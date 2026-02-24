# Flashcards data

`flashcards.json` contains the **Active recall** cards for the Flashcards page. Each card has the quiz **question** (front) and the **tip** (back), matching the same content as quiz feedback.

To regenerate this file after changing questions or tips in any quiz component, run from the project root:

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'components/quizzes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f.includes('Quiz'));
const topicMap = {
  'LinearQuiz.js': { id: 'linear', name: 'Linear Search', lessonLink: '/lesson/linear' },
  'BinaryQuiz.js': { id: 'binary', name: 'Binary Search', lessonLink: '/lesson/binary' },
  'BubbleQuiz.js': { id: 'bubble', name: 'Bubble Sort', lessonLink: '/lesson/bubble' },
  'MergeQuiz.js': { id: 'merge', name: 'Merge Sort', lessonLink: '/lesson/merge' },
  'QuickQuiz.js': { id: 'quick', name: 'Quick Sort', lessonLink: '/lesson/quick' },
  'TwoPointersQuiz.js': { id: 'twopointers', name: 'Two Pointers', lessonLink: '/lesson/twopointers' },
  'SlidingWindowQuiz.js': { id: 'slidingwindow', name: 'Sliding Window', lessonLink: '/lesson/slidingwindow' },
  'HashMapsQuiz.js': { id: 'hashmaps', name: 'Hash Maps', lessonLink: '/lesson/hashmaps' },
  'LinkedListsQuiz.js': { id: 'linkedlists', name: 'Linked Lists', lessonLink: '/lesson/linkedlists' },
  'StacksQuiz.js': { id: 'stacks', name: 'Stacks', lessonLink: '/lesson/stacks' }
};
const order = ['LinearQuiz.js','BinaryQuiz.js','BubbleQuiz.js','MergeQuiz.js','QuickQuiz.js','TwoPointersQuiz.js','SlidingWindowQuiz.js','HashMapsQuiz.js','LinkedListsQuiz.js','StacksQuiz.js'];
const reQuestion = /question:\s*\"((?:[^\"\\\\]|\\\\.)*)\"/g;
const reTip = /activeRecall:\s*\"((?:[^\"\\\\]|\\\\.)*)\"/g;
const result = order.filter(f=>files.includes(f)).map(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const questions = []; let m;
  while ((m = reQuestion.exec(content)) !== null) questions.push(m[1]);
  const tips = []; reTip.lastIndex = 0;
  while ((m = reTip.exec(content)) !== null) tips.push(m[1]);
  const cards = questions.map((q, i) => ({ question: q, tip: tips[i] || '' })).filter(c => c.tip);
  return { ...topicMap[f], cards };
});
fs.writeFileSync('data/flashcards.json', JSON.stringify(result, null, 2));
console.log('Wrote data/flashcards.json');
"
```
