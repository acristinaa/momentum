import {
  cancelDailyReminder,
  checkNotificationPermission,
  isDailyReminderScheduled,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/services/notifications";
import * as Notifications from "expo-notifications";

describe("notifications service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("requestNotificationPermission returns true when granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    const result = await requestNotificationPermission();
    expect(result).toBe(true);
  });

  test("requestNotificationPermission requests if not yet granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    const result = await requestNotificationPermission();
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("requestNotificationPermission returns false when denied", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
    const result = await requestNotificationPermission();
    expect(result).toBe(false);
  });

  test("scheduleDailyReminder cancels existing then schedules new", async () => {
    await scheduleDailyReminder("08:30");
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: "daily-reminder",
        content: expect.objectContaining({
          title: "🌱 Time to tend your garden!",
        }),
      }),
    );
  });

  test("scheduleDailyReminder parses time correctly", async () => {
    await scheduleDailyReminder("14:30");
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({
          hour: 14,
          minute: 30,
        }),
      }),
    );
  });

  test("cancelDailyReminder calls cancel with correct id", async () => {
    await cancelDailyReminder();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      "daily-reminder",
    );
  });

  test("isDailyReminderScheduled returns false when none scheduled", async () => {
    (
      Notifications.getAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValue([]);
    const result = await isDailyReminderScheduled();
    expect(result).toBe(false);
  });

  test("isDailyReminderScheduled returns true when scheduled", async () => {
    (
      Notifications.getAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValue([{ identifier: "daily-reminder" }]);
    const result = await isDailyReminderScheduled();
    expect(result).toBe(true);
  });

  test("checkNotificationPermission returns true when granted", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    const result = await checkNotificationPermission();
    expect(result).toBe(true);
  });
});
