import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import BubbleQuiz from "../components/quizzes/BubbleQuiz";
import QuickQuiz from "../components/quizzes/QuickQuiz";
import MergeQuiz from "../components/quizzes/MergeQuiz";
import LinearQuiz from "../components/quizzes/LinearQuiz";
import BinaryQuiz from "../components/quizzes/BinaryQuiz";
import TwoPointersQuiz from "../components/quizzes/TwoPointersQuiz";
import SlidingWindowQuiz from "../components/quizzes/SlidingWindowQuiz";
import HashMapsQuiz from "../components/quizzes/HashMapsQuiz";
import LinkedListsQuiz from "../components/quizzes/LinkedListsQuiz";
import StacksQuiz from "../components/quizzes/StacksQuiz";

export default function Quiz() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const quizzes = [
    { id: "bubble", name: "Bubble Sort", description: "Test your understanding of the simplest sorting algorithm", icon: "○", component: BubbleQuiz },
    { id: "quick", name: "Quick Sort", description: "Master the divide-and-conquer sorting technique", icon: "◆", component: QuickQuiz },
    { id: "merge", name: "Merge Sort", description: "Challenge yourself with recursive merging concepts", icon: "⊔", component: MergeQuiz },
    { id: "linear", name: "Linear Search", description: "Explore sequential search strategies", icon: "⋯", component: LinearQuiz },
    { id: "binary", name: "Binary Search", description: "Master efficient searching in sorted arrays", icon: "◉", component: BinaryQuiz },
    { id: "twopointers", name: "Two Pointers", description: "Remove duplicates in-place with read and write pointers", icon: "↔", component: TwoPointersQuiz },
    { id: "slidingwindow", name: "Sliding Window", description: "Max sum subarray of size k in O(n)", icon: "▬", component: SlidingWindowQuiz },
    { id: "hashmaps", name: "Hash Maps", description: "Two Sum and frequency counter with O(1) lookup", icon: "#", component: HashMapsQuiz },
    { id: "linkedlists", name: "Linked Lists", description: "Reverse in-place and find middle with fast & slow", icon: "→", component: LinkedListsQuiz },
    { id: "stacks", name: "Stacks", description: "Next Greater Element with monotonic stack", icon: "▀", component: StacksQuiz }
  ];

  const handleQuizComplete = async (lessonId, scorePercentage, difficulty = "easy") => {
    try {
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          completed: true,
          score: Math.round(scorePercentage),
          incrementAttempts: true,
          difficulty,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Progress update failed:", res.status, data);
      }
    } catch (err) {
      console.error("Progress update error:", err);
    }
  };

  if (selectedQuiz) {
    const QuizComponent = selectedQuiz.component;
    return (
      <div className="min-h-screen bg-[#1A1A2E]">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="fixed top-4 left-4 z-50 px-6 py-3 bg-[#0F3460] text-[#E8E8E8] border-2 border-[#625EC6] rounded-lg font-semibold hover:bg-[#16213E] hover:text-[#FFD700] transition-all shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
        >
          ← Back to Quizzes
        </button>
        <QuizComponent
          lessonId={selectedQuiz.id}
          onQuizComplete={(scorePercentage, difficulty) => handleQuizComplete(selectedQuiz.id, scorePercentage, difficulty)}
        />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-2xl font-bold mb-4 text-[#FFD700]">
              Algorithm Quizzes
            </h1>
            <p className="text-base text-[#C0C0C0] max-w-2xl mx-auto">
              Test your knowledge with quizzes at Easy, Medium, and Hard levels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedQuiz(quiz)}
                className="cursor-pointer group"
              >
                <div className="h-full game-card p-6 border-l-4 border-l-[#FFD700] hover:border-l-[#FFD700] transition-colors overflow-hidden flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl font-bold text-[#FFD700] bg-[#16213E] rounded-lg border border-[#625EC6]/50 group-hover:border-[#625EC6] transition-colors leading-none overflow-hidden"
                        aria-hidden
                      >
                        <span className={`inline-flex items-center justify-center leading-[0] w-full h-full ${quiz.icon === "▀" ? "translate-y-1 translate-x-0.5" : quiz.icon === "◆" ? "translate-y-0.5" : ""}`}>
                          {quiz.icon}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <span className="inline-block text-[10px] uppercase tracking-wider text-[#7B77E8] bg-[#16213E] border border-[#625EC6]/40 rounded px-2 py-0.5 mb-1">
                          Quiz
                        </span>
                        <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#FFD700] transition-colors leading-tight">
                          {quiz.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#C0C0C0] leading-relaxed mb-4 flex-grow">
                    {quiz.description}
                  </p>
                  <div className="space-y-2 py-3 border-t border-[#625EC6]/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#C0C0C0]">Questions</span>
                      <span className="text-[#E8E8E8] font-semibold">15</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#C0C0C0]">Levels</span>
                      <span className="text-[#E8E8E8] font-semibold">Easy · Medium · Hard</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#C0C0C0]">Time</span>
                      <span className="text-[#E8E8E8] font-semibold">~10 min</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="block w-full px-4 py-3 rounded-lg bg-[#625EC6] text-[#E8E8E8] font-semibold text-center text-sm border border-[#625EC6] group-hover:bg-[#4A46A8] group-hover:border-[#4A46A8] transition-colors">
                      Start Quiz →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-[#0F3460] border-2 border-[#625EC6] rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold mb-6 text-[#FFD700]">How to Excel in These Quizzes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#16213E] rounded-xl border-2 border-[#4CAF50]/50">
                <h3 className="text-base font-bold text-[#4CAF50] mb-2">Study First</h3>
                <p className="text-sm text-[#C0C0C0]">
                  Review the lesson materials before attempting the quiz.
                </p>
              </div>
              <div className="p-6 bg-[#16213E] rounded-xl border-2 border-[#FFD700]/50">
                <h3 className="text-base font-bold text-[#FFD700] mb-2">Use Active Recall</h3>
                <p className="text-sm text-[#C0C0C0]">
                  Try to answer without looking back. Each question includes memory tips!
                </p>
              </div>
              <div className="p-6 bg-[#16213E] rounded-xl border-2 border-[#625EC6]">
                <h3 className="text-base font-bold text-[#7B77E8] mb-2">Practice Regularly</h3>
                <p className="text-sm text-[#C0C0C0]">
                  Retake quizzes to improve retention through spaced repetition.
                </p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-[#16213E] rounded-xl border-2 border-[#625EC6]/50">
              <h3 className="text-base font-bold text-[#E8E8E8] mb-3">Scoring Guide:</h3>
              <div className="space-y-2 text-sm text-[#C0C0C0]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#4CAF50]">80-100%:</span>
                  <span>Excellent! You&apos;ve mastered this algorithm.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#FFD700]">60-79%:</span>
                  <span>Good understanding. Review missed concepts.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#F44336]">Below 60%:</span>
                  <span>Keep practicing! Review the lesson and try again.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}