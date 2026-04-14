import { shareProgress } from "@/services/sharing";
import { Habit, Plant } from "@/types";
import { getTodayString } from "@/utils/dateUtils";

const mockShare = jest.fn().mockResolvedValue({ action: "sharedAction" });

jest.mock("react-native/Libraries/Share/Share", () => ({
  default: {
    share: mockShare,
    dismissedAction: "dismissedAction",
  },
}));

const today = getTodayString();

const mockPlant: Plant = {
  name: "Fern",
  stage: 2,
  experience: 10,
};

const mockHabits: Habit[] = [
  {
    id: "1",
    title: "Read",
    createdAt: today,
    completedDates: [today],
  },
];

describe("sharing service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShare.mockResolvedValue({ action: "sharedAction" });
  });

  test("calls Share.share with a message containing plant name", async () => {
    await shareProgress(mockPlant, mockHabits);
    expect(mockShare).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Fern"),
      }),
    );
  });

  test("includes plant stage in message", async () => {
    await shareProgress(mockPlant, mockHabits);
    const call = mockShare.mock.calls[0][0];
    expect(call.message).toContain("Sprout");
  });

  test("includes XP in message", async () => {
    await shareProgress(mockPlant, mockHabits);
    const call = mockShare.mock.calls[0][0];
    expect(call.message).toContain("10 XP");
  });

  test("returns true when user shares", async () => {
    const result = await shareProgress(mockPlant, mockHabits);
    expect(result).toBe(true);
  });

  test("returns false when user dismisses", async () => {
    mockShare.mockResolvedValue({ action: "dismissedAction" });
    const result = await shareProgress(mockPlant, mockHabits);
    expect(result).toBe(false);
  });
});
