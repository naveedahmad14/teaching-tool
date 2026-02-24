import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import flashcardsData from "@/data/flashcards.json";

// Flatten all cards (question + tip) into one list with topic info
function buildCardList() {
  return flashcardsData.flatMap((topic) =>
    (topic.cards || []).map((card) => ({ ...topic, ...card }))
  );
}

export default function FlashcardsPage() {
  const allCards = useMemo(() => buildCardList(), []);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [topicFilter, setTopicFilter] = useState("all");

  const filteredCards = useMemo(() => {
    if (topicFilter === "all") return allCards;
    return allCards.filter((c) => c.id === topicFilter);
  }, [allCards, topicFilter]);

  const currentCard = filteredCards[index];
  const progress = filteredCards.length
    ? ((index + 1) / filteredCards.length) * 100
    : 0;

  const handleNext = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setIndex((i) => (i - 1 + filteredCards.length) % filteredCards.length);
  };

  if (filteredCards.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-[#FFD700]">
            Active recall
          </h1>
          <p className="text-[#E8E8E8]">
            No flashcards available for this topic. Choose &quot;All topics&quot; to see all tips.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2 text-[#FFD700]">
          Active recall
        </h1>
        <p className="text-[#C0C0C0] mb-6">
          Same tips as in quiz feedback. Try to recall before revealing the answer.
        </p>

        {/* Topic filter */}
        <div className="mb-6">
          <label htmlFor="topic-filter" className="block text-sm font-medium text-[#E8E8E8] mb-2">
            Topic
          </label>
          <select
            id="topic-filter"
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setIndex(0);
              setShowAnswer(false);
            }}
            className="w-full max-w-xs px-4 py-2 bg-[#0F3460] border-2 border-[#625EC6] rounded-lg text-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            aria-label="Filter by topic"
          >
            <option value="all">All topics</option>
            {flashcardsData.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[#E8E8E8] mb-2">
            <span>Card {index + 1} of {filteredCards.length}</span>
          </div>
          <div
            className="w-full bg-[#0F3460] rounded-full h-2"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Card ${index + 1} of ${filteredCards.length}`}
          >
            <div
              className="bg-[#625EC6] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${index}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0F3460] rounded-xl shadow-lg p-8 border-2 border-[#625EC6]"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#625EC6]/40 text-[#E8E8E8]">
                {currentCard.name}
              </span>
            </div>

            {!showAnswer ? (
              <>
                <p className="text-lg text-[#E8E8E8] mb-6 leading-relaxed">
                  {currentCard.question}
                </p>
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#4A46A8] focus:outline-none focus:ring-4 focus:ring-[#FFD700] transition-colors"
                  aria-label="Show answer"
                >
                  Show answer
                </button>
              </>
            ) : (
              <>
                <div className="bg-[#1A1A2E] p-4 rounded-lg mb-6 text-[#E8E8E8] border-l-4 border-[#7B77E8]">
                  <p className="text-[#E8E8E8] leading-relaxed font-medium">
                    {currentCard.tip}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#FFD700] text-[#1A1A2E] rounded-lg font-semibold hover:bg-[#FFE55C] focus:outline-none focus:ring-4 focus:ring-[#625EC6] transition-colors"
                    aria-label="Next card"
                  >
                    Next
                  </button>
                  <Link
                    href={currentCard.lessonLink}
                    className="text-sm text-[#7B77E8] hover:text-[#FFD700] underline focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded"
                  >
                    Open lesson →
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next when answer is shown - optional nav */}
        {showAnswer && filteredCards.length > 1 && (
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handlePrev}
              className="text-sm text-[#C0C0C0] hover:text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
              aria-label="Previous card"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="text-sm text-[#C0C0C0] hover:text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700] rounded px-2 py-1"
              aria-label="Next card"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
