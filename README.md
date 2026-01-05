This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Features

- **User Authentication**: Secure login and signup with username and password
- **Progress Tracking**: Track your progress through lessons, including completion status, scores, and time spent
- **Level System**: Gain XP and level up as you complete lessons
- **Interactive Lessons**: Learn algorithms through visualizations
- **Progress Dashboard**: View your overall progress and statistics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Setup

1. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:** Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

3. **Set up the database:**

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
```

This will create the database and apply all migrations.

4. **Generate Prisma Client:**

```bash
npx prisma generate
```

5. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### First Steps

1. Create an account by clicking "Sign Up" in the navigation bar
2. Log in with your credentials
3. Start exploring lessons and track your progress
4. View your progress dashboard to see your level, XP, and lesson completion status

## Authentication

The app uses NextAuth.js for authentication with:
- Secure password hashing using bcryptjs
- JWT-based sessions
- Protected API routes
- Automatic session management

## Progress Tracking

Progress is automatically tracked when you:
- View a lesson (tracks time spent)
- Complete a lesson (marks as completed and awards XP)
- Take quizzes (tracks scores and attempts)

Users gain 100 XP for completing each lesson and level up every 500 XP.

## Project Structure

- `pages/` - Next.js pages and API routes
- `components/` - React components
- `prisma/` - Database schema and migrations
- `hooks/` - Custom React hooks
- `styles/` - Global styles

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/*](http://localhost:3000/api/*). Files in the `pages/api` directory are treated as API routes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
