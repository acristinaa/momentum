import { Plant } from "../../types";
import { awardExperience, calculateStage } from "../../utils/plantUtils";

const basePlant: Plant = { name: "Fern", stage: 1, experience: 0 };

describe("plantUtils", () => {
  test("stage 1 for 0–6 XP", () => {
    expect(calculateStage(0)).toBe(1);
    expect(calculateStage(6)).toBe(1);
  });

  test("stage 2 for 7–20 XP", () => {
    expect(calculateStage(7)).toBe(2);
    expect(calculateStage(20)).toBe(2);
  });

  test("stage 3 for 21+ XP", () => {
    expect(calculateStage(21)).toBe(3);
    expect(calculateStage(100)).toBe(3);
  });

  test("awardExperience correctly updates XP and stage", () => {
    const result = awardExperience(basePlant, 7);
    expect(result.experience).toBe(7);
    expect(result.stage).toBe(2);
  });
});
