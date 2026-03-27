/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVisualization } from "@/hooks/useVisualization";

describe("useVisualization", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes speed, play, pause, reset, and sleep resolves after delay", async () => {
    const { result } = renderHook(() => useVisualization({ initialSpeed: 100 }));

    expect(result.current.speed).toBe(100);
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    let done = false;
    act(() => {
      result.current.sleep(50).then(() => {
        done = true;
      });
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60);
    });
    expect(done).toBe(true);

    act(() => {
      result.current.reset();
    });
    expect(result.current.isPlaying).toBe(false);
  });

  it("pause stops progression until play resumes", async () => {
    const { result } = renderHook(() => useVisualization({ initialSpeed: 500 }));

    act(() => {
      result.current.play();
    });

    let resolved = false;
    act(() => {
      result.current.sleep(100).then(() => {
        resolved = true;
      });
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(40);
    });
    expect(resolved).toBe(false);

    act(() => {
      result.current.pause();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(resolved).toBe(false);

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(resolved).toBe(true);
  });
});
