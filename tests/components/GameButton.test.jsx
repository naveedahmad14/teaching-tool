/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameButton from "@/components/ui/GameButton";

describe("GameButton", () => {
  it("renders children and calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <GameButton onClick={onClick} variant="primary">
        Press me
      </GameButton>
    );
    expect(screen.getByRole("button", { name: /press me/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /press me/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled", () => {
    const onClick = vi.fn();
    render(
      <GameButton disabled onClick={onClick}>
        Off
      </GameButton>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
