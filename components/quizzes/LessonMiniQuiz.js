import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import lessonMiniQuizzes from "@/data/lessonMiniQuizzes.json";

export default function LessonMiniQuiz({ lessonId }) {
  const { isAuthenticated, updateProgress } = useProgress();

  const questions = useMemo(() => {
    if (!lessonId) return [];
    return lessonMiniQuizzes[lessonId] ?? [];
  }, [lessonId]);

  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionResults, setQuestionResults] = useState(() => []);

  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [lessonMarkedComplete, setLessonMarkedComplete] = useState(false);

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const correctCount = useMemo(() => {
    return questionResults.reduce((acc, r) => acc + (r?.correct ? 1 : 0), 0);
  }, [questionResults]);

  useEffect(() => {
    if (!isAuthenticated || !lessonId) return;

    let cancelled = false;
    fetch("/api/progress/get")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const p = (data?.progress || []).find((x) => x.lessonId === lessonId);
        setAlreadyCompleted(Boolean(p?.completed));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, lessonId]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowExplanation(false);
    setQuestionResults([]);
    setQuizComplete(false);
    setLessonMarkedComplete(false);
    setSubmissionError(null);
  }, [lessonId]);

  const currentQ = questions[currentIndex];

  const canAnswer = isAuthenticated && !quizComplete;

  const handleSelect = (optIndex) => {
    if (!canAnswer) return;
    if (!currentQ) return;
    if (showExplanation) return;

    const isCorrect = optIndex === currentQ.correctIndex;
    setSelectedIndex(optIndex);
    setShowExplanation(true);

    setQuestionResults((prev) => {
      const next = Array.isArray(prev) ? [...prev] : [];
      next[currentIndex] = { correct: isCorrect, selectedIndex: optIndex };
      return next;
    });
  };

  const handleNext = () => {
    if (!showExplanation) return;
    setSelectedIndex(null);
    setShowExplanation(false);
    setSubmissionError(null);

    const isLast = currentIndex >= total - 1;
    if (isLast) return;
    setCurrentIndex((i) => i + 1);
  };

  const handleFinish = async () => {
    if (!canAnswer) return;
    if (!showExplanation) return;
    if (!total) return;

    const answersFilled = questionResults.filter(Boolean).length >= total;
    if (!answersFilled) {
      setSubmissionError("Please answer all questions.");
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    const isAllCorrect = correctCount === total;
    const scorePctRounded = isAllCorrect ? 100 : Math.round((correctCount / total) * 100);

    const result = await updateProgress(lessonId, {
      completed: isAllCorrect,
      score: scorePctRounded,
      incrementAttempts: true,
    });

    if (result?.success) {
      setQuizComplete(true);
      setLessonMarkedComplete(isAllCorrect);
      if (isAllCorrect) setAlreadyCompleted(true);
    } else {
      setSubmissionError(result?.error || "Mini quiz update failed.");
    }
    setSubmitting(false);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowExplanation(false);
    setQuestionResults([]);
    setQuizComplete(false);
    setLessonMarkedComplete(false);
    setSubmissionError(null);
  };

  if (!total) return null;

  return (
    <div className="mt-10 game-card p-6 border-2 border-[#625EC6] bg-[#0F3460]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-[#E8E8E8] mb-1">Mini Quiz</h3>
          <p className="text-sm text-[#C0C0C0]">
            Answer {total} questions. Finish with 100% to complete the lesson.
          </p>
        </div>
        <div className="text-sm text-[#C0C0C0] whitespace-nowrap">
          {currentIndex + 1} / {total}
        </div>
      </div>

      {alreadyCompleted && (
        <div className="mb-4 p-3 rounded-lg border border-[#FFD700]/40 bg-[#16213E]">
          <p className="text-sm text-[#C0C0C0]">
            Lesson already completed — you can retake to earn more attempts.
          </p>
        </div>
      )}

      <div className="bg-[#16213E] rounded-lg border border-[#625EC6]/40 p-4 mb-4">
        <p className="text-[#E8E8E8] font-semibold">{currentQ?.question}</p>

        <div className="mt-4 space-y-2">
          {currentQ?.options?.map((opt, optIndex) => {
            const isSelected = selectedIndex === optIndex;
            const isCorrectOption = optIndex === currentQ.correctIndex;
            const show = showExplanation;

            const borderColor = !show
              ? "border-[#625EC6]/50"
              : isCorrectOption
              ? "border-[#4CAF50]/60"
              : isSelected
              ? "border-[#F44336]/60"
              : "border-[#625EC6]/30";

            const bgColor = !show
              ? "bg-[#16213E]"
              : isCorrectOption
              ? "bg-[#4CAF50]/20"
              : isSelected
              ? "bg-[#F44336]/20"
              : "bg-[#16213E]";

            return (
              <button
                key={optIndex}
                type="button"
                onClick={() => handleSelect(optIndex)}
                disabled={!canAnswer}
                className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-colors ${borderColor} ${bgColor}`}
                aria-label={`Option ${optIndex + 1}`}
              >
                <span className="text-[#E8E8E8]">{opt}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && currentQ && (
          <div className="mt-4 p-3 rounded-lg border border-[#625EC6]/40 bg-[#0F3460]">
            {selectedIndex === currentQ.correctIndex ? (
              <p className="text-[#4CAF50] font-semibold">Correct!</p>
            ) : (
              <p className="text-[#F44336] font-semibold">Not quite.</p>
            )}
            {currentQ.explanation ? (
              <p className="text-sm text-[#E8E8E8] mt-1">{currentQ.explanation}</p>
            ) : null}
            {currentQ.activeRecall ? (
              <p className="text-sm text-[#FFD700] mt-2">Tip: {currentQ.activeRecall}</p>
            ) : null}
          </div>
        )}
      </div>

      {showExplanation && currentIndex < total - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 bg-[#625EC6] text-[#E8E8E8] rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FFD700] disabled:opacity-50"
        >
          Next →
        </button>
      )}

      {showExplanation && currentIndex === total - 1 && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleFinish}
            disabled={submitting}
            className="px-6 py-3 bg-[#FFD700] text-[#1A1A2E] rounded-lg font-semibold hover:bg-[#FFE55C] transition-colors focus:outline-none focus:ring-4 focus:ring-[#625EC6] disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Finish Mini Quiz"}
          </button>
          <button
            type="button"
            onClick={resetQuiz}
            disabled={submitting}
            className="px-6 py-3 bg-[#625EC6] text-[#E8E8E8] rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FFD700] disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      )}

      {submissionError && (
        <p className="mt-3 text-sm text-[#F44336]" role="alert">
          {submissionError}
        </p>
      )}

      {quizComplete && (
        <div className="mt-4 p-4 rounded-lg border border-[#625EC6]/50 bg-[#16213E]">
          <h4 className="text-lg font-bold text-[#FFD700] mb-1">
            {lessonMarkedComplete ? "Lesson complete!" : "Mini quiz submitted."}
          </h4>
          <p className="text-sm text-[#C0C0C0]">
            Score: {correctCount}/{total} ({Math.round((correctCount / total) * 100)}%)
          </p>
          <button
            type="button"
            onClick={resetQuiz}
            className="mt-3 px-6 py-3 bg-[#625EC6] text-[#E8E8E8] rounded-lg font-semibold hover:bg-[#4A46A8] transition-colors focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
          >
            {alreadyCompleted || lessonMarkedComplete ? "Retake mini quiz" : "Try again"}
          </button>
        </div>
      )}
    </div>
  );
}

