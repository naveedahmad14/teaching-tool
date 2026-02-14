import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";

const QUESTS = [
  { title: "Bubble Sort", description: "Master the art of bubble sorting through interactive visualization.", link: "/lesson/bubble", icon: "○" },
  { title: "Merge Sort", description: "Learn divide and conquer with merge sort algorithm.", link: "/lesson/merge", icon: "⊔" },
  { title: "Quick Sort", description: "Conquer quick sort, one of the fastest sorting algorithms.", link: "/lesson/quick", icon: "◆" },
  { title: "Linear Search", description: "Start your search journey with linear search technique.", link: "/lesson/linear", icon: "⋯" },
  { title: "Binary Search", description: "Master efficient searching with binary search algorithm.", link: "/lesson/binary", icon: "◉" },
  { title: "Two Pointers", description: "Remove duplicates in-place with read and write pointers.", link: "/lesson/twopointers", icon: "↔" },
  { title: "Sliding Window", description: "Maximum sum subarray of size k in O(n) with a sliding window.", link: "/lesson/slidingwindow", icon: "▬" },
  { title: "Hash Maps", description: "Two Sum and frequency counter with O(1) lookup.", link: "/lesson/hashmaps", icon: "#" },
  { title: "Linked Lists", description: "Reverse in-place and find the middle with fast & slow pointers.", link: "/lesson/linkedlists", icon: "→" },
  { title: "Stacks", description: "Next Greater Element with monotonic stack pattern.", link: "/lesson/stacks", icon: "▀" },
];

export default function Lessons() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2 text-[#FFD700]">All Quests</h1>
      <p className="text-base text-[#C0C0C0] mb-8">
        Choose a lesson to start learning.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUESTS.map((quest) => (
          <Card
            key={quest.link}
            title={quest.title}
            description={quest.description}
            link={quest.link}
            icon={quest.icon}
          />
        ))}
      </div>
    </Layout>
  );
}
