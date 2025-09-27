import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function Lesson() {
  const router = useRouter();
  const { id } = router.query;

  // Dummy content - replace with real lesson material
  const lessons = {
    ai: { title: "AI Basics", content: "Here we teach the basics of Artificial Intelligence..." },
    "data-science": { title: "Data Science", content: "Learn about datasets, cleaning, and visualization..." },
    algorithms: { title: "Algorithms", content: "Understand sorting, searching, and efficiency..." },
  };

  const lesson = lessons[id];

  if (!lesson) return <Layout><p>Lesson not found.</p></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p className="text-gray-700">{lesson.content}</p>
    </Layout>
  );
}
