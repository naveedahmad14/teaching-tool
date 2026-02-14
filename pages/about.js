import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-[#FFD700]">About AlgoQuest</h1>
      <div className="max-w-3xl">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#E8E8E8]">Our Mission</h2>
          <p className="text-[#C0C0C0] mb-4 text-base">
              AlgoQuest: An Interactive Web-Based Teaching Tool for Learning Data Structures and Algorithms through Visualisation and Gamification
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#E8E8E8]">What We Offer</h2>
          <ul className="list-disc list-inside text-[#C0C0C0] space-y-2 text-base">
            <li>Interactive coding lessons</li>
            <li>Practice exercises and quizzes</li>
            <li>Real-world programming examples</li>
            <li>Comprehensive learning paths</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#E8E8E8]">Contact Us</h2>
          <p className="text-[#C0C0C0] text-base">
            Have questions or suggestions? Email us at{" "}
            <a
              href="mailto:contact@csteachingtool.com"
              className="text-[#7B77E8] hover:text-[#FFD700] underline"
            >
              contact@csteachingtool.com
            </a>
          </p>
        </section>
      </div>
    </Layout>
  );
}