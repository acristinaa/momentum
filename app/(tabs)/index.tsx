import { HabitCard } from "@/components/HabitCard";
import { PlantDisplay } from "@/components/PlantDisplay";
import { StreakBadge } from "@/components/StreakBadge";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";
import { calculateStreak, getTodayString } from "../../utils/dateUtils";
import { allCompletedToday, countCompletedToday } from "../../utils/habitUtils";

export default function HomeScreen() {
  const habits = useAppStore((s) => s.habits);
  const plant = useAppStore((s) => s.plant);
  const toggleHabitCompletion = useAppStore((s) => s.toggleHabitCompletion);

  const allCompletedDates = useMemo(() => {
    return habits.flatMap((h) => h.completedDates);
  }, [habits]);

  const streak = useMemo(
    () => calculateStreak(allCompletedDates),
    [allCompletedDates],
  );

  const completedCount = countCompletedToday(habits);
  const allDone = allCompletedToday(habits);
  const today = getTodayString();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.greeting}>
            {allDone ? "All done today! 🎉" : "How is your day going?"}
          </Text>
        </View>

        <View style={styles.card}>
          <PlantDisplay plant={plant} />
        </View>

        <View style={styles.card}>
          <StreakBadge streak={streak} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Habits</Text>
            <Text style={styles.sectionCount}>
              {completedCount}/{habits.length} done
            </Text>
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>No habits yet</Text>
              <Text style={styles.emptySubtext}>
                Go to the Habits tab to add some!
              </Text>
            </View>
          ) : (
            <View style={styles.habitList}>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabitCompletion}
                />
              ))}
            </View>
          )}
        </View>

        {allDone && (
          <View style={styles.allDoneBanner}>
            <Text style={styles.allDoneEmoji}>🌟</Text>
            <Text style={styles.allDoneText}>
              Amazing! You completed all habits today and earned a bonus point!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    paddingTop: 16,
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#9E9E9E",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#212121",
  },
  sectionCount: {
    fontSize: 13,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  habitList: {
    gap: 10,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9E9E9E",
    textAlign: "center",
  },
  allDoneBanner: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  allDoneEmoji: {
    fontSize: 24,
  },
  allDoneText: {
    flex: 1,
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
    lineHeight: 20,
  },
});
