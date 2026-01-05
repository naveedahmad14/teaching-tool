import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";
import GameBadge from "../components/GameBadge";

const lessonNames = {
  bubble: "Bubble Sort",
  quick: "Quick Sort",
  merge: "Merge Sort",
  linear: "Linear Search",
  binary: "Binary Search",
};

export default function Progress() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProgress();
    }
  }, [status]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/progress/get");
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#625EC6] border-t-transparent mx-auto mb-4"></div>
            <p className="text-[10px] text-[#B0B0B0]">Loading your quest progress...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  const user = progressData?.user || session.user;
  const progress = progressData?.progress || [];

  // Calculate statistics
  const totalLessons = Object.keys(lessonNames).length;
  const completedLessons = progress.filter((p) => p.completed).length;
  const totalXP = user.xp || 0;
  const currentLevel = user.level || 1;
  const xpForNextLevel = currentLevel * 500;
  const xpProgress = totalXP % 500;
  const xpPercentage = (xpProgress / 500) * 100;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-lg mb-2 text-[#FFD700]">
            📊 Quest Progress
          </h1>
          <p className="text-[10px] text-[#B0B0B0]">
            Track your journey to algorithmic mastery
          </p>
        </div>

        {/* User Stats Card */}
        <div className="game-card game-border-gold p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-[10px] text-[#B0B0B0] mb-2">⚔️ Level</p>
              <p className="text-2xl text-[#FFD700]">{currentLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#B0B0B0] mb-2">⭐ Total XP</p>
              <p className="text-2xl text-[#FFD700]">{totalXP}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#B0B0B0] mb-2">✅ Completed</p>
              <p className="text-2xl text-[#FFD700]">
                {completedLessons}/{totalLessons}
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-[10px] mb-2 text-[#E8E8E8]">
              <span>🎯 XP to Level {currentLevel + 1}</span>
              <span>
                {xpProgress}/500 ({Math.round(xpPercentage)}%)
              </span>
            </div>
            <div className="game-progress-bar">
              <div
                className="game-progress-fill"
                style={{ width: `${xpPercentage}%` }}
                role="progressbar"
                aria-valuenow={xpProgress}
                aria-valuemin={0}
                aria-valuemax={500}
                aria-label={`${xpProgress} out of 500 XP to next level`}
              ></div>
            </div>
          </div>
        </div>

        {/* Lessons Progress */}
        <div className="mb-6">
          <h2 className="text-sm mb-4 text-[#FFD700] text-center">
            📚 Quest Log
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(lessonNames).map(([lessonId, lessonName]) => {
              const lessonProgress = progress.find((p) => p.lessonId === lessonId);
              const isCompleted = lessonProgress?.completed || false;
              const score = lessonProgress?.score || 0;
              const attempts = lessonProgress?.attempts || 0;
              const timeSpent = lessonProgress?.timeSpent || 0;

              return (
                <div
                  key={lessonId}
                  className={`game-card p-6 ${isCompleted ? 'game-border-gold' : ''}`}
                  role="article"
                  aria-label={`${lessonName} lesson progress`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xs mb-2 text-[#E8E8E8]">{lessonName}</h3>
                      <Link
                        href={`/lesson/${lessonId}`}
                        className="text-[10px] text-[#625EC6] hover:text-[#FFD700] transition-colors inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                        aria-label={`View ${lessonName} lesson`}
                      >
                        Enter Quest →
                      </Link>
                    </div>
                    {isCompleted && (
                      <GameBadge variant="success" className="text-[8px] flex-shrink-0 ml-2">
                        ✓
                      </GameBadge>
                    )}
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t-2 border-[#625EC6]">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[#B0B0B0]">Status:</span>
                      <span className={isCompleted ? "text-[#4CAF50] font-bold" : "text-[#B0B0B0]"}>
                        {isCompleted ? "✅ Completed" : "⏳ Not Started"}
                      </span>
                    </div>
                    {attempts > 0 && (
                      <>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#B0B0B0]">🏆 Best Score:</span>
                          <span className="text-[#FFD700] font-bold">{score}%</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#B0B0B0]">🔄 Attempts:</span>
                          <span className="text-[#E8E8E8]">{attempts}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#B0B0B0]">⏱️ Time:</span>
                          <span className="text-[#E8E8E8]">
                            {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!isCompleted && attempts === 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-[#625EC6]">
                      <p className="text-[10px] text-[#B0B0B0] text-center">
                        Begin this quest to track progress
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}


