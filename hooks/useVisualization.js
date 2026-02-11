import { useState, useRef, useCallback } from "react";

/**
 * Shared animation control logic for algorithm visualizers.
 * Provides cancellable and pausable sleep, plus play/pause/reset for UI.
 * Algorithm-specific state (array, comparing, swapping, etc.) stays in the visualizer.
 *
 * @param {Object} options
 * @param {boolean} options.initialSpeed - Initial speed in ms (default 500)
 * @returns {Object} { speed, setSpeed, isPlaying, isPaused, sleep, play, pause, reset, cancelRef, pausedRef }
 */
export function useVisualization(options = {}) {
  const { initialSpeed = 500 } = options;

  const [speed, setSpeed] = useState(initialSpeed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cancelRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseResumeRef = useRef(null);

  /**
   * Sleep for ms, respecting cancel and pause. Resolves immediately if cancelled.
   * When paused, waits until resume or cancel.
   */
  const sleep = useCallback(
    (ms) => {
      if (cancelRef.current) return Promise.resolve();

      return new Promise((resolve) => {
        const startTime = Date.now();
        let remaining = ms;
        let timeoutId = null;

        const tick = () => {
          if (cancelRef.current) {
            if (timeoutId) clearTimeout(timeoutId);
            resolve();
            return;
          }

          if (pausedRef.current) {
            pauseResumeRef.current = {
              resolve: () => {
                const elapsed = Date.now() - startTime;
                remaining = ms - elapsed;
                if (
                  remaining > 0 &&
                  !cancelRef.current &&
                  !pausedRef.current
                ) {
                  timeoutId = setTimeout(() => {
                    if (!cancelRef.current) resolve();
                  }, remaining);
                } else if (!pausedRef.current) {
                  resolve();
                }
              },
              startTime,
              remaining,
            };
            return;
          }

          const elapsed = Date.now() - startTime;
          remaining = ms - elapsed;

          if (remaining <= 0) {
            resolve();
          } else {
            timeoutId = setTimeout(tick, Math.min(remaining, 50));
          }
        };

        timeoutId = setTimeout(tick, Math.min(ms, 50));
        pauseResumeRef.current = {
          resolve,
          timeoutId,
          startTime,
          remaining: ms,
        };
      });
    },
    []
  );

  const play = useCallback(() => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setIsPaused(false);
      if (pauseResumeRef.current?.resolve) {
        pauseResumeRef.current.resolve();
        pauseResumeRef.current = null;
      }
    } else {
      cancelRef.current = false;
      pausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setIsPaused(true);
  }, []);

  const reset = useCallback(() => {
    cancelRef.current = true;
    pausedRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);

    if (pauseResumeRef.current?.timeoutId) {
      clearTimeout(pauseResumeRef.current.timeoutId);
    }
    if (pauseResumeRef.current?.resolve) {
      pauseResumeRef.current.resolve();
    }
    pauseResumeRef.current = null;
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    if (pauseResumeRef.current?.timeoutId) {
      clearTimeout(pauseResumeRef.current.timeoutId);
    }
    pauseResumeRef.current = null;
  }, []);

  return {
    speed,
    setSpeed,
    isPlaying,
    isPaused,
    sleep,
    play,
    pause,
    reset,
    stop,
    cancelRef,
    pausedRef,
  };
}
