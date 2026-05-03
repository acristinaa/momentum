import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getTodayString } from "../utils/dateUtils";

interface CalendarStripProps {
  completedDates: string[];
}

export function CalendarStrip({ completedDates }: CalendarStripProps) {
  const days = buildLast14Days();
  const completedSet = new Set(completedDates.map((d) => d.split("T")[0]));

  const firstWeek = days.slice(0, 7);
  const secondWeek = days.slice(7, 14);

  function renderRow(week: typeof days) {
    return (
      <View style={styles.grid}>
        {week.map((day) => {
          const isCompleted = completedSet.has(day.dateString);
          const isToday = day.dateString === getTodayString();
          return (
            <View key={day.dateString} style={styles.dayColumn}>
              <Text style={styles.dayLabel}>{day.shortLabel}</Text>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isToday && styles.dotToday,
                ]}>
                {isCompleted && <Text style={styles.dotCheck}>✓</Text>}
              </View>
              <Text
                style={[styles.dateNumber, isToday && styles.dateNumberToday]}>
                {day.dayNumber}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last 14 Days</Text>
      {renderRow(firstWeek)}
      {renderRow(secondWeek)}
    </View>
  );
}

interface DayInfo {
  dateString: string;
  shortLabel: string;
  dayNumber: string;
}

function buildLast14Days(): DayInfo[] {
  const days: DayInfo[] = [];
  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    days.push({
      dateString: date.toISOString().split("T")[0],
      shortLabel: labels[date.getDay()],
      dayNumber: String(date.getDate()),
    });
  }

  return days;
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayColumn: {
    width: "14.28%",
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    fontSize: 10,
    color: "#BDBDBD",
    fontWeight: "500",
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#EEEEEE",
  },
  dotCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  dotToday: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  dotCheck: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dateNumber: {
    fontSize: 10,
    color: "#BDBDBD",
  },
  dateNumberToday: {
    color: "#4CAF50",
    fontWeight: "700",
  },
});
