import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;
  const {
    lessonId,
    completed,
    score,
    correctCount,
    totalQuestions,
    timeSpent,
    incrementAttempts,
    difficulty,
    quizXpOnly,
  } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  const lessonIdStr = String(lessonId);

  try {
    // XP-only mode (used by pages/quiz.js).
    // Do not create/update lesson progress or review cards.
    if (Boolean(quizXpOnly)) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const difficultyMultipliers = { easy: 1, medium: 1.25, hard: 1.5 };
      const difficultyKey = String(difficulty || "easy").toLowerCase();
      const difficultyMultiplier = difficultyMultipliers[difficultyKey] ?? 1;

      const correctCountNum =
        correctCount === undefined || correctCount === null ? null : Number(correctCount);
      const totalQuestionsNum =
        totalQuestions === undefined || totalQuestions === null ? null : Number(totalQuestions);
      const scorePctNum = score === undefined || score === null ? null : Number(score);

      let xpGain;
      // New payload: XP per correct question.
      if (
        correctCountNum !== null &&
        totalQuestionsNum !== null &&
        Number.isFinite(correctCountNum) &&
        Number.isFinite(totalQuestionsNum) &&
        totalQuestionsNum > 0 &&
        correctCountNum >= 0
      ) {
        const safeTotal = Math.floor(totalQuestionsNum);
        const safeCorrect = Math.min(Math.floor(correctCountNum), safeTotal);

        const xpPerCorrect = Math.round((150 * difficultyMultiplier) / safeTotal);
        xpGain = safeCorrect * xpPerCorrect;
      } else if (scorePctNum !== null && Number.isFinite(scorePctNum) && !Number.isNaN(scorePctNum)) {
        // Backward compatibility: old payload used `score` as percent.
        const clampedScorePct = Math.max(0, Math.min(100, scorePctNum));
        const baseXP = 50 + clampedScorePct;
        xpGain = Math.round(baseXP * difficultyMultiplier);
      } else {
        return res.status(400).json({ error: "Quiz XP requires correctCount/totalQuestions (or score)" });
      }

      const newXP = (user.xp || 0) + xpGain;
      const newLevel = Math.floor(newXP / 500) + 1;

      await prisma.user.update({
        where: { id: userId },
        data: { xp: newXP, level: newLevel },
      });

      return res.status(200).json({ progress: { xpGain, xp: newXP, level: newLevel } });
    }

    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lessonIdStr,
        },
      },
    });

    const inputCompleted = completed !== undefined ? Boolean(completed) : undefined;
    const shouldIncrementAttempts =
      Boolean(inputCompleted) ||
      Boolean(incrementAttempts) ||
      (score !== undefined && Number(score) > 0);

    // Preserve completed=true:
    // If the user already completed the lesson, ignore incoming completed:false updates.
    const finalCompleted = existingProgress
      ? existingProgress.completed && inputCompleted === false
        ? true
        : inputCompleted !== undefined
          ? inputCompleted
          : existingProgress.completed
      : Boolean(inputCompleted);

    let progress;
    if (existingProgress) {
      progress = await prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: finalCompleted,
          score:
            score !== undefined
              ? Math.max(Number(score), existingProgress.score)
              : existingProgress.score,
          timeSpent: existingProgress.timeSpent + (Number(timeSpent) || 0),
          attempts: existingProgress.attempts + (shouldIncrementAttempts ? 1 : 0),
          lastAccessed: new Date(),
        },
      });
    } else {
      progress = await prisma.lessonProgress.create({
        data: {
          userId,
          lessonId: lessonIdStr,
          completed: finalCompleted,
          score: Math.max(0, Number(score) || 0),
          timeSpent: Number(timeSpent) || 0,
          attempts: shouldIncrementAttempts ? 1 : 0,
        },
      });
    }

    if (inputCompleted === true && !existingProgress?.completed) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        const scorePct = Math.max(0, Math.min(100, Number(score) ?? 0));
        const baseXP = 50 + scorePct;
        const difficultyMultipliers = { easy: 1, medium: 1.25, hard: 1.5 };
        const difficultyKey = String(difficulty || "easy").toLowerCase();
        const difficultyMultiplier = difficultyMultipliers[difficultyKey] ?? 1;
        const xpGain = Math.round(baseXP * difficultyMultiplier);
        const newXP = (user.xp || 0) + xpGain;
        const newLevel = Math.floor(newXP / 500) + 1;

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXP,
            level: newLevel,
          },
        });
      }

      try {
        await prisma.reviewCard.upsert({
          where: {
            userId_lessonId: { userId, lessonId: lessonIdStr },
          },
          create: {
            userId,
            lessonId: lessonIdStr,
            repetitions: 0,
            easiness: 2.5,
            interval: 1,
            nextReviewDate: new Date(),
          },
          update: {
            nextReviewDate: new Date(),
          },
        });
      } catch (reviewError) {
        console.error("Progress update: review card upsert error", reviewError);
      }
    }

    return res.status(200).json({ progress });
  } catch (error) {
    console.error("Progress update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
