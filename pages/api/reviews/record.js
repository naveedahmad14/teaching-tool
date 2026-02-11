import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { calculateNextReview } from "@/lib/spacedRepetition";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { lessonId, quality } = req.body;
  if (lessonId == null || quality == null) {
    return res.status(400).json({ error: "lessonId and quality are required" });
  }
  const q = Number(quality);
  if (Number.isNaN(q) || q < 0 || q > 5) {
    return res.status(400).json({ error: "quality must be 0–5" });
  }

  try {
    let card = await prisma.reviewCard.findUnique({
      where: {
        userId_lessonId: { userId: session.user.id, lessonId: String(lessonId) },
      },
    });

    if (!card) {
      card = await prisma.reviewCard.create({
        data: {
          userId: session.user.id,
          lessonId: String(lessonId),
          repetitions: 0,
          easiness: 2.5,
          interval: 1,
          nextReviewDate: new Date(),
        },
      });
    }

    const qualityHistory = (() => {
      try {
        const v = card.qualityHistory;
        if (Array.isArray(v)) return v;
        if (typeof v === "string") return JSON.parse(v || "[]");
        return [];
      } catch {
        return [];
      }
    })();

    const updated = calculateNextReview({ ...card, qualityHistory }, q);

    await prisma.reviewCard.update({
      where: { id: card.id },
      data: {
        repetitions: updated.repetitions,
        easiness: updated.easiness,
        interval: updated.interval,
        nextReviewDate: updated.nextReviewDate,
        lastReviewed: updated.lastReviewed,
        qualityHistory: JSON.stringify(updated.qualityHistory),
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Record review error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
