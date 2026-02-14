import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LinearSearchVisualizer from '../LinearSearchVisualizer';

export default function LinearSearchLesson() {
  const [array] = useState([23, 45, 12, 67, 34, 89, 56, 78, 91]);
  const [target, setTarget] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [visited, setVisited] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [comparisons, setComparisons] = useState(0);
  const [speed, setSpeed] = useState(800);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function linearSearch(arr, target):", indent: 0 },
    { line: 2, code: "for i from 0 to arr.length - 1:", indent: 1 },
    { line: 3, code: "if arr[i] == target:", indent: 2 },
    { line: 4, code: "return i  // Found at index i", indent: 3 },
    { line: 5, code: "return -1  // Not found", indent: 1 },
  ];

  const linearSearch = async () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) {
      alert('Please enter a valid number');
      return;
    }

    setSearching(true);
    setFoundIndex(null);
    setVisited([]);
    setComparisons(0);
    setCurrentIndex(null);

    setActiveLine(1);
    await sleep(speed);

    for (let i = 0; i < array.length; i++) {
      setActiveLine(2);
      await sleep(speed);

      setCurrentIndex(i);
      setActiveLine(3);
      setComparisons(i + 1);
      await sleep(speed);

      if (array[i] === targetNum) {
        setFoundIndex(i);
        setActiveLine(4);
        await sleep(speed * 1.5);
        setActiveLine(null);
        setSearching(false);
        return;
      }

      setVisited(prev => [...prev, i]);
      setCurrentIndex(null);
      await sleep(speed / 2);
    }

    setActiveLine(5);
    await sleep(speed);
    setActiveLine(null);
    setSearching(false);
  };

  const handleReset = () => {
    setTarget('');
    setCurrentIndex(null);
    setFoundIndex(null);
    setVisited([]);
    setActiveLine(null);
    setComparisons(0);
    setSearching(false);
  };

  const getBarColor = (index) => {
    if (foundIndex === index) return 'bg-green-500';
    if (currentIndex === index) return 'bg-yellow-500';
    if (visited.includes(index)) return 'bg-red-400';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Linear Search: The Basics</h1>
        <p className="text-xl opacity-90">Master the simplest search algorithm</p>
      </div>

        {/* Quick Visualizer Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First!</h2>
          <p className="text-gray-700 mb-6">
            Before diving into the details, play with this visualiser to get an intuitive feel for how merge sort works:
          </p>
          <LinearSearchVisualizer />
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-blue-800 text-center italic">
              Note: The standalone visualiser from your components can be placed here, or you can use the integrated one below in the Interactive Visualisation section.
            </p>
          </div>
        </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">What is Linear Search?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Linear Search (also called Sequential Search) is the simplest searching algorithm. It checks <strong>each element 
          in the array sequentially</strong> from start to finish until it finds the target value or reaches the end of the array.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-2">Time Complexity</h3>
            <p className="text-blue-800 text-sm">Best: O(1) - first element</p>
            <p className="text-blue-800 text-sm">Average: O(n/2) ≈ O(n)</p>
            <p className="text-blue-800 text-sm">Worst: O(n) - last or not found</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
            <h3 className="font-bold text-teal-900 mb-2">💾 Space Complexity</h3>
            <p className="text-teal-800">O(1) - No extra space needed</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-green-900 mb-2">✓ Works On</h3>
            <p className="text-green-800">Both sorted and unsorted arrays</p>
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Start at the Beginning</h3>
              <p className="text-gray-700">Begin at the first element (index 0) of the array.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-teal-700">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Compare with Target</h3>
              <p className="text-gray-700">Check if the current element equals the target value you're searching for.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-cyan-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-cyan-700">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Found or Move On</h3>
              <p className="text-gray-700">If it matches, return the index. If not, move to the next element and repeat.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-green-700">4</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">End of Array</h3>
              <p className="text-gray-700">If you reach the end without finding the target, it doesn't exist in the array.</p>
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={linearSearch}
              disabled={searching || !target}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
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
              min="300"
              max="1500"
              step="300"
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
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-700 font-semibold">Comparisons Made: {comparisons}</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="text-teal-700 font-semibold">
              Status: {foundIndex !== null ? `Found at index ${foundIndex}` : comparisons > 0 && !searching ? 'Not Found' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Array Visualization */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-center gap-2 flex-wrap">
            {array.map((value, index) => (
              <motion.div
                key={`linear-${index}`}
                className={`w-16 h-20 flex flex-col items-center justify-center rounded-lg font-bold text-lg shadow-md text-white ${getBarColor(index)}`}
                animate={{
                  scale: currentIndex === index ? 1.2 : foundIndex === index ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs opacity-75 mb-1">idx {index}</span>
                <span>{value}</span>
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sequential Nature</h3>
            <p className="text-gray-700">
              Linear search examines elements one by one in sequence. There's no skipping or jumping around. 
              This makes it simple but potentially slow for large arrays.
            </p>
          </div>

          <div className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Works on Any Array</h3>
            <p className="text-gray-700">
              Unlike Binary Search, Linear Search doesn't require the array to be sorted. This makes it versatile 
              but less efficient than specialized search algorithms for sorted data.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Best, Average, Worst Cases</h3>
            <p className="text-gray-700">
              <strong>Best case (O(1)):</strong> Target is the first element. 
              <strong> Average case (O(n)):</strong> Target is somewhere in the middle. 
              <strong> Worst case (O(n)):</strong> Target is last or not present.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Early Termination</h3>
            <p className="text-gray-700">
              As soon as we find the target, we can stop searching and return the index immediately. 
              We don't need to check the remaining elements.
            </p>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">When Should You Use Linear Search?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">✓ Good For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Small arrays (n {"<"} 100)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Unsorted data where sorting isn't worth the cost</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Searching once or infrequently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>When simplicity is more important than speed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Linked lists (no random access available)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Finding all occurrences of a value</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-red-700 mb-3">✗ Avoid For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Large sorted arrays (use Binary Search instead)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Frequent searches on the same data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Performance-critical applications with large datasets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>When you can use better data structures (hash tables, trees)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Linear Search vs Binary Search</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Aspect</th>
                <th className="border border-gray-300 p-3 text-left">Linear Search</th>
                <th className="border border-gray-300 p-3 text-left">Binary Search</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Time Complexity</td>
                <td className="border border-gray-300 p-3">O(n)</td>
                <td className="border border-gray-300 p-3">O(log n)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">Data Requirement</td>
                <td className="border border-gray-300 p-3">Any order</td>
                <td className="border border-gray-300 p-3">Must be sorted</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Simplicity</td>
                <td className="border border-gray-300 p-3">Very simple</td>
                <td className="border border-gray-300 p-3">Moderate complexity</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">Best Use Case</td>
                <td className="border border-gray-300 p-3">Small or unsorted data</td>
                <td className="border border-gray-300 p-3">Large sorted data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice Exercise */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl shadow-lg p-8 border-2 border-blue-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
        <p className="text-lg text-gray-700 mb-4">
          Search for the value 42 in: <code className="bg-white px-2 py-1 rounded">[15, 8, 42, 23, 67, 12]</code>
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <div className="space-y-1 text-gray-700 text-sm">
            <p>Comparison 1: Check index 0 → 15 ≠ 42</p>
            <p>Comparison 2: Check index 1 → 8 ≠ 42</p>
            <p>Comparison 3: Check index 2 → 42 = 42 ✓ Found at index 2!</p>
            <p className="mt-2 font-semibold">Total comparisons: 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}