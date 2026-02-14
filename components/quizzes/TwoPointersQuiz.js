import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TwoPointersQuiz({ lessonId, onQuizComplete }) {
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
        question: "In the two-pointer remove-duplicates technique, what must be true about the array?",
        options: [
          "It must be unsorted",
          "It must be sorted (or duplicates are adjacent)",
          "It can be any order",
          "It must have exactly two unique values"
        ],
        correct: 1,
        explanation: "The read/write two-pointer method for removing duplicates relies on comparing adjacent elements. When the array is sorted, duplicate values are adjacent, so we only need to copy when arr[read] != arr[write].",
        activeRecall: "Sorted → duplicates are next to each other. Read scans, write marks the end of the unique region."
      },
      {
        id: 2,
        question: "What does the 'write' pointer represent?",
        options: [
          "The position we are reading from",
          "The end of the unique-elements region",
          "The start of the array",
          "The position of the last duplicate"
        ],
        correct: 1,
        explanation: "The write pointer marks the boundary: all elements from index 0 to write (inclusive) are unique. When we see a new unique value at read, we advance write and copy arr[read] to arr[write].",
        activeRecall: "write = 'unique region ends here'. We extend it by writing the next unique value at write+1."
      },
      {
        id: 3,
        question: "What is the time complexity of the two-pointer in-place remove-duplicates algorithm?",
        options: [
          "O(n²)",
          "O(n log n)",
          "O(n)",
          "O(1)"
        ],
        correct: 2,
        explanation: "We make a single pass: read goes from 1 to n-1, and we do O(1) work per step (compare, maybe copy and advance write). So total time is O(n).",
        activeRecall: "One pass, constant work per element → O(n). No nested loops."
      },
      {
        id: 4,
        question: "What is the space complexity of the in-place two-pointer remove-duplicates?",
        options: [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n²)"
        ],
        correct: 2,
        explanation: "We only use a few variables (read, write, and the array itself). We overwrite within the same array, so extra space is O(1).",
        activeRecall: "In-place = no extra array. Just two indices and the original array."
      },
      {
        id: 5,
        question: "After the algorithm finishes, what does 'write + 1' represent?",
        options: [
          "The length of the original array",
          "The number of unique elements",
          "The index of the last duplicate",
          "The number of comparisons made"
        ],
        correct: 1,
        explanation: "Indices 0 through write (inclusive) hold the unique elements, so there are write + 1 unique elements. Returning write + 1 is the count of unique values.",
        activeRecall: "Unique region is [0..write], so count = write + 1."
      }
    ],
    medium: [
      {
        id: 6,
        question: "For array [1,1,2,2,3], after the algorithm, what is the value of write and the effective length?",
        options: [
          "write=4, length=5",
          "write=2, length=3",
          "write=3, length=4",
          "write=1, length=2"
        ],
        correct: 1,
        explanation: "We keep 1 (write=0), skip second 1, keep 2 (write=1), skip second 2, keep 3 (write=2). So write=2 and there are 3 unique elements. The array becomes [1,2,3,?,?] and we return 3.",
        activeRecall: "Trace: read advances, we only copy when value changes. Count unique values = write+1."
      },
      {
        id: 7,
        question: "Why do we start with write=0 and read=1 (not read=0)?",
        options: [
          "To avoid an off-by-one error",
          "The first element is always unique; we only need to compare from the second",
          "To handle empty arrays",
          "It doesn't matter; we could start both at 0"
        ],
        correct: 1,
        explanation: "The element at index 0 is always the first occurrence of its value, so it belongs in the unique region. We set write=0 and start read at 1, comparing each new position to the current unique region end.",
        activeRecall: "First element is always 'unique' so far. We only need to decide for indices 1..n-1."
      },
      {
        id: 8,
        question: "Can we use the same two-pointer idea for an unsorted array to remove duplicates?",
        options: [
          "Yes, with the same O(n) time and O(1) space",
          "Not in O(1) space; we'd need a hash set or sort first",
          "Yes, but we need two passes",
          "No; two pointers only work on sorted data"
        ],
        correct: 1,
        explanation: "For unsorted arrays, duplicates can be anywhere. To remove them in-place without reordering you'd need to know 'have I seen this value before?' which typically requires O(n) extra space (e.g. a set) or sorting first (which changes order).",
        activeRecall: "Unsorted → can't tell if value is duplicate without extra storage or sorting."
      },
      {
        id: 9,
        question: "What happens if the array is empty?",
        options: [
          "We return 0",
          "We return -1",
          "We throw an error",
          "We return the array length"
        ],
        correct: 0,
        explanation: "By convention, an empty array has zero unique elements. The algorithm should check at the start and return 0 without entering the loop.",
        activeRecall: "Edge case: empty input → return 0."
      },
      {
        id: 10,
        question: "In the loop, when do we advance write and copy?",
        options: [
          "Every time read advances",
          "Only when arr[read] !== arr[write]",
          "When arr[read] is greater than arr[write]",
          "When we have seen more than one duplicate"
        ],
        correct: 1,
        explanation: "We copy when the value at read is different from the value at write — that means we've found a new unique value. Then we do write += 1 and arr[write] = arr[read].",
        activeRecall: "New unique value ⇔ arr[read] != arr[write]. Then extend unique region."
      }
    ],
    hard: [
      {
        id: 11,
        question: "What is the minimum number of comparisons for the two-pointer remove-duplicates on n elements?",
        options: [
          "0",
          "n-1",
          "n",
          "n(n-1)/2"
        ],
        correct: 1,
        explanation: "We compare at each step from read=1 to read=n-1, so we make exactly n-1 comparisons. We always do the comparison; the number of copies depends on the number of unique elements.",
        activeRecall: "One comparison per read step. read runs from 1 to n-1 → n-1 comparisons."
      },
      {
        id: 12,
        question: "If we wanted to remove duplicates and also return the new array (not just length), would space stay O(1)?",
        options: [
          "Yes, we can do it in O(1) extra space",
          "No; returning a new array requires O(n) space for the result",
          "Only if the array is sorted",
          "Yes, if we overwrite and then slice"
        ],
        correct: 1,
        explanation: "If the problem asks to return a new array containing only unique elements, we need to allocate that array, which is O(k) where k is the number of unique elements, and in the worst case k = n. So extra space is O(n) for the result.",
        activeRecall: "In-place = modify given array, return length. New array = extra O(n) for output."
      },
      {
        id: 13,
        question: "How does the two-pointer method relate to the 'partition' idea in Quick Sort?",
        options: [
          "They are the same algorithm",
          "Both use a read/write or boundary idea to separate elements in one pass",
          "Two pointers only works for duplicates",
          "Quick Sort doesn't use two pointers"
        ],
        correct: 1,
        explanation: "Both use a 'boundary' (write or partition index) and a scanning pointer. In two-pointer remove-duplicates we separate 'unique so far' from the rest; in partition we separate smaller-than-pivot from larger. Same one-pass, in-place idea.",
        activeRecall: "Pattern: one pointer scans, one marks boundary. Reuse this in many in-place problems."
      },
      {
        id: 14,
        question: "For [1,1,1,1,1], how many times do we copy (assign to arr[write])?",
        options: [
          "5",
          "1",
          "0",
          "4"
        ],
        correct: 2,
        explanation: "We never see arr[read] != arr[write] because every element is 1. So we never advance write or copy. The first element is already at write=0; we just scan read from 1 to 4 and do nothing. Zero copies.",
        activeRecall: "All same → no new unique value ever → write stays 0, zero copies."
      },
      {
        id: 15,
        question: "Which variant of 'two pointers' is used in remove-duplicates?",
        options: [
          "Two pointers at opposite ends (like in two-sum on sorted array)",
          "Read/write: one scans, one marks the boundary of the result",
          "Fast and slow (runner) pointers",
          "Sliding window with fixed size"
        ],
        correct: 1,
        explanation: "Remove-duplicates uses a read pointer (scans the array) and a write pointer (marks the end of the unique region). This is the read/write or 'writer' pattern. Opposite ends is for two-sum; fast/slow is for linked lists; sliding window is for subarray sums.",
        activeRecall: "Read/write = one scans, one marks 'valid result so far'. Different from opposite-end or fast/slow."
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
    if (isCorrect) setScore(score + 1);
    setAnsweredQuestions([...answeredQuestions, { question: currentQ.question, correct: isCorrect, difficulty }]);
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0F3460] border-2 border-[#625EC6] rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#FFD700]">Quiz Complete!</h2>
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>{score}/{currentQuestions.length}</div>
            <div className="text-xl text-[#E8E8E8] mb-2">{percentage.toFixed(0)}%</div>
            <div className="text-base text-[#C0C0C0]">
              {percentage >= 80 ? 'Excellent! You\'ve mastered Two Pointers!' : percentage >= 60 ? 'Good job! Review the concepts you missed.' : 'Keep practicing! Review the lesson and try again.'}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-[#E8E8E8]">Performance Breakdown:</h3>
            <div className="space-y-2">
              {answeredQuestions.map((q, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
                  <span className="text-[#E8E8E8] text-sm">Question {index + 1}</span>
                  <span className={`font-semibold text-sm ${q.correct ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>{q.correct ? '✓ Correct' : '✗ Incorrect'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={resetQuiz} className="px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors border-2 border-[#7B77E8]">Try Again ({difficulty})</button>
            {difficulty !== 'medium' && <button onClick={() => changeDifficulty('medium')} className="px-6 py-3 bg-[#FFD700] text-[#1A1A2E] rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors">Try Medium</button>}
            {difficulty !== 'hard' && <button onClick={() => changeDifficulty('hard')} className="px-6 py-3 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-colors">Try Hard</button>}
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
            <h2 className="text-xl font-bold text-[#FFD700]">Two Pointers Quiz</h2>
            <div className="text-base font-semibold text-[#C0C0C0]">Score: {score}/{currentQuestions.length}</div>
          </div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => changeDifficulty('easy')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${difficulty === 'easy' ? 'bg-[#4CAF50] text-white border-2 border-[#4CAF50]' : 'bg-[#16213E] text-[#C0C0C0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'}`}>Easy</button>
            <button onClick={() => changeDifficulty('medium')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${difficulty === 'medium' ? 'bg-[#FFD700] text-[#1A1A2E] border-2 border-[#FFD700]' : 'bg-[#16213E] text-[#C0C0C0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'}`}>Medium</button>
            <button onClick={() => changeDifficulty('hard')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${difficulty === 'hard' ? 'bg-[#F44336] text-white border-2 border-[#F44336]' : 'bg-[#16213E] text-[#C0C0C0] border-2 border-[#625EC6]/50 hover:border-[#625EC6]'}`}>Hard</button>
          </div>
          <div className="w-full bg-[#16213E] rounded-full h-2 border border-[#625EC6]/50">
            <div className="bg-[#625EC6] h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }} />
          </div>
          <div className="text-sm text-[#C0C0C0] mt-1">Question {currentQuestion + 1} of {currentQuestions.length}</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#E8E8E8] mb-4">{currentQ.question}</h3>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button key={index} onClick={() => handleAnswer(index)} disabled={showExplanation} className={`w-full p-4 text-left rounded-lg border-2 transition-all text-sm ${showExplanation ? (index === currentQ.correct ? 'border-[#4CAF50] bg-[#4CAF50]/20' : index === selectedAnswer ? 'border-[#F44336] bg-[#F44336]/20' : 'border-[#625EC6]/30 bg-[#16213E]') : 'border-[#625EC6]/50 bg-[#16213E] hover:border-[#625EC6] hover:bg-[#16213E]/80 cursor-pointer'} ${selectedAnswer === index && !showExplanation ? 'border-[#625EC6] bg-[#625EC6]/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#E8E8E8]">{option}</span>
                      {showExplanation && index === currentQ.correct && <span className="text-[#4CAF50] font-bold">✓</span>}
                      {showExplanation && index === selectedAnswer && index !== currentQ.correct && <span className="text-[#F44336] font-bold">✗</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {showExplanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`p-4 rounded-lg ${selectedAnswer === currentQ.correct ? 'bg-[#4CAF50]/20 border-2 border-[#4CAF50]' : 'bg-[#F44336]/20 border-2 border-[#F44336]'}`}>
                  <h4 className={`font-bold mb-2 text-sm ${selectedAnswer === currentQ.correct ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>{selectedAnswer === currentQ.correct ? 'Correct!' : 'Incorrect'}</h4>
                  <p className="text-[#E8E8E8] text-sm">{currentQ.explanation}</p>
                </div>
                <div className="p-4 rounded-lg bg-[#625EC6]/20 border-2 border-[#625EC6]">
                  <h4 className="font-bold text-[#7B77E8] mb-2 text-sm">Active Recall Tip:</h4>
                  <p className="text-[#E8E8E8] text-sm">{currentQ.activeRecall}</p>
                </div>
                <button onClick={nextQuestion} className="w-full px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors border-2 border-[#7B77E8]">{currentQuestion < currentQuestions.length - 1 ? 'Next Question →' : 'Complete Quiz'}</button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
