import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HabitFormModalProps {
  visible: boolean;
  initialValue?: string;
  onConfirm: (title: string) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

export function HabitFormModal({
  visible,
  initialValue = "",
  onConfirm,
  onCancel,
  mode,
}: HabitFormModalProps) {
  const [title, setTitle] = useState(initialValue);

  useEffect(() => {
    if (visible) setTitle(initialValue);
  }, [visible, initialValue]);

  function handleConfirm() {
    if (!title.trim()) return;
    onConfirm(title.trim());
    setTitle("");
  }

  function handleCancel() {
    setTitle("");
    onCancel();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleCancel}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>
            {mode === "add" ? "New Habit" : "Edit Habit"}
          </Text>
          <Text style={styles.subtitle}>
            {mode === "add"
              ? "What habit do you want to build?"
              : "Update your habit name"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Read 10 pages, Drink water..."
            placeholderTextColor="#BDBDBD"
            value={title}
            onChangeText={setTitle}
            maxLength={40}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !title.trim() && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!title.trim()}>
              <Text style={styles.confirmText}>
                {mode === "add" ? "Add Habit" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  subtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#212121",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#C8E6C9",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
