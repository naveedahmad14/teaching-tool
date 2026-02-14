import { useEffect, useRef, useState } from "react";
import { useProgress } from "../hooks/useProgress";

export default function ProgressTracker({ lessonId }) {
  const {
    isAuthenticated,
    startTracking,
    updateProgress,
    getTimeSpentSeconds,
    lastSaved,
    saveError,
  } = useProgress();

  const hasTrackedView = useRef(false);
  const [timeSpentDisplay, setTimeSpentDisplay] = useState(0);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !lessonId) return;
    startTracking();
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      updateProgress(lessonId, { completed: false }).then((r) => {
        if (r?.success) setShowSavedToast(true);
      });
    }
  }, [isAuthenticated, lessonId, startTracking, updateProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpentDisplay(getTimeSpentSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, [getTimeSpentSeconds]);

  useEffect(() => {
    if (!lessonId || !isAuthenticated) return;
    return () => {
      const seconds = getTimeSpentSeconds();
      if (seconds > 0) {
        fetch("/api/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            timeSpent: seconds,
            completed: false,
          }),
        }).catch(() => {});
      }
    };
  }, [lessonId, isAuthenticated, getTimeSpentSeconds]);

  useEffect(() => {
    if (!showSavedToast) return;
    const t = setTimeout(() => setShowSavedToast(false), 3000);
    return () => clearTimeout(t);
  }, [showSavedToast]);

  const handleMarkComplete = async () => {
    if (!lessonId || !isAuthenticated) return;
    setMarkingComplete(true);
    const result = await updateProgress(lessonId, {
      completed: true,
      incrementAttempts: true,
    });
    setMarkingComplete(false);
    if (result?.success) setShowSavedToast(true);
  };

  if (!isAuthenticated) return null;

  const minutes = Math.floor(timeSpentDisplay / 60);
  const seconds = timeSpentDisplay % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-4 bg-[#16213E]/80 border-b border-[#625EC6]/40 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-[#C0C0C0]">
            Time on lesson: <strong className="text-[#E8E8E8]">{timeStr}</strong>
          </span>
          {saveError && (
            <span className="text-red-400 text-xs" role="alert">
              {saveError}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleMarkComplete}
          disabled={markingComplete}
          className="px-4 py-1.5 rounded-lg bg-[#625EC6] text-white font-medium hover:bg-[#7B75D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
        >
          {markingComplete ? "Saving…" : "Mark as Complete"}
        </button>
      </div>

      {showSavedToast && (
        <div
          className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg bg-[#4CAF50] text-white font-medium shadow-lg"
          role="status"
          aria-live="polite"
        >
          Progress saved
        </div>
      )}
    </>
  );
}
