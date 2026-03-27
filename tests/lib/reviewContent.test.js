import { describe, it, expect } from "vitest";
import { getReviewContent } from "@/lib/reviewContent";

describe("getReviewContent", () => {
  it("returns null for missing or unknown lesson", () => {
    expect(getReviewContent(null)).toBeNull();
    expect(getReviewContent("")).toBeNull();
    expect(getReviewContent("unknown-lesson")).toBeNull();
  });

  it("returns summary and tip for each core lesson id", () => {
    const ids = [
      "linear",
      "binary",
      "bubble",
      "merge",
      "quick",
      "twopointers",
      "slidingwindow",
      "hashmaps",
      "linkedlists",
      "stacks",
    ];
    for (const id of ids) {
      const c = getReviewContent(id);
      expect(c, id).not.toBeNull();
      expect(c.summary.length).toBeGreaterThan(10);
      expect(c.tip.length).toBeGreaterThan(5);
    }
  });
});
