# Code Audit Report

**Project:** AlgoQuest – Interactive Algorithm Learning Platform  
**Audit Date:** February 7, 2025  
**Scope:** Full codebase (Next.js 15.5.4, Prisma, NextAuth, Tailwind 4, Framer Motion)

---

## Executive Summary

The codebase is functional and well-structured at a high level (lessons, quizzes, progress, auth). The main issues are **duplicated logic across five algorithm visualizers** (~80 lines of identical pause/sleep logic each), **large components** (BubbleSort lesson 317 lines, BubbleQuiz 377 lines), **no error boundaries**, **inconsistent naming** (BubbleSortVisualiser vs Visualizer), and **missing analytics/error handling** in APIs. Accessibility is partially addressed (skip link, ARIA on Navbar/Card/Progress); visualizers and quiz controls need improvement.

**Recommended priority:** (1) Extract shared visualizer logic and add Error Boundaries, (2) Add analytics and schema for research, (3) Refactor directory structure and large components, (4) Full accessibility pass.

---

## Critical Issues (Must Fix)

### 1. [Visualizers] Duplicated sleep/pause/cancel logic (~400 lines total)

- **Files:** `components/BubbleSortVisualiser.js`, `components/QuickSortVisualizer.js`, `components/MergeSortVisualizer.js`, `components/LinearSearchVisualizer.js`, `components/BinarySearchVisualizer.js`
- **Problem:** Each visualizer reimplements the same `sleep()`, `cancelledRef`, `pausedRef`, `pauseResumeRef`, `handleStart`, `handlePause`, `handleReset` pattern. Bug fixes and behavior changes must be repeated in five places; risk of divergence and bugs.
- **Impact:** Maintainability, performance (no shared memoization), consistency.
- **Solution:** Extract a `useVisualization()` (or `useAnimationControl()`) hook in `/hooks/useVisualization.js` that returns `{ state, speed, setSpeed, play, pause, reset, stepForward?, stepBackward? }` and a cancellable/pausable `sleep`. Refactor each visualizer to use the hook and only implement algorithm-specific state and rendering. Estimated effort: 1–2 days.

### 2. [App] No error boundaries

- **File:** `pages/_app.js`
- **Problem:** Any uncaught React error in a child component (e.g. visualizer, quiz) will unmount the entire app with a blank screen. No recovery path or user-facing message.
- **Impact:** UX, reliability; unsuitable for research/data collection if crashes lose context.
- **Solution:** Add a class `ErrorBoundary` component (e.g. `/components/common/ErrorBoundary.js`) that catches errors, shows a fallback UI with “Reload” and optional error details, and optionally reports to analytics. Wrap `Component` in `_app.js` with `ErrorBoundary`; consider additional boundaries around major sections (e.g. visualizer, quiz). Estimated effort: 0.5 day.

### 3. [API] No request body validation / schema

- **Files:** `pages/api/progress/update.js`, `pages/api/auth/register.js`
- **Problem:** APIs trust `req.body` shape. Malformed or oversized payloads could cause Prisma errors or unexpected behavior. No central validation (e.g. Zod/Joi).
- **Impact:** Security, stability, possible information leakage via 500 stack traces.
- **Solution:** Validate `req.body` with a schema (e.g. Zod) before using it; return 400 with clear messages for invalid input. Sanitize string length and types. Estimated effort: 0.5 day.

### 4. [Naming] Inconsistent visualizer filename

- **File:** `components/BubbleSortVisualiser.js` (UK spelling)
- **Problem:** All other visualizers use “Visualizer”; imports and future tooling may assume one convention.
- **Impact:** Consistency, discoverability.
- **Solution:** Rename to `BubbleSortVisualizer.js` and update all imports (e.g. in `components/lessons/BubbleSort.js`). Estimated effort: &lt;0.5 day.

---

## Performance Issues

### 5. [Visualizers] No memoization of list items or callbacks

- **Files:** All five visualizer components
- **Problem:** Bar/cell components re-render on every state change; inline `getBarColor(index)` and handlers recreated each render. With 10+ elements and frequent state updates during animation, this can hurt frame rate.
- **Impact:** Risk of dropping below 60fps on lower-end devices; Lighthouse performance.
- **Solution:** Use `React.memo()` for the bar/cell component (or a small `ArrayBar` component). Memoize `getBarColor` with `useCallback` (or derive colors in a `useMemo` from state). Memoize `handleStart`, `handlePause`, `handleReset`, and speed handler with `useCallback`. Ensure stable `key` (e.g. index + value only if needed). Estimated effort: 0.5–1 day.

### 6. [Lesson] Duplicate visualization state in BubbleSort lesson

- **File:** `components/lessons/BubbleSort.js`
- **Problem:** Lesson implements its own full bubble-sort visualization (array, comparing, swapping, sortedIndices, sleep, pseudocode highlighting) in addition to embedding `BubbleSortVisualizer`. Two separate implementations to maintain; heavier component (~317 lines).
- **Impact:** Bundle size, maintenance, risk of behavior divergence between “Quick Practice” and “Interactive Visualization.”
- **Solution:** Prefer a single source of truth: either (a) use only the shared visualizer and pass props/callbacks for pseudocode/statistics, or (b) extract a shared “bubble sort with pseudocode” component used by both. After introducing `useVisualization`, consider a compound `<Visualizer algorithm="bubbleSort">` that composes controls, array display, and pseudocode. Estimated effort: 1 day.

### 7. [Quizzes] Large inline question data and no code splitting

- **Files:** `components/quizzes/BubbleQuiz.js` (377 lines), similar for other quizzes
- **Problem:** Each quiz embeds a large `questions` object (easy/medium/hard). All quiz components are imported on `pages/quiz.js`, so all quiz code loads on first visit to /quiz.
- **Impact:** Initial load and TTI; harder to maintain question content.
- **Solution:** Move question sets to JSON or a shared module (e.g. `/data/quizzes/bubbleSort.js`). Use dynamic `next/dynamic` for quiz components so only the selected quiz loads. Consider a single `QuizEngine` component that takes `quizId` and fetches/loads questions. Estimated effort: 1 day.

---

## Accessibility Issues

### 8. [Visualizers] Controls lack ARIA and keyboard support

- **Files:** All visualizer components
- **Problem:** Play/Pause/Reset and speed slider have no `aria-label` or `aria-valuemin`/`aria-valuemax`/`aria-valuenow` for the slider. No keyboard shortcuts (e.g. Space to play/pause). Color-only legend (unsorted/comparing/swapping/sorted) may not meet WCAG if contrast or “information not by color alone” is not verified.
- **Impact:** WCAG 2.1 Level AA; screen reader and keyboard users.
- **Solution:** Add `aria-label` to all controls; add proper ARIA attributes to the speed slider. Optionally add `aria-live` for status (“Sorting”, “Paused”, “Complete”). Add keyboard handlers (Space, R for reset) and document in UI or help. Ensure legend uses text + color and check contrast (≥4.5:1). Estimated effort: 0.5 day.

### 9. [Quiz] Question/answer buttons and progress

- **Files:** `components/quizzes/BubbleQuiz.js` (and other quizzes)
- **Problem:** Option buttons get focus and visual state but could improve: no `aria-pressed` or `aria-current` for selected option, no `aria-live` for “Correct/Incorrect” result. Progress bar has no `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.
- **Impact:** Screen reader clarity and WCAG.
- **Solution:** Add `role="group"` and `aria-label` for question block; use `aria-checked` or `aria-selected` for options; announce result in a live region. Add ARIA attributes to progress bar. Estimated effort: 0.5 day.

### 10. [Layout] Skip link visibility

- **File:** `components/Layout.js`, `styles/globals.css`
- **Problem:** Skip link is off-screen until focus; behavior is correct, but ensure it’s visible on focus (already styled in globals.css). Verify tab order and that `#main-content` exists and is focusable.
- **Impact:** Keyboard/screen reader users.
- **Solution:** Confirm skip link receives focus and is visible; add `tabIndex={0}` to main if needed. Quick check. Estimated effort: &lt;0.25 day.

---

## Code Quality Issues

### 11. [Structure] Flat component directory

- **Location:** `components/`
- **Problem:** All components (layout, common UI, feature-specific visualizers, lessons, quizzes) live in one flat tree. Harder to enforce boundaries and find shared vs feature code.
- **Impact:** Scalability, onboarding.
- **Solution:** Introduce structure as specified: `/components/common/`, `/components/features/visualizers/`, `/components/features/lessons/`, `/components/features/quizzes/`, `/components/layout/`. Move existing components gradually and update imports. Estimated effort: 1 day.

### 12. [Progress API] Time spent calculation on every update

- **File:** `pages/api/progress/update.js`
- **Problem:** Each call computes `timeSpent` from client-provided or server-side start; multiple rapid calls (e.g. from `ProgressTracker` and onComplete) can double-count or fragment time. Progress tracker calls `updateProgress(lessonId, { completed: false })` on mount and again on completion.
- **Impact:** Accuracy of timeSpent for research; possible over-counting.
- **Solution:** Consider storing `lessonStartedAt` per lesson/session and computing time server-side on “complete” or on a single heartbeat. Throttle or debounce non-completion updates. Estimated effort: 0.5 day.

### 13. [useProgress] Missing dependency and possible stale closure

- **File:** `hooks/useProgress.js`
- **Problem:** `ProgressTracker` passes `onComplete` and `score` to `updateProgress` in a `useEffect` that depends on them. If `onComplete` is not stable, effect may run at wrong times. `startTracking`/`updateProgress` are stable (useCallback with [session]).
- **Impact:** Progress may not be saved when lesson is completed if effect dependencies are wrong.
- **Solution:** Ensure parent passes stable `onComplete` (useCallback) or document that progress is saved only when `completed: true` is sent. Consider saving completion in a dedicated “complete lesson” action rather than only in effect. Estimated effort: 0.25 day.

### 14. [Auth] Generic error messages

- **File:** `pages/api/auth/[...nextauth].js`
- **Problem:** “Invalid username or password” is correct for security; ensure no stack traces or DB errors leak in production. NextAuth generally handles this; verify in production.
- **Impact:** Security.
- **Solution:** Audit that no `console.error` of sensitive data is exposed; ensure NEXTAUTH_SECRET and env are documented. Low effort.

### 15. [Quizzes] No integration with progress or backend

- **Files:** `components/quizzes/*.js`, `pages/quiz.js`
- **Problem:** Quiz completion and score are local state only; not persisted to `LessonProgress` or a dedicated quiz-attempts table. Cannot support spaced repetition or adaptive difficulty without backend.
- **Impact:** Research and pedagogy goals (analytics, recommendations).
- **Solution:** Add `QuizAttempt` (and optionally `AnalyticsEvent`) to Prisma schema; implement `POST /api/quiz/submit` and call it on quiz complete. Optionally link attempt to lessonId for progress. Estimated effort: 1 day (with schema).

---

## Security Considerations

- **Registration:** Password length and username length validated; bcrypt with cost 12 is good. Consider rate limiting on register/login in production.
- **Session:** JWT via NextAuth; ensure `NEXTAUTH_SECRET` is set and strong.
- **API:** Progress and auth routes check session; ensure no endpoint returns other users’ data (progress/get already scopes by `session.user.id`).

---

## Unused / Missing

- **Unused:** `pages/api/hello.js` – remove or repurpose.
- **Missing:** No `lib/analytics.js` or `/api/analytics/track`; required for dissertation and Task 4.1.
- **Missing:** No `ReviewCard` / spaced repetition schema or APIs (Task 2.1).
- **Missing:** TypeScript types; project is JavaScript. Incremental migration would improve safety (optional in scope of this audit).

---

## Recommended Refactoring Plan (Priority Order)

| Priority | Task | Effort | Phase |
|----------|------|--------|--------|
| P0 | Add Error Boundary and wrap app | 0.5 d | 1 |
| P0 | Extract `useVisualization` and refactor visualizers to use it | 1.5 d | 1 |
| P0 | Rename BubbleSortVisualiser → BubbleSortVisualizer | &lt;0.5 d | 1 |
| P1 | Add request validation (Zod) to progress and auth APIs | 0.5 d | 1 |
| P1 | Add QuizAttempt + AnalyticsEvent schema and POST /api/quiz/submit, /api/analytics/track | 1 d | 2 |
| P1 | Spaced repetition: ReviewCard schema, SM-2 engine, APIs, ReviewSession UI | 2 d | 2 |
| P2 | Memoize visualizers (React.memo, useCallback, useMemo) | 0.5 d | 1 |
| P2 | Reorganize components into common/features/layout | 1 d | 1 |
| P2 | Single BubbleSort visualization source (lesson + quick practice) | 1 d | 1 |
| P2 | Adaptive learning engine + recommend API | 1.5 d | 2 |
| P2 | ARIA and keyboard for visualizers and quizzes | 0.5 d | 1 |
| P3 | Dynamic import for quiz components + move questions to data | 1 d | 1 |
| P3 | Progress timeSpent logic (server-side/throttle) | 0.5 d | 1 |

---

## Summary Table

| Category | Count | Severity |
|----------|--------|----------|
| Critical | 4 | Must fix before research/scale |
| Performance | 3 | Fix for 60fps and Lighthouse |
| Accessibility | 3 | Fix for WCAG AA |
| Code quality | 5 | Improve maintainability |
| Security | Noted | Minor follow-ups |
| Unused/Missing | 4 | Add/remove as needed |

Total estimated effort for P0+P1: ~6–7 days. Full list including P2/P3: ~10–11 days.
