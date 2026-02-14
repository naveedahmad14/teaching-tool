import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BinarySearchQuiz({ lessonId, onQuizComplete }) {
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
        question: "What is the primary requirement for Binary Search to work correctly?",
        options: [
          "Array must be unsorted",
          "Array must be sorted",
          "Array must have unique elements",
          "Array must be small"
        ],
        correct: 1,
        explanation: "Binary Search REQUIRES a sorted array. It uses the sorted property to determine which half contains the target by comparing with the middle element. Without sorting, we can't eliminate half the search space reliably.",
        activeRecall: "Sorted = foundation! Binary Search logic depends entirely on order to eliminate halves."
      },
      {
        id: 2,
        question: "How much of the search space does Binary Search eliminate with each comparison?",
        options: [
          "One element",
          "One quarter",
          "Half",
          "Three quarters"
        ],
        correct: 2,
        explanation: "Binary Search eliminates half the remaining elements with each comparison. If target < middle, eliminate right half; if target > middle, eliminate left half. This halving is why we get O(log n) complexity.",
        activeRecall: "Halving is the magic! Each step: n → n/2 → n/4 → n/8 → ... until found."
      },
      {
        id: 3,
        question: "What is Binary Search's time complexity?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(log n)",
          "O(1)"
        ],
        correct: 2,
        explanation: "Binary Search has O(log n) time complexity because we halve the search space with each comparison. For n elements, we need at most log₂ n comparisons. Example: 1024 elements = max 10 comparisons!",
        activeRecall: "Log n = halving power! 1000 elements → only ~10 comparisons. Exponentially faster than O(n)!"
      },
      {
        id: 4,
        question: "Which index formula avoids integer overflow when calculating the middle?",
        options: [
          "mid = (left + right) / 2",
          "mid = left + (right - left) / 2",
          "mid = (left + right) * 2",
          "mid = right - left"
        ],
        correct: 1,
        explanation: "The formula mid = left + (right - left) / 2 prevents overflow that can occur with (left + right) / 2 when both are large integers. (right - left) stays bounded, making the calculation safe.",
        activeRecall: "Overflow prevention! Subtract first, then divide. Keeps intermediate values small."
      },
      {
        id: 5,
        question: "What is Binary Search's space complexity for the iterative version?",
        options: [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n log n)"
        ],
        correct: 2,
        explanation: "Iterative Binary Search uses O(1) space - just a few variables (left, right, mid) regardless of array size. The recursive version uses O(log n) space for the call stack.",
        activeRecall: "Iterative = constant space! Just 3 pointers. Recursive = log n stack frames."
      }
    ],
    medium: [
      {
        id: 6,
        question: "For an array of size 1,000,000, what's the maximum number of comparisons Binary Search makes?",
        options: [
          "1,000,000",
          "20",
          "100",
          "1,000"
        ],
        correct: 1,
        explanation: "Maximum comparisons = ⌈log₂(1,000,000)⌉ = 20. We calculate: 2²⁰ = 1,048,576 > 1,000,000. Compare this to Linear Search's 1,000,000 maximum comparisons - Binary Search is 50,000 times faster!",
        activeRecall: "Million elements? Only 20 checks! 2²⁰ ≈ 1 million. Log scales incredibly well!"
      },
      {
        id: 7,
        question: "How can Binary Search find the first occurrence of a duplicate element?",
        options: [
          "It can't - Binary Search doesn't work with duplicates",
          "Continue searching left after finding element",
          "Stop at first match",
          "Sort array differently"
        ],
        correct: 1,
        explanation: "Modified Binary Search can find first occurrence: when you find the target, continue searching in the left half (don't return immediately). Keep updating the result index until left > right. This finds the leftmost occurrence in O(log n) time.",
        activeRecall: "Found it? Keep going left! Don't stop at first match - may be more to the left."
      },
      {
        id: 8,
        question: "What happens if you use Binary Search on an unsorted array?",
        options: [
          "It will always fail to find the element",
          "It might find the element by luck",
          "It will sort the array automatically",
          "It will throw an error"
        ],
        correct: 1,
        explanation: "On unsorted arrays, Binary Search may sometimes find elements by chance but is fundamentally unreliable. The elimination logic (left/right decision) assumes ordering. You might get lucky occasionally, but correctness isn't guaranteed.",
        activeRecall: "Undefined behavior! May work sometimes, fail others. Never trust Binary Search on unsorted data."
      },
      {
        id: 9,
        question: "Why is Binary Search inefficient for linked lists?",
        options: [
          "Linked lists can't be sorted",
          "Finding middle element requires O(n) traversal",
          "Linked lists only work with Linear Search",
          "Binary Search requires continuous memory"
        ],
        correct: 1,
        explanation: "Linked lists lack random access. Finding the middle requires traversing n/2 nodes = O(n) time. With log n iterations needing O(n) each to find middle, total becomes O(n log n), worse than Linear Search's O(n)!",
        activeRecall: "No random access = Binary Search fails! Can't jump to middle efficiently in linked lists."
      },
      {
        id: 10,
        question: "What's the loop termination condition in Binary Search?",
        options: [
          "left < right",
          "left <= right",
          "left != right",
          "right - left > 1"
        ],
        correct: 1,
        explanation: "The loop continues while left <= right. When left > right, the search space is empty and element doesn't exist. Using left < right would miss checking when left equals right (single element remaining).",
        activeRecall: "left <= right ensures we check the last element! left < right would skip single-element case."
      }
    ],
    hard: [
      {
        id: 11,
        question: "How do you search in a rotated sorted array [4,5,6,7,0,1,2]?",
        options: [
          "Linear Search only",
          "Sort first, then Binary Search",
          "Modified Binary Search checking which half is sorted",
          "Two Binary Searches"
        ],
        correct: 2,
        explanation: "Modified Binary Search: find mid, determine which half is properly sorted (check if arr[left] <= arr[mid] or arr[mid] <= arr[right]). Search the sorted half if target is in its range, otherwise search the other half. Still O(log n)!",
        activeRecall: "One half always sorted! Check which half, determine if target in range, recurse accordingly."
      },
      {
        id: 12,
        question: "What's the tight lower bound for comparison-based searching in a sorted array?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "Ω(log n)"
        ],
        correct: 3,
        explanation: "The tight lower bound is Ω(log n). Any comparison-based search in a sorted array requires at least log₂ n comparisons in the worst case (information-theoretic argument: n possibilities require log n bits of information). Binary Search achieves this bound optimally.",
        activeRecall: "Binary Search is optimal! Can't do better than log n with comparisons on sorted data."
      },
      {
        id: 13,
        question: "How can Binary Search find the square root of n (without using sqrt)?",
        options: [
          "It can't be used for this",
          "Search in range [0, n] for x where x² = n",
          "Requires calculus",
          "Only works for perfect squares"
        ],
        correct: 1,
        explanation: "Binary Search on range [0, n] for value x where x² ≤ n but (x+ε)² > n. Check mid: if mid² < n, search right; if mid² > n, search left. Converges to √n in O(log n) iterations with desired precision!",
        activeRecall: "Binary Search = not just arrays! Works on any monotonic function, including f(x) = x²."
      },
      {
        id: 14,
        question: "What is exponential search and when is it better than Binary Search?",
        options: [
          "A slower version of Binary Search",
          "Find range with exponential jumps, then Binary Search",
          "Only works on exponential data",
          "Requires sorted exponential array"
        ],
        correct: 1,
        explanation: "Exponential Search: jump by powers of 2 (1,2,4,8,...) until overshooting target, then Binary Search in [2^(k-1), 2^k]. Better than pure Binary Search when target is near the beginning (O(log i) where i is target index vs O(log n) for Binary Search).",
        activeRecall: "Near start? Exponential wins! Jump exponentially, then binary search the small range found."
      },
      {
        id: 15,
        question: "In a sorted matrix (rows and columns sorted), what's optimal search complexity?",
        options: [
          "O(n²) - check each element",
          "O(n log n) - Binary Search each row",
          "O(n + m) - start top-right, eliminate row or column",
          "O(log(nm)) - treat as 1D array"
        ],
        correct: 2,
        explanation: "Staircase search: start at top-right. If target < current, move left (eliminate column). If target > current, move down (eliminate row). Each step eliminates a row or column, giving O(n + m) for n×m matrix. Better than O(n log m) Binary Search approach!",
        activeRecall: "Top-right corner = decision point! Smaller→left, Larger→down. Eliminates row or column each step!"
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
      const percentage = currentQuestions.length ? (score / currentQuestions.length) * 100 : 0;
      onQuizComplete?.(percentage, difficulty);
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
    if (percentage >= 80) return 'text-[#4CAF50]';
    if (percentage >= 60) return 'text-[#FFD700]';
    return 'text-[#F44336]';
  };

  if (quizComplete) {
    const percentage = (score / currentQuestions.length) * 100;
    
    return (
      <div className="max-w-4xl mx-auto p-8 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0F3460] border-2 border-[#625EC6] rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#FFD700]">Quiz Complete!</h2>
          
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>
              {score}/{currentQuestions.length}
            </div>
            <div className="text-xl text-[#E8E8E8] mb-2">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-base text-[#C0C0C0]">
              {percentage >= 80 ? 'Excellent! You\'ve mastered Binary Search!' :
               percentage >= 60 ? 'Good job! Review the concepts you missed.' :
               'Keep practicing! Review the lesson and try again.'}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-[#E8E8E8]">Performance Breakdown:</h3>
            <div className="space-y-2">
              {answeredQuestions.map((q, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
                  <span className="text-[#E8E8E8] text-sm">Question {index + 1}</span>
                  <span className={`font-semibold text-sm ${q.correct ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                    {q.correct ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors border-2 border-[#7B77E8]"
            >
              Try Again ({difficulty})
            </button>
            {difficulty !== 'medium' && (
              <button
                onClick={() => changeDifficulty('medium')}
                className="px-6 py-3 bg-[#FFD700] text-[#1A1A2E] rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
              >
                Try Medium
              </button>
            )}
            {difficulty !== 'hard' && (
              <button
                onClick={() => changeDifficulty('hard')}
                className="px-6 py-3 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-colors"
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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#FFD700]">Binary Search Quiz</h2>
            <div className="text-base font-semibold text-[#C0C0C0]">
              Score: {score}/{currentQuestions.length}
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => changeDifficulty('easy')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                difficulty === 'easy'
                  ? 'bg-[#4CAF50] text-white border-2 border-[#4CAF50]'
                  : 'bg-[#16213E] text-[#C0C0C0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => changeDifficulty('medium')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                difficulty === 'medium'
                  ? 'bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700]'
                  : 'bg-[#16213E] text-[#C0C0C0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => changeDifficulty('hard')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                difficulty === 'hard'
                  ? 'bg-[#F44336] text-white border-2 border-[#F44336]'
                  : 'bg-[#16213E] text-[#C0C0C0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'
              }`}
            >
              Hard
            </button>
          </div>

          <div className="w-full bg-[#16213E] rounded-full h-2 border border-[#625EC6]/50">
            <div
              className="bg-[#625EC6] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
          <div className="text-sm text-[#C0C0C0] mt-1">
            Question {currentQuestion + 1} of {currentQuestions.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#E8E8E8] mb-4">
                {currentQ.question}
              </h3>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all text-sm ${
                      showExplanation
                        ? index === currentQ.correct
                          ? 'border-[#4CAF50] bg-[#4CAF50]/20'
                          : index === selectedAnswer
                          ? 'border-[#F44336] bg-[#F44336]/20'
                          : 'border-[#625EC6]/30 bg-[#16213E]'
                        : 'border-[#625EC6]/50 bg-[#16213E] hover:border-[#625EC6] hover:bg-[#16213E]/80 cursor-pointer'
                    } ${selectedAnswer === index && !showExplanation ? 'border-[#625EC6] bg-[#625EC6]/20' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#E8E8E8]">{option}</span>
                      {showExplanation && index === currentQ.correct && (
                        <span className="text-[#4CAF50] font-bold">✓</span>
                      )}
                      {showExplanation && index === selectedAnswer && index !== currentQ.correct && (
                        <span className="text-[#F44336] font-bold">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentQ.correct
                    ? 'bg-[#4CAF50]/20 border-2 border-[#4CAF50]'
                    : 'bg-[#F44336]/20 border-2 border-[#F44336]'
                }`}>
                  <h4 className={`font-bold mb-2 text-sm ${
                    selectedAnswer === currentQ.correct ? 'text-[#4CAF50]' : 'text-[#F44336]'
                  }`}>
                    {selectedAnswer === currentQ.correct ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-[#E8E8E8] text-sm">{currentQ.explanation}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#625EC6]/20 border-2 border-[#625EC6]">
                  <h4 className="font-bold text-[#7B77E8] mb-2 text-sm">Active Recall Tip:</h4>
                  <p className="text-[#E8E8E8] text-sm">{currentQ.activeRecall}</p>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors border-2 border-[#7B77E8]"
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