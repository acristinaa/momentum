import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Plant } from "../../types";
import { getStageName } from "../../utils/plantUtils";

interface PlantDisplayProps {
  plant: Plant;
}

const STAGE_CONFIG = {
  1: {
    emoji: "🌱",
    background: "#E8F5E9",
    size: 80,
    description: "Just getting started...",
  },
  2: {
    emoji: "🌿",
    background: "#C8E6C9",
    size: 100,
    description: "Growing stronger!",
  },
  3: {
    emoji: "🌸",
    background: "#A5D6A7",
    size: 120,
    description: "Fully blooming!",
  },
} as const;

export function PlantDisplay({ plant }: PlantDisplayProps) {
  const config = STAGE_CONFIG[plant.stage];

  return (
    <View style={styles.container}>
      <View
        style={[styles.plantCircle, { backgroundColor: config.background }]}>
        <Text style={[styles.plantEmoji, { fontSize: config.size * 0.6 }]}>
          {config.emoji}
        </Text>
      </View>

      <Text style={styles.plantName}>{plant.name}</Text>

      <View style={styles.stageBadge}>
        <Text style={styles.stageText}>{getStageName(plant.stage)}</Text>
      </View>

      <Text style={styles.description}>{config.description}</Text>

      <Text style={styles.xp}>{plant.experience} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  plantCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  plantEmoji: {
    lineHeight: undefined,
  },
  plantName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#212121",
  },
  stageBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },
  description: {
    fontSize: 13,
    color: "#9E9E9E",
    fontStyle: "italic",
  },
  xp: {
    fontSize: 12,
    color: "#BDBDBD",
    fontWeight: "500",
  },
});
