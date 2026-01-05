import { useEffect, useRef } from "react";
import { useProgress } from "../hooks/useProgress";

export default function ProgressTracker({ lessonId, onComplete, score }) {
  const { isAuthenticated, startTracking, updateProgress } = useProgress();
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (isAuthenticated && lessonId && !hasTrackedView.current) {
      startTracking();
      // Track initial page view
      updateProgress(lessonId, { completed: false, score: 0 });
      hasTrackedView.current = true;
    }
  }, [isAuthenticated, lessonId, startTracking, updateProgress]);

  useEffect(() => {
    if (onComplete && isAuthenticated && lessonId) {
      updateProgress(lessonId, {
        completed: true,
        score: score || 0,
      });
    }
  }, [onComplete, isAuthenticated, lessonId, score, updateProgress]);

  return null; // This component doesn't render anything
}

