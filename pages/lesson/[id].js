// ==========================================
// File: pages/lesson/[id].js (SIMPLIFIED)
// ==========================================
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ProgressTracker from "../../components/ProgressTracker";

// Import consolidated lesson components
import BubbleSortLesson from "../../components/lessons/BubbleSort";
import QuickSortLesson from "../../components/lessons/QuickSort";
import MergeSortLesson from "../../components/lessons/MergeSort";
import LinearSearchLesson from "../../components/lessons/LinearSearch";
import BinarySearchLesson from "../../components/lessons/BinarySearch";

export default function Lesson() {
  const router = useRouter();
  const { id } = router.query;

  const lessons = {
    bubble: { component: BubbleSortLesson },
    quick: { component: QuickSortLesson },
    merge: { component: MergeSortLesson },
    linear: { component: LinearSearchLesson },
    binary: { component: BinarySearchLesson },
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