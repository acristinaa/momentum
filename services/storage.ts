import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppData } from "../types";

const STORAGE_KEY = "@momentum_app_data";

export async function saveAppData(data: AppData): Promise<void> {
  try {
    const serialized = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("[Storage] Failed to save app data:", error);
  }
}

export async function loadAppData(): Promise<AppData | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppData;
  } catch (error) {
    console.error("[Storage] Failed to load app data:", error);
    return null;
  }
}

export async function clearAppData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("[Storage] Failed to clear app data:", error);
  }
}
