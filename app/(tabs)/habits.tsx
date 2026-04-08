import { HabitFormModal } from "@/components/HabitFormModal";
import { Habit } from "@/types";
import { isCompletedToday } from "@/utils/habitUtils";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";

const MAX_HABITS = 3;

interface EditTarget {
  id: string;
  title: string;
}

export default function HabitsScreen() {
  const habits = useAppStore((s) => s.habits);
  const addHabit = useAppStore((s) => s.addHabit);
  const editHabit = useAppStore((s) => s.editHabit);
  const deleteHabit = useAppStore((s) => s.deleteHabit);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  const canAddMore = habits.length < MAX_HABITS;

  function handleAddConfirm(title: string) {
    addHabit(title);
    setAddModalVisible(false);
  }

  function handleEditConfirm(title: string) {
    if (!editTarget) return;
    editHabit(editTarget.id, title);
    setEditTarget(null);
  }

  function handleDeletePress(habit: Habit) {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.title}"? Your completion history will be lost.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHabit(habit.id),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Habits</Text>
          <Text style={styles.subtitle}>
            {habits.length}/{MAX_HABITS} habits · tap a habit to edit
          </Text>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Complete all habits in a day to earn a bonus point for your plant!
          </Text>
        </View>

        {habits.length === 0 ? (
          <EmptyState onAdd={() => setAddModalVisible(true)} />
        ) : (
          <View style={styles.list}>
            {habits.map((habit, index) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                index={index}
                onEdit={() =>
                  setEditTarget({ id: habit.id, title: habit.title })
                }
                onDelete={() => handleDeletePress(habit)}
              />
            ))}
          </View>
        )}

        {canAddMore && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Add Habit</Text>
          </TouchableOpacity>
        )}

        {!canAddMore && (
          <Text style={styles.maxReached}>
            You&apos;ve reached the maximum of {MAX_HABITS} habits 🌿
          </Text>
        )}
      </ScrollView>

      <HabitFormModal
        visible={addModalVisible}
        mode="add"
        onConfirm={handleAddConfirm}
        onCancel={() => setAddModalVisible(false)}
      />

      <HabitFormModal
        visible={editTarget !== null}
        mode="edit"
        initialValue={editTarget?.title ?? ""}
        onConfirm={handleEditConfirm}
        onCancel={() => setEditTarget(null)}
      />
    </SafeAreaView>
  );
}

interface HabitRowProps {
  habit: Habit;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function HabitRow({ habit, index, onEdit, onDelete }: HabitRowProps) {
  const completedToday = isCompletedToday(habit);
  const totalDays = habit.completedDates.length;

  return (
    <View style={styles.habitCard}>
      <View style={styles.habitIndex}>
        <Text style={styles.habitIndexText}>{index + 1}</Text>
      </View>

      <View style={styles.habitInfo}>
        <Text style={styles.habitTitle}>{habit.title}</Text>
        <View style={styles.habitMeta}>
          {completedToday && (
            <View style={styles.donePill}>
              <Text style={styles.donePillText}>✓ Done today</Text>
            </View>
          )}
          <Text style={styles.habitStat}>
            {totalDays} day{totalDays !== 1 ? "s" : ""} total
          </Text>
        </View>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🌱</Text>
      <Text style={styles.emptyTitle}>No habits yet</Text>
      <Text style={styles.emptySubtext}>
        Add your first habit to start growing your plant!
      </Text>
      <TouchableOpacity style={styles.emptyAddButton} onPress={onAdd}>
        <Text style={styles.emptyAddButtonText}>+ Add your first habit</Text>
      </TouchableOpacity>
    </View>
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
  infoBanner: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  infoEmoji: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#795548",
    lineHeight: 18,
  },
  list: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  habitIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  habitIndexText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },
  habitInfo: {
    flex: 1,
    gap: 6,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  habitMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  donePill: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  donePillText: {
    fontSize: 11,
    color: "#2E7D32",
    fontWeight: "600",
  },
  habitStat: {
    fontSize: 12,
    color: "#BDBDBD",
  },
  habitActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    padding: 6,
  },
  editIcon: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  maxReached: {
    textAlign: "center",
    fontSize: 14,
    color: "#9E9E9E",
    paddingVertical: 8,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyAddButton: {
    marginTop: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
