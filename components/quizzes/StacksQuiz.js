import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StacksQuiz({ lessonId, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = {
    easy: [
      { id: 1, question: "What does LIFO mean in the context of a stack?", options: ["Largest In, First Out", "Last In, First Out", "Linear In, First Out", "Least In, First Out"], correct: 1, explanation: "Last In, First Out: the most recently added element is the first one to be removed. Like a stack of plates: you add and remove from the top.", activeRecall: "LIFO = last in, first out. Top of stack = most recent." },
      { id: 2, question: "Which operations does a stack typically support?", options: ["Enqueue and dequeue", "Push and pop (and often peek)", "Insert and delete at any position", "Add and remove from both ends"], correct: 1, explanation: "Push adds to the top, pop removes from the top, and peek returns the top without removing. No random access.", activeRecall: "Push, pop, peek. All at the top only." },
      { id: 3, question: "In the Next Greater Element problem, what do we store in the stack?", options: ["The array values only", "Indices (so we can assign result and compare values)", "The results only", "Both value and index in separate stacks"], correct: 1, explanation: "We store indices in the stack. When we pop an index j, we set result[j] = arr[i] (current value is the next greater for j). We need indices to write into the result array.", activeRecall: "Stack of indices. Pop when current value is greater than arr[stack top]." },
      { id: 4, question: "What order do we process the array in for Next Greater Element?", options: ["Right to left", "Left to right", "Random order", "Largest first"], correct: 1, explanation: "We scan left to right. For each index i, we pop all stack indices whose value is smaller than arr[i] and assign their next greater to arr[i]. Then we push i.", activeRecall: "Left to right. Current element 'resolves' smaller elements on the stack." },
      { id: 5, question: "After the main loop in Next Greater Element, what about indices still in the stack?", options: ["They have no next greater element (result = -1)", "We ignore them", "We assign them the last value", "The algorithm is wrong"], correct: 0, explanation: "If an index is still in the stack at the end, no element to its right was larger. So it has no next greater element; we set result[j] = -1 (or leave as -1 if pre-filled).", activeRecall: "Left in stack ⇒ no element to the right was bigger ⇒ -1." },
    ],
    medium: [
      { id: 6, question: "What invariant does the monotonic stack maintain in Next Greater Element?", options: ["Values at stack indices are in increasing order", "Values at stack indices are in decreasing order (bottom to top)", "The stack is always full", "Values are in random order"], correct: 1, explanation: "We maintain a strictly decreasing order (bottom to top): when we see a larger value, we pop smaller ones. So the stack is 'monotonic decreasing'.", activeRecall: "Monotonic decreasing: bottom ≥ top. Current > top ⇒ pop." },
      { id: 7, question: "Why is the Next Greater Element algorithm O(n) time?", options: ["We do one pass", "Each index is pushed once and popped at most once", "The stack is small", "We skip elements"], correct: 1, explanation: "Each index is pushed exactly once. Each pop corresponds to one index being assigned its next greater. So total pushes + pops = O(n).", activeRecall: "Each index: one push, at most one pop → 2n operations → O(n)." },
      { id: 8, question: "For Valid Parentheses, when do we pop from the stack?", options: ["When we see an opening bracket", "When we see a closing bracket that matches the stack top", "Never", "At the end only"], correct: 1, explanation: "We push opening brackets. When we see a closing bracket, we check if it matches the top (e.g. ')' matches '('). If yes, pop; if no or stack empty, invalid.", activeRecall: "Closing bracket ⇒ must match stack top ⇒ pop. Mismatch or empty ⇒ invalid." },
      { id: 9, question: "What does 'peek' do on a stack?", options: ["Remove and return the top", "Return the top without removing it", "Add an element", "Check if stack is empty"], correct: 1, explanation: "Peek (or top) returns the value at the top of the stack without modifying the stack. Pop removes and returns it.", activeRecall: "Peek = look at top. Pop = remove and return top." },
      { id: 10, question: "In a monotonic decreasing stack for NGE, when we pop index j and set result[j] = arr[i], why is arr[i] the next greater for j?", options: ["Because i > j", "Because we process left to right and arr[i] is the first element to the right of j that is larger than arr[j]", "Because the stack says so", "Only for adjacent elements"], correct: 1, explanation: "We process left to right. When we're at i, any index j we pop had arr[j] < arr[i]. We haven't assigned result[j] before, so arr[i] is the first element to the right of j that is greater than arr[j]. So it's the next greater.", activeRecall: "First time we see a larger value to the right of j → that's NGE for j." },
    ],
    hard: [
      { id: 11, question: "For array [2,1,5,1,3,2], what is the Next Greater Element for index 0 (value 2)?", options: ["1", "5", "-1", "3"], correct: 1, explanation: "We need the first element to the right of index 0 that is greater than 2. Going right: 1 is not, 5 is. So NGE for index 0 is 5.", activeRecall: "Scan right from index 0: 1 < 2, 5 > 2 ⇒ answer 5." },
      { id: 12, question: "After processing index i in NGE, what do we do with i?", options: ["We push i onto the stack", "We pop i", "We discard i", "We only push if stack is empty"], correct: 0, explanation: "After popping all indices for which arr[i] is the next greater, we push i. So the stack always holds indices whose NGE hasn't been found yet, in decreasing value order.", activeRecall: "Pop those we've resolved, then push current index." },
      { id: 13, question: "How would you adapt the same stack idea for 'Next Smaller Element'?", options: ["Use a monotonic increasing stack; pop when current is smaller than stack top", "Same algorithm", "Use a queue instead", "It's not possible"], correct: 0, explanation: "For next smaller: maintain a monotonic increasing stack (values at stack indices increase bottom to top). When current is smaller than arr[stack top], current is the next smaller for stack top; pop and assign.", activeRecall: "Next smaller ⇒ monotonic increasing stack. Pop when current < top." },
      { id: 14, question: "Why do we store indices in the stack instead of values?", options: ["Values would work the same", "We need indices to write result[j] and to compare arr[i] with arr[stack top]", "To save memory", "Indices are faster"], correct: 1, explanation: "We need to set result[j] = arr[i] when we pop j. We also need to compare the current value arr[i] with the value at the stack index (arr[stack.top]). So we need indices; we can get values via arr[index].", activeRecall: "Index → we can get value (arr[i]) and set result[index]." },
      { id: 15, question: "What is the space complexity of the Next Greater Element algorithm?", options: ["O(1)", "O(n) for the result array and O(n) worst case for the stack", "O(n²)", "O(log n)"], correct: 1, explanation: "We need an O(n) result array. The stack can hold up to n indices in the worst case (e.g. strictly decreasing array: we never pop until the end). So O(n) total extra space.", activeRecall: "Result array O(n). Stack worst case O(n) (all indices pushed)." },
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
            <div className="text-base text-[#C0C0C0]">{percentage >= 80 ? 'Excellent! You\'ve mastered Stacks!' : percentage >= 60 ? 'Good job! Review the concepts you missed.' : 'Keep practicing! Review the lesson and try again.'}</div>
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
            <h2 className="text-xl font-bold text-[#FFD700]">Stacks Quiz</h2>
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
