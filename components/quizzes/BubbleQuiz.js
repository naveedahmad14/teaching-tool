import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BubbleSortQuiz() {
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
        question: "What does Bubble Sort compare in each step?",
        options: [
          "The first and last elements",
          "Adjacent elements (side-by-side)",
          "Random elements",
          "The middle element with all others"
        ],
        correct: 1,
        explanation: "Bubble Sort works by comparing adjacent (neighboring) elements and swapping them if they're in the wrong order. This is why it's called a 'comparison-based' algorithm.",
        activeRecall: "Think about how bubbles rise in water - they move up one position at a time by comparing with their immediate neighbor!"
      },
      {
        id: 2,
        question: "After the first complete pass through an array, where is the largest element?",
        options: [
          "At the beginning of the array",
          "In the middle of the array",
          "At the end of the array",
          "It could be anywhere"
        ],
        correct: 2,
        explanation: "After one complete pass, the largest element 'bubbles up' to the end. This is guaranteed because we compare and swap adjacent elements, pushing the largest element to the right each time.",
        activeRecall: "Visualize: [5,2,8,1] → After pass 1, 8 must be at the end: [?,?,?,8]"
      },
      {
        id: 3,
        question: "What is the space complexity of Bubble Sort?",
        options: [
          "O(n)",
          "O(n²)",
          "O(log n)",
          "O(1)"
        ],
        correct: 3,
        explanation: "Bubble Sort has O(1) space complexity because it sorts in-place. We only need a constant amount of extra space (one temporary variable for swapping), regardless of input size.",
        activeRecall: "Remember: In-place algorithms use constant extra space. We're just swapping elements within the original array!"
      },
      {
        id: 4,
        question: "When would Bubble Sort perform in O(n) time?",
        options: [
          "When the array is reverse sorted",
          "When the array is already sorted",
          "When the array has random elements",
          "Bubble Sort is always O(n²)"
        ],
        correct: 1,
        explanation: "With the optimized version using a 'swapped' flag, Bubble Sort can detect if the array is already sorted after just one pass (no swaps occurred), achieving O(n) best-case time complexity.",
        activeRecall: "Key insight: If we make a complete pass with NO swaps, the array must be sorted!"
      },
      {
        id: 5,
        question: "Is Bubble Sort a stable sorting algorithm?",
        options: [
          "No, it always changes the relative order",
          "Yes, equal elements maintain their relative order",
          "Only if we modify the comparison",
          "Stability doesn't apply to Bubble Sort"
        ],
        correct: 1,
        explanation: "Bubble Sort is stable because we only swap when elements are strictly greater (arr[j] > arr[j+1]), not when they're equal. This preserves the relative order of equal elements.",
        activeRecall: "Think: [3a, 5, 3b] → We never swap 3a and 3b because they're equal, so their order is preserved!"
      }
    ],
    medium: [
      {
        id: 6,
        question: "How many passes are needed to sort an array of n elements in the worst case?",
        options: [
          "n passes",
          "n-1 passes",
          "n² passes",
          "log n passes"
        ],
        correct: 1,
        explanation: "Bubble Sort needs n-1 passes in the worst case. After each pass, one more element is in its final position. After n-1 passes, all elements are sorted (the last element is automatically in place).",
        activeRecall: "For 5 elements: Pass 1→largest at end, Pass 2→2nd largest placed, Pass 3→3rd placed, Pass 4→done (5th auto-placed)!"
      },
      {
        id: 7,
        question: "What happens if you modify Bubble Sort to swap when arr[j] >= arr[j+1] instead of arr[j] > arr[j+1]?",
        options: [
          "It becomes faster",
          "It becomes unstable",
          "It stops working correctly",
          "Nothing changes"
        ],
        correct: 1,
        explanation: "Changing > to >= makes Bubble Sort unstable. Equal elements would now swap positions, destroying their original relative order. This is why proper comparison operators are crucial for stability.",
        activeRecall: "Stability depends on NOT swapping equal elements. >= would swap them unnecessarily!"
      },
      {
        id: 8,
        question: "In the optimized Bubble Sort, what does the 'swapped' flag detect?",
        options: [
          "When to reverse the sorting order",
          "When the array is already sorted",
          "Which elements to compare next",
          "The position of the largest element"
        ],
        correct: 1,
        explanation: "The 'swapped' flag is set to false at the start of each pass. If no swaps occur during a complete pass, the array is already sorted and we can terminate early, improving best-case performance to O(n).",
        activeRecall: "No swaps in a full pass = array is sorted! This optimization saves unnecessary comparisons."
      },
      {
        id: 9,
        question: "After k passes of Bubble Sort, how many elements are guaranteed to be in their final sorted positions?",
        options: [
          "k elements at the beginning",
          "k elements at the end",
          "k elements randomly placed",
          "No guarantee about position"
        ],
        correct: 1,
        explanation: "After k passes, the k largest elements are guaranteed to be in their correct positions at the end of the array. Each pass 'bubbles up' the largest remaining unsorted element to its final position.",
        activeRecall: "Pattern: Pass 1→1 sorted, Pass 2→2 sorted, Pass k→k sorted (all at the end)!"
      },
      {
        id: 10,
        question: "Why is Bubble Sort's average case O(n²)?",
        options: [
          "It needs to sort n² elements",
          "It makes n comparisons in n passes",
          "The swapping operation is O(n)",
          "It uses nested loops"
        ],
        correct: 1,
        explanation: "Bubble Sort uses nested loops: outer loop runs n-1 times, inner loop runs up to n-1 times for each outer iteration. This gives approximately n²/2 comparisons on average, which is O(n²).",
        activeRecall: "Nested loops = multiply! Outer n × Inner n = n² time complexity."
      }
    ],
    hard: [
      {
        id: 11,
        question: "What is the exact number of comparisons Bubble Sort makes in the worst case for an array of size n?",
        options: [
          "n²",
          "n(n-1)/2",
          "n-1",
          "2n"
        ],
        correct: 1,
        explanation: "In the worst case, Bubble Sort makes exactly n(n-1)/2 comparisons. Pass 1: (n-1) comparisons, Pass 2: (n-2), ..., Pass n-1: 1. Sum = (n-1)+(n-2)+...+1 = n(n-1)/2.",
        activeRecall: "It's the sum of first (n-1) natural numbers! For n=5: 4+3+2+1 = 10 = 5(4)/2"
      },
      {
        id: 12,
        question: "Consider Bubble Sort on [5,1,4,2,8]. After 2 complete passes, what's the array state?",
        options: [
          "[1,4,2,5,8]",
          "[1,2,4,5,8]",
          "[1,2,5,4,8]",
          "[2,1,4,5,8]"
        ],
        correct: 0,
        explanation: "Pass 1: [5,1,4,2,8]→[1,4,2,5,8] (8 bubbles up). Pass 2: [1,4,2,5,8]→[1,2,4,5,8] (5 bubbles to 2nd-last position). After 2 passes, the 2 largest elements (8,5) are correctly positioned at the end.",
        activeRecall: "Trace it step by step! Each pass moves one more element to its final position at the end."
      },
      {
        id: 13,
        question: "What technique could reduce Bubble Sort's worst-case swaps (though not comparisons)?",
        options: [
          "Using a different data structure",
          "Remembering the last swap position",
          "Comparing every other element",
          "Sorting in reverse first"
        ],
        correct: 1,
        explanation: "By remembering the position of the last swap in each pass, we know all elements after that position are sorted. We can reduce the range of the inner loop to this position, reducing unnecessary swaps (though comparisons still remain high).",
        activeRecall: "Smart optimization: If last swap was at position k, everything after k is sorted!"
      },
      {
        id: 14,
        question: "Which statement about Bubble Sort's adaptive behavior is TRUE?",
        options: [
          "It's always adaptive regardless of implementation",
          "It's only adaptive with the 'swapped' flag optimization",
          "It's never adaptive, always O(n²)",
          "Adaptivity depends on the input array size"
        ],
        correct: 1,
        explanation: "An adaptive algorithm performs better on partially sorted data. Standard Bubble Sort is NOT adaptive (always O(n²)). Only with the 'swapped' flag optimization does it become adaptive, achieving O(n) on already-sorted arrays.",
        activeRecall: "Adaptive = performs better on partially sorted data. Without optimization, Bubble Sort doesn't detect this!"
      },
      {
        id: 15,
        question: "Why isn't Bubble Sort used in practice despite being simple?",
        options: [
          "It's too difficult to implement correctly",
          "It uses too much memory",
          "Poor cache locality and O(n²) comparisons",
          "It's not a stable sorting algorithm"
        ],
        correct: 2,
        explanation: "Despite simplicity and stability, Bubble Sort has poor cache performance (lots of scattered memory access) and O(n²) time complexity. Modern algorithms like Quicksort or Timsort are much faster in practice, even with similar worst-case complexity.",
        activeRecall: "Simplicity ≠ Efficiency. Modern CPUs favor algorithms with good cache locality and fewer operations!"
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
          <h2 className="text-2xl font-bold text-center mb-6 text-[#FFD700]">Quiz Complete! 🎉</h2>
          
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>
              {score}/{currentQuestions.length}
            </div>
            <div className="text-xl text-[#E8E8E8] mb-2">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-base text-[#B0B0B0]">
              {percentage >= 80 ? '🌟 Excellent! You\'ve mastered Bubble Sort!' :
               percentage >= 60 ? '👍 Good job! Review the concepts you missed.' :
               '📚 Keep practicing! Review the lesson and try again.'}
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
            <h2 className="text-xl font-bold text-[#FFD700]">Bubble Sort Quiz</h2>
            <div className="text-base font-semibold text-[#B0B0B0]">
              Score: {score}/{currentQuestions.length}
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => changeDifficulty('easy')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                difficulty === 'easy'
                  ? 'bg-[#4CAF50] text-white border-2 border-[#4CAF50]'
                  : 'bg-[#16213E] text-[#B0B0B0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => changeDifficulty('medium')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                difficulty === 'medium'
                  ? 'bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700]'
                  : 'bg-[#16213E] text-[#B0B0B0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => changeDifficulty('hard')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                difficulty === 'hard'
                  ? 'bg-[#F44336] text-white border-2 border-[#F44336]'
                  : 'bg-[#16213E] text-[#B0B0B0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'
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
          <div className="text-sm text-[#B0B0B0] mt-1">
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
                    {selectedAnswer === currentQ.correct ? '🎉 Correct!' : '❌ Incorrect'}
                  </h4>
                  <p className="text-[#E8E8E8] text-sm">{currentQ.explanation}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#625EC6]/20 border-2 border-[#625EC6]">
                  <h4 className="font-bold text-[#7B77E8] mb-2 text-sm">💡 Active Recall Tip:</h4>
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