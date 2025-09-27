import { useState } from "react";
import Layout from "../components/Layout";

export default function Quiz() {
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Quick Quiz</h1>
      <p className="mb-4">Which of these is an example of supervised learning?</p>

      <div className="space-y-2">
        <button
          onClick={() => setAnswer("A")}
          className={`block w-full text-left p-3 rounded-lg border ${
            answer === "A" ? "bg-blue-100 border-blue-400" : "border-gray-300"
          }`}
        >
          A) Classifying emails as spam or not spam
        </button>

        <button
          onClick={() => setAnswer("B")}
          className={`block w-full text-left p-3 rounded-lg border ${
            answer === "B" ? "bg-blue-100 border-blue-400" : "border-gray-300"
          }`}
        >
          B) Finding groups of customers based on purchases
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Submit
      </button>

      {submitted && (
        <p className="mt-4 font-semibold">
          {answer === "A" ? "✅ Correct! That's supervised learning." : "❌ Not quite. That's unsupervised learning."}
        </p>
      )}
    </Layout>
  );
}
