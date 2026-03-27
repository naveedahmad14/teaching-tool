import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth/next";
import { createMockRes, getJsonPayload } from "../utils/apiMocks.js";
import handler from "../../pages/api/leaderboard.js";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("GET /api/leaderboard", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockReset();
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.findMany.mockReset();
    prismaMock.user.count.mockReset();
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

  it("returns ordered top users and current user rank", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u11" } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u11",
      username: "zoe",
      xp: 300,
      level: 1,
    });
    prismaMock.user.findMany.mockResolvedValue([
      { id: "u1", username: "amy", xp: 1200, level: 3 },
      { id: "u2", username: "ben", xp: 1000, level: 3 },
      { id: "u3", username: "cal", xp: 900, level: 2 },
      { id: "u4", username: "dan", xp: 800, level: 2 },
      { id: "u5", username: "eve", xp: 700, level: 2 },
      { id: "u6", username: "fox", xp: 600, level: 2 },
      { id: "u7", username: "gia", xp: 500, level: 2 },
      { id: "u8", username: "hal", xp: 450, level: 1 },
      { id: "u9", username: "ian", xp: 400, level: 1 },
      { id: "u10", username: "jay", xp: 350, level: 1 },
    ]);
    prismaMock.user.count.mockResolvedValue(10);

    const req = { method: "GET" };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = getJsonPayload(res);
    expect(body.topUsers).toHaveLength(10);
    expect(body.topUsers[0]).toMatchObject({ rank: 1, username: "amy" });
    expect(body.topUsers[9]).toMatchObject({ rank: 10, username: "jay" });
    expect(body.currentUserRank).toBe(11);
    expect(body.isCurrentUserInTop10).toBe(false);
  });

  it("marks current user inside top 10", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u2" } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u2",
      username: "ben",
      xp: 1000,
      level: 3,
    });
    prismaMock.user.findMany.mockResolvedValue([
      { id: "u1", username: "amy", xp: 1200, level: 3 },
      { id: "u2", username: "ben", xp: 1000, level: 3 },
    ]);
    prismaMock.user.count.mockResolvedValue(1);

    const req = { method: "GET" };
    const res = createMockRes();
    await handler(req, res);

    const body = getJsonPayload(res);
    expect(body.currentUserRank).toBe(2);
    expect(body.isCurrentUserInTop10).toBe(true);
    expect(body.topUsers[1].isCurrentUser).toBe(true);
  });
});
