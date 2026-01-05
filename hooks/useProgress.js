import { useSession } from "next-auth/react";
import { useState, useCallback, useRef } from "react";

export function useProgress() {
  const { data: session } = useSession();
  const [isTracking, setIsTracking] = useState(false);
  const startTimeRef = useRef(null);

  const startTracking = useCallback(() => {
    if (session) {
      startTimeRef.current = Date.now();
      setIsTracking(true);
    }
  }, [session]);

  const updateProgress = useCallback(
    async (lessonId, options = {}) => {
      if (!session) {
        return { success: false, error: "Not authenticated" };
      }

      const { completed = false, score = 0 } = options;
      let timeSpent = 0;

      if (startTimeRef.current) {
        timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      }

      try {
        const response = await fetch("/api/progress/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId,
            completed,
            score,
            timeSpent,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { success: false, error: data.error };
        }

        return { success: true, data: data.progress };
      } catch (error) {
        console.error("Error updating progress:", error);
        return { success: false, error: "Failed to update progress" };
      }
    },
    [session]
  );

  return {
    isAuthenticated: !!session,
    startTracking,
    updateProgress,
    isTracking,
  };
}

