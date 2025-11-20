import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import BubbleSortVisualizer from "../../components/BubbleSortVisualiser";
import QuickSortVisualizer from "../../components/QuickSortVisualizer";
import MergeSortVisualizer from "../../components/MergeSortVisualizer";
import MergeSortLesson from "../../components/MergeSortLesson";
import LinearSearchVisualizer from "../../components/LinearSearchVisualizer";
import BinarySearchVisualizer from "../../components/BinarySearchVisualizer";

export default function Lesson() {
  const router = useRouter();
  const { id } = router.query;

  const lessons = {
    bubble: { 
      title: "Bubble Sort", 
      content: "Bubble sort is a simple sorting algorithm that repeatedly steps through a list, compares adjacent elements, and swaps them if they're in the wrong order. This process continues until no more swaps are needed, causing larger elements to 'bubble' to the end of the list." 
    },
    merge: { 
      title: "Merge Sort", 
      hasFullLesson: true // Flag to indicate this has a comprehensive lesson
    },
    quick: { 
      title: "Quick Sort", 
      content: "Understand sorting, searching, and efficiency..." 
    },
    linear: { 
      title: "Linear Search", 
      content: "Understand the linear search algorithm and its applications..." 
    },
    binary: { 
      title: "Binary Search", 
      content: "Explore the binary search algorithm and its efficiency..." 
    },
  };

  const lesson = lessons[id];

  if (!lesson) return <Layout><p>Lesson not found.</p></Layout>;

  // For Merge Sort, render the full lesson component
  if (id === 'merge' && lesson.hasFullLesson) {
    return (
      <Layout>
        <MergeSortLesson />
      </Layout>
    );
  }

  // For other lessons, render the simple format
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p className="text-gray-700 mb-6">{lesson.content}</p>
      
      {id === 'bubble' && <BubbleSortVisualizer />}
      {id === 'quick' && <QuickSortVisualizer />}
      {id === 'linear' && <LinearSearchVisualizer />}
      {id === 'binary' && <BinarySearchVisualizer />}
    </Layout>
  );
}