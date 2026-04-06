export default function LeaderboardSection({
  topUsers = [],
  currentUserRank = null,
  isCurrentUserInTop10 = false,
}) {
  return (
    <div className="game-card p-4 sm:p-6 mb-8">
      <h2 className="text-lg font-bold mb-4 text-[#FFD700] text-center">
        Leaderboard
      </h2>

      {topUsers.length === 0 ? (
        <p className="text-sm text-[#C0C0C0] text-center">
          Leaderboard data is not available yet.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {topUsers.map((entry) => (
              <div
                key={entry.id}
                className={`leaderboard-row ${
                  entry.isCurrentUser ? "leaderboard-row-me" : ""
                }`}
              >
                <div className="leaderboard-rank">#{entry.rank}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#E8E8E8] truncate">
                    {entry.username}
                  </p>
                  <p className="text-xs text-[#C0C0C0]">Level {entry.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#FFD700]">{entry.xp} XP</p>
                </div>
              </div>
            ))}
          </div>

          {!isCurrentUserInTop10 && currentUserRank ? (
            <div className="leaderboard-rank-callout mt-4">
              Your current rank: #{currentUserRank}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
