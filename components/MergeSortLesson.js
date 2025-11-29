import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MergeSortVisualizer from './MergeSortVisualizer';

export default function MergeSortLesson() {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [sorting, setSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeLine, setActiveLine] = useState(null);
  const [visualState, setVisualState] = useState({
    left: null,
    mid: null,
    right: null,
    leftArr: [],
    rightArr: [],
    merging: false,
    sorted: []
  });
  const [speed, setSpeed] = useState(2000);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function mergeSort(arr, left, right):", indent: 0 },
    { line: 2, code: "if left < right:", indent: 1 },
    { line: 3, code: "mid = (left + right) / 2", indent: 2 },
    { line: 4, code: "mergeSort(arr, left, mid)", indent: 2 },
    { line: 5, code: "mergeSort(arr, mid + 1, right)", indent: 2 },
    { line: 6, code: "merge(arr, left, mid, right)", indent: 2 },
    { line: 7, code: "", indent: 0 },
    { line: 8, code: "function merge(arr, left, mid, right):", indent: 0 },
    { line: 9, code: "leftArr = arr[left...mid]", indent: 1 },
    { line: 10, code: "rightArr = arr[mid+1...right]", indent: 1 },
    { line: 11, code: "i = 0, j = 0, k = left", indent: 1 },
    { line: 12, code: "while i < leftArr.length AND j < rightArr.length:", indent: 1 },
    { line: 13, code: "if leftArr[i] <= rightArr[j]:", indent: 2 },
    { line: 14, code: "arr[k] = leftArr[i++]", indent: 3 },
    { line: 15, code: "else:", indent: 2 },
    { line: 16, code: "arr[k] = rightArr[j++]", indent: 3 },
    { line: 17, code: "k++", indent: 2 },
    { line: 18, code: "copy remaining elements", indent: 1 }
  ];

  const steps = [
    { title: "Initial Array", description: "We start with an unsorted array of numbers.", lines: [] },
    { title: "Divide Phase Begins", description: "Find the middle point to divide the array into two halves.", lines: [1, 2, 3] },
    { title: "Recursively Sort Left", description: "Recursively sort the left half of the array.", lines: [4] },
    { title: "Recursively Sort Right", description: "Recursively sort the right half of the array.", lines: [5] },
    { title: "Merge Phase", description: "Now we merge the two sorted halves back together.", lines: [6, 8] },
    { title: "Create Subarrays", description: "Copy elements into temporary left and right arrays.", lines: [9, 10] },
    { title: "Initialize Pointers", description: "Set up pointers: i for left array, j for right array, k for main array.", lines: [11] },
    { title: "Compare Elements", description: "Compare elements from left and right arrays, choosing the smaller one.", lines: [12, 13, 14, 15, 16] },
    { title: "Merge Complete", description: "Continue until all elements are merged back into the main array.", lines: [17, 18] },
    { title: "Fully Sorted", description: "The array is now completely sorted!", lines: [] }
  ];

  const visualizeMergeSort = async () => {
    setSorting(true);
    setCurrentStep(0);
    const arr = [...array];

    const merge = async (arr, left, mid, right, depth = 0) => {
      setActiveLine(8);
      await sleep(speed);

      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      setVisualState({
        left,
        mid,
        right,
        leftArr: leftArr.map((val, idx) => ({ val, origIdx: left + idx })),
        rightArr: rightArr.map((val, idx) => ({ val, origIdx: mid + 1 + idx })),
        merging: true,
        sorted: []
      });
      setActiveLine(9);
      await sleep(speed);
      setActiveLine(10);
      await sleep(speed);

      let i = 0, j = 0, k = left;
      setActiveLine(11);
      await sleep(speed);

      while (i < leftArr.length && j < rightArr.length) {
        setActiveLine(12);
        await sleep(speed);

        if (leftArr[i] <= rightArr[j]) {
          setActiveLine(13);
          await sleep(speed);
          setActiveLine(14);
          arr[k] = leftArr[i];
          i++;
        } else {
          setActiveLine(15);
          await sleep(speed);
          setActiveLine(16);
          arr[k] = rightArr[j];
          j++;
        }
        setArray([...arr]);
        await sleep(speed);
        setActiveLine(17);
        k++;
        await sleep(speed);
      }

      while (i < leftArr.length) {
        setActiveLine(18);
        arr[k] = leftArr[i];
        setArray([...arr]);
        i++;
        k++;
        await sleep(speed / 2);
      }

      while (j < rightArr.length) {
        setActiveLine(18);
        arr[k] = rightArr[j];
        setArray([...arr]);
        j++;
        k++;
        await sleep(speed / 2);
      }

      setVisualState(prev => ({ ...prev, merging: false }));
    };

    const sort = async (arr, left, right, depth = 0) => {
      if (left < right) {
        setActiveLine(2);
        await sleep(speed);

        const mid = Math.floor((left + right) / 2);
        setVisualState({ left, mid, right, leftArr: [], rightArr: [], merging: false, sorted: [] });
        setActiveLine(3);
        await sleep(speed);

        setActiveLine(4);
        await sleep(speed);
        await sort(arr, left, mid, depth + 1);

        setActiveLine(5);
        await sleep(speed);
        await sort(arr, mid + 1, right, depth + 1);

        setActiveLine(6);
        await sleep(speed);
        await merge(arr, left, mid, right, depth);
      }
    };

    setActiveLine(1);
    await sleep(speed);
    await sort(arr, 0, arr.length - 1, 0);
    
    setVisualState({ left: null, mid: null, right: null, leftArr: [], rightArr: [], merging: false, sorted: arr.map((_, i) => i) });
    setActiveLine(null);
    setSorting(false);
  };

  const handleReset = () => {
    setArray([38, 27, 43, 3, 9, 82, 10]);
    setVisualState({ left: null, mid: null, right: null, leftArr: [], rightArr: [], merging: false, sorted: [] });
    setActiveLine(null);
    setCurrentStep(0);
    setSorting(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Merge Sort: A Deep Dive</h1>
        <p className="text-xl opacity-90">Master the divide-and-conquer sorting algorithm</p>
      </div>

      {/* Quick Visualizer Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First!</h2>
        <p className="text-gray-700 mb-6">
          Before diving into the details, play with this visualiser to get an intuitive feel for how merge sort works:
        </p>
        <MergeSortVisualizer />
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-blue-800 text-center italic">
            Note: The standalone visualiser from your components can be placed here, or you can use the integrated one below in the Interactive Visualisation section.
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">What is Merge Sort?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Merge Sort is a <strong>divide-and-conquer</strong> algorithm that splits an array into smaller subarrays, 
          sorts them, and then merges them back together. It's efficient, stable, and consistently performs at O(n log n).
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-2">⏱️ Time Complexity</h3>
            <p className="text-blue-800">O(n log n) - Best, Average, and Worst case</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-green-900 mb-2">💾 Space Complexity</h3>
            <p className="text-green-800">O(n) - Requires additional space</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-bold text-purple-900 mb-2">✓ Stability</h3>
            <p className="text-purple-800">Stable - Preserves relative order</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">How Does It Work?</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-700">1</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Divide</h3>
              <p className="text-gray-700">Split the array into two halves repeatedly until each subarray has only one element.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-purple-700">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Conquer</h3>
              <p className="text-gray-700">A single element is already "sorted" by definition. This is the base case.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-pink-700">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Merge</h3>
              <p className="text-gray-700">Combine two sorted subarrays into one sorted array by comparing elements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Interactive Visualisation</h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={visualizeMergeSort}
            disabled={sorting}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {sorting ? 'Sorting...' : 'Start Visualisation'}
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
              max="3000"
              step="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={sorting}
              className="w-32"
            />
            <span className="text-gray-600 text-sm">{speed}ms</span>
          </div>
        </div>

        {/* Main Array Visualization */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Main Array:</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {array.map((value, index) => (
              <motion.div
                key={`main-${index}`}
                className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg shadow-md ${
                  visualState.sorted.includes(index) ? 'bg-green-500 text-white' :
                  visualState.left !== null && index >= visualState.left && index <= visualState.right
                    ? 'bg-indigo-400 text-white'
                    : 'bg-blue-500 text-white'
                }`}
                animate={{
                  scale: visualState.left !== null && index >= visualState.left && index <= visualState.right ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>
            ))}
          </div>

          {/* Range Indicators */}
          {visualState.left !== null && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="font-semibold">Current Range: </span>
              Left = {visualState.left}, Mid = {visualState.mid}, Right = {visualState.right}
            </div>
          )}
        </div>

        {/* Subarrays During Merge */}
        {visualState.merging && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-cyan-50 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-900 mb-3">Left Subarray:</h3>
              <div className="flex gap-2 flex-wrap">
                {visualState.leftArr.map((item, idx) => (
                  <div key={`left-${idx}`} className="w-14 h-14 flex items-center justify-center bg-cyan-500 text-white rounded-lg font-bold shadow">
                    {item.val}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <h3 className="font-semibold text-pink-900 mb-3">Right Subarray:</h3>
              <div className="flex gap-2 flex-wrap">
                {visualState.rightArr.map((item, idx) => (
                  <div key={`right-${idx}`} className="w-14 h-14 flex items-center justify-center bg-pink-500 text-white rounded-lg font-bold shadow">
                    {item.val}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Pseudocode with Highlighting */}
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
                {line.code || '\u00A0'}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Key Concepts</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Divide and Conquer</h3>
            <p className="text-gray-700">
              The algorithm breaks down the problem into smaller subproblems (dividing the array), 
              solves them independently (sorting small arrays), and combines the solutions (merging).
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Recursion</h3>
            <p className="text-gray-700">
              Merge sort calls itself recursively to sort the left and right halves. The base case 
              is when the array has only one element (already sorted).
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">The Merge Operation</h3>
            <p className="text-gray-700">
              The merge function combines two sorted arrays by comparing their elements one by one 
              and placing the smaller element into the result array. This maintains the sorted order.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Stability</h3>
            <p className="text-gray-700">
              Merge sort is stable, meaning equal elements maintain their relative order. This is 
              important when sorting objects with multiple fields.
            </p>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">When Should You Use Merge Sort?</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">✓ Good For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Large datasets where O(n log n) performance is needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>When stability is required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Sorting linked lists (no random access needed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>External sorting (data doesn't fit in memory)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Guaranteed worst-case O(n log n) performance</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-red-700 mb-3">✗ Not Ideal For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Small arrays (overhead of recursion)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>When memory is limited (needs O(n) extra space)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>When in-place sorting is required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Nearly sorted arrays (Quick Sort might be faster)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Practice Exercise */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
        <p className="text-lg text-gray-700 mb-4">
          Try to manually trace through merge sort with this array: <code className="bg-white px-2 py-1 rounded">[5, 2, 8, 1]</code>
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Divide [5, 2, 8, 1] into [5, 2] and [8, 1]</li>
            <li>Divide [5, 2] into [5] and [2]</li>
            <li>Merge [5] and [2] → [2, 5]</li>
            <li>Divide [8, 1] into [8] and [1]</li>
            <li>Merge [8] and [1] → [1, 8]</li>
            <li>Merge [2, 5] and [1, 8] → [1, 2, 5, 8]</li>
          </ol>
        </div>
      </div>
    </div>
  );
}