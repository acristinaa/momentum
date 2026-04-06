import { useAppStore } from "@/store/useAppStore";
import { Stack, router } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    // Redirect based on onboarding state
    if (hasCompletedOnboarding) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  }, [hasCompletedOnboarding]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
