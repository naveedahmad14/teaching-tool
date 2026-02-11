import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LinearSearchQuiz() {
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
        question: "In what order does Linear Search examine elements?",
        options: [
            "From the end to the beginning",
            "From the beginning to the end sequentially",
            "Random order",
            "From middle outward"
        ],
        correct: 1,
        explanation: "Linear Search examines elements sequentially from index 0 to the last index, checking each element one by one until it finds the target or reaches the end.",
        activeRecall: "Sequential = in order, like reading a book page by page from start to finish!"
        },
        {
        id: 2,
        question: "What is Linear Search's best-case time complexity?",
        options: [
            "O(n)",
            "O(log n)",
            "O(1)",
            "O(n²)"
        ],
        correct: 2,
        explanation: "Best case is O(1) when the target element is at the first position (index 0). We find it with just one comparison!",
        activeRecall: "Best case = lucky first try! Found at index 0 = constant time O(1)."
        },
        {
        id: 3,
        question: "Does Linear Search require the array to be sorted?",
        options: [
            "Yes, it only works on sorted arrays",
            "No, it works on any array regardless of order",
            "Only for optimal performance",
            "Yes, but only for large arrays"
        ],
        correct: 1,
        explanation: "Linear Search works on ANY array - sorted, unsorted, or reverse sorted. It checks each element regardless of order, which is both its flexibility and its limitation.",
        activeRecall: "Linear Search = no prerequisites! Works on any data order, unlike Binary Search."
        },
        {
        id: 4,
        question: "What does Linear Search return when the element is not found?",
        options: [
            "The last index",
            "0",
            "-1 or null",
            "The middle index"
        ],
        correct: 2,
        explanation: "By convention, Linear Search returns -1 (or null/false) when the target is not found, indicating the element doesn't exist in the array.",
        activeRecall: "Not found = -1. Valid indices start at 0, so -1 clearly means 'not present'!"
        },
        {
        id: 5,
        question: "What is the space complexity of Linear Search?",
        options: [
            "O(n)",
            "O(log n)",
            "O(1)",
            "O(n log n)"
        ],
        correct: 2,
        explanation: "Linear Search has O(1) space complexity because it only needs a constant amount of extra space (a variable to track the current index), regardless of array size.",
        activeRecall: "Just one counter variable needed! No extra arrays or recursion = O(1) space."
        }
    ],
    medium: [
        {
        id: 6,
        question: "In an unsorted array of n elements, what's the average number of comparisons Linear Search makes to find an element that exists?",
        options: [
            "n",
            "n/2",
            "(n+1)/2",
            "log n"
        ],
        correct: 2,
        explanation: "On average, the element is found at position (n+1)/2 when it exists. For array [1,2,3,4,5], average position is (5+1)/2 = 3. We sum positions 1 to n, divide by n: (1+2+...+n)/n = (n+1)/2.",
        activeRecall: "Average case = middle of array! For 10 elements: (10+1)/2 = 5.5 comparisons."
        },
        {
        id: 7,
        question: "What technique can optimize Linear Search for frequently accessed elements?",
        options: [
            "Binary search preprocessing",
            "Move-to-front heuristic",
            "Quick sort first",
            "Hash table conversion"
        ],
        correct: 1,
        explanation: "Move-to-front (MTF) heuristic moves accessed elements to the front. Frequently accessed items cluster at the beginning, reducing average search time for skewed access patterns.",
        activeRecall: "Popular items move forward! Like organizing your desk - frequently used items on top."
        },
        {
        id: 8,
        question: "When is Linear Search more efficient than Binary Search?",
        options: [
            "When the array is sorted",
            "When n is very small (< 10 elements)",
            "When searching multiple times",
            "When the array is very large"
        ],
        correct: 1,
        explanation: "For very small arrays (typically n < 10), Linear Search's simplicity and lack of overhead make it faster than Binary Search despite worse asymptotic complexity. The constant factors matter more than O(log n) vs O(n) for tiny inputs.",
        activeRecall: "Small data = simple wins! Binary Search overhead not worth it for 5 elements."
        },
        {
        id: 9,
        question: "What is the worst-case scenario for Linear Search?",
        options: [
            "Element is at the beginning",
            "Element is in the middle",
            "Element is at the end or not present",
            "Array is sorted"
        ],
        correct: 2,
        explanation: "Worst case requires checking ALL n elements: either the target is at the last position, or it doesn't exist. Both scenarios require n comparisons, making it O(n) worst-case.",
        activeRecall: "Worst case = check everything! Last position or not found = maximum n comparisons."
        },
        {
        id: 10,
        question: "What optimization uses a 'sentinel' value in Linear Search?",
        options: [
            "Place target at end, avoid bound checking",
            "Sort array first",
            "Use two pointers",
            "Skip every other element"
        ],
        correct: 0,
        explanation: "Sentinel Linear Search places the target at the end of the array temporarily. This eliminates the need to check array bounds in the loop (one fewer condition per iteration), slightly improving performance.",
        activeRecall: "Sentinel = guaranteed to find! Place target at end → no bound check needed in loop."
        }
    ],
    hard: [
        {
        id: 11,
        question: "Given an unsorted array where 70% of searches hit the same 10% of elements, what's the optimal Linear Search strategy?",
        options: [
            "Keep array as-is",
            "Sort array first",
            "Use frequency count and move-to-front",
            "Use Binary Search"
        ],
        correct: 2,
        explanation: "With highly skewed access patterns (70% of searches hit 10% of elements), maintaining a frequency count and moving frequently accessed items to the front dramatically reduces average search time from O(n) to near O(1) for common elements.",
        activeRecall: "Skewed access = self-organizing! Popular items bubble to front organically."
        },
        {
        id: 12,
        question: "What is the expected number of comparisons to find an element in an array of n elements, assuming uniform probability?",
        options: [
            "(n+1)/2 if element exists",
            "Always n comparisons",
            "n if not present, (n+1)/2 if present with 50% probability each",
            "log n regardless"
        ],
        correct: 2,
        explanation: "If element has 50% chance of existing: E = 0.5 × (n+1)/2 + 0.5 × n = (n+1)/4 + n/2 = (3n+1)/4 ≈ 3n/4 comparisons. This accounts for both success and failure cases.",
        activeRecall: "Expected value = weighted average! Success cost + Failure cost, each weighted by probability."
        },
        {
        id: 13,
        question: "In a circular array (where last element connects to first), how does Linear Search complexity change?",
        options: [
            "Becomes O(log n)",
            "Stays O(n) but may need to wrap around",
            "Becomes O(n²)",
            "Becomes O(1)"
        ],
        correct: 1,
        explanation: "Circular arrays still require O(n) worst case - you might start mid-array and wrap around, but you'll never check more than n elements. The circularity just affects implementation (modulo arithmetic), not complexity.",
        activeRecall: "Circular = same total elements! May wrap around, but still check at most n items."
        },
        {
        id: 14,
        question: "For linked lists, why is Linear Search often preferred over Binary Search?",
        options: [
            "Binary Search doesn't work on linked lists",
            "Linear Search is faster on linked lists",
            "Binary Search requires O(n) access time for middle element",
            "All of the above"
        ],
        correct: 3,
        explanation: "Linked lists lack O(1) random access. Binary Search needs middle element access, which takes O(n) time in linked lists, making total complexity O(n log n) - worse than Linear Search's O(n)! Linear Search only needs sequential access.",
        activeRecall: "No random access? Binary Search dies! Need O(1) middle access for efficiency."
        },
        {
        id: 15,
        question: "What parallel speedup can Linear Search theoretically achieve with k processors?",
        options: [
            "k-times speedup (linear)",
            "log k speedup",
            "No speedup possible",
            "k² speedup"
        ],
        correct: 0,
        explanation: "Linear Search is embarrassingly parallel: divide array into k parts, search each part simultaneously. With perfect conditions, k processors give k-times speedup, completing in O(n/k) time. This is one of the few algorithms with perfect parallel scaling.",
        activeRecall: "Perfectly parallelizable! Divide array → k processors → k-times faster. Ideal speedup!"
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
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0F3460] border-2 border-[#625EC6] rounded-xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Quiz Complete! 🎉</h2>
          
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
              {score}/{currentQuestions.length}
            </div>
            <div className="text-2xl text-gray-700 mb-2">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-lg text-gray-600">
              {percentage >= 80 ? '🌟 Excellent! You\'ve mastered Linear Search!' :
               percentage >= 60 ? '👍 Good job! Review the concepts you missed.' :
               '📚 Keep practicing! Review the lesson and try again.'}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Performance Breakdown:</h3>
            <div className="space-y-2">
              {answeredQuestions.map((q, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Question {index + 1}</span>
                  <span className={`font-semibold ${q.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {q.correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
            >
              Try Again ({difficulty})
            </button>
            {difficulty !== 'medium' && (
              <button
                onClick={() => changeDifficulty('medium')}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
              >
                Try Medium
              </button>
            )}
            {difficulty !== 'hard' && (
              <button
                onClick={() => changeDifficulty('hard')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
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
    <div className="min-h-screen bg-[#1A1A2E] p-8 pt-20">
      <div className="max-w-5xl mx-auto bg-[#0F3460] border-2 border-[#625EC6] rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Linear Search Quiz</h2>
            <div className="text-lg font-semibold text-gray-600">
              Score: {score}/{currentQuestions.length}
            </div>
          </div>
          
          {/* Difficulty Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => changeDifficulty('easy')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                difficulty === 'easy'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => changeDifficulty('medium')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                difficulty === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => changeDifficulty('hard')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                difficulty === 'hard'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Hard
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Question {currentQuestion + 1} of {currentQuestions.length}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {currentQ.question}
              </h3>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      showExplanation
                        ? index === currentQ.correct
                          ? 'border-green-500 bg-green-50'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer'
                    } ${selectedAnswer === index && !showExplanation ? 'border-purple-500 bg-purple-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showExplanation && index === currentQ.correct && (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                      {showExplanation && index === selectedAnswer && index !== currentQ.correct && (
                        <span className="text-red-600 font-bold">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentQ.correct
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <h4 className={`font-bold mb-2 ${
                    selectedAnswer === currentQ.correct ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {selectedAnswer === currentQ.correct ? '🎉 Correct!' : '❌ Incorrect'}
                  </h4>
                  <p className="text-gray-700">{currentQ.explanation}</p>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-2">💡 Active Recall Tip:</h4>
                  <p className="text-gray-700">{currentQ.activeRecall}</p>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
                >
                  {currentQuestion < currentQuestions.length - 1 ? 'Next Question →' : 'Complete Quiz'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}