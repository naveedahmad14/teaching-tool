import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#625EC6] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your progress...</p>
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

        {/* User Stats Card */}
        <div className="bg-gradient-to-r from-[#625EC6] to-[#524DB8] text-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Level</p>
              <p className="text-4xl font-bold">{currentLevel}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Total XP</p>
              <p className="text-4xl font-bold">{totalXP}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Lessons Completed</p>
              <p className="text-4xl font-bold">
                {completedLessons}/{totalLessons}
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>XP to Level {currentLevel + 1}</span>
              <span>
                {xpProgress}/500 ({Math.round(xpPercentage)}%)
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Lessons Progress */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Lessons Progress</h2>
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
                  className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-100 hover:border-[#625EC6] transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{lessonName}</h3>
                      <Link
                        href={`/lesson/${lessonId}`}
                        className="text-[#625EC6] hover:underline text-sm"
                      >
                        View Lesson →
                      </Link>
                    </div>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Status:</span>
                      <span className={isCompleted ? "text-green-600 font-semibold" : "text-gray-500"}>
                        {isCompleted ? "Completed" : "Not Started"}
                      </span>
                    </div>
                    {attempts > 0 && (
                      <>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Best Score:</span>
                          <span className="font-semibold">{score}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Attempts:</span>
                          <span>{attempts}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Time Spent:</span>
                          <span>
                            {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!isCompleted && attempts === 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 text-center">
                        Start learning to track your progress
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


