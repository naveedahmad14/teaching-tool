# AlgoQuest

**An interactive web-based teaching tool for learning data structures and algorithms through visualisation and gamification.**

This project was developed as part of a dissertation in Computer Science / Software Engineering. It demonstrates the design and implementation of a full-stack educational platform that combines algorithm visualisation, formative assessment (quizzes), progress tracking, and spaced repetition to support learning of fundamental CS topics.

---

## Overview

AlgoQuest is a single-page-style web application that helps learners build intuition for classic algorithms and data-structure patterns. Users work through **interactive lessons** with step-by-step visualisations, then test their understanding with **multi-difficulty quizzes**. Progress is persisted per user (time on lesson, completion, quiz scores), with **XP and levels** for motivation and a **spaced-repetition review** flow to reinforce retention.

The system is built with modern web technologies (Next.js, React, Prisma) and is intended both as a practical learning tool and as a basis for research or extension (e.g. analytics, A/B tests, or additional topics).

---

## Key Features

| Feature | Description |
|--------|-------------|
| **User accounts** | Secure registration and login (NextAuth, bcrypt). Sessions and protected routes. |
| **10 algorithm topics** | Bubble Sort, Merge Sort, Quick Sort, Linear Search, Binary Search, Two Pointers, Sliding Window, Hash Maps, Linked Lists, Stacks. |
| **Interactive visualisations** | Per-lesson visualisers with play/pause, speed control, and step-through of pseudocode. |
| **Quizzes** | 15 questions per topic (5 Easy, 5 Medium, 5 Hard) with immediate feedback, explanations, and “active recall” tips. |
| **Progress tracking** | Per-lesson: completed flag, best quiz score, attempts, time spent. Stored in the database and shown on a progress dashboard. |
| **Gamification** | XP awarded on lesson completion; level derived from total XP (e.g. level up every 500 XP). |
| **Spaced repetition** | SM-2–based review: when a lesson is completed, a review card is created. Users can review due cards and rate recall (0–5); next review date is computed by the algorithm. |
| **Responsive UI** | Layout and components work across screen sizes; dark theme and consistent typography/contrast. |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js](https://nextjs.org) 15 (Pages Router) |
| **UI** | React 19, [Tailwind CSS](https://tailwindcss.com) 4, [Framer Motion](https://www.framer.com/motion/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org) (credentials provider, JWT sessions) |
| **Database** | [Prisma](https://www.prisma.io) ORM, SQLite (file-based; can be swapped for PostgreSQL) |
| **Password hashing** | bcryptjs |

---

## Project Structure

```
teaching-tool/
├── pages/                    # Next.js pages and API routes
│   ├── api/                  # REST-style APIs (auth, progress, reviews)
│   ├── lesson/[id].js        # Dynamic lesson page (loads topic by slug)
│   ├── index.js              # Home
│   ├── lessons.js            # Lesson list
│   ├── quiz.js               # Quiz list and runner
│   ├── progress.js          # User progress dashboard
│   ├── review.js            # Spaced repetition review session
│   ├── login.js, signup.js
│   └── _app.js, _document.js
├── components/
│   ├── layout/              # Layout, Navbar, Footer
│   ├── ui/                  # Shared UI (Card, GameButton, GameBadge)
│   ├── progress/            # ProgressTracker (time on lesson, mark complete)
│   ├── quizzes/             # One quiz component per topic (e.g. BubbleQuiz, StacksQuiz)
│   ├── lessons/             # Lesson content per topic (e.g. BubbleSort, HashMaps)
│   ├── visualizers/         # Algorithm visualisers and demos (e.g. BubbleSortVisualizer, StackVisualizer)
│   ├── common/              # ErrorBoundary, AnimatedBackground
│   └── features/            # Feature modules (e.g. SpacedRepetition/ReviewSession)
├── lib/                     # Prisma client, spaced repetition (SM-2) logic
├── hooks/                    # useProgress, useVisualization (shared animation control)
├── prisma/
│   └── schema.prisma        # User, LessonProgress, ReviewCard
├── styles/
│   └── globals.css          # Global and utility styles
└── docs/                    # Architecture decisions, audit reports
```

**Data model (high level)**  
- **User**: id, username, hashed password, level, xp.  
- **LessonProgress**: per user per lesson — completed, score, timeSpent, attempts, lastAccessed.  
- **ReviewCard**: per user per lesson — SM-2 state (repetitions, easiness, interval, nextReviewDate, qualityHistory).

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later  
- **npm** (or yarn / pnpm / bun)

### 1. Clone and install

```bash
git clone <repository-url>
cd teaching-tool
npm install
```

### 2. Environment variables

Create a `.env` (or `.env.local`) in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<a-secure-random-string>"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure value for `NEXTAUTH_SECRET`, for example:

```bash
openssl rand -base64 32
```

### 3. Database

Initialize the SQLite database and generate the Prisma client:

```bash
npx prisma db push
npx prisma generate
```

(Use `npx prisma migrate dev` if you prefer migrations.)

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, log in, and use **Lessons**, **Quiz**, **Progress**, and **Review** from the navigation.

### 5. Build for production

```bash
npm run build
npm start
```

---

## Design and Implementation Notes

- **Lesson routing**: Each topic has a slug (e.g. `bubble`, `stacks`). `pages/lesson/[id].js` maps the slug to the correct lesson component and attaches `ProgressTracker` with that `lessonId` so progress and time are recorded.
- **Quiz completion**: Quizzes call the same progress API with `lessonId` (e.g. `stacks`), so quiz score and attempts are stored in `LessonProgress` and contribute to XP when the lesson is marked completed.
- **Spaced repetition**: When a user completes a lesson for the first time, a `ReviewCard` is created. The review UI fetches due cards from `/api/reviews/due` and submits ratings to `/api/reviews/record`; `lib/spacedRepetition.js` implements the SM-2 update logic.
- **Visualisations**: Shared behaviour (speed, play/pause, step-through) is centralised in `hooks/useVisualization.js`; each algorithm has its own visualiser component in `components/visualizers/`.

Further technical decisions are documented in `docs/decisions.md`.

---

## Dissertation Context

This codebase supports a dissertation on interactive tools for learning data structures and algorithms. It covers full-stack development (auth, database, APIs, UI), educational design (lessons, quizzes, spaced repetition), and a clear separation of layout, UI, features, and visualisers with shared hooks and a documented data model.

---

## Possible Extensions

- **Analytics**: Track lesson views, quiz attempts, and review sessions for research or UX improvement.  
- **More topics**: Additional algorithms (e.g. DFS/BFS, dynamic programming) following the same lesson + visualiser + quiz pattern.  
- **PostgreSQL**: Replace SQLite with PostgreSQL for production and use Prisma migrations.  
- **Deployment**: Deploy on Vercel, Railway, or similar with a hosted database and environment variables for `DATABASE_URL` and `NEXTAUTH_*`.
