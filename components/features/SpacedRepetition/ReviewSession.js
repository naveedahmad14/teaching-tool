"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewSession() {
  const [dueCards, setDueCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchDue() {
      try {
        const res = await fetch("/api/reviews/due");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        if (!cancelled) setDueCards(data.cards || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDue();
    return () => { cancelled = true; };
  }, []);

  const handleQualityRating = async (quality) => {
    const card = dueCards[currentIndex];
    if (!card) return;

    try {
      const res = await fetch("/api/reviews/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: card.lessonId, quality }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
    } catch (e) {
      setError(e.message);
      return;
    }

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
    } else {
      setDueCards([]);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-[#E8E8E8]" role="status" aria-live="polite">
        Loading reviews…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-500 rounded-xl text-red-200" role="alert">
        {error}
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">All caught up</h2>
        <p className="text-[#E8E8E8]">No reviews due today. Come back tomorrow.</p>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];
  const progress = ((currentIndex + 1) / dueCards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-[#E8E8E8] mb-2">
          <span>Review progress</span>
          <span>{currentIndex + 1} / {dueCards.length}</span>
        </div>
        <div
          className="w-full bg-[#0F3460] rounded-full h-2"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Review ${currentIndex + 1} of ${dueCards.length}`}
        >
          <div
            className="bg-[#625EC6] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.2 }}
          className="bg-[#0F3460] rounded-xl shadow-lg p-8 border-2 border-[#625EC6]"
        >
          <h3 className="text-xl font-bold mb-4 text-[#FFD700]">
            Review: {currentCard.lesson?.name || currentCard.lessonId}
          </h3>

          <p className="text-lg mb-4 text-[#E8E8E8]">
            Can you explain how {currentCard.lesson?.name || currentCard.lessonId} works?
          </p>

          {!showAnswer ? (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#4A46A8] focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
              aria-label="Show answer"
            >
              Show answer
            </button>
          ) : (
            <div className="bg-[#1A1A2E] p-4 rounded-lg mb-6 text-[#E8E8E8]">
              <p>Review the lesson content in your mind, then rate how well you remembered below.</p>
            </div>
          )}

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <p className="font-semibold mb-3 text-[#E8E8E8]">How well did you remember?</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleQualityRating(0)}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Forgot"
                >
                  Forgot
                </button>
                <button
                  type="button"
                  onClick={() => handleQualityRating(3)}
                  className="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Difficult"
                >
                  Difficult
                </button>
                <button
                  type="button"
                  onClick={() => handleQualityRating(5)}
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Easy"
                >
                  Easy
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
