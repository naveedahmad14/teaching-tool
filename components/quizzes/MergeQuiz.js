import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MergeSortQuiz({ lessonId, onQuizComplete }) {
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
              {percentage >= 80 ? 'Excellent! You\'ve mastered Merge Sort!' :
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
            <h2 className="text-xl font-bold text-[#FFD700]">Merge Sort Quiz</h2>
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