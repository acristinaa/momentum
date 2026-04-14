import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { getTodayString } from "../utils/dateUtils";

export function useDailyReset() {
  const lastOpenedDate = useAppStore((s) => s.lastOpenedDate);
  const handleAppForeground = useAppStore((s) => s.handleAppForeground);

  useEffect(() => {
    const today = getTodayString();

    // If app was last opened on a previous day, trigger foreground handler
    if (lastOpenedDate !== today) {
      handleAppForeground();
    }
  }, []);
}
