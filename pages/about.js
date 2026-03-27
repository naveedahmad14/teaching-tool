import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Logo from "@/components/ui/Logo";

const topics = [
  { name: "Bubble Sort", note: "Basics of swapping and passes" },
  { name: "Quick Sort", note: "Divide and conquer with pivots" },
  { name: "Merge Sort", note: "Stable divide, merge, O(n log n)" },
  { name: "Linear Search", note: "Sequential scan" },
  { name: "Binary Search", note: "Halving a sorted range" },
  { name: "Two Pointers", note: "In-place patterns on arrays" },
  { name: "Sliding Window", note: "Fixed-size subarray problems" },
  { name: "Hash Maps", note: "Frequency and O(1) lookup" },
  { name: "Linked Lists", note: "Pointers, reversal, slow/fast" },
  { name: "Stacks", note: "LIFO and monotonic patterns" },
];

const pathSteps = [
  {
    title: "Open a quest",
    body: "Each lesson pairs explanations with a live visualiser—play, pause, and change speed to see the algorithm move step by step.",
    href: "/lessons",
    cta: "View quests",
  },
  {
    title: "Finish the mini quiz",
    body: "At the bottom of every lesson, short questions check understanding. Score 100% to mark the lesson complete and unlock review scheduling.",
    href: "/lessons",
    cta: "Start a lesson",
  },
  {
    title: "Try full quizzes",
    body: "Deeper multiple-choice sets with easy, medium, and hard modes. Earn XP that scales with difficulty and how many you get right.",
    href: "/quiz",
    cta: "Open quizzes",
  },
  {
    title: "Drill with flashcards",
    body: "Quick active recall on key ideas—useful right after a lesson or before an exam.",
    href: "/flashcards",
    cta: "Open flashcards",
  },
  {
    title: "Review on schedule",
    body: "After you complete a lesson, it can appear in Review. Rate how well you remembered it and the app spaces the next session for you.",
    href: "/review",
    cta: "Spaced review",
  },
];

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[#E8E8E8] flex flex-wrap items-center justify-center sm:justify-start gap-2">
            About <Logo inline size="default" link={false} />
          </h1>
          <p className="text-lg text-[#C0C0C0] leading-relaxed max-w-2xl">
            AlgoQuest is an interactive way to learn classic data structures and algorithms: read, watch them run,
            answer questions, and come back when your brain is ready for another pass.
          </p>
        </header>

        <section className="mb-12" aria-labelledby="about-mission">
          <h2 id="about-mission" className="text-xl font-semibold mb-4 text-[#FFD700]">
            Why it exists
          </h2>
          <div className="game-card p-6 border border-[#625EC6]/50 bg-[#0F3460]/60">
            <p className="text-[#C0C0C0] text-base leading-relaxed">
              Textbooks and static diagrams help, but algorithms are really about{" "}
              <strong className="text-[#E8E8E8]">motion and invariants</strong>—what moves when, and what stays true.
              AlgoQuest puts that front and centre with visualisers and immediate feedback, then layers in{" "}
              <strong className="text-[#E8E8E8]">quizzes, flashcards, and spaced repetition</strong> so you are not
              just watching—you are practising retrieval, which is what makes ideas stick.
            </p>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="about-path">
          <h2 id="about-path" className="text-xl font-semibold mb-4 text-[#FFD700]">
            Recommended path
          </h2>
          <p className="text-[#C0C0C0] mb-6 text-base">
            You can jump anywhere, but this order matches how the topics build on each other and how the quest map is
            laid out.
          </p>
          <ol className="space-y-4">
            {pathSteps.map((step, i) => (
              <li key={step.title}>
                <div className="game-card p-5 border border-[#625EC6]/40 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#16213E] border border-[#625EC6] text-[#FFD700] font-bold flex items-center justify-center text-sm"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#E8E8E8] mb-1">{step.title}</h3>
                      <p className="text-sm text-[#C0C0C0] leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                  <Link
                    href={step.href}
                    className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#625EC6] text-[#E8E8E8] text-sm font-semibold hover:bg-[#4A46A8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#1A1A2E]"
                  >
                    {step.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12" aria-labelledby="about-features">
          <h2 id="about-features" className="text-xl font-semibold mb-4 text-[#FFD700]">
            What you will find here
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="game-card p-5 border border-[#625EC6]/40">
              <h3 className="font-bold text-[#E8E8E8] mb-2">Progress and XP</h3>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Signed-in learners get a progress dashboard, per-lesson stats, and levels driven by XP—so you can see
                momentum, not just page views.
              </p>
            </div>
            <div className="game-card p-5 border border-[#625EC6]/40">
              <h3 className="font-bold text-[#E8E8E8] mb-2">Two kinds of quizzes</h3>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Mini quizzes tie to lesson completion. Standalone quizzes go deeper and award XP without mixing in
                lesson-completion rules.
              </p>
            </div>
            <div className="game-card p-5 border border-[#625EC6]/40">
              <h3 className="font-bold text-[#E8E8E8] mb-2">Accessible navigation</h3>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Skip link, labelled controls, and focus styles are part of the layout so keyboard and screen-reader
                users can move through the app predictably.
              </p>
            </div>
            <div className="game-card p-5 border border-[#625EC6]/40">
              <h3 className="font-bold text-[#E8E8E8] mb-2">Your own pace</h3>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                Replay visualisers, retake quizzes, and let spaced review bring topics back when it is time—not on a
                fixed calendar.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="about-topics">
          <h2 id="about-topics" className="text-xl font-semibold mb-4 text-[#FFD700]">
            Topics covered
          </h2>
          <p className="text-[#C0C0C0] mb-4 text-base">
            Ten quest lines, each with lesson content, a visualiser, and integrated practice.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {topics.map((t) => (
              <li
                key={t.name}
                className="flex flex-col gap-0.5 px-4 py-3 rounded-lg bg-[#16213E]/80 border border-[#625EC6]/30"
              >
                <span className="font-semibold text-[#E8E8E8]">{t.name}</span>
                <span className="text-xs text-[#7B77E8]">{t.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="about-tips">
          <h2 id="about-tips" className="text-xl font-semibold mb-4 text-[#FFD700]">
            How to get the most out of it
          </h2>
          <ul className="space-y-3 text-[#C0C0C0] text-base list-disc list-inside marker:text-[#625EC6]">
            <li>
              Run the visualiser <strong className="text-[#E8E8E8]">before</strong> memorising pseudocode—build a
              mental movie first.
            </li>
            <li>
              Read the explanations in the mini quiz even when you guess right; they connect ideas to interview-style
              wording.
            </li>
            <li>
              Use flashcards for terms and invariants; use full quizzes when you want timed, exam-style pressure.
            </li>
            <li>
              Check <Link href="/progress" className="text-[#7B77E8] hover:text-[#FFD700] underline underline-offset-2">Progress</Link>{" "}
              after a few sessions to see which quests still need a perfect mini quiz or more attempts.
            </li>
          </ul>
        </section>

        <section className="mb-8" aria-labelledby="about-account">
          <h2 id="about-account" className="text-xl font-semibold mb-4 text-[#FFD700]">
            Accounts
          </h2>
          <p className="text-[#C0C0C0] text-base leading-relaxed">
            You can browse a lot of the material without signing in, but{" "}
            <strong className="text-[#E8E8E8]">progress, XP, levels, and spaced review</strong> are tied to an account so
            your data stays with you between visits. Create a free account from{" "}
            <Link href="/signup" className="text-[#7B77E8] hover:text-[#FFD700] underline underline-offset-2">
              Sign up
            </Link>
            , or{" "}
            <Link href="/login" className="text-[#7B77E8] hover:text-[#FFD700] underline underline-offset-2">
              sign in
            </Link>{" "}
            if you already have one.
          </p>
        </section>
      </div>
    </Layout>
  );
}
