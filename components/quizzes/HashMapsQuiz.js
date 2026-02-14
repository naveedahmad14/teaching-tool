import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HashMapsQuiz({ lessonId, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = {
    easy: [
      { id: 1, question: "What is the typical time complexity of a hash map lookup by key?", options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"], correct: 2, explanation: "Hash maps provide average O(1) lookup: we hash the key to an index and access the bucket. Worst case can be O(n) with many collisions, but with a good hash function it's O(1) on average.", activeRecall: "Hash → index → direct access. Average O(1) lookup." },
      { id: 2, question: "In the Two Sum problem, what do we store in the hash map?", options: ["The target sum", "Value → index (so we can find complement quickly)", "Index → value", "The array length"], correct: 1, explanation: "We store each element's value as key and its index as value. When we see arr[i], we look up (target - arr[i]) in the map to find if we've already seen the complement.", activeRecall: "Map: value → index. Need = target - current; check if need is in map." },
      { id: 3, question: "Why use a hash map for Two Sum instead of checking every pair?", options: ["Hash maps are easier to code", "We avoid O(n²) pairs: one pass with O(1) lookup per element → O(n)", "Hash maps use less memory", "Two Sum only works with hash maps"], correct: 1, explanation: "Brute force: two nested loops over all pairs = O(n²). With a map: for each element we check if (target - element) exists in the map, which is O(1). One pass → O(n).", activeRecall: "Trade space for time: O(n) pass + O(1) lookup = O(n) total." },
      { id: 4, question: "What is 'need' in the Two Sum algorithm when we're at index i?", options: ["arr[i]", "target + arr[i]", "target - arr[i]", "i"], correct: 2, explanation: "We need a pair that sums to target. If current element is arr[i], the other must be target - arr[i]. We look up that value in the map to see if we've seen it before.", activeRecall: "need = target - arr[i]. If need is in map, we have a pair." },
      { id: 5, question: "When do we add an element to the map in Two Sum?", options: ["Before checking for the complement", "After checking: if complement not found, store arr[i] → i for later", "Only when we find a pair", "We add all elements at the start"], correct: 1, explanation: "We first check if (target - arr[i]) is already in the map. If yes, we return. If no, we add (arr[i], i) to the map so that future indices can find this value as their complement.", activeRecall: "Check first, then put. So we don't use the same index twice." },
    ],
    medium: [
      { id: 6, question: "What is a frequency counter pattern?", options: ["Counting how many keys are in the map", "Using a map to store count of each element (e.g. character counts)", "Counting map lookups", "A map that only stores frequencies"], correct: 1, explanation: "We iterate once, and for each element we do map[element] = (map[element] || 0) + 1. Then we can answer 'how many times does x appear?' in O(1).", activeRecall: "One pass: increment count for each element. Then O(1) queries." },
      { id: 7, question: "For Two Sum, in what order do we check and insert?", options: ["Insert first, then check (would use same index)", "Check for complement first, then insert current element", "Check and insert in parallel", "Insert at the end of the loop only"], correct: 1, explanation: "We must check first. If we inserted arr[i] before checking, then when we look up (target - arr[i]) we might find the same index i and return a pair that uses the same element twice.", activeRecall: "Check for need, then map[arr[i]] = i. Order matters." },
      { id: 8, question: "What is the space complexity of the Two Sum hash map solution?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "In the worst case we might store n-1 elements in the map before finding a pair (or none). So the map size is O(n).", activeRecall: "Map can hold up to n entries → O(n) space." },
      { id: 9, question: "Can we use a set instead of a map for Two Sum if we only need to know whether a pair exists?", options: ["No, we need indices", "Yes, we can store values and check if (target - value) is in the set", "Only for sorted arrays", "Sets don't support O(1) lookup"], correct: 1, explanation: "If the problem only asks 'is there a pair that sums to target?', a set of values is enough: for each value, check if (target - value) is in the set. We lose index information, so we can't return indices.", activeRecall: "Set = values only. Map = value → index when we need to return indices." },
      { id: 10, question: "Why might we use a map instead of an array for character frequency?", options: ["Maps are always faster", "When the key space is sparse or non-numeric (e.g. Unicode characters)", "Arrays can't hold counts", "We never use arrays for this"], correct: 1, explanation: "If keys are characters or arbitrary values, an array would need to be sized by the maximum key and could be huge/sparse. A map only stores keys we've seen, so it's more efficient for sparse or non-integer keys.", activeRecall: "Sparse or non-integer keys → map. Dense small integers → array OK." },
    ],
    hard: [
      { id: 11, question: "For array [2,7,11,15] and target 9, after processing index 0 (value 2), what is in the map?", options: ["{}", "{2: 0}", "{7: 0}", "{9: 0}"], correct: 1, explanation: "At i=0, need = 9-2 = 7. 7 is not in the map. We add (2, 0) so the map is {2: 0}.", activeRecall: "Check need=7, not in map, then put (2, 0)." },
      { id: 12, question: "When we find that 'need' is in the map, what do we return?", options: ["[need, arr[i]]", "[map.get(need), i]", "[i, map.get(need)]", "map.get(need) only"], correct: 1, explanation: "The map stores value → index. So map.get(need) is the index where we saw the complement. We return that index and the current index i.", activeRecall: "Return [index of complement, current index] = [map.get(need), i]." },
      { id: 13, question: "What if the problem allows the same element to be used twice (e.g. [3,3], target 6)?", options: ["We must check before insert so we don't use same index", "We insert first then check", "We need a different data structure", "Two Sum never allows same index"], correct: 0, explanation: "If we insert then check, we might find (target - arr[i]) = arr[i] and use the same index twice. So we check first: if need is in the map, we get map.get(need) which is a different index (we haven't inserted current yet). So same element at two indices is OK when they're different positions.", activeRecall: "Check then insert ensures the complement index is always before i." },
      { id: 14, question: "How does the frequency counter help in 'valid anagram' (same characters, same counts)?", options: ["It doesn't", "Count chars in first string, decrement using second string; all counts should end at 0", "We only need to sort both", "We use two separate maps and compare"], correct: 1, explanation: "Build frequency map for first string. For each char in second string, decrement count. If any count goes negative or a char isn't in the map, not an anagram. At the end all counts should be 0.", activeRecall: "One map: add for s1, subtract for s2. All zero ⇒ anagram." },
      { id: 15, question: "What is the time complexity of building a frequency map of n elements?", options: ["O(n log n)", "O(n)", "O(n²)", "O(1)"], correct: 1, explanation: "One pass over n elements; each insert/lookup is O(1) average. So total O(n).", activeRecall: "n elements × O(1) per operation = O(n)." },
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
            <div className="text-base text-[#C0C0C0]">{percentage >= 80 ? 'Excellent! You\'ve mastered Hash Maps!' : percentage >= 60 ? 'Good job! Review the concepts you missed.' : 'Keep practicing! Review the lesson and try again.'}</div>
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
            <h2 className="text-xl font-bold text-[#FFD700]">Hash Maps Quiz</h2>
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
