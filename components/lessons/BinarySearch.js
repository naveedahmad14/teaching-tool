import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BinarySearchVisualizer from '../BinarySearchVisualizer';

export default function BinarySearchLesson() {
  const [array] = useState([12, 23, 34, 45, 56, 67, 78, 89, 91]);
  const [target, setTarget] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentMid, setCurrentMid] = useState(null);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [comparisons, setComparisons] = useState(0);
  const [speed, setSpeed] = useState(1000);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function binarySearch(arr, target):", indent: 0 },
    { line: 2, code: "left = 0, right = arr.length - 1", indent: 1 },
    { line: 3, code: "while left <= right:", indent: 1 },
    { line: 4, code: "mid = floor((left + right) / 2)", indent: 2 },
    { line: 5, code: "if arr[mid] == target:", indent: 2 },
    { line: 6, code: "return mid  // Found!", indent: 3 },
    { line: 7, code: "else if arr[mid] < target:", indent: 2 },
    { line: 8, code: "left = mid + 1  // Search right half", indent: 3 },
    { line: 9, code: "else:", indent: 2 },
    { line: 10, code: "right = mid - 1  // Search left half", indent: 3 },
    { line: 11, code: "return -1  // Not found", indent: 1 },
  ];

  const binarySearch = async () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) {
      alert('Please enter a valid number');
      return;
    }

    setSearching(true);
    setFoundIndex(null);
    setEliminated([]);
    setComparisons(0);

    setActiveLine(1);
    await sleep(speed);

    let l = 0;
    let r = array.length - 1;
    let compCount = 0;

    setActiveLine(2);
    setLeft(l);
    setRight(r);
    await sleep(speed);

    while (l <= r) {
      setActiveLine(3);
      await sleep(speed);

      const mid = Math.floor((l + r) / 2);
      setCurrentMid(mid);
      setActiveLine(4);
      await sleep(speed);

      compCount++;
      setComparisons(compCount);
      setActiveLine(5);
      await sleep(speed);

      if (array[mid] === targetNum) {
        setFoundIndex(mid);
        setActiveLine(6);
        await sleep(speed * 1.5);
        setActiveLine(null);
        setSearching(false);
        return;
      }

      setActiveLine(7);
      await sleep(speed);

      if (array[mid] < targetNum) {
        // Eliminate left half
        const newEliminated = Array.from({ length: mid - l + 1 }, (_, i) => l + i);
        setEliminated(prev => [...prev, ...newEliminated]);
        l = mid + 1;
        setLeft(l);
        setActiveLine(8);
        await sleep(speed);
      } else {
        // Eliminate right half
        setActiveLine(9);
        await sleep(speed);
        const newEliminated = Array.from({ length: r - mid + 1 }, (_, i) => mid + i);
        setEliminated(prev => [...prev, ...newEliminated]);
        r = mid - 1;
        setRight(r);
        setActiveLine(10);
        await sleep(speed);
      }

      setCurrentMid(null);
    }

    setActiveLine(11);
    await sleep(speed);
    setActiveLine(null);
    setSearching(false);
  };

  const handleReset = () => {
    setTarget('');
    setCurrentMid(null);
    setLeft(null);
    setRight(null);
    setFoundIndex(null);
    setEliminated([]);
    setActiveLine(null);
    setComparisons(0);
    setSearching(false);
  };

  const getBarColor = (index) => {
    if (foundIndex === index) return 'bg-green-500';
    if (currentMid === index) return 'bg-purple-500';
    if (eliminated.includes(index)) return 'bg-gray-400';
    if (left !== null && right !== null && index >= left && index <= right) {
      return 'bg-blue-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Binary Search: Divide and Find</h1>
        <p className="text-xl opacity-90">Master the efficient search algorithm for sorted data</p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">What is Binary Search?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Binary Search is an extremely efficient algorithm for finding an element in a <strong>sorted array</strong>. 
          Instead of checking every element sequentially, it repeatedly divides the search space in half, 
          eliminating half of the remaining elements with each comparison!
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-bold text-purple-900 mb-2">⏱️ Time Complexity</h3>
            <p className="text-purple-800 text-sm">Best: O(1) - middle element</p>
            <p className="text-purple-800 text-sm">Average: O(log n)</p>
            <p className="text-purple-800 text-sm">Worst: O(log n)</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <h3 className="font-bold text-indigo-900 mb-2">💾 Space Complexity</h3>
            <p className="text-indigo-800">O(1) - Iterative version</p>
            <p className="text-indigo-800 text-sm">O(log n) - Recursive version</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h3 className="font-bold text-red-900 mb-2">⚠️ Requirement</h3>
            <p className="text-red-800">Array MUST be sorted</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">How Does It Work?</h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-purple-700">1</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Set the Search Range</h3>
              <p className="text-gray-700">Start with left = 0 (first index) and right = n-1 (last index). The entire array is our initial search space.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-700">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Find the Middle</h3>
              <p className="text-gray-700">Calculate mid = (left + right) / 2. Check if the middle element equals our target.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-blue-700">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Decide Which Half</h3>
              <p className="text-gray-700">
                If arr[mid] {"<"} target: the target must be in the right half, so set left = mid + 1.<br/>
                If arr[mid] {">"} target: the target must be in the left half, so set right = mid - 1.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-green-700">4</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Repeat or Finish</h3>
              <p className="text-gray-700">Continue until either: (a) arr[mid] == target (found!), or (b) left {">"} right (not found).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Interactive Visualization</h2>

        {/* Search Input */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <label className="text-gray-700 font-medium">Search for:</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={searching}
              placeholder="Enter a number"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              onClick={binarySearch}
              disabled={searching || !target}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {searching ? 'Searching...' : 'Start Search'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 justify-center">
            <label className="text-gray-700 font-medium">Speed:</label>
            <input
              type="range"
              min="500"
              max="2000"
              step="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={searching}
              className="w-32"
            />
            <span className="text-gray-600 text-sm">{speed}ms</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-purple-700 font-semibold">Comparisons Made: {comparisons}</p>
            <p className="text-purple-600 text-sm">vs Linear Search: up to {array.length}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-indigo-700 font-semibold">
              Status: {foundIndex !== null ? `Found at index ${foundIndex}` : comparisons > 0 && !searching ? 'Not Found' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Array Visualization */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-center gap-2 flex-wrap">
            {array.map((value, index) => (
              <motion.div
                key={`binary-${index}`}
                className={`w-16 h-20 flex flex-col items-center justify-center rounded-lg font-bold text-lg shadow-md text-white ${getBarColor(index)}`}
                animate={{
                  scale: currentMid === index ? 1.25 : foundIndex === index ? 1.2 : 1,
                  opacity: eliminated.includes(index) ? 0.3 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs opacity-75 mb-1">idx {index}</span>
                <span>{value}</span>
                {index === left && <span className="text-xs mt-1">L</span>}
                {index === right && <span className="text-xs mt-1">R</span>}
                {index === currentMid && <span className="text-xs mt-1">M</span>}
              </motion.div>
            ))}
          </div>

          {left !== null && right !== null && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="font-semibold">Search Range: </span>
              [{left}, {right}] {currentMid !== null && `| Middle: ${currentMid} (value: ${array[currentMid]})`}
            </div>
          )}
        </div>

        {/* Pseudocode */}
        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <h3 className="font-semibold text-white mb-4">Pseudocode:</h3>
          <div className="font-mono text-sm">
            {pseudocode.map((line) => (
              <motion.div
                key={line.line}
                className={`py-1 px-3 rounded ${
                  activeLine === line.line
                    ? 'bg-yellow-400 text-gray-900 font-bold'
                    : 'text-gray-300'
                }`}
                style={{ paddingLeft: `${line.indent * 2 + 1}rem` }}
                animate={{
                  backgroundColor: activeLine === line.line ? '#fbbf24' : 'transparent'
                }}
                transition={{ duration: 0.3 }}
              >
                {line.code}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why O(log n)? */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Why is it O(log n)?</h2>
        
        <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200 mb-6">
          <p className="text-gray-700 mb-4">
            Binary search eliminates <strong>half</strong> of the remaining elements with each comparison. 
            This creates a logarithmic relationship between array size and number of comparisons needed.
          </p>
          
          <div className="space-y-2 text-gray-700">
            <p><strong>Array size 8:</strong> Max 3 comparisons (2³ = 8)</p>
            <p><strong>Array size 16:</strong> Max 4 comparisons (2⁴ = 16)</p>
            <p><strong>Array size 1,000:</strong> Max 10 comparisons (2¹⁰ ≈ 1,000)</p>
            <p><strong>Array size 1,000,000:</strong> Max 20 comparisons (2²⁰ ≈ 1,000,000)</p>
          </div>
          
          <p className="text-gray-700 mt-4">
            Notice how doubling the array size only adds one more comparison! This is the power of O(log n).
          </p>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Key Concepts</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sorted Data Requirement</h3>
            <p className="text-gray-700">
              Binary search ONLY works on sorted arrays. If your array isn't sorted, you must sort it first 
              (which costs O(n log n)) or use linear search instead.
            </p>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Divide and Conquer</h3>
            <p className="text-gray-700">
              By comparing with the middle element, we can determine which half of the array to search next. 
              Because the array is sorted, we know all elements less than the middle are on the left, and 
              all greater elements are on the right.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Integer Overflow Prevention</h3>
            <p className="text-gray-700">
              In some languages, (left + right) / 2 can cause integer overflow for large values. 
              A safer formula is: mid = left + (right - left) / 2
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Iterative vs Recursive</h3>
            <p className="text-gray-700">
              Binary search can be implemented iteratively (using a loop) or recursively. The iterative version 
              uses O(1) space, while recursive uses O(log n) space for the call stack.
            </p>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">When Should You Use Binary Search?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">✓ Perfect For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Large sorted arrays or lists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Searching multiple times in the same data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>When data is already sorted or can be sorted once</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Random access data structures (arrays)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Finding insertion points for new elements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Database indexes and search systems</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-red-700 mb-3">✗ Not Suitable For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Unsorted data (use linear search or sort first)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Linked lists (no O(1) random access)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Very small arrays (linear search is simpler)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Frequently changing data (maintaining sorted order is costly)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Finding all occurrences (binary search finds one)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Practice Exercise */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-purple-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
        <p className="text-lg text-gray-700 mb-4">
          Search for 67 in: <code className="bg-white px-2 py-1 rounded">[12, 23, 34, 45, 56, 67, 78, 89]</code>
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <div className="space-y-2 text-gray-700 text-sm">
            <p><strong>Step 1:</strong> L=0, R=7, Mid=3 → arr[3]=45 {"<"} 67, search right half</p>
            <p><strong>Step 2:</strong> L=4, R=7, Mid=5 → arr[5]=67 = 67 ✓ Found at index 5!</p>
            <p className="mt-2 font-semibold">Total comparisons: 2 (vs 6 with linear search)</p>
            <p className="text-purple-700">Binary search eliminated half the array each time, finding the target in just 2 comparisons!</p>
          </div>
        </div>
      </div>
    </div>
  );
}