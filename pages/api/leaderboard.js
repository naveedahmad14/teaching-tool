import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

const TOP_LIMIT = 10;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, xp: true, level: true },
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const topUsersRaw = await prisma.user.findMany({
      take: TOP_LIMIT,
      orderBy: [
        { xp: "desc" },
        { level: "desc" },
        { username: "asc" },
        { id: "asc" },
      ],
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
      },
    });

    const usersAheadCount = await prisma.user.count({
      where: {
        OR: [
          { xp: { gt: currentUser.xp } },
          {
            xp: currentUser.xp,
            level: { gt: currentUser.level },
          },
          {
            xp: currentUser.xp,
            level: currentUser.level,
            username: { lt: currentUser.username },
          },
          {
            xp: currentUser.xp,
            level: currentUser.level,
            username: currentUser.username,
            id: { lt: currentUser.id },
          },
        ],
      },
    });

    const currentUserRank = usersAheadCount + 1;
    const topUsers = topUsersRaw.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      xp: user.xp,
      level: user.level,
      isCurrentUser: user.id === currentUser.id,
    }));
    const isCurrentUserInTop10 = topUsers.some((user) => user.isCurrentUser);

    return res.status(200).json({
      topUsers,
      currentUserRank,
      isCurrentUserInTop10,
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
