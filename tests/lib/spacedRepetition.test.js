import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  calculateNextReview,
  getDueCards,
  createReviewCard,
} from "@/lib/spacedRepetition";

describe("calculateNextReview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("throws when quality is out of range", () => {
    expect(() => calculateNextReview({}, -1)).toThrow(/Quality must be between 0 and 5/);
    expect(() => calculateNextReview({}, 6)).toThrow(/Quality must be between 0 and 5/);
  });

  it("resets repetitions and interval on quality < 3", () => {
    const card = { repetitions: 5, easiness: 2.5, interval: 10 };
    const out = calculateNextReview(card, 2);
    expect(out.repetitions).toBe(0);
    expect(out.interval).toBe(1);
  });

  it("first successful review (quality 3) sets repetitions to 1 and interval to 1", () => {
    const out = calculateNextReview({ repetitions: 0, easiness: 2.5, interval: 1 }, 3);
    expect(out.repetitions).toBe(1);
    expect(out.interval).toBe(1);
  });

  it("second successful review uses interval 6", () => {
    const out = calculateNextReview({ repetitions: 1, easiness: 2.5, interval: 1 }, 4);
    expect(out.repetitions).toBe(2);
    expect(out.interval).toBe(6);
  });

  it("appends quality to history", () => {
    const out = calculateNextReview({ repetitions: 0, easiness: 2.5, interval: 1, qualityHistory: [] }, 5);
    expect(out.qualityHistory).toHaveLength(1);
    expect(out.qualityHistory[0].quality).toBe(5);
    expect(out.qualityHistory[0].date).toMatch(/^\d{4}-/);
  });

  it("sets nextReviewDate interval days ahead", () => {
    const out = calculateNextReview({ repetitions: 0, easiness: 2.5, interval: 1 }, 3);
    const expected = new Date("2025-06-15T12:00:00.000Z");
    expected.setDate(expected.getDate() + out.interval);
    expect(out.nextReviewDate.getTime()).toBe(expected.getTime());
  });
});

describe("getDueCards", () => {
  it("returns only cards with nextReviewDate <= now", () => {
    const past = new Date(Date.now() - 86400000);
    const future = new Date(Date.now() + 86400000);
    const cards = [
      { id: "a", nextReviewDate: past },
      { id: "b", nextReviewDate: future },
      { id: "c", nextReviewDate: new Date() },
    ];
    const due = getDueCards(cards);
    expect(due.map((c) => c.id).sort()).toEqual(["a", "c"]);
  });

  it("accepts ISO date strings", () => {
    const past = new Date(Date.now() - 1000).toISOString();
    const due = getDueCards([{ nextReviewDate: past }]);
    expect(due).toHaveLength(1);
  });
});

describe("createReviewCard", () => {
  it("returns initial shape for a lesson", () => {
    const c = createReviewCard("bubble");
    expect(c.lessonId).toBe("bubble");
    expect(c.repetitions).toBe(0);
    expect(c.easiness).toBe(2.5);
    expect(c.interval).toBe(1);
    expect(c.lastReviewed).toBeNull();
    expect(c.qualityHistory).toEqual([]);
  });
});
