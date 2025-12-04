import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MergeSortQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = {
    easy: [
      {
        id: 1,
        question: "What algorithmic paradigm does Merge Sort follow?",
        options: [
          "Divide and Conquer",
          "Greedy Algorithm",
          "Dynamic Programming",
          "Backtracking"
        ],
        correct: 0,
        explanation: "Merge Sort uses divide-and-conquer: recursively divide the array into halves until single elements remain, then merge them back in sorted order. Each merge combines two sorted subarrays.",
        activeRecall: "Think: Divide (split array) → Conquer (sort halves) → Combine (merge sorted halves)!"
      },
      {
        id: 2,
        question: "What is Merge Sort's time complexity in ALL cases?",
        options: [
          "O(n²)",
          "O(n log n)",
          "O(n)",
          "O(log n)"
        ],
        correct: 1,
        explanation: "Merge Sort has O(n log n) time complexity in best, average, AND worst cases. This consistency is its key advantage - you always know exactly how long it will take regardless of input order.",
        activeRecall: "Guaranteed performance! Unlike Quick Sort's O(n²) worst case, Merge Sort is ALWAYS O(n log n)!"
      },
      {
        id: 3,
        question: "What is the space complexity of standard Merge Sort?",
        options: [
          "O(1) - constant space",
          "O(log n) - logarithmic space",
          "O(n) - linear space",
          "O(n²) - quadratic space"
        ],
        correct: 2,
        explanation: "Merge Sort needs O(n) auxiliary space for temporary arrays during the merge operation. Each merge operation copies elements to temporary arrays before merging them back. This is its main drawback compared to in-place algorithms.",
        activeRecall: "Trade-off: Guaranteed O(n log n) time BUT needs O(n) extra space for merging!"
      },
      {
        id: 4,
        question: "Is Merge Sort a stable sorting algorithm?",
        options: [
          "No, it changes relative order of equal elements",
          "Yes, equal elements maintain their relative order",
          "Only when using bottom-up approach",
          "Stability depends on implementation details"
        ],
        correct: 1,
        explanation: "Merge Sort is stable because during the merge operation, when elements are equal, we take from the left subarray first. This preserves the original relative ordering of equal elements throughout the sorting process.",
        activeRecall: "Stable means: [3a, 5, 3b] → [3a, 3b, 5]. The two 3's stay in their original order!"
      },
      {
        id: 5,
        question: "How many times is each element copied during Merge Sort?",
        options: [
          "Once",
          "Twice per merge level",
          "log n times (once per level)",
          "n times"
        ],
        correct: 2,
        explanation: "Each element is copied once per level of the recursion tree. Since the tree has log n levels (halving each time), each element is copied approximately log n times throughout the entire sorting process.",
        activeRecall: "Tree height = log n levels. Each level touches every element once = log n copies per element!"
      }
    ],
    medium: [
      {
        id: 6,
        question: "What is the height of Merge Sort's recursion tree for an array of size n?",
        options: [
          "n",
          "log n",
          "n log n",
          "√n"
        ],
        correct: 1,
        explanation: "The recursion tree has height log₂ n because we halve the array at each level. Starting with n elements: n → n/2 → n/4 → ... → 1. The number of times you can halve n before reaching 1 is log₂ n.",
        activeRecall: "Halving pattern: 16→8→4→2→1 is 4 levels = log₂(16). Each level processes all n elements!"
      },
      {
        id: 7,
        question: "In the merge operation, what's the maximum number of comparisons needed to merge two sorted arrays of total size n?",
        options: [
          "n/2",
          "n-1",
          "n",
          "2n"
        ],
        correct: 1,
        explanation: "Merging two sorted arrays of combined size n requires at most n-1 comparisons. You compare elements until one array is exhausted, then copy remaining elements without comparison. Example: merging [1,3,5] and [2,4,6] takes 5 comparisons, not 6.",
        activeRecall: "Think: Last element needs no comparison - it's automatically placed when one array empties!"
      },
      {
        id: 8,
        question: "When does Merge Sort perform better than Quick Sort?",
        options: [
          "When the array is already sorted",
          "When guaranteed O(n log n) is required",
          "When memory is limited",
          "When sorting primitive types"
        ],
        correct: 1,
        explanation: "Merge Sort is preferred when guaranteed O(n log n) worst-case performance is critical. Quick Sort can degrade to O(n²), while Merge Sort is always O(n log n). This makes Merge Sort better for real-time systems or when predictable performance matters more than average speed.",
        activeRecall: "Merge Sort = consistency. Quick Sort = speed (usually). Choose based on priorities!"
      },
      {
        id: 9,
        question: "What optimization reduces Merge Sort's overhead on small subarrays?",
        options: [
          "Switch to Insertion Sort for small n",
          "Use random pivot selection",
          "Skip the merge step",
          "Use hash tables"
        ],
        correct: 0,
        explanation: "For small subarrays (typically n < 10-20), switching to Insertion Sort reduces overhead. Insertion Sort has high constant factors but works well on tiny arrays. This hybrid approach is used in Timsort (Python's default sort).",
        activeRecall: "Small arrays: Insertion Sort wins! Large arrays: Merge Sort wins! Combine them for best results."
      },
      {
        id: 10,
        question: "How many recursive calls does Merge Sort make for an array of size n?",
        options: [
          "n",
          "log n",
          "2n - 1",
          "n log n"
        ],
        correct: 2,
        explanation: "Merge Sort makes 2n-1 total function calls. Each non-leaf node in the binary recursion tree represents a merge operation, and there are n-1 internal nodes. Including the n leaf nodes (single elements), we get 2n-1 total calls.",
        activeRecall: "Binary tree with n leaves has n-1 internal nodes. Total = n + (n-1) = 2n-1 calls!"
      }
    ],
    hard: [
      {
        id: 11,
        question: "Given [38, 27, 43, 3], what's the state after the FIRST complete merge?",
        options: [
          "[27, 38, 3, 43]",
          "[3, 27, 38, 43]",
          "[27, 38, 43, 3]",
          "[38, 27, 3, 43]"
        ],
        correct: 0,
        explanation: "First split: [38,27] and [43,3]. Each splits again: [38],[27] and [43],[3]. First merges: [27,38] and [3,43]. After the first complete merge of these two sorted halves, we get [3,27,38,43]. But the question asks after FIRST merge, which would be [27,38] on left, [3,43] on right = state is [27,38,3,43] before final merge.",
        activeRecall: "Trace bottom-up! Singles→pairs→final. Question catches you between merge levels!"
      },
      {
        id: 12,
        question: "What's the exact number of comparisons Merge Sort makes in the worst case for an array of size 8?",
        options: [
          "12",
          "17",
          "24",
          "28"
        ],
        correct: 1,
        explanation: "For n=8: Level 3 (merge 1+1): 4 merges × 1 comparison = 4. Level 2 (merge 2+2): 2 merges × 3 comparisons = 6. Level 1 (merge 4+4): 1 merge × 7 comparisons = 7. Total: 4+6+7=17 comparisons. Formula: n⌈log₂n⌉ - 2^⌈log₂n⌉ + 1.",
        activeRecall: "Count merge by merge! Each merge of size k needs k-1 comparisons worst case."
      },
      {
        id: 13,
        question: "How can Merge Sort be implemented with O(1) space for linked lists?",
        options: [
          "It can't - always needs O(n) space",
          "By reordering pointers during merge",
          "By using the list itself as temporary storage",
          "Both B and C"
        ],
        correct: 3,
        explanation: "For linked lists, Merge Sort can be O(1) space! Instead of creating new arrays, we just rearrange pointers during merge. The list structure itself serves as 'temporary storage'. This makes Merge Sort excellent for linked lists, unlike Quick Sort which needs random access.",
        activeRecall: "Arrays need temp space, but linked lists? Just rewire pointers! O(1) space achieved!"
      },
      {
        id: 14,
        question: "In external sorting with Merge Sort, what determines the number of passes?",
        options: [
          "Size of the input file",
          "Available RAM size",
          "log_k(N/M) where k=merge ways, N=file size, M=RAM",
          "Number of processors available"
        ],
        correct: 2,
        explanation: "External sorting passes = log_k(N/M) where k is the k-way merge, N is total data size, M is available memory. With 4GB RAM sorting 1TB data using 2-way merge: log₂(1024/4) = log₂(256) = 8 passes. K-way merging reduces passes but requires more RAM.",
        activeRecall: "More merge ways (k) = fewer passes! Trade memory for speed in external sorting."
      },
      {
        id: 15,
        question: "Why is Merge Sort preferred for sorting data in tape drives?",
        options: [
          "Tape drives support random access",
          "Merge Sort only needs sequential access",
          "It's faster than Quick Sort on tapes",
          "It uses less space on tapes"
        ],
        correct: 1,
        explanation: "Tape drives only support sequential access (forward/backward, no jumping). Merge Sort naturally reads data sequentially during merge operations, making it perfect for tapes. Quick Sort needs random access for efficient partitioning, making it impractical for sequential-access devices.",
        activeRecall: "Sequential access only? Merge Sort shines! Quick Sort needs random jumping = bad for tapes."
      }
    ]
  };

  const currentQuestions = questions[difficulty];
  const currentQ = currentQuestions[currentQuestion];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, {
      question: currentQ.question,
      correct: isCorrect,
      difficulty
    }]);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetQuiz();
  };

  const getScoreColor = () => {
    const percentage = (score / currentQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (quizComplete) {
    const percentage = (score / currentQuestions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quiz Complete! 🎉
          </h2>
          
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`text-7xl font-bold mb-4 ${getScoreColor()}`}
            >
              {score}/{currentQuestions.length}
            </motion.div>
            <div className="text-3xl text-gray-700 mb-2">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-xl text-gray-600">
              {percentage >= 80 ? '🌟 Excellent! You\'ve mastered Merge Sort!' :
               percentage >= 60 ? '👍 Good job! Review the concepts you missed.' :
               '📚 Keep practicing! Review the lesson and try again.'}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Performance Breakdown:</h3>
            <div className="space-y-2">
              {answeredQuestions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                >
                  <span className="text-gray-700 font-medium">Question {index + 1}</span>
                  <span className={`font-bold text-lg ${q.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {q.correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
            >
              Try Again ({difficulty})
            </button>
            {difficulty !== 'medium' && (
              <button
                onClick={() => changeDifficulty('medium')}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg transform hover:scale-105"
              >
                Try Medium
              </button>
            )}
            {difficulty !== 'hard' && (
              <button
                onClick={() => changeDifficulty('hard')}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105"
              >
                Try Hard
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Merge Sort Quiz
              </h2>
              <div className="text-2xl font-bold text-gray-700">
                {score}/{currentQuestions.length}
              </div>
            </div>
            
            {/* Difficulty Selector */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => changeDifficulty('easy')}
                className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                  difficulty === 'easy'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => changeDifficulty('medium')}
                className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                  difficulty === 'medium'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => changeDifficulty('hard')}
                className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                  difficulty === 'hard'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hard
              </button>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2 font-medium">
              Question {currentQuestion + 1} of {currentQuestions.length}
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {currentQ.question}
                </h3>

                <div className="space-y-4">
                  {currentQ.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showExplanation}
                      whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                      whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                      className={`w-full p-6 text-left rounded-xl border-2 transition-all text-lg ${
                        showExplanation
                          ? index === currentQ.correct
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-lg'
                            : index === selectedAnswer
                            ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer shadow-md hover:shadow-lg'
                      } ${selectedAnswer === index && !showExplanation ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showExplanation && index === currentQ.correct && (
                          <span className="text-green-600 font-bold text-2xl">✓</span>
                        )}
                        {showExplanation && index === selectedAnswer && index !== currentQ.correct && (
                          <span className="text-red-600 font-bold text-2xl">✗</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className={`p-6 rounded-xl ${
                    selectedAnswer === currentQ.correct
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300'
                      : 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300'
                  }`}>
                    <h4 className={`font-bold text-xl mb-3 ${
                      selectedAnswer === currentQ.correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === currentQ.correct ? '🎉 Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className="text-gray-700 text-lg leading-relaxed">{currentQ.explanation}</p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
                    <h4 className="font-bold text-indigo-800 text-xl mb-3">💡 Active Recall Tip:</h4>
                    <p className="text-gray-700 text-lg leading-relaxed">{currentQ.activeRecall}</p>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
                  >
                    {currentQuestion < currentQuestions.length - 1 ? 'Next Question →' : 'Complete Quiz'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}