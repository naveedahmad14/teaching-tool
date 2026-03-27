import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth/next";
import { createMockRes, getJsonPayload } from "../utils/apiMocks.js";
import handler from "../../pages/api/progress/update.js";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    lessonProgress: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    reviewCard: { upsert: vi.fn() },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("POST /api/progress/update", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockReset();
    Object.values(prismaMock.user).forEach((fn) => fn.mockReset());
    Object.values(prismaMock.lessonProgress).forEach((fn) => fn.mockReset());
    prismaMock.reviewCard.upsert.mockReset();
  });

  it("returns 405 for non-POST", async () => {
    const req = { method: "GET", body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(getJsonPayload(res).error).toBe("Method not allowed");
  });

  it("returns 401 without session", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = { method: "POST", body: { lessonId: "bubble" } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 when lessonId missing", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    const req = { method: "POST", body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("quizXpOnly: awards XP from correctCount/totalQuestions", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", xp: 100, level: 1 });
    prismaMock.user.update.mockResolvedValue({});

    const req = {
      method: "POST",
      body: {
        lessonId: "bubble",
        quizXpOnly: true,
        correctCount: 10,
        totalQuestions: 15,
        difficulty: "easy",
      },
    };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = getJsonPayload(res);
    expect(body.progress.xpGain).toBeGreaterThan(0);
    expect(body.progress.xp).toBe(100 + body.progress.xpGain);
    expect(prismaMock.user.update).toHaveBeenCalled();
  });

  it("quizXpOnly: returns 400 when XP payload invalid", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", xp: 0, level: 1 });

    const req = {
      method: "POST",
      body: { lessonId: "bubble", quizXpOnly: true },
    };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates lesson progress when none exists", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.lessonProgress.findUnique.mockResolvedValue(null);
    prismaMock.lessonProgress.create.mockResolvedValue({
      id: "p1",
      lessonId: "bubble",
      completed: false,
      score: 0,
      timeSpent: 0,
      attempts: 0,
    });

    const req = {
      method: "POST",
      body: { lessonId: "bubble", completed: false, timeSpent: 30 },
    };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaMock.lessonProgress.create).toHaveBeenCalled();
  });

  it("updates existing lesson progress", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.lessonProgress.findUnique.mockResolvedValue({
      id: "p1",
      completed: false,
      score: 40,
      timeSpent: 10,
      attempts: 1,
    });
    prismaMock.lessonProgress.update.mockResolvedValue({ id: "p1" });

    const req = {
      method: "POST",
      body: { lessonId: "bubble", completed: false, timeSpent: 5, score: 80 },
    };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaMock.lessonProgress.update).toHaveBeenCalled();
  });

  it("on first completion, updates user XP and upserts review card", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.lessonProgress.findUnique.mockResolvedValue({
      id: "p1",
      completed: false,
      score: 0,
      timeSpent: 0,
      attempts: 0,
    });
    prismaMock.lessonProgress.update.mockResolvedValue({ id: "p1", completed: true });
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", xp: 0, level: 1 });
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.reviewCard.upsert.mockResolvedValue({});

    const req = {
      method: "POST",
      body: { lessonId: "bubble", completed: true, score: 100, difficulty: "easy" },
    };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaMock.user.update).toHaveBeenCalled();
    expect(prismaMock.reviewCard.upsert).toHaveBeenCalled();
  });
});
