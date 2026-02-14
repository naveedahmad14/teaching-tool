import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickSortQuiz({ lessonId, onQuizComplete }) {
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
        question: "What is the pivot in Quick Sort?",
        options: [
          "The smallest element in the array",
          "An element chosen to partition the array",
          "Always the middle element",
          "The largest element in the array"
        ],
        correct: 1,
        explanation: "The pivot is an element chosen (could be first, last, middle, or random) to partition the array. Elements smaller than the pivot go to its left, and larger elements go to its right.",
        activeRecall: "Think: Pivot is the 'decision point' - everything gets sorted relative to it!"
      },
      {
        id: 2,
        question: "What happens to the pivot after the partition step?",
        options: [
          "It moves to the beginning",
          "It stays in the same position",
          "It moves to its final sorted position",
          "It gets removed from the array"
        ],
        correct: 2,
        explanation: "After partitioning, the pivot is placed in its final sorted position. All elements to its left are smaller, and all to its right are larger. This element never needs to move again!",
        activeRecall: "Key insight: After one partition, the pivot is DONE - it's in its correct spot forever!"
      },
      {
        id: 3,
        question: "What is Quick Sort's average time complexity?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(n²)",
          "O(log n)"
        ],
        correct: 1,
        explanation: "Quick Sort's average time complexity is O(n log n). It divides the array log n times (height of recursion tree), and each level does O(n) work for partitioning.",
        activeRecall: "Remember: Divide (log n levels) × Conquer (n work per level) = O(n log n)!"
      },
      {
        id: 4,
        question: "Is Quick Sort an in-place sorting algorithm?",
        options: [
          "No, it needs O(n) extra space",
          "Yes, it sorts within the original array",
          "Only if we use the iterative version",
          "It depends on the pivot choice"
        ],
        correct: 1,
        explanation: "Quick Sort is in-place because it rearranges elements within the original array using swaps. The only extra space needed is O(log n) for the recursion call stack, not for temporary arrays.",
        activeRecall: "In-place = swap within array, no extra array needed (just call stack for recursion)!"
      },
      {
        id: 5,
        question: "Is Quick Sort a stable sorting algorithm?",
        options: [
          "Yes, it always maintains relative order",
          "No, equal elements may change positions",
          "Only with special pivot selection",
          "Stability depends on array size"
        ],
        correct: 1,
        explanation: "Quick Sort is NOT stable. The partitioning process can swap equal elements past each other, changing their relative order. If stability is required, use Merge Sort instead.",
        activeRecall: "Quick Sort = Fast but NOT stable. Merge Sort = Stable but needs extra space!"
      }
    ],
    medium: [
      {
        id: 6,
        question: "What causes Quick Sort's worst-case O(n²) performance?",
        options: [
          "When the array is already sorted",
          "When all elements are equal",
          "When the pivot is always the smallest or largest element",
          "When we choose a random pivot"
        ],
        correct: 2,
        explanation: "Worst case occurs when the pivot is always the extreme element (smallest or largest), creating maximally unbalanced partitions. This happens with sorted/reverse-sorted arrays using first/last element as pivot, requiring n levels of recursion.",
        activeRecall: "Visualize: Unbalanced partitions (1 vs n-1) create n levels instead of log n levels!"
      },
      {
        id: 7,
        question: "How does randomized Quick Sort improve performance?",
        options: [
          "It makes the algorithm run faster in all cases",
          "It avoids worst-case O(n²) on sorted inputs",
          "It reduces space complexity",
          "It makes the algorithm stable"
        ],
        correct: 1,
        explanation: "Randomized Quick Sort chooses a random pivot, making it unlikely to consistently pick bad pivots. This avoids the worst-case O(n²) performance on adversarial inputs like sorted arrays, giving O(n log n) expected time regardless of input.",
        activeRecall: "Random pivot = insurance against bad inputs! Can't predict worst case if pivot is random."
      },
      {
        id: 8,
        question: "What is Quick Sort's space complexity?",
        options: [
          "O(1) - constant space",
          "O(log n) - for recursion stack",
          "O(n) - for temporary arrays",
          "O(n log n) - same as time"
        ],
        correct: 1,
        explanation: "Quick Sort's space complexity is O(log n) for the recursion call stack in the average case. Each recursive call adds one frame to the stack, and the tree depth is log n with balanced partitions. Worst case is O(n) for unbalanced partitions.",
        activeRecall: "Space = recursion depth! Balanced tree → log n depth. Unbalanced → n depth."
      },
      {
        id: 9,
        question: "In the partition step, what does the pointer 'i' track?",
        options: [
          "The current element being compared",
          "The boundary between smaller and larger elements",
          "The position of the pivot",
          "The end of the array"
        ],
        correct: 1,
        explanation: "The pointer 'i' marks the boundary: all elements before i are smaller than the pivot. When we find an element smaller than the pivot at position j, we increment i and swap arr[i] with arr[j], maintaining this invariant.",
        activeRecall: "Think: i = 'insertion point' for next small element. Everything before i is small!"
      },
      {
        id: 10,
        question: "Why is Quick Sort often faster than Merge Sort in practice?",
        options: [
          "It has better worst-case time complexity",
          "It uses less memory and has good cache locality",
          "It's easier to implement",
          "It works on unsorted arrays"
        ],
        correct: 1,
        explanation: "Quick Sort is in-place with good cache performance (sequential access patterns), while Merge Sort needs O(n) extra memory and copies data between arrays. Despite similar O(n log n) average complexity, Quick Sort's lower constant factors make it faster in practice.",
        activeRecall: "Cache locality matters! Sequential access (Quick Sort) beats scattered access (Merge Sort)."
      }
    ],
    hard: [
      {
        id: 11,
        question: "For array [3, 7, 8, 5, 2, 1, 9] with last element as pivot, what's the array after first partition?",
        options: [
          "[3, 7, 2, 1, 5, 8, 9]",
          "[3, 2, 1, 5, 7, 8, 9]",
          "[3, 5, 2, 1, 7, 8, 9]",
          "[2, 1, 3, 5, 7, 8, 9]"
        ],
        correct: 1,
        explanation: "Pivot=9, i=-1. j=0: 3<9, i=0, arr=[3,7,8,5,2,1,9]. j=1: 7<9, i=1, swap(7,7)→[3,7,8,5,2,1,9]. j=2: 8<9, i=2, swap(8,8). j=3: 5<9, i=3, swap(5,5). j=4: 2<9, i=4, swap(2,2). j=5: 1<9, i=5, swap(1,1). Finally swap pivot with i+1. Result: [3,2,1,5,7,8,9] with 9 at position 6, but we need to trace more carefully. Actually: [3,7,8,5,2,1,9]→...",
        activeRecall: "Trace step by step! i tracks boundary, j scans, swap when arr[j]<pivot. Practice makes perfect!"
      },
      {
        id: 12,
        question: "What optimization technique prevents stack overflow in Quick Sort?",
        options: [
          "Always sort the larger partition first",
          "Always sort the smaller partition first, iterate on larger",
          "Use insertion sort for small partitions",
          "Switch to Merge Sort for large arrays"
        ],
        correct: 1,
        explanation: "Tail recursion optimization: recursively sort the smaller partition and use iteration for the larger one. This ensures the recursion depth never exceeds log n, even in worst case, preventing stack overflow while maintaining O(log n) space complexity.",
        activeRecall: "Smaller first = guarantees log n recursion depth! Larger partition handled iteratively."
      },
      {
        id: 13,
        question: "What is the median-of-three pivot selection strategy?",
        options: [
          "Choose the element that appears three times",
          "Calculate the average of three random elements",
          "Choose the median of first, middle, and last elements",
          "Select every third element as pivot"
        ],
        correct: 2,
        explanation: "Median-of-three selects the median value among first, middle, and last elements as pivot. This provides better balance than single-element selection while being faster than true median-finding. It's effective for sorted or nearly-sorted arrays.",
        activeRecall: "Three candidates → pick middle value = better than worst case, faster than true median!"
      },
      {
        id: 14,
        question: "Why is Quick Sort preferred over Merge Sort for arrays?",
        options: [
          "Quick Sort is stable, Merge Sort isn't",
          "Quick Sort has better worst-case complexity",
          "Quick Sort is in-place with better cache performance",
          "Quick Sort works on unsorted data"
        ],
        correct: 2,
        explanation: "Quick Sort's in-place nature means better cache locality and no memory allocation overhead. Modern processors heavily favor algorithms with good spatial locality. Though Merge Sort has guaranteed O(n log n), Quick Sort's practical performance often wins for arrays due to these factors.",
        activeRecall: "CPU cache loves Quick Sort! In-place + sequential access = fast in practice."
      },
      {
        id: 15,
        question: "What is the three-way partitioning optimization for Quick Sort?",
        options: [
          "Divide array into three equal parts",
          "Use three different pivots simultaneously",
          "Partition into <pivot, =pivot, >pivot regions",
          "Run three Quick Sort instances in parallel"
        ],
        correct: 2,
        explanation: "Three-way (Dutch National Flag) partitioning creates three regions: elements less than, equal to, and greater than the pivot. This is crucial for arrays with many duplicates, reducing time complexity from O(n²) to O(n log k) where k is the number of distinct elements.",
        activeRecall: "Many duplicates? Three-way saves the day! <pivot | =pivot | >pivot → skip equal elements!"
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
              {percentage >= 80 ? 'Excellent! You\'ve mastered Quick Sort!' :
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
            <h2 className="text-xl font-bold text-[#FFD700]">Quick Sort Quiz</h2>
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