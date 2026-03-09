/**
 * Per-lesson content for the Review (spaced repetition) flow.
 * When the user clicks "Show answer", we display this summary + active-recall tip
 * so the review is a proper retrieval + feedback cycle.
 */
const REVIEW_CONTENT = {
  linear: {
    summary: "Linear search checks every element in order until the target is found or the array ends. Time O(n), space O(1); works on any array.",
    tip: "Sequential = in order, like reading a book page by page from start to finish!",
  },
  binary: {
    summary: "Binary search halves the search space each step on a sorted array. Time O(log n), space O(1) iterative. Requires sorted data.",
    tip: "Sorted = foundation! Binary Search logic depends entirely on order to eliminate halves.",
  },
  bubble: {
    summary: "Bubble sort repeatedly compares and swaps adjacent elements; the largest bubbles to the end each pass. O(n²) time, O(1) space, stable.",
    tip: "Think about how bubbles rise in water — they move up one position at a time by comparing with their immediate neighbor!",
  },
  merge: {
    summary: "Merge sort divides the array in half, recursively sorts, then merges two sorted halves. O(n log n) in all cases, O(n) space, stable.",
    tip: "Think: Divide (split array) → Conquer (sort halves) → Combine (merge sorted halves)!",
  },
  quick: {
    summary: "Quick sort picks a pivot, partitions into smaller and larger elements, then recurses. O(n log n) average, O(n²) worst; in-place, not stable.",
    tip: "Think: Pivot is the 'decision point' — everything gets sorted relative to it!",
  },
  twopointers: {
    summary: "Two pointers (read and write) remove duplicates in-place in one pass on a sorted array. O(n) time, O(1) space.",
    tip: "Use two pointers: write marks the end of the unique region; only advance and copy when arr[read] ≠ arr[write].",
  },
  slidingwindow: {
    summary: "Fixed-size sliding window: compute the first window sum, then slide by subtracting the element that leaves and adding the one that enters. O(n).",
    tip: "Reuse the previous sum: newSum = oldSum - leftOut + rightIn. Track the max.",
  },
  hashmaps: {
    summary: "Hash map gives O(1) lookup. Two Sum: store value → index; for each element check if (target - current) is in the map before adding.",
    tip: "Two Sum: store each value with its index; for each element, check if (target - value) is in the map before adding.",
  },
  linkedlists: {
    summary: "Three-pointer reversal: prev, curr, next. Save next, set curr.next = prev, advance. Fast & slow: slow 1 step, fast 2 steps → slow at middle.",
    tip: "Break, reverse, advance. Save next first or we lose the list.",
  },
  stacks: {
    summary: "Next Greater Element: monotonic decreasing stack of indices. Pop when current value is greater than arr[stack top]; then push current index. O(n).",
    tip: "Stack of indices. Pop when current value is greater than arr[stack top]. Left in stack at end ⇒ no NGE ⇒ -1.",
  },
};

/**
 * Get summary and active-recall tip for a lesson (for Review "Show answer").
 * @param {string} lessonId - e.g. "linear", "binary", "quick"
 * @returns {{ summary: string, tip: string } | null}
 */
export function getReviewContent(lessonId) {
  if (!lessonId) return null;
  return REVIEW_CONTENT[lessonId] ?? null;
}
