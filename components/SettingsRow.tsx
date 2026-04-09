import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

type RowVariant = "toggle" | "arrow" | "destructive";

interface SettingsRowProps {
  icon: string;
  label: string;
  description?: string;
  variant: RowVariant;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  rightLabel?: string;
}

export function SettingsRow({
  icon,
  label,
  description,
  variant,
  value,
  onToggle,
  onPress,
  rightLabel,
}: SettingsRowProps) {
  const isDestructive = variant === "destructive";

  const Inner = (
    <View style={styles.inner}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.label, isDestructive && styles.labelDestructive]}>
          {label}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={styles.right}>
        {variant === "toggle" && (
          <Switch
            value={value ?? false}
            onValueChange={onToggle}
            trackColor={{ false: "#E0E0E0", true: "#A5D6A7" }}
            thumbColor={value ? "#4CAF50" : "#F5F5F5"}
          />
        )}
        {variant === "arrow" && (
          <>
            {rightLabel && <Text style={styles.rightLabel}>{rightLabel}</Text>}
            <Text style={styles.arrow}>›</Text>
          </>
        )}
      </View>
    </View>
  );

  if (variant === "toggle") {
    return <View style={styles.row}>{Inner}</View>;
  }

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {Inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },
  labelDestructive: {
    color: "#E53935",
  },
  description: {
    fontSize: 12,
    color: "#9E9E9E",
    lineHeight: 16,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rightLabel: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  arrow: {
    fontSize: 22,
    color: "#BDBDBD",
    lineHeight: 24,
  },
});
