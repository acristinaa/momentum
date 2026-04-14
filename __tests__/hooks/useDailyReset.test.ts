import { useDailyReset } from "@/hooks/useDailyReset";
import { renderHook } from "@testing-library/react-native";
import { useAppStore } from "../../store/useAppStore";

beforeEach(() => {
  useAppStore.getState().resetAll();
});

describe("useDailyReset", () => {
  test("does not trigger reset if already opened today", () => {
    const handleAppForeground = jest.fn();

    // Set lastOpenedDate to today so no reset is needed
    useAppStore.setState({
      lastOpenedDate: new Date().toISOString().split("T")[0],
      handleAppForeground,
    } as never);

    renderHook(() => useDailyReset());
    expect(handleAppForeground).not.toHaveBeenCalled();
  });

  test("triggers reset if last opened on a previous day", () => {
    const handleAppForeground = jest.fn();

    // Set lastOpenedDate to yesterday
    useAppStore.setState({
      lastOpenedDate: "2020-01-01",
      handleAppForeground,
    } as never);

    renderHook(() => useDailyReset());
    expect(handleAppForeground).toHaveBeenCalled();
  });
});
