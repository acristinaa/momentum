import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
}

export function ProgressBar({ current, max, label }: ProgressBarProps) {
  const percent = Math.min((current / max) * 100, 100);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {current} / {max} XP
          </Text>
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#757575",
  },
  value: {
    fontSize: 12,
    color: "#BDBDBD",
    fontWeight: "500",
  },
  track: {
    width: "100%",
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
});
