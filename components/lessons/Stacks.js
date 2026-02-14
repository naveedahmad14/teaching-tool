import StackVisualizer from "../visualizers/StackVisualizer";
import BasicStackDemo from "../visualizers/BasicStackDemo";

export default function StacksLesson() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#625EC6] to-indigo-700 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Stacks &amp; Monotonic Stack</h1>
        <p className="text-xl opacity-90">
          LIFO, then Next Greater Element with a decreasing stack
        </p>
      </div>

      {/* Basic Stack Operations */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Basic Stack Operations</h2>
        <p className="text-gray-700 mb-4">
          A <strong>stack</strong> is a LIFO (Last In, First Out) structure. You can only add (<strong>push</strong>) and remove (<strong>pop</strong>) from the <strong>top</strong>. <strong>Peek</strong> returns the top without removing it.
        </p>
        <div className="flex flex-wrap gap-6 items-start">
          <BasicStackDemo />
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-bold text-gray-800 mb-2">LIFO principle</h3>
            <p className="text-gray-700 text-sm mb-4">
              The last element pushed is the first one popped. Think of a stack of plates: you add and remove from the top only.
            </p>
            <h3 className="font-bold text-gray-800 mb-2">Valid Parentheses (warmup)</h3>
            <p className="text-gray-700 text-sm">
              Use a stack to check if a string of brackets is balanced: push opening brackets, pop and match on closing. If the stack is empty at the end and we never tried to pop on empty, it’s valid.
            </p>
          </div>
        </div>
      </div>

      {/* Try It First: Next Greater */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First: Next Greater Element</h2>
        <p className="text-gray-700 mb-6">
          Use the visualiser to see how a <strong>monotonic decreasing</strong> stack is used: we pop when the current element is greater than the stack top and assign the result, then push the current index.
        </p>
        <StackVisualizer />
      </div>

      {/* Problem */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">The Problem: Next Greater Element</h2>
        <p className="text-lg text-gray-700 mb-4">
          Given an array, for each element find the <strong>next greater element</strong> (NGE): the first element to the right that is strictly larger. If none exists, use -1.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
          <p>Input:  [2, 1, 5, 1, 3, 2]</p>
          <p>Output: [5, 5, -1, 3, -1, -1]</p>
        </div>
      </div>

      {/* Brute force */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Brute Force: O(n²)</h2>
        <p className="text-gray-700 mb-4">
          For each index <code>i</code>, scan right until you find the first <code>arr[j] &gt; arr[i]</code>. Two nested loops → O(n²).
        </p>
      </div>

      {/* Key insight */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key Insight: Monotonic Decreasing Stack</h2>
        <p className="text-gray-700 mb-4">
          We maintain a stack of <strong>indices</strong> such that the corresponding values are in <strong>decreasing order</strong> (bottom to top). When we process <code>arr[i]</code>, any stack top whose value is smaller than <code>arr[i]</code> has <code>arr[i]</code> as its next greater element — we pop them, assign the result, then push <code>i</code>.
        </p>
        <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Why the stack works</h3>
          <p className="text-gray-200 text-sm">
            By keeping indices in decreasing value order, we know that when we see a larger value, it is the &quot;next greater&quot; for all smaller values still on the stack. Each index is pushed once and popped at most once → <strong>O(n)</strong> time.
          </p>
        </div>
      </div>

      {/* Invariant */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Invariant Maintained</h2>
        <p className="text-gray-700 mb-4">
          At every step, the stack (from bottom to top) holds indices whose values are in <strong>strictly decreasing</strong> order. So when we compare the current element with the stack top, we either pop (current is greater) or push (current is smaller or equal).
        </p>
      </div>

      {/* Step-by-step */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Step-by-Step Stack Operations</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>For each index <code>i</code> from left to right:</li>
          <li>While stack not empty and <code>arr[stack.top] &lt; arr[i]</code>: pop the top index <code>j</code>, set <code>result[j] = arr[i]</code>.</li>
          <li>Push <code>i</code> onto the stack.</li>
          <li>After the loop, any index left in the stack has no next greater → <code>result[j] = -1</code> (or leave as -1 if pre-filled).</li>
        </ol>
      </div>

      {/* Applications */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Common Applications</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Daily Temperatures:</strong> For each day, find how many days until a warmer day — same pattern, store (value, index) and result is <code>index - popped_index</code>.</li>
          <li><strong>Stock Span:</strong> For each day, find the span (number of consecutive days with price ≤ today). Use a monotonic decreasing stack of (price, span).</li>
          <li><strong>Largest Rectangle in Histogram:</strong> For each bar, find the next smaller bar on left and right (two passes with monotonic stack), then compute areas.</li>
        </ul>
      </div>

      {/* Time complexity */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Time Complexity Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Approach</th>
                <th className="border border-gray-300 p-2 text-left">Time</th>
                <th className="border border-gray-300 p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="border p-2">Brute force (nested loops)</td>
                <td className="border p-2">O(n²)</td>
                <td className="border p-2">O(1)</td>
              </tr>
              <tr>
                <td className="border p-2">Monotonic stack (one pass)</td>
                <td className="border p-2 text-green-600 font-semibold">O(n)</td>
                <td className="border p-2">O(n)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice */}
      <div className="bg-gradient-to-br from-[#625EC6]/10 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-[#625EC6]/30">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Practice</h2>
        <p className="text-gray-700 mb-4">
          Trace Next Greater Element on <code className="bg-white px-2 py-1 rounded">[4, 2, 3, 1, 5]</code>. What is the result array?
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <p className="text-gray-700 text-sm">
            {"NGE: [5, 3, 5, 5, -1]. Stack goes: push 0(4), push 1(2), pop 1→3, push 2(3), push 3(1), pop 3→5, pop 2→5, pop 0→5, push 4(5)."}
          </p>
        </div>
      </div>
    </div>
  );
}
