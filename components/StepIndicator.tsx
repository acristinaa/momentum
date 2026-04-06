import React from "react";
import { StyleSheet, View } from "react-native";

interface StepIndicatorProps {
  total: number;
  current: number;
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
    width: 24, // if active, wider
  },
  inactiveDot: {
    backgroundColor: "#E0E0E0",
  },
});
