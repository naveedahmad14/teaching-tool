/**
 * Suggested learning path (quest order) and prerequisites.
 * Used for the Lessons page "fantasy map" and scaffolding.
 */
const QUEST_META = {
  linear: { title: "Linear Search", description: "Start your search journey with linear search technique.", link: "/lesson/linear", icon: "⋯" },
  binary: { title: "Binary Search", description: "Master efficient searching in sorted arrays.", link: "/lesson/binary", icon: "◉" },
  bubble: { title: "Bubble Sort", description: "Master the art of bubble sorting through interactive visualization.", link: "/lesson/bubble", icon: "○" },
  merge: { title: "Merge Sort", description: "Learn divide and conquer with merge sort algorithm.", link: "/lesson/merge", icon: "⊔" },
  quick: { title: "Quick Sort", description: "Conquer quick sort, one of the fastest sorting algorithms.", link: "/lesson/quick", icon: "◆" },
  twopointers: { title: "Two Pointers", description: "Remove duplicates in-place with read and write pointers.", link: "/lesson/twopointers", icon: "↔" },
  slidingwindow: { title: "Sliding Window", description: "Maximum sum subarray of size k in O(n) with a sliding window.", link: "/lesson/slidingwindow", icon: "▬" },
  hashmaps: { title: "Hash Maps", description: "Two Sum and frequency counter with O(1) lookup.", link: "/lesson/hashmaps", icon: "#" },
  linkedlists: { title: "Linked Lists", description: "Reverse in-place and find the middle with fast & slow pointers.", link: "/lesson/linkedlists", icon: "→" },
  stacks: { title: "Stacks", description: "Next Greater Element with monotonic stack pattern.", link: "/lesson/stacks", icon: "▀" },
};

/** Suggested order: follow the path for a logical learning sequence */
export const QUEST_PATH_ORDER = [
  "linear",
  "binary",
  "bubble",
  "merge",
  "quick",
  "twopointers",
  "slidingwindow",
  "hashmaps",
  "linkedlists",
  "stacks",
];

/** Prerequisites: lesson id → list of lesson ids that are recommended to complete first */
export const PREREQUISITES = {
  binary: ["linear"],
  merge: ["bubble"],
  quick: ["merge"],
};

/**
 * Get the ordered list of quests with full meta, nextQuest id, and prerequisite titles.
 */
export function getOrderedQuests() {
  return QUEST_PATH_ORDER.map((id, index) => {
    const meta = QUEST_META[id];
    const nextId = QUEST_PATH_ORDER[index + 1] ?? null;
    const prereqIds = PREREQUISITES[id] ?? [];
    return {
      id,
      step: index + 1,
      ...meta,
      nextQuestId: nextId,
      nextQuestTitle: nextId ? QUEST_META[nextId].title : null,
      prerequisiteIds: prereqIds,
      prerequisiteTitles: prereqIds.map((pid) => QUEST_META[pid].title),
    };
  });
}
