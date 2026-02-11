/**
 * SM-2 Algorithm for Spaced Repetition (SuperMemo 2).
 * Quality ratings: 0 = complete blackout, 1–2 = incorrect, 3 = correct with difficulty,
 * 4 = correct after hesitation, 5 = perfect.
 */

const MIN_EASINESS = 1.3;

/**
 * Calculate next review date and updated card state after a quality rating.
 * @param {Object} card - { repetitions, easiness, interval, qualityHistory?, ... }
 * @param {number} quality - 0–5
 * @returns {Object} Updated card fields: repetitions, easiness, interval, nextReviewDate, lastReviewed, qualityHistory
 */
export function calculateNextReview(card, quality) {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5");
  }

  let { repetitions = 0, easiness = 2.5, interval = 1 } = card;
  const history = Array.isArray(card.qualityHistory) ? card.qualityHistory : [];

  easiness = Math.max(
    MIN_EASINESS,
    easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  const qualityHistory = [
    ...history,
    { quality, date: new Date().toISOString() },
  ];

  return {
    repetitions,
    easiness,
    interval,
    nextReviewDate,
    lastReviewed: new Date(),
    qualityHistory,
  };
}

/**
 * Filter cards that are due for review (nextReviewDate <= now).
 * @param {Array<{ nextReviewDate: Date | string }>} cards
 * @returns {Array} Cards due
 */
export function getDueCards(cards) {
  const now = new Date();
  return cards.filter((card) => new Date(card.nextReviewDate) <= now);
}

/**
 * Create initial review card for a lesson (due immediately).
 * @param {string} lessonId
 * @returns {Object} Initial card shape
 */
export function createReviewCard(lessonId) {
  return {
    lessonId,
    repetitions: 0,
    easiness: 2.5,
    interval: 1,
    nextReviewDate: new Date(),
    lastReviewed: null,
    qualityHistory: [],
  };
}
