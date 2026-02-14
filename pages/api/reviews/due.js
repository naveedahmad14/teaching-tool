import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { getDueCards } from "@/lib/spacedRepetition";

const LESSON_NAMES = {
  bubble: "Bubble Sort",
  quick: "Quick Sort",
  merge: "Merge Sort",
  linear: "Linear Search",
  binary: "Binary Search",
  twopointers: "Two Pointers",
  slidingwindow: "Sliding Window",
  hashmaps: "Hash Maps",
  linkedlists: "Linked Lists",
  stacks: "Stacks",
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const cards = await prisma.reviewCard.findMany({
      where: { userId: session.user.id },
    });

    const due = getDueCards(cards);
    const withNames = due.map((card) => ({
      ...card,
      lesson: {
        id: card.lessonId,
        name: LESSON_NAMES[card.lessonId] || card.lessonId,
      },
    }));

    return res.status(200).json({ cards: withNames });
  } catch (error) {
    console.error("Reviews due error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
