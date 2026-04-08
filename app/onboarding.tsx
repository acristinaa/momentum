import { StepIndicator } from "@/components/StepIndicator";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HabitInput {
  id: string;
  title: string;
}

const MAX_HABITS = 3; // for now
const TOTAL_STEPS = 3;

export default function OnboardingScreen() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [plantName, setPlantName] = useState("");
  const [habits, setHabits] = useState<HabitInput[]>([]);
  const [habitInput, setHabitInput] = useState("");

  function handleNextFromStep1() {
    if (!plantName.trim()) {
      Alert.alert("Give your plant a name!", "It needs an identity 🌱");
      return;
    }
    setStep(1);
  }

  function handleAddHabit() {
    if (!habitInput.trim()) return;
    if (habits.length >= MAX_HABITS) return;

    setHabits((prev) => [
      ...prev,
      { id: `tmp_${Date.now()}`, title: habitInput.trim() },
    ]);
    setHabitInput("");
  }

  function handleRemoveHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function handleNextFromStep2() {
    if (habits.length === 0) {
      Alert.alert("Add at least one habit!", "Even one small habit counts 💪");
      return;
    }
    setStep(2);
  }

  function handleFinish() {
    completeOnboarding(
      plantName.trim(),
      habits.map((h) => ({ title: h.title })),
    );
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
          <StepIndicator total={TOTAL_STEPS} current={step} />

          <View style={styles.content}>
            {step === 0 && (
              <Step1
                plantName={plantName}
                onChangeName={setPlantName}
                onNext={handleNextFromStep1}
              />
            )}
            {step === 1 && (
              <Step2
                habits={habits}
                habitInput={habitInput}
                onChangeInput={setHabitInput}
                onAddHabit={handleAddHabit}
                onRemoveHabit={handleRemoveHabit}
                onNext={handleNextFromStep2}
              />
            )}
            {step === 2 && (
              <Step3
                plantName={plantName}
                habits={habits}
                onFinish={handleFinish}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface Step1Props {
  plantName: string;
  onChangeName: (name: string) => void;
  onNext: () => void;
}

function Step1({ plantName, onChangeName, onNext }: Step1Props) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🌱</Text>
      <Text style={styles.title}>Welcome to Momentum</Text>
      <Text style={styles.subtitle}>
        Build daily habits and watch your plant grow with you.
      </Text>

      <Text style={styles.label}>Give your plant a name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Fern, Buddy, Sprout..."
        placeholderTextColor="#BDBDBD"
        value={plantName}
        onChangeText={onChangeName}
        maxLength={20}
        autoFocus
        returnKeyType="next"
        onSubmitEditing={onNext}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
        <Text style={styles.primaryButtonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
}

interface Step2Props {
  habits: HabitInput[];
  habitInput: string;
  onChangeInput: (text: string) => void;
  onAddHabit: () => void;
  onRemoveHabit: (id: string) => void;
  onNext: () => void;
}

function Step2({
  habits,
  habitInput,
  onChangeInput,
  onAddHabit,
  onRemoveHabit,
  onNext,
}: Step2Props) {
  const canAddMore = habits.length < MAX_HABITS;

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={styles.title}>Your Daily Habits</Text>
      <Text style={styles.subtitle}>
        Add up to 3 habits you want to build. Keep them simple and achievable.
      </Text>

      {canAddMore && (
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="e.g. Read 10 pages..."
            placeholderTextColor="#BDBDBD"
            value={habitInput}
            onChangeText={onChangeInput}
            maxLength={40}
            returnKeyType="done"
            onSubmitEditing={onAddHabit}
          />
          <TouchableOpacity style={styles.addButton} onPress={onAddHabit}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {habits.map((h) => (
        <View key={h.id} style={styles.habitRow}>
          <Text style={styles.habitBullet}>🌿</Text>
          <Text style={styles.habitTitle}>{h.title}</Text>
          <TouchableOpacity onPress={() => onRemoveHabit(h.id)}>
            <Text style={styles.removeButton}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.counter}>
        {habits.length}/{MAX_HABITS} habits added
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
        <Text style={styles.primaryButtonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
}

interface Step3Props {
  plantName: string;
  habits: HabitInput[];
  onFinish: () => void;
}

function Step3({ plantName, habits, onFinish }: Step3Props) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>You&apos;re all set!</Text>
      <Text style={styles.subtitle}>
        Your plant <Text style={styles.highlight}>{plantName}</Text> is ready to
        grow with you.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your habits:</Text>
        {habits.map((h) => (
          <Text key={h.id} style={styles.summaryHabit}>
            ✓ {h.title}
          </Text>
        ))}
      </View>

      <Text style={styles.hint}>
        Complete your habits daily to earn points and evolve your plant 🌸
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onFinish}>
        <Text style={styles.primaryButtonText}>Start Growing!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  stepContainer: {
    alignItems: "center",
    gap: 16,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#757575",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#212121",
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    width: undefined, // override 100% when in a row
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E8F5E9",
    gap: 10,
  },
  habitBullet: {
    fontSize: 16,
  },
  habitTitle: {
    flex: 1,
    fontSize: 15,
    color: "#212121",
  },
  removeButton: {
    color: "#BDBDBD",
    fontSize: 16,
    fontWeight: "600",
    padding: 4,
  },
  counter: {
    fontSize: 13,
    color: "#9E9E9E",
    alignSelf: "flex-end",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  summaryCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
    marginBottom: 4,
  },
  summaryHabit: {
    fontSize: 15,
    color: "#2E7D32",
    fontWeight: "500",
  },
  hint: {
    fontSize: 13,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  highlight: {
    color: "#4CAF50",
    fontWeight: "700",
  },
});
