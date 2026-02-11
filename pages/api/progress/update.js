import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { lessonId, completed, score, timeSpent } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  try {
    // Get or create lesson progress
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.lessonProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          completed: completed !== undefined ? completed : existingProgress.completed,
          score: score !== undefined ? Math.max(score, existingProgress.score) : existingProgress.score,
          timeSpent: existingProgress.timeSpent + (timeSpent || 0),
          attempts: existingProgress.attempts + 1,
          lastAccessed: new Date(),
        },
      });
    } else {
      // Create new progress
      progress = await prisma.lessonProgress.create({
        data: {
          userId: session.user.id,
          lessonId: lessonId,
          completed: completed || false,
          score: score || 0,
          timeSpent: timeSpent || 0,
          attempts: 1,
        },
      });
    }

    // Update user XP and level if lesson was completed
    if (completed && !existingProgress?.completed) {
      const xpGain = 100; // Base XP for completing a lesson
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      const newXP = user.xp + xpGain;
      const newLevel = Math.floor(newXP / 500) + 1; // Level up every 500 XP

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          xp: newXP,
          level: newLevel,
        },
      });

      // Add to spaced repetition: create or reset review card so it's due for review
      await prisma.reviewCard.upsert({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId: String(lessonId) },
        },
        create: {
          userId: session.user.id,
          lessonId: String(lessonId),
          repetitions: 0,
          easiness: 2.5,
          interval: 1,
          nextReviewDate: new Date(),
        },
        update: {
          nextReviewDate: new Date(),
        },
      });
    }

    return res.status(200).json({ progress });
  } catch (error) {
    console.error("Progress update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

