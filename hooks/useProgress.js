import { useSession } from "next-auth/react";
import { useState, useCallback, useRef, useEffect } from "react";

export function useProgress() {
  const { data: session } = useSession();
  const [isTracking, setIsTracking] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  const startTracking = useCallback(() => {
    if (session && !startTimeRef.current) {
      startTimeRef.current = Date.now();
      setIsTracking(true);
      if (typeof window !== "undefined" && window.__ALGOQUEST_DEBUG__) {
        console.log("[useProgress] startTracking", { userId: session.user?.id });
      }
    }
  }, [session]);

  const getTimeSpentSeconds = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  const updateProgress = useCallback(
    async (lessonId, options = {}) => {
      if (!session?.user?.id) {
        if (typeof window !== "undefined" && window.__ALGOQUEST_DEBUG__) {
          console.log("[useProgress] updateProgress skipped: not authenticated");
        }
        setSaveError("Not authenticated");
        return { success: false, error: "Not authenticated" };
      }

      if (!lessonId) {
        if (typeof window !== "undefined" && window.__ALGOQUEST_DEBUG__) {
          console.log("[useProgress] updateProgress skipped: no lessonId");
        }
        return { success: false, error: "Lesson ID required" };
      }

      const { completed = false, score, incrementAttempts } = options;
      const timeSpent = getTimeSpentSeconds();

      const body = {
        lessonId: String(lessonId),
        completed: Boolean(completed),
        timeSpent,
      };
      if (score !== undefined) body.score = Math.max(0, Math.min(100, Number(score)));
      if (incrementAttempts !== undefined) body.incrementAttempts = Boolean(incrementAttempts);

      if (typeof window !== "undefined" && window.__ALGOQUEST_DEBUG__) {
        console.log("[useProgress] updateProgress calling API", { lessonId, body });
      }

      try {
        const response = await fetch("/api/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("[useProgress] Progress update failed:", response.status, data);
          setSaveError(data?.error || "Update failed");
          return { success: false, error: data?.error };
        }

        setLastSaved(Date.now());
        setSaveError(null);
        if (typeof window !== "undefined" && window.__ALGOQUEST_DEBUG__) {
          console.log("[useProgress] Progress updated successfully", data.progress);
        }
        return { success: true, data: data.progress };
      } catch (error) {
        console.error("[useProgress] Progress update error:", error);
        setSaveError("Network error");
        return { success: false, error: "Failed to update progress" };
      }
    },
    [session, getTimeSpentSeconds]
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
