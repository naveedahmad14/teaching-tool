import { describe, it, expect } from "vitest";
import {
  QUEST_PATH_ORDER,
  PREREQUISITES,
  getOrderedQuests,
} from "@/lib/questPath";

describe("questPath", () => {
  it("QUEST_PATH_ORDER has 10 topics in a stable order", () => {
    expect(QUEST_PATH_ORDER).toHaveLength(10);
    expect(QUEST_PATH_ORDER[0]).toBe("linear");
    expect(QUEST_PATH_ORDER.at(-1)).toBe("stacks");
  });

  it("PREREQUISITES lists expected dependencies", () => {
    expect(PREREQUISITES.binary).toEqual(["linear"]);
    expect(PREREQUISITES.merge).toEqual(["bubble"]);
    expect(PREREQUISITES.quick).toEqual(["merge"]);
  });

  it("getOrderedQuests returns meta, step numbers, and next quest", () => {
    const quests = getOrderedQuests();
    expect(quests).toHaveLength(10);
    expect(quests[0]).toMatchObject({
      id: "linear",
      step: 1,
      title: "Linear Search",
      nextQuestId: "binary",
    });
    expect(quests[0].link).toBe("/lesson/linear");
    expect(quests[0].prerequisiteIds).toEqual([]);
    expect(quests[0].prerequisiteTitles).toEqual([]);
  });

  it("last quest has no next title", () => {
    const last = getOrderedQuests().at(-1);
    expect(last.nextQuestId).toBeNull();
    expect(last.nextQuestTitle).toBeNull();
  });

  it("binary quest lists linear as prerequisite title", () => {
    const binary = getOrderedQuests().find((q) => q.id === "binary");
    expect(binary.prerequisiteTitles).toEqual(["Linear Search"]);
  });
});
