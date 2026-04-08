import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HabitCard } from '@/components/HabitCard';
import { Habit } from '@/types';
import { getTodayString } from '@/utils/dateUtils';

const today = getTodayString();

const mockHabit: Habit = {
  id: '1',
  title: 'Read 10 pages',
  createdAt: today,
  completedDates: [],
};

const completedHabit: Habit = {
  ...mockHabit,
  completedDates: [today],
};

describe('HabitCard', () => {
  test('renders habit title', () => {
    const { getByText } = render(
      <HabitCard habit={mockHabit} onToggle={jest.fn()} />
    );
    expect(getByText('Read 10 pages')).toBeTruthy();
  });

  test('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <HabitCard habit={mockHabit} onToggle={onToggle} />
    );
    fireEvent.press(getByText('Read 10 pages'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  test('shows checkmark when completed today', () => {
    const { getByText } = render(
      <HabitCard habit={completedHabit} onToggle={jest.fn()} />
    );
    expect(getByText('✓')).toBeTruthy();
  });
});