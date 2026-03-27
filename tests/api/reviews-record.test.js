import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth/next";
import { createMockRes, getJsonPayload } from "../utils/apiMocks.js";
import handler from "../../pages/api/reviews/record.js";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    reviewCard: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("POST /api/reviews/record", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockReset();
    prismaMock.reviewCard.findUnique.mockReset();
    prismaMock.reviewCard.create.mockReset();
    prismaMock.reviewCard.update.mockReset();
  });

  it("returns 405 for non-POST", async () => {
    const req = { method: "GET", body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("returns 401 without session", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = { method: "POST", body: { lessonId: "bubble", quality: 4 } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 when lessonId or quality missing", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    const req = { method: "POST", body: { lessonId: "bubble" } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when quality out of range", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    const req = { method: "POST", body: { lessonId: "bubble", quality: 6 } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates card if missing then updates with SM-2 result", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.reviewCard.findUnique.mockResolvedValue(null);
    prismaMock.reviewCard.create.mockResolvedValue({
      id: "card1",
      userId: "u1",
      lessonId: "bubble",
      repetitions: 0,
      easiness: 2.5,
      interval: 1,
      qualityHistory: "[]",
    });
    prismaMock.reviewCard.update.mockResolvedValue({});

    const req = { method: "POST", body: { lessonId: "bubble", quality: 4 } };
    const res = createMockRes();
    await handler(req, res);

    expect(prismaMock.reviewCard.create).toHaveBeenCalled();
    expect(prismaMock.reviewCard.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(getJsonPayload(res).success).toBe(true);
  });

  it("updates existing card", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.reviewCard.findUnique.mockResolvedValue({
      id: "card1",
      userId: "u1",
      lessonId: "bubble",
      repetitions: 0,
      easiness: 2.5,
      interval: 1,
      qualityHistory: "[]",
    });
    prismaMock.reviewCard.update.mockResolvedValue({});

    const req = { method: "POST", body: { lessonId: "bubble", quality: 3 } };
    const res = createMockRes();
    await handler(req, res);

    expect(prismaMock.reviewCard.create).not.toHaveBeenCalled();
    expect(prismaMock.reviewCard.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
