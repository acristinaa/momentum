import { useAppLifecycle } from "@/hooks/useAppLifecycle";
import { useDailyReset } from "@/hooks/useDailyReset";
import { loadAppData } from "@/services/storage";
import { Slot, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppStore } from "../store/useAppStore";

export default function RootLayout() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const loadFromStorage = useAppStore((s) => s.loadFromStorage);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useAppLifecycle();
  useDailyReset();

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
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (hasCompletedOnboarding) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  }, [mounted, isLoading, hasCompletedOnboarding]);

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
