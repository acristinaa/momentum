import { SettingsRow } from "@/components/SettingsRow";
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/services/notifications";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as SafeAreaViewContext } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";

const REMINDER_TIMES = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

export default function SettingsScreen() {
  const reminderEnabled = useAppStore((s) => s.reminderEnabled);
  const reminderTime = useAppStore((s) => s.reminderTime);
  const setReminderEnabled = useAppStore((s) => s.setReminderEnabled);
  const setReminderTime = useAppStore((s) => s.setReminderTime);
  const resetAll = useAppStore((s) => s.resetAll);
  const plant = useAppStore((s) => s.plant);
  const habits = useAppStore((s) => s.habits);

  const [timePickerVisible, setTimePickerVisible] = useState(false);

  async function handleReminderToggle(enabled: boolean) {
    if (enabled) {
      // Ask for permission before enabling
      const granted = await requestNotificationPermission();

      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to use reminders.",
          [{ text: "OK" }],
        );
        return; // Don't toggle on if permission denied
      }

      // Schedule the notification at the current reminder time
      await scheduleDailyReminder(reminderTime);
      setReminderEnabled(true);
    } else {
      // Cancel any scheduled notification
      await cancelDailyReminder();
      setReminderEnabled(false);
    }
  }

  // Replace the existing handleTimeSelect inside TimePicker usage
  async function handleTimeSelect(time: string) {
    setReminderTime(time);
    setTimePickerVisible(false);

    // If reminders are on, reschedule at the new time immediately
    if (reminderEnabled) {
      await scheduleDailyReminder(time);
    }
  }

  function handleResetPress() {
    Alert.alert(
      "Reset All Data",
      "This will delete your plant, all habits, and your entire history. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: () => {
            resetAll();
            router.replace("/onboarding");
          },
        },
      ],
    );
  }

  function formatTime(time: string): string {
    const [hourStr, minute] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute} ${period}`;
  }

  return (
    <SafeAreaViewContext style={styles.safe} edges={["left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </View>

        <View style={styles.plantCard}>
          <Text style={styles.plantEmoji}>
            {plant.stage === 1 ? "🌱" : plant.stage === 2 ? "🌿" : "🌸"}
          </Text>
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{plant.name || "No plant yet"}</Text>
            <Text style={styles.plantStats}>
              {habits.length} habit{habits.length !== 1 ? "s" : ""} ·{" "}
              {plant.experience} XP · Stage {plant.stage}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionRows}>
            <SettingsRow
              icon="🔔"
              label="Daily Reminder"
              description="Get a nudge to complete your habits"
              variant="toggle"
              value={reminderEnabled}
              onToggle={handleReminderToggle}
            />

            {reminderEnabled && (
              <SettingsRow
                icon="⏰"
                label="Reminder Time"
                description="When should we remind you?"
                variant="arrow"
                rightLabel={formatTime(reminderTime)}
                onPress={() => setTimePickerVisible(true)}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionRows}>
            <SettingsRow
              icon="🌱"
              label="Momentum"
              description="Build habits. Grow your plant."
              variant="arrow"
              rightLabel="v1.0.0"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.sectionRows}>
            <SettingsRow
              icon="🗑️"
              label="Reset All Data"
              description="Delete everything and start fresh"
              variant="destructive"
              onPress={handleResetPress}
            />
          </View>
        </View>
      </ScrollView>

      <TimePicker
        visible={timePickerVisible}
        selected={reminderTime}
        times={REMINDER_TIMES}
        onSelect={handleTimeSelect}
        onClose={() => setTimePickerVisible(false)}
        formatTime={formatTime}
      />
    </SafeAreaViewContext>
  );
}

interface TimePickerProps {
  visible: boolean;
  selected: string;
  times: string[];
  onSelect: (time: string) => void;
  onClose: () => void;
  formatTime: (time: string) => string;
}

function TimePicker({
  visible,
  selected,
  times,
  onSelect,
  onClose,
  formatTime,
}: TimePickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.pickerSheet}>
        <View style={styles.handle} />

        <Text style={styles.pickerTitle}>Reminder Time</Text>
        <Text style={styles.pickerSubtitle}>
          When should we remind you to complete your habits?
        </Text>

        <ScrollView
          style={styles.timeList}
          showsVerticalScrollIndicator={false}>
          {times.map((time) => {
            const isSelected = time === selected;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeRow, isSelected && styles.timeRowSelected]}
                onPress={() => onSelect(time)}>
                <Text
                  style={[
                    styles.timeRowText,
                    isSelected && styles.timeRowTextSelected,
                  ]}>
                  {formatTime(time)}
                </Text>
                {isSelected && <Text style={styles.timeRowCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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
    gap: 24,
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
  plantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  plantEmoji: {
    fontSize: 36,
  },
  plantInfo: {
    flex: 1,
    gap: 4,
  },
  plantName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#212121",
  },
  plantStats: {
    fontSize: 13,
    color: "#9E9E9E",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9E9E9E",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  sectionRows: {
    gap: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 4,
  },
  pickerSubtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    marginBottom: 16,
  },
  timeList: {
    maxHeight: 300,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  timeRowSelected: {
    backgroundColor: "#E8F5E9",
  },
  timeRowText: {
    fontSize: 16,
    color: "#424242",
  },
  timeRowTextSelected: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  timeRowCheck: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "700",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
