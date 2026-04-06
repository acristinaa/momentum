import { Plant } from "../types";

/**
 * Determines the plant stage based on total experience points.
 * Stage 1: 0–6 XP  (Seedling)
 * Stage 2: 7–20 XP (Sprout)
 * Stage 3: 21+ XP  (Full Plant)
 */
export function calculateStage(experience: number): 1 | 2 | 3 {
  if (experience >= 21) return 3;
  if (experience >= 7) return 2;
  return 1;
}

/**
 * Returns a human-readable label for each plant stage.
 */
export function getStageName(stage: 1 | 2 | 3): string {
  const names: Record<1 | 2 | 3, string> = {
    1: "Seedling 🌱",
    2: "Sprout 🌿",
    3: "Blooming 🌸",
  };
  return names[stage];
}

/**
 * Returns an emoji representation of the plant at each stage.
 * (Will be replaced by proper visuals later)
 */
export function getPlantEmoji(stage: 1 | 2 | 3): string {
  const emojis: Record<1 | 2 | 3, string> = {
    1: "🌱",
    2: "🌿",
    3: "🌸",
  };
  return emojis[stage];
}

/**
 * Returns an updated Plant object after adding experience.
 */
export function awardExperience(plant: Plant, points: number): Plant {
  const newXP = plant.experience + points;
  return {
    ...plant,
    experience: newXP,
    stage: calculateStage(newXP),
  };
}
