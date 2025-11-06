import { useState } from "react";
import Layout from "../components/Layout";

export default function Quiz() {
  const [currentTopic, setCurrentTopic] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const quizzes = {
    ai: {
      question: "Which of these is an example of supervised learning?",
      options: [
        { id: "A", text: "Classifying emails as spam or not spam" },
        { id: "B", text: "Finding groups of customers based on purchases" }
      ],
      correctAnswer: "A"
    },
    "data-science": {
      question: "What is the primary purpose of data cleaning?",
      options: [
        { id: "A", text: "To make the data look pretty" },
        { id: "B", text: "To remove errors and inconsistencies in the data" }
      ],
      correctAnswer: "B"
    },
    algorithms: {
      question: "What is the time complexity of binary search?",
      options: [
        { id: "A", text: "O(n)" },
        { id: "B", text: "O(log n)" }
      ],
      correctAnswer: "B"
    }
  };

  const handleTopicSelect = (topic) => {
    setCurrentTopic(topic);
    setAnswer(null);
    setSubmitted(false);
  };

  const handleSubmit = () => setSubmitted(true);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Lesson Quizzes</h1>
      
      {!currentTopic ? (
        <div className="space-y-4">
          <h2 className="text-xl mb-4">Select a topic:</h2>
          <button
            onClick={() => handleTopicSelect("ai")}
            className="block w-full text-left p-4 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            AI Basics
          </button>
          <button
            onClick={() => handleTopicSelect("data-science")}
            className="block w-full text-left p-4 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Data Science
          </button>
          <button
            onClick={() => handleTopicSelect("algorithms")}
            className="block w-full text-left p-4 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Algorithms
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setCurrentTopic(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to topics
          </button>
          
          <p className="mb-4">{quizzes[currentTopic].question}</p>

          <div className="space-y-2">
            {quizzes[currentTopic].options.map((option) => (
              <button
                key={option.id}
                onClick={() => setAnswer(option.id)}
                className={`block w-full text-left p-3 rounded-lg border ${
                  answer === option.id ? "bg-blue-100 border-blue-400" : "border-gray-300"
                }`}
              >
                {option.id}) {option.text}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!answer}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Submit
          </button>

          {submitted && (
            <p className="mt-4 font-semibold">
              {answer === quizzes[currentTopic].correctAnswer 
                ? "✅ Correct!" 
                : "❌ Incorrect. Try again!"}
            </p>
          )}
        </div>
      )}
    </Layout>
  );
}
