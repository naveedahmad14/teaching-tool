import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">About AlgoQuest</h1>
      <div className="max-w-3xl">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
              AlgoQuest: An Interactive Web-Based Teaching Tool for Learning Data Structures and Algorithms through Visualisation and Gamification
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Interactive coding lessons</li>
            <li>Practice exercises and quizzes</li>
            <li>Real-world programming examples</li>
            <li>Comprehensive learning paths</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have questions or suggestions? Email us at{" "}
            <a
              href="mailto:contact@csteachingtool.com"
              className="text-blue-600 hover:underline"
            >
              contact@csteachingtool.com
            </a>
          </p>
        </section>
      </div>
    </Layout>
  );
}