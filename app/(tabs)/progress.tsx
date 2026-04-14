import { CalendarStrip } from "@/components/CalendarStrip";
import { PlantDisplay } from "@/components/PlantDisplay";
import { ProgressBar } from "@/components/PorgressBar";
import { shareProgress } from "@/services/sharing";
import { calculateStreak } from "@/utils/dateUtils";
import { countCompletedToday } from "@/utils/habitUtils";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";

const STAGE_THRESHOLDS = {
  1: { max: 7, label: "Seedling → Sprout" },
  2: { max: 21, label: "Sprout → Blooming" },
  3: { max: 21, label: "Fully Bloomed!" },
} as const;

export default function ProgressScreen() {
  const plant = useAppStore((s) => s.plant);
  const habits = useAppStore((s) => s.habits);

  const allCompletedDates = useMemo(
    () => habits.flatMap((h) => h.completedDates),
    [habits],
  );

  const uniqueCompletedDays = useMemo(
    () => [...new Set(allCompletedDates.map((d) => d.split("T")[0]))],
    [allCompletedDates],
  );

  const streak = useMemo(
    () => calculateStreak(allCompletedDates),
    [allCompletedDates],
  );

  const totalDaysActive = uniqueCompletedDays.length;
  const completedToday = countCompletedToday(habits);

  const stageConfig = STAGE_THRESHOLDS[plant.stage];
  const xpForCurrentStage = plant.stage === 1 ? 0 : plant.stage === 2 ? 7 : 21;
  const xpProgress = plant.experience - xpForCurrentStage;
  const xpNeeded = stageConfig.max - xpForCurrentStage;

  async function handleShare() {
    await shareProgress(plant, habits);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Your journey so far</Text>
        </View>

        <View style={styles.card}>
          <PlantDisplay plant={plant} />

          {plant.stage < 3 ? (
            <View style={styles.progressBarWrapper}>
              <ProgressBar
                current={xpProgress}
                max={xpNeeded}
                label={`Next: ${stageConfig.label}`}
              />
            </View>
          ) : (
            <View style={styles.maxedBanner}>
              <Text style={styles.maxedText}>
                🏆 Your plant has fully bloomed!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <StatCard emoji="🔥" value={String(streak)} label="Day Streak" />
          <StatCard
            emoji="📅"
            value={String(totalDaysActive)}
            label="Days Active"
          />
          <StatCard
            emoji="⭐"
            value={String(plant.experience)}
            label="Total XP"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today</Text>
          <View style={styles.todayRow}>
            <Text style={styles.todayEmoji}>
              {completedToday === habits.length && habits.length > 0
                ? "🎉"
                : "📋"}
            </Text>
            <Text style={styles.todayText}>
              {habits.length === 0
                ? "No habits added yet"
                : completedToday === habits.length
                  ? "All habits completed!"
                  : `${completedToday} of ${habits.length} habits done`}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <CalendarStrip completedDates={allCompletedDates} />
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareEmoji}>🔗</Text>
          <Text style={styles.shareText}>Share My Progress</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>{getMotivationalMessage(streak)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  emoji: string;
  value: string;
  label: string;
}

function StatCard({ emoji, value, label }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Every journey starts with a single step 🌱";
  if (streak < 3) return "You're just getting started. Keep going! 💪";
  if (streak < 7) return "Great momentum! Don't break the chain! 🔥";
  if (streak < 14) return "One week strong! You're building real habits! 🌿";
  return "You're unstoppable! Your plant is proud of you! 🌸";
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
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    paddingTop: 16,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#212121",
  },
  subtitle: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
  },
  progressBarWrapper: {
    marginTop: 4,
  },
  maxedBanner: {
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  maxedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F57F17",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#212121",
  },
  statLabel: {
    fontSize: 11,
    color: "#9E9E9E",
    fontWeight: "500",
    textAlign: "center",
  },
  todayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  todayEmoji: {
    fontSize: 28,
  },
  todayText: {
    fontSize: 15,
    color: "#424242",
    fontWeight: "500",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#4CAF50",
  },
  shareEmoji: {
    fontSize: 18,
  },
  shareText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#BDBDBD",
    fontStyle: "italic",
    paddingBottom: 8,
  },
});
