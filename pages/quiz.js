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
      <div className="min-h-screen">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="fixed top-4 left-4 z-50 px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
        >
          ← Back to Quizzes
        </button>
        <QuizComponent />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Algorithm Quizzes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Test your knowledge with comprehensive quizzes covering Easy, Medium, and Hard difficulty levels
            </p>
          </motion.div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedQuiz(quiz)}
                className="cursor-pointer group"
              >
                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                  {/* Quiz Icon/Header */}
                  <div className={`p-8 bg-gradient-to-br ${quiz.color} text-white`}>
                    <div className="text-6xl mb-4">{quiz.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{quiz.name}</h3>
                    <p className="text-white/90">{quiz.description}</p>
                  </div>

                  {/* Quiz Details */}
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Questions:</span>
                        <span className="text-gray-800 font-bold">15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Difficulty Levels:</span>
                        <span className="text-gray-800 font-bold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Time:</span>
                        <span className="text-gray-800 font-bold">~10 min</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className={`px-4 py-3 rounded-lg bg-gradient-to-r ${quiz.color} text-white font-bold text-center group-hover:shadow-lg transition-all`}>
                        Start Quiz →
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">How to Excel in These Quizzes</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Study First</h3>
                <p className="text-green-700">
                  Review the lesson materials before attempting the quiz. Understanding concepts is key!
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="text-xl font-bold text-yellow-800 mb-2">Use Active Recall</h3>
                <p className="text-yellow-700">
                  Try to answer without looking back. Each question includes memory tips to help you learn!
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Practice Regularly</h3>
                <p className="text-purple-700">
                  Retake quizzes to improve retention through spaced repetition. Progress through difficulty levels!
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Scoring Guide:</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-600">80-100%:</span>
                  <span>Excellent! You've mastered this algorithm.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-yellow-600">60-79%:</span>
                  <span>Good understanding. Review missed concepts.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600">Below 60%:</span>
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