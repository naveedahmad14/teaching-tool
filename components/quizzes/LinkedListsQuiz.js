import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LinkedListsQuiz({ lessonId, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = {
    easy: [
      { id: 1, question: "In the three-pointer in-place reversal, what does 'prev' represent?", options: ["The current node", "The head of the already-reversed portion", "The next node to process", "The tail of the list"], correct: 1, explanation: "prev holds the head of the list we've already reversed. Initially null; as we reverse, we build the new list in front of prev.", activeRecall: "prev = head of reversed part. We extend it by pointing curr back to prev." },
      { id: 2, question: "Why do we save 'next = curr.next' before changing curr.next?", options: ["To make code faster", "So we don't lose the rest of the list when we set curr.next = prev", "To check for null", "It's optional"], correct: 1, explanation: "Once we set curr.next = prev, we break the link to the rest of the list. We must have saved that rest in 'next' so we can move curr forward in the next step.", activeRecall: "Break, reverse, advance. Save next first or we lose the list." },
      { id: 3, question: "What is the space complexity of the iterative three-pointer reversal?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2, explanation: "We only use three pointers (prev, curr, next). No recursion, no extra data structures. So O(1) extra space.", activeRecall: "Three pointers = O(1). Recursive version would be O(n) stack." },
      { id: 4, question: "How do we find the middle node of a linked list with the fast & slow pattern?", options: ["Slow moves 2 steps, fast moves 1", "Slow moves 1 step, fast moves 2 steps per iteration", "Both move at same speed", "We need to count the length first"], correct: 1, explanation: "Slow starts at head and moves one step at a time; fast starts at head and moves two steps. When fast reaches the end, slow is at the middle (or first of the two middles for even length).", activeRecall: "Fast 2× speed → when fast at end, slow at middle." },
      { id: 5, question: "When does the reversal loop terminate?", options: ["When prev is null", "When curr is null", "When next is null", "After n iterations"], correct: 1, explanation: "We advance curr = next each time. When curr becomes null, we've processed every node. The new head is prev (the last non-null node we processed).", activeRecall: "curr === null ⇒ we're done. Return prev as new head." },
    ],
    medium: [
      { id: 6, question: "After one iteration (prev=1, curr=2, next=3), what is the state of the link from node 1?", options: ["1.next = 2", "1.next = null", "1.next = 3", "1 is not yet reversed"], correct: 1, explanation: "We set curr.next = prev, so 2.next = 1. Node 1 was the previous curr; we set its next to the previous prev (null). So 1.next = null.", activeRecall: "After first step: 1→null, 2→1. Reversed so far: 2→1." },
      { id: 7, question: "What do we return at the end of the reversal?", options: ["curr", "next", "prev", "head"], correct: 2, explanation: "When curr becomes null, prev is the last node we reversed — i.e. the original tail, which is now the new head. So we return prev.", activeRecall: "Loop ends when curr = null. New head = prev." },
      { id: 8, question: "For a list with one node, what does the reversal algorithm return?", options: ["null", "The same node (correct)", "We need to handle this case separately", "Undefined"], correct: 1, explanation: "Initially prev=null, curr=head (the single node), next=curr.next=null. We set curr.next=prev so head.next=null. Then prev=curr (head), curr=next (null). Loop ends. We return prev = head. So the single node is still the head.", activeRecall: "One node: next=null, we set its next to null, return it. Same head." },
      { id: 9, question: "In fast & slow for middle, what if the list has even length (e.g. 4 nodes)?", options: ["Slow points to node 2 (first of the two middles)", "Slow points to node 3", "We need a different algorithm", "Slow is null"], correct: 0, explanation: "With 4 nodes, when fast (moving 2×) reaches the end (null), slow has moved half as far and is at the second node — the first of the two 'middle' nodes. Often we want this (e.g. for merging).", activeRecall: "Even length: slow at first middle. Fast at end ⇒ slow at index n/2 - 1 (0-based)." },
      { id: 10, question: "Why is the recursive reversal O(n) space?", options: ["We use an array", "The call stack has n frames (one per node)", "We copy the list", "We use a queue"], correct: 1, explanation: "Recursive reversal: assume the rest is reversed, then link back. We recurse to the end, so there are n recursive calls → n stack frames → O(n) space.", activeRecall: "Recursion depth = list length → O(n) stack space." },
    ],
    hard: [
      { id: 11, question: "In the step 'curr.next = prev', what happens to the link from curr to the rest of the list?", options: ["It is preserved in next", "It is lost unless we saved it in next", "It is reversed", "Nothing"], correct: 1, explanation: "We overwrite curr.next. The rest of the list is only reachable via the value we saved in 'next'. So we must have set next = curr.next at the start of the iteration.", activeRecall: "curr.next is overwritten. next variable holds the rest." },
      { id: 12, question: "For list 1→2→3→null, after the reversal loop, what is the new head and what is the link structure?", options: ["Head 3, 3→2→1→null", "Head 1, 1→2→3→null", "Head 2, 2→1→3→null", "Head 3, 3→1→2→null"], correct: 0, explanation: "We reverse in place: first 1→null, then 2→1, then 3→2. So the new list is 3→2→1→null. New head is 3 (the original tail).", activeRecall: "Original tail becomes new head. 3→2→1→null." },
      { id: 13, question: "Why can't we do 'curr.next = prev' before saving next?", options: ["It would be slower", "We would lose the reference to the rest of the list and couldn't advance curr", "It would cause a cycle", "We can; order doesn't matter"], correct: 1, explanation: "curr.next is the only reference to the rest of the list. If we set curr.next = prev first, we've lost that reference. We'd have no way to get to the next node to continue the loop.", activeRecall: "Save next first. Always: next = curr.next, then curr.next = prev, then advance." },
      { id: 14, question: "What is the time complexity of the iterative reversal?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], correct: 2, explanation: "We visit each node exactly once, doing O(1) work per node (save next, update link, advance pointers). So O(n) time.", activeRecall: "One pass over n nodes, O(1) per node → O(n)." },
      { id: 15, question: "In fast & slow, how do we detect that fast has reached the end?", options: ["fast === null || fast.next === null", "fast.next === null only", "slow === fast", "We count steps"], correct: 0, explanation: "We check fast === null (even length: fast moves past last node) or fast.next === null (odd length: fast at last node). In both cases we stop so slow is at the correct middle.", activeRecall: "Stop when fast is null or fast.next is null. Covers odd and even length." },
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
            <div className="text-base text-[#C0C0C0]">{percentage >= 80 ? 'Excellent! You\'ve mastered Linked Lists!' : percentage >= 60 ? 'Good job! Review the concepts you missed.' : 'Keep practicing! Review the lesson and try again.'}</div>
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
            <h2 className="text-xl font-bold text-[#FFD700]">Linked Lists Quiz</h2>
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
