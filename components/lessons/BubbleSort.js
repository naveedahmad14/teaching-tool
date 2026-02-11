// ==========================================
// File: components/lessons/BubbleSort.js
// ==========================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BubbleSortVisualizer from '../BubbleSortVisualizer';

export default function BubbleSortLesson() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [passCount, setPassCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const [speed, setSpeed] = useState(1000);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function bubbleSort(arr):", indent: 0 },
    { line: 2, code: "n = arr.length", indent: 1 },
    { line: 3, code: "for i from 0 to n-1:", indent: 1 },
    { line: 4, code: "for j from 0 to n-i-2:", indent: 2 },
    { line: 5, code: "if arr[j] > arr[j+1]:", indent: 3 },
    { line: 6, code: "swap arr[j] and arr[j+1]", indent: 4 },
    { line: 7, code: "// Largest element is now at position n-i-1", indent: 2 },
  ];

  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    const n = arr.length;
    let swaps = 0;
    let passes = 0;
    const newSortedIndices = [];

    setActiveLine(1);
    await sleep(speed);
    setActiveLine(2);
    await sleep(speed);

    for (let i = 0; i < n - 1; i++) {
      setActiveLine(3);
      passes++;
      setPassCount(passes);
      await sleep(speed);

      for (let j = 0; j < n - i - 1; j++) {
        setActiveLine(4);
        await sleep(speed);

        setComparing([j, j + 1]);
        setActiveLine(5);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          setActiveLine(6);
          await sleep(speed);

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          swaps++;
          setSwapCount(swaps);
          await sleep(speed);
          setSwapping([]);
        }

        setComparing([]);
      }

      setActiveLine(7);
      newSortedIndices.push(n - i - 1);
      setSortedIndices([...newSortedIndices]);
      await sleep(speed);
    }

    newSortedIndices.push(0);
    setSortedIndices([...newSortedIndices]);
    setActiveLine(null);
    setSorting(false);
  };

  const handleReset = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setActiveLine(null);
    setPassCount(0);
    setSwapCount(0);
    setSorting(false);
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full space-y-8">
      {/* Quick Practice Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Quick Practice</h2>
        <p className="text-gray-700 mb-4">
          Get a feel for bubble sort with this interactive visualizer:
        </p>
        <BubbleSortVisualizer />
      </div>

      {/* Main Lesson Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Bubble Sort: The Foundation</h1>
          <p className="text-xl opacity-90">Master the simplest sorting algorithm</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">What is Bubble Sort?</h2>
          <p className="text-lg text-gray-700 mb-4">
            Bubble Sort is the simplest sorting algorithm that works by <strong>repeatedly comparing adjacent elements</strong> and 
            swapping them if they're in the wrong order. The name comes from the way larger elements "bubble up" to the end 
            of the array with each pass.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-900 mb-2">⏱️ Time Complexity</h3>
              <p className="text-blue-800 text-sm">Best: O(n) - already sorted</p>
              <p className="text-blue-800 text-sm">Average: O(n²)</p>
              <p className="text-blue-800 text-sm">Worst: O(n²)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green-900 mb-2">💾 Space Complexity</h3>
              <p className="text-green-800">O(1) - In-place sorting</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-900 mb-2">✓ Stability</h3>
              <p className="text-purple-800">Stable - Equal elements stay in order</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">How Does It Work?</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-700">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Compare Adjacent Elements</h3>
                <p className="text-gray-700">Start at the beginning and compare the first two elements. If they're in the wrong order, swap them.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-cyan-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-cyan-700">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Move to Next Pair</h3>
                <p className="text-gray-700">Move one position forward and compare the next pair. Continue to the end of the array.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-teal-700">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Complete the Pass</h3>
                <p className="text-gray-700">After one complete pass, the largest element is guaranteed to be at the end. It's now in its correct position!</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-green-700">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Repeat</h3>
                <p className="text-gray-700">Repeat the process, but ignore the last sorted elements. Continue until no more swaps are needed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Interactive Visualization</h2>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={bubbleSort}
              disabled={sorting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {sorting ? 'Sorting...' : 'Start Visualization'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
            >
              Reset
            </button>
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">Speed:</label>
              <input
                type="range"
                min="500"
                max="2000"
                step="250"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={sorting}
                className="w-32"
              />
              <span className="text-gray-600 text-sm">{speed}ms</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 font-semibold">Passes: {passCount}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-red-600 font-semibold">Swaps: {swapCount}</p>
            </div>
          </div>

          {/* Array Visualization */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-center gap-2 flex-wrap">
              {array.map((value, index) => (
                <motion.div
                  key={`bubble-${index}`}
                  className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg shadow-md text-white ${getBarColor(index)}`}
                  animate={{
                    scale: swapping.includes(index) ? 1.2 : comparing.includes(index) ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {value}
                </motion.div>
              ))}
            </div>
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

        {/* Key Concepts */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Key Concepts</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">The "Bubbling" Effect</h3>
              <p className="text-gray-700">
                With each pass through the array, the largest unsorted element "bubbles up" to its correct position 
                at the end. This is why after each pass, we can ignore one more element from the end.
              </p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Optimization: Early Termination</h3>
              <p className="text-gray-700">
                If no swaps occur during a pass, the array is already sorted! We can add a flag to detect this 
                and stop early, improving best-case performance to O(n).
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">In-Place Sorting</h3>
              <p className="text-gray-700">
                Bubble sort only needs O(1) extra space since we swap elements within the original array. 
                This makes it memory-efficient despite being slow.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Stable Sorting</h3>
              <p className="text-gray-700">
                Equal elements maintain their relative order because we only swap when arr[j] {">"} arr[j+1], 
                not when they're equal.
              </p>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">When Should You Use Bubble Sort?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-3">✓ Good For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Educational purposes - easy to understand and visualize</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Very small datasets (n {"<"} 10)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Nearly sorted data (with optimization)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>When memory is extremely limited</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>When stability is required and simplicity matters</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-700 mb-3">✗ Avoid For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Large datasets - O(n²) is too slow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Production code - better alternatives exist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Time-critical applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Reverse-sorted or random data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Practice Exercise */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-8 border-2 border-blue-300">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
          <p className="text-lg text-gray-700 mb-4">
            Manually trace bubble sort on: <code className="bg-white px-2 py-1 rounded">[5, 2, 8, 1]</code>
          </p>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold mb-2">Solution:</p>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Pass 1:</strong></p>
              <p className="ml-4">[5, 2, 8, 1] → [2, 5, 8, 1] (swap 5,2)</p>
              <p className="ml-4">[2, 5, 8, 1] → [2, 5, 8, 1] (no swap)</p>
              <p className="ml-4">[2, 5, 8, 1] → [2, 5, 1, 8] (swap 8,1) ✓ 8 is sorted</p>
              <p><strong>Pass 2:</strong></p>
              <p className="ml-4">[2, 5, 1, 8] → [2, 5, 1, 8] (no swap)</p>
              <p className="ml-4">[2, 5, 1, 8] → [2, 1, 5, 8] (swap 5,1) ✓ 5 is sorted</p>
              <p><strong>Pass 3:</strong></p>
              <p className="ml-4">[2, 1, 5, 8] → [1, 2, 5, 8] (swap 2,1) ✓ All sorted!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}