import { describe, it, expect, vi, beforeEach } from "vitest";
import { getServerSession } from "next-auth/next";
import { createMockRes, getJsonPayload } from "../utils/apiMocks.js";
import handler from "../../pages/api/progress/get.js";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

describe("GET /api/progress/get", () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockReset();
    prismaMock.user.findUnique.mockReset();
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

  it("returns user and progress", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      username: "alice",
      level: 2,
      xp: 400,
      progress: [{ lessonId: "bubble", completed: true }],
    });

    const req = { method: "GET" };
    const res = createMockRes();
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = getJsonPayload(res);
    expect(body.user.username).toBe("alice");
    expect(body.user.level).toBe(2);
    expect(body.progress).toHaveLength(1);
  });

  it("returns 404 when user missing", async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "u1" } });
    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = { method: "GET" };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
