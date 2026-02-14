import LinkedListVisualizer from "../LinkedListVisualizer";

export default function LinkedListsLesson() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#625EC6] to-indigo-700 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Linked Lists</h1>
        <p className="text-xl opacity-90">
          Reverse in-place with three pointers; find the middle with fast &amp; slow
        </p>
      </div>

      {/* Try It First */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First!</h2>
        <p className="text-gray-700 mb-6">
          Use the visualiser to see the three-pointer reversal (prev, curr, next) and the fast &amp; slow pattern for finding the middle. Switch modes and run step-by-step.
        </p>
        <LinkedListVisualizer />
      </div>

      {/* Problem: Reverse Linked List */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">The Problem: Reverse Linked List</h2>
        <p className="text-lg text-gray-700 mb-4">
          Given the head of a singly linked list, reverse the list in-place and return the new head. You must do it in O(1) extra space (aside from a few pointers).
        </p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
          <p>Input: 1 → 2 → 3 → 4 → 5 → null</p>
          <p>Output: 5 → 4 → 3 → 2 → 1 → null</p>
        </div>
      </div>

      {/* Brute force */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Brute Force: Store in Array, Rebuild</h2>
        <p className="text-gray-700 mb-4">
          Traverse the list and push each value (or node) into an array. Then build a new list by iterating the array backwards and creating new nodes. This is O(n) time but <strong>O(n) extra space</strong> for the array and possibly new nodes.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-900 font-semibold mb-1">Why O(n) space?</p>
          <p className="text-amber-800 text-sm">
            The array holds n values. If you also allocate n new nodes, that’s another O(n). The problem asks for in-place reversal, so we avoid extra storage by only changing pointers.
          </p>
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key Insight: Three-Pointer In-Place Reversal</h2>
        <p className="text-gray-700 mb-4">
          Use three references: <strong className="text-red-600">prev</strong> (reversed portion so far), <strong className="text-blue-600">curr</strong> (current node), <strong className="text-green-600">next</strong> (saved so we don’t lose the rest of the list). At each step: save <code>next = curr.next</code>, then <code>curr.next = prev</code>, then advance <code>prev = curr</code> and <code>curr = next</code>.
        </p>
        <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Break, reverse, reconnect</h3>
          <p className="text-gray-200 text-sm">
            We “break” the link from curr to the rest, “reverse” by pointing curr to prev, then “reconnect” by moving prev and curr forward. We never lose the rest of the list because we saved it in <code>next</code>.
          </p>
        </div>
      </div>

      {/* Step-by-step */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Step-by-Step Pointer Manipulation</h2>
        <p className="text-gray-700 mb-4">
          Initially: <code>prev = null</code>, <code>curr = head</code>. While <code>curr</code> is not null: set <code>next = curr.next</code>, set <code>curr.next = prev</code>, set <code>prev = curr</code>, set <code>curr = next</code>. Return <code>prev</code> (new head).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Step</th>
                <th className="border border-gray-300 p-2 text-left">prev</th>
                <th className="border border-gray-300 p-2 text-left">curr</th>
                <th className="border border-gray-300 p-2 text-left">next</th>
                <th className="border border-gray-300 p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr><td className="border p-2">0</td><td className="border p-2">null</td><td className="border p-2">1</td><td className="border p-2">2</td><td className="border p-2">save next</td></tr>
              <tr><td className="border p-2">1</td><td className="border p-2">1</td><td className="border p-2">2</td><td className="border p-2">3</td><td className="border p-2">1→null, advance</td></tr>
              <tr><td className="border p-2">2</td><td className="border p-2">2</td><td className="border p-2">3</td><td className="border p-2">4</td><td className="border p-2">2→1, advance</td></tr>
              <tr><td className="border p-2">…</td><td className="border p-2">…</td><td className="border p-2">…</td><td className="border p-2">…</td><td className="border p-2">…</td></tr>
              <tr><td className="border p-2">end</td><td className="border p-2">5</td><td className="border p-2">null</td><td className="border p-2">—</td><td className="border p-2">return prev</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Iterative vs recursive */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Iterative vs Recursive</h2>
        <p className="text-gray-700 mb-4">
          <strong>Iterative:</strong> The three-pointer loop above. O(n) time, O(1) space. <strong>Recursive:</strong> Assume the rest of the list is already reversed; then point the next node back to current and set current’s next to null. O(n) time but O(n) stack space for the recursion. For in-place preference, iterative is standard.
        </p>
      </div>

      {/* Edge cases */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Edge Cases</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Empty list:</strong> head is null → return null.</li>
          <li><strong>Single node:</strong> one iteration; curr.next = null, prev = head, curr = null → return prev (same head).</li>
          <li><strong>Two nodes:</strong> after one step: first node points to null, prev = first, curr = second; after second step: second points to first, prev = second, curr = null → return second.</li>
        </ul>
      </div>

      {/* Common mistakes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Common Mistakes</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Losing the rest of the list</h3>
            <p className="text-gray-700 text-sm">
              If you do <code>curr.next = prev</code> before saving <code>next = curr.next</code>, you lose the reference to the rest of the list. Always save <code>next</code> first.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Returning the wrong head</h3>
            <p className="text-gray-700 text-sm">
              After the loop, <code>curr</code> is null. The new head is <code>prev</code> (the last non-null node). Returning <code>curr</code> would return null.
            </p>
          </div>
        </div>
      </div>

      {/* Fast & Slow: Middle */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Second Pattern: Fast &amp; Slow Pointers (Middle of List)</h2>
        <p className="text-gray-700 mb-4">
          <strong>Problem:</strong> Given the head of a linked list, return the middle node. If two middles (even length), return the second one.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Idea:</strong> Use two pointers: <code>slow</code> moves one step, <code>fast</code> moves two steps per iteration. When <code>fast</code> reaches the end (or past it), <code>slow</code> is at the middle. Each iteration, fast advances by 2 and slow by 1, so when fast has moved 2k steps, slow has moved k steps — so slow is at the midpoint.
        </p>
        <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Why slow reaches the middle</h3>
          <p className="text-gray-200 text-sm">
            Fast travels twice as fast. So when fast has covered the full list (length n), slow has covered n/2 — the middle. For even length, we usually stop when fast can’t take two steps; slow ends at the second middle.
          </p>
        </div>
      </div>

      {/* Practice */}
      <div className="bg-gradient-to-br from-[#625EC6]/10 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-[#625EC6]/30">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Practice</h2>
        <p className="text-gray-700 mb-2">
          <strong>Variations:</strong>
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Reverse only the first k nodes (keep the rest attached).</li>
          <li>Reverse the nodes between position left and right (1-indexed).</li>
        </ul>
        <p className="text-gray-700 text-sm">
          Both use the same “break, reverse, reconnect” idea: reverse a segment with the three-pointer technique, then reconnect the segment to the rest of the list.
        </p>
      </div>
    </div>
  );
}
