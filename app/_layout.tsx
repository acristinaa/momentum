import { useAppLifecycle } from "@/hooks/useAppLifecycle";
import { useDailyReset } from "@/hooks/useDailyReset";
import {
  checkNotificationPermission,
  scheduleDailyReminder,
} from "@/services/notifications";
import { loadAppData } from "@/services/storage";
import * as Notifications from "expo-notifications";
import { Slot, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppStore } from "../store/useAppStore";

export default function RootLayout() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const reminderEnabled = useAppStore((s) => s.reminderEnabled);
  const reminderTime = useAppStore((s) => s.reminderTime);
  const loadFromStorage = useAppStore((s) => s.loadFromStorage);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Keep a ref to the notification listener so we can remove it on unmount
  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);

  useAppLifecycle();
  useDailyReset();

  // Hydrate state from AsyncStorage
  useEffect(() => {
    async function hydrate() {
      const saved = await loadAppData();
      if (saved) {
        loadFromStorage(saved);
      }
      setIsLoading(false);
      setMounted(true);
    }
    hydrate();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (hasCompletedOnboarding) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  }, [mounted, isLoading, hasCompletedOnboarding]);

  // Re-sync notification schedule when app loads
  useEffect(() => {
    async function syncNotification() {
      if (!hasCompletedOnboarding || !reminderEnabled) return;

      const hasPermission = await checkNotificationPermission();
      if (hasPermission) {
        await scheduleDailyReminder(reminderTime);
      }
    }

    if (mounted) syncNotification();
  }, [mounted, hasCompletedOnboarding, reminderEnabled, reminderTime]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "[Notification received]",
          notification.request.content.title,
        );
      });

    return () => {
      notificationListener.current?.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
