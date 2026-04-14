import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = "momentum-daily-reminder";

const NOTIFICATION_ID = "daily-reminder";

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Daily Reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  // Already granted — no need to ask again
  if (existingStatus === "granted") return true;

  // Ask the user
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function checkNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/*Schedules a daily repeating notification at the given time. Cancels any existing reminder first so there's only ever one scheduled. @param time - "HH:MM" format e.g. "08:00"*/
export async function scheduleDailyReminder(time: string): Promise<void> {
  // Always cancel existing before scheduling a new one
  await cancelDailyReminder();

  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: "🌱 Time to tend your garden!",
      body: "Complete your habits today and help your plant grow.",
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
}

export async function isDailyReminderScheduled(): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === NOTIFICATION_ID);
}
