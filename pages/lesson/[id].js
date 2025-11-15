import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import BubbleSortVisualizer from "../../components/BubbleSortVisualiser";
import QuickSortVisualizer from "../../components/QuickSortVisualizer";
import MergeSortVisualizer from "../../components/MergeSortVisualizer";

export default function Lesson() {
  const router = useRouter();
  const { id } = router.query;

  // Dummy content - replace with real lesson material
  const lessons = {
    bubble: { title: "Bubble Sort", content: "Here we teach the basics of Artificial Intelligence..." },
    merge: { title: "Merge Sort", content: "Learn about datasets, cleaning, and visualization..." },
    quick: { title: "Quick Sort", content: "Understand sorting, searching, and efficiency..." },
  };

  const lesson = lessons[id];

  if (!lesson) return <Layout><p>Lesson not found.</p></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p className="text-gray-700">{lesson.content}</p>
      {id === 'bubble' && <BubbleSortVisualizer />}
      {id === 'quick' && <QuickSortVisualizer />}
      {id === 'merge' && <MergeSortVisualizer />}

    </Layout>
  );
}
