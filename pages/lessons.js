import Layout from "../components/Layout";
import Card from "../components/Card";

const QUESTS = [
  {
    title: "Bubble Sort",
    description: "Master the art of bubble sorting through interactive visualization.",
    link: "/lesson/bubble",
  },
  {
    title: "Merge Sort",
    description: "Learn divide and conquer with merge sort algorithm.",
    link: "/lesson/merge",
  },
  {
    title: "Quick Sort",
    description: "Conquer quick sort, one of the fastest sorting algorithms.",
    link: "/lesson/quick",
  },
  {
    title: "Linear Search",
    description: "Start your search journey with linear search technique.",
    link: "/lesson/linear",
  },
  {
    title: "Binary Search",
    description: "Master efficient searching with binary search algorithm.",
    link: "/lesson/binary",
  },
];

export default function Lessons() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2 text-[#FFD700]">All Quests</h1>
      <p className="text-base text-[#B0B0B0] mb-8">
        Choose a lesson to start your algorithm quest.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUESTS.map((quest) => (
          <Card
            key={quest.link}
            title={quest.title}
            description={quest.description}
            link={quest.link}
          />
        ))}
      </div>
    </Layout>
  );
}
