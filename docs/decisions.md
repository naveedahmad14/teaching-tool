# Architecture & Implementation Decisions

This document records significant technical and product decisions for AlgoQuest.

---

## 2025-02-07

### Phase 1: Code audit and error handling

- **Code audit:** A full codebase audit was performed and documented in `docs/code-audit-report.md`. Findings: duplicated sleep/pause logic across five visualizers, no error boundaries, large lesson/quiz components, and missing analytics/validation. Priority order for fixes is defined in the report.

- **Error Boundary:** A single root-level `ErrorBoundary` was added in `_app.js` so any uncaught React error in the component tree shows a fallback UI (reload button, optional dev-only error details) instead of a blank screen. The boundary supports an optional `fallback` component prop for custom UIs and calls `window.analytics.track("Error Occurred", …)` when available, to support future analytics without hard dependency.

- **Component location:** `ErrorBoundary` was placed under `components/common/` to start the planned structure (common vs features vs layout). Further refactors (e.g. moving Button, Card, layout components) will follow the structure described in the audit and the project spec.

### Naming and consistency

- **BubbleSortVisualiser:** Renamed to `BubbleSortVisualizer.js` and refactored to use `useVisualization`. Old file removed; `components/lessons/BubbleSort.js` imports the new component.

### Phase 2: Spaced repetition (SM-2)

- **Schema:** Added `ReviewCard` model (userId, lessonId, repetitions, easiness, interval, nextReviewDate, lastReviewed, qualityHistory as JSON string for SQLite). Unique on (userId, lessonId); index on (userId, nextReviewDate). Applied via `prisma db push`.
- **Engine:** `lib/spacedRepetition.js` exports `calculateNextReview(card, quality)`, `getDueCards(cards)`, `createReviewCard(lessonId)`. Quality 0–5; quality &lt; 3 resets interval.
- **APIs:** `GET /api/reviews/due` returns due cards with lesson names (from a static map). `POST /api/reviews/record` accepts `{ lessonId, quality }`, upserts card and applies SM-2.
- **Progress integration:** When a lesson is completed for the first time (`completed && !existingProgress?.completed`), we upsert a `ReviewCard` with `nextReviewDate = now` so it appears in Review.
- **UI:** `components/features/SpacedRepetition/ReviewSession.js` fetches due cards, shows one at a time with “Show answer” and quality buttons (Forgot / Difficult / Easy). Navbar “Review” link (when logged in) goes to `/review`.

---

## Pending (from spec)

- **useVisualization hook:** Shared animation control (sleep with cancel/pause, play/pause/reset, speed) will be extracted into `hooks/useVisualization.js` and consumed by each algorithm visualizer to remove ~400 lines of duplicated logic.

- **Spaced repetition:** SM-2 algorithm and `ReviewCard` schema/APIs will be implemented as specified in the project brief; decisions will be recorded here when implemented.

- **Analytics:** Central `lib/analytics.js` and `/api/analytics/track` for research events; schema and export API for dissertation data.

- **Database:** Current stack is Prisma + SQLite; migration to PostgreSQL is planned; schema changes (ReviewCard, QuizAttempt, AnalyticsEvent) will be added incrementally with migrations.
