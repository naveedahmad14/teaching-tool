import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import BubbleQuiz from "../components/quizzes/BubbleQuiz";
import QuickQuiz from "../components/quizzes/QuickQuiz";
import MergeQuiz from "../components/quizzes/MergeQuiz";
import LinearQuiz from "../components/quizzes/LinearQuiz";
import BinaryQuiz from "../components/quizzes/BinaryQuiz";

export default function Quiz() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const quizzes = [
    {
      id: "bubble",
      name: "Bubble Sort",
      description: "Test your understanding of the simplest sorting algorithm",
      color: "from-blue-500 to-cyan-500",
      hoverColor: "from-blue-600 to-cyan-600",
      icon: "🔵",
      component: BubbleQuiz
    },
    {
      id: "quick",
      name: "Quick Sort",
      description: "Master the divide-and-conquer sorting technique",
      color: "from-purple-500 to-pink-500",
      hoverColor: "from-purple-600 to-pink-600",
      icon: "⚡",
      component: QuickQuiz
    },
    {
      id: "merge",
      name: "Merge Sort",
      description: "Challenge yourself with recursive merging concepts",
      color: "from-indigo-500 to-purple-500",
      hoverColor: "from-indigo-600 to-purple-600",
      icon: "🔀",
      component: MergeQuiz
    },
    {
      id: "linear",
      name: "Linear Search",
      description: "Explore sequential search strategies",
      color: "from-teal-500 to-blue-500",
      hoverColor: "from-teal-600 to-blue-600",
      icon: "🔍",
      component: LinearQuiz
    },
    {
      id: "binary",
      name: "Binary Search",
      description: "Master efficient searching in sorted arrays",
      color: "from-violet-500 to-purple-500",
      hoverColor: "from-violet-600 to-purple-600",
      icon: "🎯",
      component: BinaryQuiz
    }
  ];

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
        <QuizComponent />
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
            <p className="text-base text-[#B0B0B0] max-w-2xl mx-auto">
              Test your knowledge with comprehensive quizzes covering Easy, Medium, and Hard difficulty levels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedQuiz(quiz)}
                className="cursor-pointer group"
              >
                <div className="h-full bg-[#0F3460] border-2 border-[#625EC6] rounded-2xl shadow-lg hover:shadow-[#625EC6]/30 hover:border-[#FFD700]/50 transition-all overflow-hidden">
                  <div className={`p-8 bg-gradient-to-br ${quiz.color} text-white`}>
                    <div className="text-4xl mb-3">{quiz.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{quiz.name}</h3>
                    <p className="text-white/90 text-sm">{quiz.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[#B0B0B0] text-sm">Questions:</span>
                        <span className="text-[#E8E8E8] font-bold">15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#B0B0B0] text-sm">Difficulty Levels:</span>
                        <span className="text-[#E8E8E8] font-bold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#B0B0B0] text-sm">Time:</span>
                        <span className="text-[#E8E8E8] font-bold">~10 min</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className={`px-4 py-3 rounded-lg bg-gradient-to-r ${quiz.color} text-white font-bold text-center text-sm group-hover:shadow-lg transition-all`}>
                        Start Quiz →
                      </div>
                    </div>
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
                <div className="text-3xl mb-2">📚</div>
                <h3 className="text-base font-bold text-[#4CAF50] mb-2">Study First</h3>
                <p className="text-sm text-[#B0B0B0]">
                  Review the lesson materials before attempting the quiz.
                </p>
              </div>
              <div className="p-6 bg-[#16213E] rounded-xl border-2 border-[#FFD700]/50">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="text-base font-bold text-[#FFD700] mb-2">Use Active Recall</h3>
                <p className="text-sm text-[#B0B0B0]">
                  Try to answer without looking back. Each question includes memory tips!
                </p>
              </div>
              <div className="p-6 bg-[#16213E] rounded-xl border-2 border-[#625EC6]">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="text-base font-bold text-[#7B77E8] mb-2">Practice Regularly</h3>
                <p className="text-sm text-[#B0B0B0]">
                  Retake quizzes to improve retention through spaced repetition.
                </p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-[#16213E] rounded-xl border-2 border-[#625EC6]/50">
              <h3 className="text-base font-bold text-[#E8E8E8] mb-3">Scoring Guide:</h3>
              <div className="space-y-2 text-sm text-[#B0B0B0]">
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