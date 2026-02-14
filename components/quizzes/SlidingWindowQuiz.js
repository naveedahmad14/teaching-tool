import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SlidingWindowQuiz({ lessonId, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = {
    easy: [
      { id: 1, question: "What does the 'sliding window' of size k represent in the max-sum problem?", options: ["A random subset of k elements", "A contiguous subarray of length k", "k separate elements anywhere in the array", "The first k elements only"], correct: 1, explanation: "The window is a contiguous block of k consecutive elements. We 'slide' it one position at a time from left to right.", activeRecall: "Contiguous = next to each other. Window = fixed-size block that moves." },
      { id: 2, question: "Why do we reuse the previous window sum instead of adding k elements each time?", options: ["It's easier to code", "To achieve O(n) time instead of O(n*k)", "To use less memory", "We don't; we always recompute"], correct: 1, explanation: "Reusing the sum: new_sum = old_sum - element_leaving + element_entering. That's O(1) per slide. Recomputing the sum for each window would be O(k) per window, giving O(n*k) total.", activeRecall: "Slide = subtract one, add one. One pass → O(n)." },
      { id: 3, question: "When we slide the window right by one, which element leaves and which enters?", options: ["Leftmost leaves, rightmost of new window enters", "Rightmost leaves, leftmost enters", "Middle element changes", "Two random elements swap"], correct: 0, explanation: "The window [left, left+k-1] slides to [left+1, left+k]. So the element at index (left) leaves and the element at index (left+k) enters.", activeRecall: "Leave = arr[left], enter = arr[left+k]. Same as sliding a frame." },
      { id: 4, question: "What is the time complexity of the sliding-window max-sum algorithm?", options: ["O(n²)", "O(n log n)", "O(n)", "O(k)"], correct: 2, explanation: "We compute the first window sum in O(k), then each slide is O(1). We do (n - k) slides, so total is O(k + n - k) = O(n).", activeRecall: "One initial sum + (n-k) slides of O(1) each = O(n)." },
      { id: 5, question: "What is the space complexity of the sliding-window max-sum?", options: ["O(n)", "O(k)", "O(n*k)", "O(1)"], correct: 3, explanation: "We only need variables for the current sum, max sum, and loop index. No extra array proportional to n or k.", activeRecall: "A few variables → O(1) extra space." },
    ],
    medium: [
      { id: 6, question: "For array [2,1,5,1,3,2] and k=3, what is the sum of the first window?", options: ["2", "8", "6", "9"], correct: 1, explanation: "First window is indices 0,1,2: arr[0]+arr[1]+arr[2] = 2+1+5 = 8.", activeRecall: "First window = first k elements. 2+1+5 = 8." },
      { id: 7, question: "After the first window [2,1,5], when we slide right, which element leaves and which enters?", options: ["2 leaves, 1 enters", "5 leaves, 1 enters", "2 leaves, 1 (at index 3) enters", "1 leaves, 3 enters"], correct: 2, explanation: "Window was [0,1,2]. After slide, window is [1,2,3]. So index 0 (value 2) leaves and index 3 (value 1) enters. New sum = 8 - 2 + 1 = 7.", activeRecall: "Leave = left boundary, enter = right boundary of new window." },
      { id: 8, question: "How many possible windows of size k are there in an array of length n?", options: ["n", "k", "n - k + 1", "n - k"], correct: 2, explanation: "The left index of the window can be 0, 1, ..., n-k (so that the window ends at index n-1). That's (n-k+1) positions.", activeRecall: "Left index from 0 to n-k inclusive → n-k+1 windows." },
      { id: 9, question: "What if k > n?", options: ["We return 0 or handle as no valid window", "We use k = n", "Algorithm fails", "We return the sum of the whole array"], correct: 0, explanation: "There is no contiguous subarray of length k. Typically we return 0 or a sentinel value and should check k > n at the start.", activeRecall: "Edge case: k > n → no window. Return 0 or handle explicitly." },
      { id: 10, question: "Why is the sliding-window approach better than checking every subarray of size k?", options: ["It uses less code", "It avoids redundant work: we don't recompute the whole sum each time", "It works for unsorted arrays only", "It isn't better; they have the same complexity"], correct: 1, explanation: "Brute force: for each of (n-k+1) starting positions, sum k elements → O((n-k+1)*k) = O(n*k). Sliding window: O(k) for first window + O(1) per slide → O(n).", activeRecall: "Reuse = constant work per step. Brute force = linear work per step." },
    ],
    hard: [
      { id: 11, question: "For [2,1,5,1,3,2], k=3, what is the maximum sum among all windows?", options: ["8", "9", "7", "6"], correct: 1, explanation: "Windows: [2,1,5]=8, [1,5,1]=7, [5,1,3]=9, [1,3,2]=6. Max is 9.", activeRecall: "Compute each window sum; track max. Answer 9." },
      { id: 12, question: "Can we use a sliding window for 'find minimum sum subarray of size k'?", options: ["No, sliding window only works for maximum", "Yes, same idea: maintain window sum and track minimum instead of maximum", "Only if we sort first", "Yes, but we need a different window size"], correct: 1, explanation: "Same structure: slide the window, maintain current sum, and update the minimum sum seen instead of the maximum.", activeRecall: "Same pattern: slide + maintain aggregate (min instead of max)." },
      { id: 13, question: "What type of sliding window is used for max-sum of size k?", options: ["Variable-size window", "Fixed-size window", "Two-pointer window", "Circular window"], correct: 1, explanation: "The window has fixed size k. We only slide it. Variable-size window is used for problems like 'longest subarray with sum ≤ target'.", activeRecall: "Fixed size k → one loop, slide by one. Variable size → expand/shrink." },
      { id: 14, question: "If the array has negative numbers, does the sliding-window max-sum algorithm still work?", options: ["No, we need a different algorithm", "Yes, the same formula (subtract leave, add enter) still gives the correct sum for each window", "Only if we take absolute values", "Yes, but we must use a heap"], correct: 1, explanation: "The sum of a contiguous window is just the sum of its elements. Subtracting the element that leaves and adding the one that enters is correct regardless of sign.", activeRecall: "Sum is sum. Leave/enter update is arithmetic; negatives are fine." },
      { id: 15, question: "How many times do we add an element to the running sum over the entire algorithm?", options: ["n", "k", "n - k + 1", "Once per element in the array"], correct: 0, explanation: "We add each of the n elements exactly once: the first k when we compute the first window, then each new element when it enters the window. So n additions total (and n subtractions for the elements that leave).", activeRecall: "Each element enters the window exactly once → added once. O(n) total." },
    ]
  };

  const currentQuestions = questions[difficulty];
  const currentQ = currentQuestions[currentQuestion];

  const handleAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentQ.correct) setScore(score + 1);
    setAnsweredQuestions([...answeredQuestions, { question: currentQ.question, correct: index === currentQ.correct, difficulty }]);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      onQuizComplete?.(currentQuestions.length ? (score / currentQuestions.length) * 100 : 0, difficulty);
    }
  };

  const resetQuiz = () => { setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); setScore(0); setAnsweredQuestions([]); setQuizComplete(false); };
  const changeDifficulty = (d) => { setDifficulty(d); resetQuiz(); };
  const getScoreColor = () => { const p = (score / currentQuestions.length) * 100; if (p >= 80) return 'text-[#4CAF50]'; if (p >= 60) return 'text-[#FFD700]'; return 'text-[#F44336]'; };

  if (quizComplete) {
    const percentage = (score / currentQuestions.length) * 100;
    return (
      <div className="max-w-4xl mx-auto p-8 pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0F3460] border-2 border-[#625EC6] rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#FFD700]">Quiz Complete!</h2>
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>{score}/{currentQuestions.length}</div>
            <div className="text-xl text-[#E8E8E8] mb-2">{percentage.toFixed(0)}%</div>
            <div className="text-base text-[#C0C0C0]">{percentage >= 80 ? 'Excellent! You\'ve mastered Sliding Window!' : percentage >= 60 ? 'Good job! Review the concepts you missed.' : 'Keep practicing! Review the lesson and try again.'}</div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-[#E8E8E8]">Performance Breakdown:</h3>
            <div className="space-y-2">{answeredQuestions.map((q, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
                <span className="text-[#E8E8E8] text-sm">Question {i + 1}</span>
                <span className={`font-semibold text-sm ${q.correct ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>{q.correct ? '✓ Correct' : '✗ Incorrect'}</span>
              </div>
            ))}</div>
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
            <h2 className="text-xl font-bold text-[#FFD700]">Sliding Window Quiz</h2>
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
                {currentQ.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)} disabled={showExplanation} className={`w-full p-4 text-left rounded-lg border-2 transition-all text-sm ${showExplanation ? (idx === currentQ.correct ? 'border-[#4CAF50] bg-[#4CAF50]/20' : idx === selectedAnswer ? 'border-[#F44336] bg-[#F44336]/20' : 'border-[#625EC6]/30 bg-[#16213E]') : 'border-[#625EC6]/50 bg-[#16213E] hover:border-[#625EC6] hover:bg-[#16213E]/80 cursor-pointer'} ${selectedAnswer === idx && !showExplanation ? 'border-[#625EC6] bg-[#625EC6]/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#E8E8E8]">{opt}</span>
                      {showExplanation && idx === currentQ.correct && <span className="text-[#4CAF50] font-bold">✓</span>}
                      {showExplanation && idx === selectedAnswer && idx !== currentQ.correct && <span className="text-[#F44336] font-bold">✗</span>}
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
