/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useProgress } from "@/hooks/useProgress";

const updateSession = vi.fn(() => Promise.resolve());

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("useProgress", () => {
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
      update: updateSession,
    });
    updateSession.mockClear();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ progress: { id: "p1" } }),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns not authenticated when no user id", () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: updateSession });
    const { result } = renderHook(() => useProgress());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("updateProgress returns error when lessonId missing", async () => {
    const { result } = renderHook(() => useProgress());
    let out;
    await act(async () => {
      out = await result.current.updateProgress(null);
    });
    expect(out).toEqual({ success: false, error: "Lesson ID required" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("updateProgress posts to API and refreshes session on success", async () => {
    const { result } = renderHook(() => useProgress());
    let out;
    await act(async () => {
      out = await result.current.updateProgress("bubble", { completed: true, score: 100 });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/progress/update",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.lessonId).toBe("bubble");
    expect(body.completed).toBe(true);
    expect(body.score).toBe(100);
    expect(out.success).toBe(true);
    expect(updateSession).toHaveBeenCalled();
  });

  it("sets saveError when API returns error", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Bad request" }),
      })
    );
    const { result } = renderHook(() => useProgress());
    await act(async () => {
      await result.current.updateProgress("bubble");
    });
    await waitFor(() => {
      expect(result.current.saveError).toBe("Bad request");
    });
  });
});
