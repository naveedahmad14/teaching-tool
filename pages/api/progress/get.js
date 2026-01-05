import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get user with progress
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        progress: {
          orderBy: {
            lastAccessed: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        xp: user.xp,
      },
      progress: user.progress,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

