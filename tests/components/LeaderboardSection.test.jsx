/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LeaderboardSection from "@/components/progress/LeaderboardSection";

describe("LeaderboardSection", () => {
  it("renders top users and current rank callout when user is outside top 10", () => {
    render(
      <LeaderboardSection
        topUsers={[
          { rank: 1, id: "u1", username: "amy", xp: 1200, level: 3, isCurrentUser: false },
          { rank: 2, id: "u2", username: "ben", xp: 1000, level: 3, isCurrentUser: false },
        ]}
        currentUserRank={11}
        isCurrentUserInTop10={false}
      />
    );

    expect(screen.getByRole("heading", { name: /leaderboard/i })).toBeInTheDocument();
    expect(screen.getByText("amy")).toBeInTheDocument();
    expect(screen.getByText("ben")).toBeInTheDocument();
    expect(screen.getByText(/your current rank: #11/i)).toBeInTheDocument();
  });

  it("highlights current user and hides rank callout when user is in top 10", () => {
    const { container } = render(
      <LeaderboardSection
        topUsers={[
          { rank: 1, id: "u1", username: "amy", xp: 1200, level: 3, isCurrentUser: false },
          { rank: 2, id: "u2", username: "ben", xp: 1000, level: 3, isCurrentUser: true },
        ]}
        currentUserRank={2}
        isCurrentUserInTop10
      />
    );

    expect(container.querySelector(".leaderboard-row-me")).not.toBeNull();
    expect(screen.queryByText(/your current rank:/i)).not.toBeInTheDocument();
  });
});
