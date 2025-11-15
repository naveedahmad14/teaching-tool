import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Welcome to AlgoQuest</h1>
      <p className="mb-6 text-gray-700">
        An Interactive Web-Based Teaching Tool for Learning Data Structures and Algorithms through Visualisation and Gamification
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Bubble Sort" description="Introduction to Artificial Intelligence." link="/lesson/bubble" />
        <Card title="Merge Sort" description="Learn how to analyze and visualize data." link="/lesson/merge" />
        <Card title="Quick Sort" description="Problem solving with algorithms and efficiency." link="/lesson/quick" />
      </div>
    </Layout>
  );
}
