import { clearAppData, loadAppData, saveAppData } from "@/services/storage";
import { AppData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// jest-expo sets up AsyncStorage mock automatically
const mockData: AppData = {
  habits: [],
  plant: { name: "Fern", stage: 1, experience: 0 },
  lastOpenedDate: "2024-01-15",
  reminderEnabled: false,
  reminderTime: "08:00",
  hasCompletedOnboarding: true,
};

describe("storage service", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test("saveAppData stores data correctly", async () => {
    await saveAppData(mockData);
    const raw = await AsyncStorage.getItem("@momentum_app_data");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).plant.name).toBe("Fern");
  });

  test("loadAppData returns null when nothing saved", async () => {
    const result = await loadAppData();
    expect(result).toBeNull();
  });

  test("loadAppData returns saved data", async () => {
    await saveAppData(mockData);
    const result = await loadAppData();
    expect(result).not.toBeNull();
    expect(result?.plant.name).toBe("Fern");
    expect(result?.hasCompletedOnboarding).toBe(true);
  });

  test("clearAppData removes saved data", async () => {
    await saveAppData(mockData);
    await clearAppData();
    const result = await loadAppData();
    expect(result).toBeNull();
  });

  test("loadAppData returns null on corrupt data", async () => {
    // Manually write invalid JSON
    await AsyncStorage.setItem("@momentum_app_data", "not-valid-json{{{");
    const result = await loadAppData();
    expect(result).toBeNull();
  });
});
