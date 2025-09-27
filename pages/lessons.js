import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Lessons() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">All Lessons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="AI Basics" description="Start learning AI." link="/lesson/ai" />
        <Card title="Data Science" description="Work with data and ML models." link="/lesson/data-science" />
        <Card title="Algorithms" description="Dive into algorithms." link="/lesson/algorithms" />
      </div>
    </Layout>
  );
}
