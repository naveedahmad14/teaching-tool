import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth/next";
import { createMockRes, getJsonPayload } from "../utils/apiMocks.js";
import handler from "../../pages/api/reviews/due.js";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    reviewCard: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("GET /api/reviews/due", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockReset();
    prismaMock.reviewCard.findMany.mockReset();
  });

  it("returns 405 for non-GET", async () => {
    const req = { method: "POST" };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("returns 401 without session", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = { method: "GET" };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns due cards with lesson names and review content", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    const past = new Date(Date.now() - 1000);
    prismaMock.reviewCard.findMany.mockResolvedValue([
      { id: "c1", lessonId: "bubble", nextReviewDate: past },
    ]);

    const req = { method: "GET" };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = getJsonPayload(res);
    expect(body.cards).toHaveLength(1);
    expect(body.cards[0].lesson.name).toBe("Bubble Sort");
    expect(body.cards[0].lesson.summary).toContain("Bubble");
  });
});
