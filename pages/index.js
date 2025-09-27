import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Welcome to the CS Teaching Tool</h1>
      <p className="mb-6 text-gray-700">
        Explore interactive lessons and quizzes to learn core Computer Science topics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="AI Basics" description="Introduction to Artificial Intelligence." link="/lesson/ai" />
        <Card title="Data Science" description="Learn how to analyze and visualize data." link="/lesson/data-science" />
        <Card title="Algorithms" description="Problem solving with algorithms and efficiency." link="/lesson/algorithms" />
      </div>
    </Layout>
  );
}
