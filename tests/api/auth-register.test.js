import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { createMockRes, getJsonPayload } from "../utils/apiMocks.js";
import handler from "../../pages/api/auth/register.js";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(() => Promise.resolve("hashed-password")),
  },
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.create.mockReset();
    vi.mocked(bcrypt.hash).mockClear();
  });

  it("returns 405 for non-POST", async () => {
    const req = { method: "GET", body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("returns 400 when username or password missing", async () => {
    const req = { method: "POST", body: { username: "ab" } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when username too short", async () => {
    const req = { method: "POST", body: { username: "ab", password: "secret1" } };
    const res = createMockRes();
    await handler(req, res);
    expect(getJsonPayload(res).error).toMatch(/Username/);
  });

  it("returns 400 when password too short", async () => {
    const req = { method: "POST", body: { username: "alice", password: "12345" } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when username exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "x" });
    const req = { method: "POST", body: { username: "alice", password: "secret12" } };
    const res = createMockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(getJsonPayload(res).error).toMatch(/exists/);
  });

  it("creates user and returns 201", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: "newid",
      username: "alice",
      level: 1,
      xp: 0,
    });

    const req = { method: "POST", body: { username: "alice", password: "secret12" } };
    const res = createMockRes();
    await handler(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("secret12", 12);
    expect(prismaMock.user.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    const body = getJsonPayload(res);
    expect(body.user.username).toBe("alice");
  });
});
