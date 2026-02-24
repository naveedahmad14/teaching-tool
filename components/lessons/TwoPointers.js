import { useState } from "react";
import { motion } from "framer-motion";
import TwoPointersVisualizer from "../visualizers/TwoPointersVisualizer";

const INITIAL_ARRAY = [1, 1, 2, 2, 2, 3, 4, 4, 5];

export default function TwoPointersLesson() {
  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [read, setRead] = useState(null);
  const [write, setWrite] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [overwrite, setOverwrite] = useState(null);
  const [uniqueCount, setUniqueCount] = useState(null);
  const [running, setRunning] = useState(false);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [speed, setSpeed] = useState(800);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function removeDuplicates(arr):", indent: 0 },
    { line: 2, code: "if arr.length == 0: return 0", indent: 1 },
    { line: 3, code: "write = 0  // unique region ends at write", indent: 1 },
    { line: 4, code: "for read from 1 to arr.length - 1:", indent: 1 },
    { line: 5, code: "if arr[read] != arr[write]:  // new unique value", indent: 2 },
    { line: 6, code: "write += 1", indent: 3 },
    { line: 7, code: "arr[write] = arr[read]  // copy to unique region", indent: 3 },
    { line: 8, code: "return write + 1  // count of unique elements", indent: 1 },
  ];

  const [activeLine, setActiveLine] = useState(null);

  const runAlgorithm = async () => {
    setRunning(true);
    setUniqueCount(null);
    setComparisonCount(0);
    const arr = [...array];
    let w = 0;
    let comparisons = 0;

    setActiveLine(1);
    await sleep(speed);
    setActiveLine(2);
    await sleep(speed);
    setActiveLine(3);
    setWrite(0);
    setRead(1);
    await sleep(speed);
    setActiveLine(4);

    for (let r = 1; r < arr.length; r++) {
      setRead(r);
      setComparing(true);
      comparisons++;
      setComparisonCount(comparisons);
      setActiveLine(5);
      await sleep(speed);

      if (arr[r] !== arr[w]) {
        setActiveLine(6);
        w++;
        setOverwrite(w);
        await sleep(speed);
        setActiveLine(7);
        arr[w] = arr[r];
        setArray([...arr]);
        setWrite(w);
        setOverwrite(null);
        await sleep(speed);
      }
      setComparing(false);
      setActiveLine(4);
      await sleep(speed / 2);
    }

    setActiveLine(8);
    setUniqueCount(w + 1);
    await sleep(speed);
    setActiveLine(null);
    setRunning(false);
  };

  const handleReset = () => {
    setArray([...INITIAL_ARRAY]);
    setRead(null);
    setWrite(null);
    setComparing(false);
    setOverwrite(null);
    setUniqueCount(null);
    setComparisonCount(0);
    setActiveLine(null);
    setRunning(false);
  };

  const getCellColor = (index) => {
    if (overwrite === index) return "bg-amber-400 text-gray-900";
    if (read === index && comparing) return "bg-yellow-500 text-gray-900";
    if (read === index) return "bg-blue-500 text-white";
    if (write === index) return "bg-purple-500 text-white";
    if (uniqueCount !== null && index < uniqueCount) return "bg-green-500 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#625EC6] to-indigo-700 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Two Pointers: Remove Duplicates</h1>
        <p className="text-xl opacity-90">
          In-place O(n) with a read and a write pointer
        </p>
      </div>

      {/* Learning objectives */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Learning objectives</h2>
        <p className="text-gray-600 mb-3">By the end of this lesson you will be able to:</p>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>Remove duplicates in-place from a sorted array using read and write pointers in O(n) time</li>
          <li>Explain the invariant: elements in indices 0..write are unique and sorted</li>
          <li>Trace when to advance write and copy (only when arr[read] != arr[write])</li>
          <li>Return the count of unique elements (write + 1) and know the valid result is in arr[0..write]</li>
        </ul>
      </div>

      {/* Try It First */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First!</h2>
        <p className="text-gray-700 mb-6">
          Before diving into the details, play with this visualiser to see how the read and write pointers move and how duplicates are removed in one pass.
        </p>
        <TwoPointersVisualizer />
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mt-4">
          <p className="text-blue-800 text-center italic">
            Use Play/Pause and Speed to step through. The standalone visualiser is above; the interactive section with pseudocode is below.
          </p>
        </div>
      </div>

      {/* The Problem */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">The Problem</h2>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Remove duplicates from sorted array:</strong> Given a sorted array in non-decreasing order, remove duplicates in-place so that each unique element appears only once. Return the number of unique elements <code className="bg-gray-100 px-1 rounded">k</code>, and the first <code className="bg-gray-100 px-1 rounded">k</code> elements of the array must be the unique values in order.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
          <p>Input:  [1, 1, 2, 2, 2, 3, 4, 4, 5]</p>
          <p>Output: k = 5, array becomes [1, 2, 3, 4, 5, _, _, _, _]</p>
        </div>
      </div>

      {/* Why Not Nested Loops? */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Why Not Nested Loops?</h2>
        <p className="text-gray-700 mb-4">
          A brute-force idea: for each index, check if it’s a duplicate of something earlier and “shift” or build a new list. That usually leads to nested loops (e.g. for each element, scan backwards or use another loop to skip duplicates), which gives <strong>O(n²)</strong> time.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-900 font-semibold mb-1">Big-O intuition</p>
          <p className="text-amber-800 text-sm">
            Two nested loops over n elements → O(n²). For large n, that’s too slow when we can do one pass.
          </p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key Insight: Two Pointers</h2>
        <p className="text-gray-700 mb-4">
          Because the array is <strong>sorted</strong>, equal values are adjacent. So we can do a single pass with two pointers:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li><strong className="text-blue-600">Read:</strong> scans the array (index <code>read</code>).</li>
          <li><strong className="text-purple-600">Write:</strong> index where the next unique value should go. Everything before <code>write</code> is already unique and in order.</li>
        </ul>
        <p className="text-gray-700 mb-4">
          When <code>arr[read] !== arr[write]</code>, we’ve found a new unique value. We copy it to <code>arr[write + 1]</code> and advance <code>write</code>. One pass, no extra array.
        </p>
        <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Invariant</h3>
          <p className="text-gray-200 text-sm">
            At every step, the elements in <code className="text-purple-300">arr[0..write]</code> are unique, sorted, and form the “answer” so far. <code className="text-blue-300">read</code> only moves forward; we never need to look back.
          </p>
        </div>
      </div>

      {/* Step-by-step walkthrough */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Step-by-Step Walkthrough</h2>
        <p className="text-gray-700 mb-4">
          Start with <code>write = 0</code> (first element is always unique). Then for <code>read = 1, 2, …</code>:
        </p>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
          <li>If <code>arr[read] === arr[write]</code>, it’s a duplicate → do nothing, move <code>read</code>.</li>
          <li>If <code>arr[read] !== arr[write]</code>, we found a new value → <code>write++</code>, then <code>arr[write] = arr[read]</code>, then move <code>read</code>.</li>
          <li>Return <code>write + 1</code> as the count of unique elements.</li>
        </ol>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 font-mono overflow-x-auto">
          <p>Example: [1, 1, 2, 2, 3]</p>
          <p>write=0, read=1: 1==1 → skip. read=2: 2!=1 → write=1, arr[1]=2. read=3: 2==2 → skip. read=4: 3!=2 → write=2, arr[2]=3. → k=3.</p>
        </div>
      </div>

      {/* Interactive Visualization + Pseudocode */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Interactive Visualisation</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runAlgorithm}
            disabled={running}
            className="px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#7B75D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {running ? "Running…" : "Start"}
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
              min="400"
              max="1200"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={running}
              className="w-32"
            />
            <span className="text-gray-600 text-sm">{speed}ms</span>
          </div>
        </div>

        {uniqueCount !== null && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold">Unique count: {uniqueCount} | Comparisons: {comparisonCount}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 font-medium mb-3">Array</p>
            <div className="flex flex-wrap gap-2">
              {array.map((value, index) => (
                <motion.div
                  key={`cell-${index}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg shadow-md border-2 ${getCellColor(index)} ${
                    read === index || write === index ? "border-[#FFD700]" : "border-transparent"
                  }`}
                  animate={{ scale: overwrite === index ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-blue-600 font-medium">read</span>
              <span className="text-purple-600 font-medium">write</span>
              <span className="text-yellow-600 font-medium">comparing</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <h3 className="font-semibold text-white mb-4">Pseudocode</h3>
            <div className="font-mono text-sm">
              {pseudocode.map((line) => (
                <motion.div
                  key={line.line}
                  className={`py-1 px-3 rounded ${
                    activeLine === line.line ? "bg-[#FFD700] text-gray-900 font-bold" : "text-gray-300"
                  }`}
                  style={{ paddingLeft: `${line.indent * 2 + 1}rem` }}
                  transition={{ duration: 0.2 }}
                >
                  {line.code}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time & Space Complexity */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Time & Space Complexity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-2">Time: O(n)</h3>
            <p className="text-blue-800 text-sm">
              One pass: <code>read</code> goes from 1 to n-1, each step O(1). No nested loops.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-green-900 mb-2">Space: O(1)</h3>
            <p className="text-green-800 text-sm">
              Only a few variables (read, write). In-place; no extra array.
            </p>
          </div>
        </div>
        <div className="mt-4 bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Big-O intuition</h3>
          <p className="text-gray-200 text-sm">
            One linear pass → O(n) time. Constant extra variables → O(1) space. This is optimal for in-place.
          </p>
        </div>
      </div>

      {/* Edge Cases */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Edge Cases</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>Empty array:</strong> return 0 (handle at the start).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>Single element:</strong> return 1; no loop runs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>All unique:</strong> write advances every step; still O(n).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>All duplicates:</strong> write stays 0; we return 1.</span>
          </li>
        </ul>
      </div>

      {/* Common Mistakes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Common Mistakes</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Starting write at 1</h3>
            <p className="text-gray-700 text-sm">
              The first element is always unique, so the unique region starts at index 0. <code>write</code> should start at 0; we only advance when we see a new value.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Comparing with the wrong index</h3>
            <p className="text-gray-700 text-sm">
              We compare <code>arr[read]</code> with <code>arr[write]</code> (the last unique so far), not with <code>arr[read - 1]</code>. The invariant is “everything before write is unique.”
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Returning the wrong count</h3>
            <p className="text-gray-700 text-sm">
              The number of unique elements is <code>write + 1</code>, because indices <code>0..write</code> (inclusive) are the unique values.
            </p>
          </div>
        </div>
      </div>

      {/* Key takeaways */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key takeaways</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Use two pointers: <code>write</code> marks the end of the unique region; <code>read</code> scans the array. Only when arr[read] ≠ arr[write] do we advance write and copy.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Requires a sorted array so duplicates are adjacent; one pass O(n) time, O(1) extra space.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>The number of unique elements is write + 1; the in-place result is in indices 0..write.</span>
          </li>
        </ul>
      </div>

      {/* Practice Exercise */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
        <p className="text-lg text-gray-700 mb-4">
          Trace the algorithm on <code className="bg-white px-2 py-1 rounded">[1, 1, 1, 2, 2, 3]</code>. What is <code>write</code> after each step when we see a new value?
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <p className="text-gray-700 text-sm">
            write=0. read=1,2: 1==1 → skip. read=3: 2!=1 → write=1, arr[1]=2. read=4: 2==2 → skip. read=5: 3!=2 → write=2, arr[2]=3. Return 3. First three elements: [1, 2, 3].
          </p>
        </div>
      </div>
    </div>
  );
}
