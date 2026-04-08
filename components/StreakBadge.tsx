import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  function getStreakMessage(days: number): string {
    if (days === 0) return "Start your streak today!";
    if (days === 1) return "Great start! Keep going!";
    if (days < 7) return "Building momentum! 💪";
    if (days < 14) return "One week strong! 🔥";
    return "Unstoppable! 🚀";
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.fire}>🔥</Text>
        <Text style={styles.number}>{streak}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>
      <Text style={styles.message}>{getStreakMessage(streak)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  fire: {
    fontSize: 20,
  },
  number: {
    fontSize: 32,
    fontWeight: "800",
    color: "#212121",
  },
  label: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  message: {
    fontSize: 13,
    color: "#9E9E9E",
  },
});
