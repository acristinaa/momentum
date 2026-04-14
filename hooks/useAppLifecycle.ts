import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAppStore } from "../store/useAppStore";

export function useAppLifecycle() {
  const handleAppForeground = useAppStore((s) => s.handleAppForeground);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        const wasBackground =
          appStateRef.current === "background" ||
          appStateRef.current === "inactive";
        const isNowActive = nextState === "active";

        if (wasBackground && isNowActive) {
          handleAppForeground();
        }

        appStateRef.current = nextState;
      },
    );

    return () => subscription.remove();
  }, [handleAppForeground]);
}
