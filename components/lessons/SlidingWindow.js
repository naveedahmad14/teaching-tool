import { useState } from "react";
import { motion } from "framer-motion";
import SlidingWindowVisualizer from "../visualizers/SlidingWindowVisualizer";

const INITIAL_ARRAY = [2, 1, 5, 1, 3, 2];
const INITIAL_K = 3;

export default function SlidingWindowLesson() {
  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [k] = useState(INITIAL_K);
  const [windowLeft, setWindowLeft] = useState(null);
  const [currentSum, setCurrentSum] = useState(null);
  const [maxSum, setMaxSum] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [adding, setAdding] = useState(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [activeLine, setActiveLine] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function maxSumSubarray(arr, k):", indent: 0 },
    { line: 2, code: "if k > arr.length: return 0", indent: 1 },
    { line: 3, code: "sum = sum of arr[0..k-1]  // first window", indent: 1 },
    { line: 4, code: "maxSum = sum", indent: 1 },
    { line: 5, code: "for left from 1 to arr.length - k:", indent: 1 },
    { line: 6, code: "sum = sum - arr[left-1] + arr[left+k-1]  // slide", indent: 2 },
    { line: 7, code: "maxSum = max(maxSum, sum)", indent: 2 },
    { line: 8, code: "return maxSum", indent: 1 },
  ];

  const runAlgorithm = async () => {
    setRunning(true);
    const arr = array;
    const n = arr.length;
    if (k > n) {
      setRunning(false);
      return;
    }

    setActiveLine(1);
    await sleep(speed);
    setActiveLine(2);
    await sleep(speed);
    setActiveLine(3);

    let left = 0;
    let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let max = sum;
    setWindowLeft(0);
    setCurrentSum(sum);
    setMaxSum(max);
    setActiveLine(4);
    await sleep(speed);

    for (left = 1; left <= n - k; left++) {
      setActiveLine(5);
      const leave = left - 1;
      const enter = left + k - 1;
      setRemoving(leave);
      setAdding(enter);
      await sleep(speed);

      setActiveLine(6);
      sum = sum - arr[leave] + arr[enter];
      setCurrentSum(sum);
      setWindowLeft(left);
      setRemoving(null);
      setAdding(null);
      await sleep(speed);

      setActiveLine(7);
      if (sum > max) max = sum;
      setMaxSum(max);
      await sleep(speed);
    }

    setActiveLine(8);
    await sleep(speed);
    setActiveLine(null);
    setRunning(false);
  };

  const handleReset = () => {
    setArray([...INITIAL_ARRAY]);
    setWindowLeft(null);
    setCurrentSum(null);
    setMaxSum(null);
    setRemoving(null);
    setAdding(null);
    setActiveLine(null);
    setRunning(false);
  };

  const getCellStyle = (index) => {
    const inWindow = windowLeft !== null && index >= windowLeft && index < windowLeft + k;
    if (removing === index) return "bg-red-500 text-white";
    if (adding === index) return "bg-green-500 text-white";
    if (inWindow) return "bg-[#625EC6] text-white";
    return "bg-gray-500 text-white";
  };

  const n = array.length;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#625EC6] to-indigo-700 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Sliding Window: Max Sum of Size k</h1>
        <p className="text-xl opacity-90">
          O(n) by reusing the previous window sum
        </p>
      </div>

      {/* Learning objectives */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Learning objectives</h2>
        <p className="text-gray-600 mb-3">By the end of this lesson you will be able to:</p>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>Solve &quot;max sum of a contiguous subarray of size k&quot; in O(n) using a sliding window</li>
          <li>Compute the first window sum, then slide by subtracting the element that leaves and adding the one that enters</li>
          <li>Track the maximum sum seen and handle edge cases (e.g. k &gt; n)</li>
          <li>Recognise when a fixed-size sliding window avoids O(n²) brute force</li>
        </ul>
      </div>

      {/* Try It First */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First!</h2>
        <p className="text-gray-700 mb-6">
          Use the visualiser below to see the window slide, which element is removed (red), which is added (green), and how the current and max sum update.
        </p>
        <SlidingWindowVisualizer />
      </div>

      {/* The Problem */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">The Problem</h2>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Maximum sum subarray of size k:</strong> Given an array of integers and a fixed window size <code className="bg-gray-100 px-1 rounded">k</code>, find the maximum sum of any contiguous subarray of length <code className="bg-gray-100 px-1 rounded">k</code>.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
          <p>Input: arr = [2, 1, 5, 1, 3, 2], k = 3</p>
          <p>Windows: [2,1,5]=8, [1,5,1]=7, [5,1,3]=9, [1,3,2]=6 → max sum = 9</p>
        </div>
      </div>

      {/* Brute Force vs Optimized */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Brute Force vs Optimized</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50/50">
            <h3 className="text-xl font-bold text-red-800 mb-3">Brute force: O(n·k)</h3>
            <p className="text-gray-700 text-sm mb-3">
              For each starting position <code>i</code>, sum elements <code>arr[i..i+k-1]</code> in a loop. That’s <code>n - k + 1</code> windows, each taking O(k) time → <strong>O(n·k)</strong>.
            </p>
            <p className="text-red-700 text-sm font-medium">
              Overlapping work: each slide re-adds almost the same k numbers again.
            </p>
          </div>
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50/50">
            <h3 className="text-xl font-bold text-green-800 mb-3">Sliding window: O(n)</h3>
            <p className="text-gray-700 text-sm mb-3">
              Compute the first window sum once. When sliding right, <strong>subtract the element that leaves</strong> (left) and <strong>add the element that enters</strong> (right). Each step is O(1).
            </p>
            <p className="text-green-700 text-sm font-medium">
              One pass, no nested loop over k.
            </p>
          </div>
        </div>

        <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Big-O comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#625EC6]/50 border-b border-[#625EC6]/50">
                  <th className="text-left py-2 text-[#FFD700] font-semibold">Approach</th>
                  <th className="text-left py-2 text-[#FFD700] font-semibold">Time</th>
                  <th className="text-left py-2 text-[#FFD700] font-semibold">Space</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                <tr className="border-b border-gray-600">
                  <td className="py-2">Brute force (sum each window)</td>
                  <td className="py-2">O(n·k)</td>
                  <td className="py-2">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2">Sliding window (subtract left, add right)</td>
                  <td className="py-2 text-[#FFD700]">O(n)</td>
                  <td className="py-2">O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key Insight</h2>
        <p className="text-gray-700 mb-4">
          Consecutive windows overlap by <code>k - 1</code> elements. So the new sum = old sum <strong>− arr[left]</strong> (element leaving) <strong>+ arr[right]</strong> (element entering). No need to add all <code>k</code> elements again.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-900 font-semibold mb-1">Fixed-size vs variable-size</p>
          <p className="text-amber-800 text-sm">
            This problem uses a <strong>fixed-size</strong> window (k is given). Variable-size sliding window (e.g. “longest subarray with sum ≤ target”) uses a different pattern: expand and shrink the window based on a condition.
          </p>
        </div>
      </div>

      {/* Interactive Visualization */}
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

        <div className="flex flex-wrap gap-4 mb-4">
          <span className="bg-[#16213E] text-[#FFD700] px-3 py-1 rounded font-semibold">
            Max sum: {maxSum ?? "—"}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded font-medium">
            Current sum: {currentSum ?? "—"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 font-medium mb-3">Array (k = {k})</p>
            <div className="flex flex-wrap gap-2">
              {array.map((value, index) => (
                <motion.div
                  key={`cell-${index}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg shadow-md ${getCellStyle(index)}`}
                  transition={{ duration: 0.25 }}
                >
                  {value}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-[#625EC6] font-medium">Window</span>
              <span className="text-red-600 font-medium">Removed</span>
              <span className="text-green-600 font-medium">Added</span>
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

      {/* Time & Space */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Time & Space Complexity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-2">Time: O(n)</h3>
            <p className="text-blue-800 text-sm">
              One pass: we visit each element at most twice (once when added, once when removed). Constant work per step.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-green-900 mb-2">Space: O(1)</h3>
            <p className="text-green-800 text-sm">
              Only a few variables: sum, maxSum, loop index. No extra array.
            </p>
          </div>
        </div>
      </div>

      {/* Edge Cases */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Edge Cases</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>k &gt; n:</strong> no valid window; return 0 or handle upfront.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>k === n:</strong> one window = whole array; return sum of array.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>k === 1:</strong> max single element; one pass.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#625EC6] font-bold">•</span>
            <span><strong>Negative numbers:</strong> algorithm is unchanged; max sum can still be found.</span>
          </li>
        </ul>
      </div>

      {/* Common Mistakes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Common Mistakes</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Wrong indices when sliding</h3>
            <p className="text-gray-700 text-sm">
              Element <strong>leaving</strong> is <code>arr[left - 1]</code> (the old left end). Element <strong>entering</strong> is <code>arr[left + k - 1]</code> (the new right end). Off-by-one here breaks the sum.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Updating max only when sum increases</h3>
            <p className="text-gray-700 text-sm">
              We do <code>maxSum = max(maxSum, sum)</code> every step. If we only update when <code>sum &gt; maxSum</code>, we already do that with max(); but forgetting to track max and only returning the last sum is wrong.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Not handling k &gt; n</h3>
            <p className="text-gray-700 text-sm">
              If <code>k &gt; arr.length</code>, there is no valid window. Return 0 or a sentinel value and avoid reading out-of-bounds.
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
            <span>Fixed-size sliding window: compute the sum of the first k elements, then for each new position update sum as sum - leftOut + rightIn and track the max.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>This gives O(n) time instead of O(n·k) or O(n²); use when the problem asks for a contiguous subarray of fixed length (or a length that can be tried for each k).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Handle k &gt; arr.length (no valid window) and initialise max from the first window.</span>
          </li>
        </ul>
      </div>

      {/* Practice Exercise */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">💡 Practice Exercise</h2>
        <p className="text-lg text-gray-700 mb-4">
          For <code className="bg-white px-2 py-1 rounded">arr = [2, 1, 5, 1, 3, 2]</code> and <code className="bg-white px-2 py-1 rounded">k = 3</code>, write the sum after each slide and the final max.
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <p className="text-gray-700 text-sm">
            Window 0: 2+1+5 = 8. Window 1: 8 − 2 + 1 = 7. Window 2: 7 − 1 + 3 = 9. Window 3: 9 − 5 + 2 = 6. Max sum = 9.
          </p>
        </div>
      </div>
    </div>
  );
}
