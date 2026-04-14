# Momentum

A mobile habit tracker where your consistency grows a virtual plant.
Built with React Native, Expo, and TypeScript.

---

## Features

- **Onboarding** — Name your plant, add 1–3 daily habits
- **Home Screen** — See your plant, tick off today's habits, track your streak
- **Habit Management** — Add, edit, delete habits (max 3)
- **Plant Evolution** — 3 visual stages based on your XP
- **Progress Screen** — Streak, 14-day calendar, stats, share button
- **Settings** — Daily reminders, time picker, reset data
- **Notifications** — Local daily reminders via Expo Notifications
- **Persistence** — All state saved via AsyncStorage across restarts
- **Sharing** — Native share sheet with your progress summary

---

## Tech Stack

| Tool                | Purpose                    |
| ------------------- | -------------------------- |
| React Native + Expo | Mobile framework           |
| TypeScript          | Type safety                |
| Expo Router         | File-based navigation      |
| Zustand             | Global state management    |
| AsyncStorage        | Local data persistence     |
| Expo Notifications  | Local push reminders       |
| Jest + RNTL         | Unit and component testing |

---

## Project Structure

```
momentum/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout + hydration
│   ├── index.tsx               # Entry redirect
│   ├── onboarding.tsx          # Onboarding flow
│   └── (tabs)/
│       ├── _layout.tsx         # Tab bar config
│       ├── index.tsx           # Home screen
│       ├── habits.tsx          # Habits screen
│       ├── progress.tsx        # Progress screen
│       └── settings.tsx        # Settings screen
├── types/
│   └── index.ts                # TypeScript data models
├── store/
│   └── useAppStore.ts          # Zustand global store
├── services/
│   ├── storage.ts              # AsyncStorage read/write
│   ├── notifications.ts        # Expo notifications
│   └── sharing.ts              # Native share API
├── hooks/
│   ├── useAppLifecycle.ts      # Foreground/background detection
│   └── useDailyReset.ts        # New day detection
├── utils/
│   ├── dateUtils.ts            # Date helpers + streak calc
│   ├── plantUtils.ts           # XP + stage logic
│   └── habitUtils.ts           # Habit completion logic
├── components/
│   ├── PlantDisplay.tsx        # Visual plant (3 stages)
│   ├── HabitCard.tsx           # Tappable habit row
│   ├── HabitFormModal.tsx      # Add/edit bottom sheet
│   ├── StreakBadge.tsx         # Streak counter
│   ├── ProgressBar.tsx         # XP fill bar
│   ├── CalendarStrip.tsx       # 14-day dot calendar
│   ├── SettingsRow.tsx         # Reusable settings row
│   └── StepIndicator.tsx       # Onboarding dots
├── constants/
│   ├── colors.ts               # Centralized color tokens
│   └── theme.ts                # Theme constants
├── __mocks__/
│   └── expo-notifications.js   # Jest mock
├── __tests__/                  # All test suites
└── jest.setup.ts               # Jest global setup
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go on device)

### Install

```bash
git clone https://github.com/yourusername/momentum.git
cd momentum
npm install
```

### Run

```bash
npx expo start
```

Then press `i` for iOS simulator or `a` for Android emulator.

### Test

```bash
npx jest
```

---

## Business Logic

### Points System

| Action                       | Points              |
| ---------------------------- | ------------------- |
| Complete one habit           | +1 XP               |
| Complete ALL habits in a day | +1 bonus XP         |
| Missing a day                | No penalty, no gain |

### Plant Stages

| Stage    | XP Required | Label   |
| -------- | ----------- | ------- |
| Seedling | 0–6 XP      | Stage 1 |
| Sprout   | 7–20 XP     | Stage 2 |
| Blooming | 21+ XP      | Stage 3 |

### Streak

A streak increments for every consecutive day where at least one habit was completed. Missing a day stops the streak but does not reset XP.

---

## Testing

Tests are written with Jest and React Native Testing Library.

```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage

# Run in watch mode during development
npx jest --watch
```

### Test coverage includes:

- All utility functions (date, plant, habit logic)
- Zustand store actions
- AsyncStorage service
- Notifications service
- Sharing service
- All reusable components
- All screen-level integration tests

---

## Data Models

```typescript
interface Habit {
  id: string;
  title: string;
  createdAt: string; // "YYYY-MM-DD"
  completedDates: string[]; // ["YYYY-MM-DD", ...]
}

interface Plant {
  name: string;
  stage: 1 | 2 | 3;
  experience: number;
}

interface AppData {
  habits: Habit[];
  plant: Plant;
  lastOpenedDate: string;
  reminderEnabled: boolean;
  reminderTime: string; // "HH:MM"
  hasCompletedOnboarding: boolean;
}
```

---

## Future Improvements

- [ ] Animated plant transitions between stages
- [ ] Multiple plants / plant selection
- [ ] Weekly and monthly habit history charts
- [ ] Habit categories and icons
- [ ] iCloud / Google account sync
- [ ] Widget support (iOS/Android)
- [ ] Dark mode support

---

## License

MIT — free to use and modify.

---

Built with React Native.
