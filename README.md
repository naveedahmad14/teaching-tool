# AlgoQuest

**A full-stack, interactive platform for learning data structures and algorithms** — built with Next.js, React, and Prisma. Learners explore **interactive lessons** with **step-by-step visualisations**, check understanding with **in-lesson mini-quizzes** and **full topic quizzes**, track **progress and XP**, and reinforce memory with **flashcards** and **spaced repetition**.

Originally developed as part of a Computer Science dissertation, AlgoQuest demonstrates production-minded patterns: authentication, REST APIs, a relational data model, separation of UI / lessons / visualisers / quizzes, and content-driven configuration (JSON-backed mini-quizzes and flashcards).

---

## Why this project (for reviewers)

| Area | What it shows |
|------|----------------|
| **Product** | End-to-end learning flow: lesson → visualiser → formative quiz → summative quiz → progress → review |
| **Frontend** | React 19, Next.js 15 (Pages Router), Tailwind CSS 4, Framer Motion, reusable hooks (`useProgress`, `useVisualization`) |
| **Backend** | Next.js API routes, session-based auth, Prisma ORM, structured progress updates (including XP rules) |
| **Education** | Multi-modal practice (visual, MCQ, active recall, spaced repetition) aligned with common DS&A curricula |

---

## Overview

AlgoQuest helps users build intuition for classic algorithms and patterns. Each topic combines **readable lesson content**, a **dedicated visualiser** (play/pause, speed, stepping), and a **Lesson Mini Quiz** at the end of the page — short questions with explanations, backed by `data/lessonMiniQuizzes.json`.

**Full quizzes** (`/quiz`) offer deeper assessment (multiple difficulties) with XP rewards decoupled from lesson completion where appropriate. **Flashcards** (`/flashcards`) surface active-recall prompts derived from quiz content. **Progress** and **Review** (SM-2–style spaced repetition) persist per user in SQLite via Prisma.

The UI uses a consistent **quest / retro-game** aesthetic (navigation, logo, global styles) while staying responsive and readable.

---

## Key Features

| Feature | Description |
|--------|-------------|
| **Accounts & sessions** | Registration, login, bcrypt password hashing, NextAuth (JWT). Protected routes for progress-sensitive actions. |
| **10 DS&A topics** | Bubble Sort, Merge Sort, Quick Sort, Linear Search, Binary Search, Two Pointers, Sliding Window, Hash Maps, Linked Lists, Stacks. |
| **Interactive visualisations** | Per-topic visualisers with controls aligned through shared hooks; pseudocode-oriented step-through. |
| **In-lesson mini-quizzes** | Embedded at the bottom of each lesson; JSON-driven questions; integrates with progress when the learner completes the lesson. |
| **Full quizzes** | Multi-difficulty question sets per topic with feedback; XP can be awarded via a dedicated API mode without duplicating lesson progress semantics. |
| **Flashcards** | Flip cards with topic filtering — supports quick active recall alongside lessons and quizzes. |
| **Progress tracking** | Per-lesson completion, scores, attempts, time spent; dashboard at `/progress`. |
| **Gamification** | XP and levels; quiz XP uses configurable rules (e.g. per-correct-question with difficulty multipliers). |
| **Spaced repetition** | Review cards after lesson completion; rate recall and schedule next review (SM-2–style logic in `lib/`). |
| **Responsive UI** | Works across viewports; dark theme, accessible navigation labels, focus styles. |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js](https://nextjs.org) 15 (Pages Router) |
| **UI** | React 19, [Tailwind CSS](https://tailwindcss.com) 4, [Framer Motion](https://www.framer.com/motion/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org) (credentials, JWT sessions) |
| **Database** | [Prisma](https://www.prisma.io) ORM, SQLite (`file:./dev.db`; swappable for PostgreSQL in production) |
| **Security** | bcryptjs for password hashing |

---

## Project Structure

```
teaching-tool/
├── pages/
│   ├── api/                    # Auth, progress, reviews
│   ├── lesson/[id].js         # Dynamic lesson + ProgressTracker + LessonMiniQuiz
│   ├── index.js, lessons.js, quiz.js, flashcards.js
│   ├── progress.js, review.js
│   ├── login.js, signup.js, about.js
│   └── _app.js, _document.js
├── components/
│   ├── layout/                 # Layout, Navbar, Footer
│   ├── ui/                     # Logo, shared UI (Card, GameButton, …)
│   ├── progress/               # ProgressTracker (time on lesson, completion)
│   ├── quizzes/                # Topic quizzes + LessonMiniQuiz
│   ├── lessons/                # One module per topic
│   ├── visualizers/            # Algorithm demos and visualisers
│   ├── common/                 # ErrorBoundary, AnimatedBackground
│   └── features/               # e.g. spaced repetition / review UI
├── data/
│   ├── lessonMiniQuizzes.json  # In-lesson mini-quiz items per lesson slug
│   ├── flashcards.json         # Active recall cards for /flashcards
│   └── README.md               # Notes on regenerating flashcard data
├── lib/                        # Prisma client, spaced repetition helpers
├── hooks/                      # useProgress, useVisualization
├── prisma/
│   └── schema.prisma           # User, LessonProgress, ReviewCard, …
├── styles/
│   └── globals.css
└── docs/                       # Architecture, pedagogy, dissertation notes
```

**Data model (high level)**  
- **User** — id, username, hashed password, level, xp.  
- **LessonProgress** — per user per lesson: completed, score, time, attempts, last access.  
- **ReviewCard** — SM-2–style state for spaced repetition.

---

## Getting Started

### Prerequisites

- **Node.js** 18+  
- **npm** (or yarn / pnpm / bun)

### 1. Clone and install

```bash
git clone <repository-url>
cd teaching-tool
npm install
```

### 2. Environment variables

Create `.env` or `.env.local` in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<a-secure-random-string>"
NEXTAUTH_URL="http://localhost:3000"
```

Generate `NEXTAUTH_SECRET`, for example:

```bash
openssl rand -base64 32
```

### 3. Database

```bash
npx prisma db push
npx prisma generate
```

(Or use `npx prisma migrate dev` if you prefer migrations.)

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, then explore **Quests** (lessons), **Quiz**, **Cards** (flashcards), **Progress**, and **Review**.

### 5. Production build

```bash
npm run build
npm start
```

---

## Implementation Notes

- **Lessons** — Each topic maps to a slug (e.g. `bubble`, `stacks`). `pages/lesson/[id].js` renders the lesson component, `ProgressTracker`, and `LessonMiniQuiz` for that slug.
- **Mini-quizzes** — Questions live in `data/lessonMiniQuizzes.json` for easy editing and versioning without touching React code for every text tweak.
- **Full quizzes & XP** — `pages/api/progress/update.js` supports normal lesson progress updates and a **`quizXpOnly`** mode so standalone quiz sessions can award XP without side effects intended only for lesson flows.
- **Flashcards** — Driven by `data/flashcards.json`; see `data/README.md` for how cards relate to quiz content.
- **Spaced repetition** — Review APIs under `pages/api/reviews/`; scheduling logic in `lib/spacedRepetition.js`.
- **Visualisations** — Shared animation/control patterns live in `hooks/useVisualization.js`; each algorithm has its own component under `components/visualizers/`.

Further design notes: `docs/decisions.md`.

---

## Dissertation & Pedagogy

The codebase supported research into interactive tools for DS&A learning: combining visualisation, formative and summative assessment, and retention strategies. Additional pedagogy-oriented notes live under `docs/` for readers interested in instructional design choices.

---

## Possible Extensions

- **Analytics** — Event tracking for lessons, quizzes, and reviews.  
- **More topics** — New `lesson` + `visualizer` + `quiz` entries following the same slug pattern.  
- **PostgreSQL** — Swap `DATABASE_URL` and run Prisma migrations for production.  
- **Deployment** — Vercel / Railway / Docker with env vars for DB and NextAuth.  
- **Internationalisation** — Extract strings from lessons and JSON data for i18n.

---

## License

Private / academic use unless otherwise specified by the repository owner.
