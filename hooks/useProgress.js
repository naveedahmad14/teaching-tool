import { useSession } from "next-auth/react";
import { useState, useCallback, useRef } from "react";

export function useProgress() {
  const { data: session, update: updateSession } = useSession();
  const [isTracking, setIsTracking] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  const startTracking = useCallback(() => {
    if (!session || startTimeRef.current) return;
    startTimeRef.current = Date.now();
    setIsTracking(true);
  }, [session]);

  const getTimeSpentSeconds = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  const updateProgress = useCallback(
    async (lessonId, options = {}) => {
      if (!session?.user?.id) {
        setSaveError("Not authenticated");
        return { success: false, error: "Not authenticated" };
      }

      if (!lessonId) {
        return { success: false, error: "Lesson ID required" };
      }

      const { completed = false, score, incrementAttempts } = options;
      const body = {
        lessonId: String(lessonId),
        completed: Boolean(completed),
        timeSpent: getTimeSpentSeconds(),
      };
      if (score !== undefined) body.score = Math.max(0, Math.min(100, Number(score)));
      if (incrementAttempts !== undefined) body.incrementAttempts = Boolean(incrementAttempts);

      try {
        const response = await fetch("/api/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          const message = data?.error || "Update failed";
          setSaveError(message);
          return { success: false, error: data?.error };
        }

        setLastSaved(Date.now());
        setSaveError(null);
        try {
          await updateSession();
        } catch {
          /* navbar refreshes on next session poll / focus */
        }
        return { success: true, data: data.progress };
      } catch {
        setSaveError("Network error");
        return { success: false, error: "Failed to update progress" };
      }
    },
    [session, getTimeSpentSeconds, updateSession]
  );

  return {
    isAuthenticated: !!session?.user?.id,
    isTracking,
    startTracking,
    updateProgress,
    getTimeSpentSeconds,
    lastSaved,
    saveError,
  };
}
