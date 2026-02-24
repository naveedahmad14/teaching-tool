import { useState } from 'react';
import { motion } from 'framer-motion';
import QuickSortVisualizer from '../visualizers/QuickSortVisualizer';

export default function QuickSortLesson() {
  const [array, setArray] = useState([10, 80, 30, 90, 40, 50, 70]);
  const [sorting, setSorting] = useState(false);
  const [pivot, setPivot] = useState(null);
  const [comparing, setComparing] = useState([]);
  const [partitionRange, setPartitionRange] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [partitionCount, setPartitionCount] = useState(0);
  const [speed, setSpeed] = useState(1500);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function quickSort(arr, low, high):", indent: 0 },
    { line: 2, code: "if low < high:", indent: 1 },
    { line: 3, code: "pivotIndex = partition(arr, low, high)", indent: 2 },
    { line: 4, code: "quickSort(arr, low, pivotIndex - 1)", indent: 2 },
    { line: 5, code: "quickSort(arr, pivotIndex + 1, high)", indent: 2 },
    { line: 6, code: "", indent: 0 },
    { line: 7, code: "function partition(arr, low, high):", indent: 0 },
    { line: 8, code: "pivot = arr[high]  // Choose last element", indent: 1 },
    { line: 9, code: "i = low - 1  // Index of smaller element", indent: 1 },
    { line: 10, code: "for j from low to high - 1:", indent: 1 },
    { line: 11, code: "if arr[j] < pivot:", indent: 2 },
    { line: 12, code: "i++", indent: 3 },
    { line: 13, code: "swap arr[i] and arr[j]", indent: 3 },
    { line: 14, code: "swap arr[i + 1] and arr[high]", indent: 1 },
    { line: 15, code: "return i + 1", indent: 1 },
  ];

  const quickSort = async () => {
    setSorting(true);
    const arr = [...array];
    let partitions = 0;

    const partition = async (arr, low, high) => {
      setActiveLine(7);
      await sleep(speed);

      const pivotValue = arr[high];
      setPivot(high);
      setPartitionRange([low, high]);
      partitions++;
      setPartitionCount(partitions);
      
      setActiveLine(8);
      await sleep(speed);

      let i = low - 1;
      setActiveLine(9);
      await sleep(speed);

      setActiveLine(10);
      for (let j = low; j < high; j++) {
        setComparing([j, high]);
        setActiveLine(11);
        await sleep(speed);

        if (arr[j] < pivotValue) {
          i++;
          setActiveLine(12);
          await sleep(speed);

          if (i !== j) {
            setActiveLine(13);
            [arr[i], arr[j]] = [arr[j], arr[i]];
            setArray([...arr]);
            await sleep(speed);
          }
        }
        setComparing([]);
      }

      setActiveLine(14);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(speed);

      setSortedIndices(prev => [...prev, i + 1]);
      setPivot(null);
      setPartitionRange([]);
      setComparing([]);
      
      setActiveLine(15);
      await sleep(speed);

      return i + 1;
    };

    const sort = async (arr, low, high) => {
      setActiveLine(1);
      await sleep(speed);

      if (low < high) {
        setActiveLine(2);
        await sleep(speed);

        setActiveLine(3);
        const pi = await partition(arr, low, high);

        setActiveLine(4);
        await sleep(speed);
        await sort(arr, low, pi - 1);

        setActiveLine(5);
        await sleep(speed);
        await sort(arr, pi + 1, high);
      } else if (low === high) {
        setSortedIndices(prev => [...prev, low]);
      }
    };

    await sort(arr, 0, arr.length - 1);
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setActiveLine(null);
    setSorting(false);
  };

  const handleReset = () => {
    setArray([10, 80, 30, 90, 40, 50, 70]);
    setPivot(null);
    setComparing([]);
    setPartitionRange([]);
    setSortedIndices([]);
    setActiveLine(null);
    setPartitionCount(0);
    setSorting(false);
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (pivot === index) return 'bg-purple-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (partitionRange.length === 2 && index >= partitionRange[0] && index <= partitionRange[1]) {
      return 'bg-orange-400';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Quick Sort: Divide and Conquer</h1>
        <p className="text-xl opacity-90">Master one of the fastest sorting algorithms</p>
      </div>

      {/* Learning objectives */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Learning objectives</h2>
        <p className="text-gray-600 mb-3">By the end of this lesson you will be able to:</p>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>Explain how Quick Sort uses a pivot and the partition step to divide the array</li>
          <li>Trace the partition algorithm (Lomuto or last-element pivot) step-by-step</li>
          <li>State average O(n log n) and worst O(n²) time, and why pivot choice matters</li>
          <li>Compare Quick Sort with Merge Sort (in-place vs stable, when to use each)</li>
        </ul>
      </div>

      {/* Quick Visualizer Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First!</h2>
        <p className="text-gray-700 mb-6">
          Before diving into the details, play with this visualiser to get an intuitive feel for how merge sort works:
        </p>
        <QuickSortVisualizer />
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-blue-800 text-center italic">
            Note: The standalone visualiser from your components can be placed here, or you can use the integrated one below in the Interactive Visualisation section.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">What is Quick Sort?</h2>
        <p className="text-lg text-gray-700 mb-4">
          Quick Sort is a highly efficient, <strong>divide-and-conquer</strong> sorting algorithm. It works by selecting 
          a 'pivot' element and partitioning the array so that all elements smaller than the pivot come before it, 
          and all greater elements come after. It then recursively sorts the sub-arrays.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-bold text-purple-900 mb-2">Time Complexity</h3>
            <p className="text-purple-800 text-sm">Best: O(n log n)</p>
            <p className="text-purple-800 text-sm">Average: O(n log n)</p>
            <p className="text-purple-800 text-sm">Worst: O(n²) - rare</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
            <h3 className="font-bold text-pink-900 mb-2">💾 Space Complexity</h3>
            <p className="text-pink-800">O(log n) - In-place with recursion stack</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-bold text-orange-900 mb-2">✗ Stability</h3>
            <p className="text-orange-800">Unstable - May change relative order</p>
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Choose a Pivot</h3>
              <p className="text-gray-700">Select a pivot element from the array. Common choices: last element, first element, middle element, or random element.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-pink-700">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Partition the Array</h3>
              <p className="text-gray-700">Rearrange the array so all elements smaller than the pivot are to its left, and all larger elements are to its right. The pivot is now in its final sorted position!</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-orange-700">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Recursively Sort Sub-arrays</h3>
              <p className="text-gray-700">Apply the same process to the sub-array of elements less than the pivot and the sub-array of elements greater than the pivot.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-green-700">4</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Base Case</h3>
              <p className="text-gray-700">When a sub-array has 0 or 1 element, it's already sorted. This is the base case that stops the recursion.</p>
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
            onClick={quickSort}
            disabled={sorting}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
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
              max="2500"
              step="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={sorting}
              className="w-32"
            />
            <span className="text-gray-600 text-sm">{speed}ms</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <p className="text-purple-700 font-semibold">Partitions Completed: {partitionCount}</p>
        </div>

        {/* Array Visualization */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex justify-center gap-2 flex-wrap">
            {array.map((value, index) => (
              <motion.div
                key={`quick-${index}`}
                className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg shadow-md text-white ${getBarColor(index)}`}
                animate={{
                  scale: pivot === index ? 1.25 : comparing.includes(index) ? 1.15 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>
            ))}
          </div>

          {partitionRange.length === 2 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="font-semibold">Partitioning range: </span>
              [{partitionRange[0]}, {partitionRange[1]}] | Pivot value: {array[pivot]}
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
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">The Partition Operation</h3>
            <p className="text-gray-700">
              The partition is the heart of Quick Sort. It uses two pointers: one (i) tracks where to place the next 
              small element, and another (j) scans through the array. When we find an element smaller than the pivot, 
              we increment i and swap arr[i] with arr[j].
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pivot Selection Strategies</h3>
            <p className="text-gray-700">
              <strong>Last element:</strong> Simple but worst-case O(n²) on sorted arrays. <strong>Random:</strong> Good average performance. 
              <strong>Median-of-three:</strong> Choose median of first, middle, and last elements for better performance.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">In-Place Sorting</h3>
            <p className="text-gray-700">
              Quick Sort sorts in-place by swapping elements within the array. The only extra space needed is for 
              the recursion call stack, which is O(log n) on average.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Worst Case: O(n²)</h3>
            <p className="text-gray-700">
              The worst case occurs when the pivot is always the smallest or largest element, causing highly unbalanced 
              partitions. This happens with already-sorted arrays using last-element pivot. Randomization prevents this.
            </p>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">When Should You Use Quick Sort?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">✓ Good For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Large datasets - O(n log n) average performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>In-memory sorting with limited space</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Arrays (benefits from cache locality)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>When average-case performance matters more than worst-case</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>General-purpose sorting in most languages' standard libraries</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-red-700 mb-3">✗ Avoid For:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>When guaranteed O(n log n) is required (use Merge Sort)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>When stability is required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Linked lists (poor cache performance)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Small arrays (use Insertion Sort instead)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>When recursion stack depth is a concern</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key takeaways */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key takeaways</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Quick Sort picks a pivot (e.g. last element), partitions so smaller elements are left and larger right, then recurses on both sides.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Average time is O(n log n); worst case is O(n²) with a bad pivot (e.g. already sorted with last-element pivot). Space: O(log n) for the recursion stack.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Quick Sort is fast in practice and in-place but not stable; use Merge Sort when you need stability or guaranteed O(n log n).</span>
          </li>
        </ul>
      </div>

      {/* Practice Exercise */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
        <p className="text-lg text-gray-700 mb-4">
          Manually partition this array with pivot = 5: <code className="bg-white px-2 py-1 rounded">[3, 7, 8, 5, 2, 1, 9]</code>
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>Pivot = 5 (last element), i = -1</p>
            <p className="ml-4">j=0: 3 {"<"} 5, i=0, swap arr[0] with arr[0]: [3, 7, 8, 5, 2, 1, 9]</p>
            <p className="ml-4">j=1: 7 {">"} 5, no swap: [3, 7, 8, 5, 2, 1, 9]</p>
            <p className="ml-4">j=2: 8 {">"} 5, no swap: [3, 7, 8, 5, 2, 1, 9]</p>
            <p className="ml-4">j=3: Skip (it's the pivot)</p>
            <p className="ml-4">j=4: 2 {"<"} 5, i=1, swap arr[1] with arr[4]: [3, 2, 8, 5, 7, 1, 9]</p>
            <p className="ml-4">j=5: 1 {"<"} 5, i=2, swap arr[2] with arr[5]: [3, 2, 1, 5, 7, 8, 9]</p>
            <p className="ml-4">Finally, swap pivot with arr[i+1]: [3, 2, 1, 5, 7, 8, 9]</p>
            <p className="font-semibold mt-2">Result: All elements before 5 are smaller, all after are larger!</p>
          </div>
        </div>
      </div>
    </div>
  );
}