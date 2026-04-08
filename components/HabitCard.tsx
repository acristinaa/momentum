import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Habit } from "../types";
import { isCompletedToday } from "../utils/habitUtils";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const completed = isCompletedToday(habit);

  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted]}
      onPress={() => onToggle(habit.id)}
      activeOpacity={0.7}>
      <View style={[styles.checkbox, completed && styles.checkboxDone]}>
        {completed && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={[styles.title, completed && styles.titleDone]}>
        {habit.title}
      </Text>

      <Text style={styles.count}>{habit.completedDates.length}d</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompleted: {
    borderColor: "#A5D6A7",
    backgroundColor: "#F1F8E9",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    fontWeight: "500",
  },
  titleDone: {
    color: "#9E9E9E",
    textDecorationLine: "line-through",
  },
  count: {
    fontSize: 12,
    color: "#BDBDBD",
    fontWeight: "500",
  },
});
