// ==========================================
// File: pages/lesson/[id].js (SIMPLIFIED)
// ==========================================
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import ProgressTracker from "@/components/progress/ProgressTracker";

// Import consolidated lesson components
import BubbleSortLesson from "../../components/lessons/BubbleSort";
import QuickSortLesson from "../../components/lessons/QuickSort";
import MergeSortLesson from "../../components/lessons/MergeSort";
import LinearSearchLesson from "../../components/lessons/LinearSearch";
import BinarySearchLesson from "../../components/lessons/BinarySearch";
import TwoPointersLesson from "../../components/lessons/TwoPointers";
import SlidingWindowLesson from "../../components/lessons/SlidingWindow";
import HashMapsLesson from "../../components/lessons/HashMaps";
import LinkedListsLesson from "../../components/lessons/LinkedLists";
import StacksLesson from "../../components/lessons/Stacks";

export default function Lesson() {
  const router = useRouter();
  const { id } = router.query;

  const lessons = {
    bubble: { component: BubbleSortLesson },
    quick: { component: QuickSortLesson },
    merge: { component: MergeSortLesson },
    linear: { component: LinearSearchLesson },
    binary: { component: BinarySearchLesson },
    twopointers: { component: TwoPointersLesson },
    slidingwindow: { component: SlidingWindowLesson },
    hashmaps: { component: HashMapsLesson },
    linkedlists: { component: LinkedListsLesson },
    stacks: { component: StacksLesson },
  };

  const lesson = lessons[id];

  if (!lesson) {
    return (
      <Layout>
        <p>Lesson not found.</p>
      </Layout>
    );
  }

  const LessonComponent = lesson.component;

  return (
    <Layout>
      <ProgressTracker lessonId={id} />
      <LessonComponent />
    </Layout>
  );
}