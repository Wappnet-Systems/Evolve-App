import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { useNavigation } from '@react-navigation/native';
// import { format } from '../../../../domain/usecases/';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock HomePresenter
jest.mock('../../../presenters/HomePresenter', () => {
  return {
    HomePresenter: jest.fn().mockImplementation(() => ({
      loadHabits: jest.fn().mockResolvedValue([
        {
          id: '1',
          name: 'Test Habit',
          emoji: '🏃',
          description: 'Test Description',
          time: new Date(),
          reminder: true,
          days: ['Monday'],
          duration: { hours: '1', minutes: '30' },
          lastCompleted: null,
          completedDates: [],
          startDay: new Date()
        }
      ]),
      completeHabit: jest.fn().mockResolvedValue(true),
      deleteHabit: jest.fn().mockResolvedValue(true),
      getReminderStatus: jest.fn().mockReturnValue('Reminder set'),
    })),
  };
});

// Mock HomeUseCases
jest.mock('../../../../domain/usecases/HomeUseCases', () => {
  return {
    HomeUseCases: jest.fn().mockImplementation(() => ({
      getReminderStatus: jest.fn().mockReturnValue('Reminder set'),
    })),
  };
});

// Mock HomeRepositoryImpl
jest.mock('../../../../data/repositories/HomeRepositoryImpl', () => {
  return {
    HomeRepositoryImpl: jest.fn().mockImplementation(() => ({
      // Add repository methods as needed
    })),
  };
});

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);
    
    expect(getByText('Hi, Mert 👋')).toBeTruthy();
    expect(getByText("Let's make habits together!")).toBeTruthy();
    expect(getByTestId('main-scroll-view')).toBeTruthy();
  });

  it('shows loading state initially', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('initial-loader')).toBeTruthy();
  });

  it('renders date selector with correct days', () => {
    const { getAllByTestId } = render(<HomeScreen />);
    const dayButtons = getAllByTestId(/day-button-/);
    expect(dayButtons.length).toBe(7); // 7 days in a week
  });

  it('handles date selection', () => {
    const { getAllByTestId } = render(<HomeScreen />);
    const dayButtons = getAllByTestId(/day-button-/);
    
    fireEvent.press(dayButtons[0]);
    // Add assertions for date change effects
  });

  it('shows progress card with correct completion status', async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText('No habits for today')).toBeTruthy();
    });
  });

  it('handles habit completion', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      const completeButton = getByTestId('complete-button-1');
      fireEvent.press(completeButton);
    });
  });

  it('handles habit deletion', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      const deleteButton = getByTestId('delete-button-1');
      fireEvent.press(deleteButton);
    });
  });

  it('navigates to habit detail on habit press', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      const habitCard = getByTestId('habit-card-1');
      fireEvent.press(habitCard);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('HabitDetail', expect.any(Object));
    });
  });

  it('handles pull to refresh', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      const scrollView = getByTestId('main-scroll-view');
      fireEvent.scroll(scrollView, {
        nativeEvent: {
          contentOffset: { y: -100 },
          contentSize: { height: 500, width: 100 },
          layoutMeasurement: { height: 100, width: 100 },
        },
      });
    });
  });

  it('shows toast messages for success and error', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByTestId('toast-message')).toBeTruthy();
    });
  });

  it('handles load more habits', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      const viewAllButton = getByTestId('view-all-button');
      fireEvent.press(viewAllButton);
    });
  });

  it('shows no habits message when there are no habits', async () => {
    const { getByText } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByText('No habits scheduled for this day')).toBeTruthy();
    });
  });
}); 