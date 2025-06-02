import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HabitDetailScreen from '../HabitDetailScreen';
import { HabitDetailUseCases } from '../../../../domain/usecases/HabitDetailUseCases';
import { HabitDetailRepositoryImpl } from '../../../../data/repositories/HabitDetailRepositoryImpl';
import { format } from 'date-fns';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('../../../../data/repositories/HabitDetailRepositoryImpl');
jest.mock('../../../../domain/usecases/HabitDetailUseCases');
jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {
    app: jest.fn(),
    apps: [],
    initializeApp: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
      doc: jest.fn(() => ({
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    })),
  })),
}));

// Mock navigation and route
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    habitName: 'Test Habit',
    habitIcon: '✨',
    habitId: {
      id: '123',
      name: 'Test Habit',
      emoji: '✨',
      description: 'Test Description',
      time: new Date(),
      reminder: false,
      days: ['Monday', 'Wednesday'],
      duration: { hours: '1', minutes: '30' },
      lastCompleted: null,
      completedDates: [],
      startDay: new Date(),
    },
  },
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => mockRoute,
}));

describe('HabitDetailScreen', () => {
  let mockHabitDetailUseCases: jest.Mocked<HabitDetailUseCases>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHabitDetailUseCases = {
      saveHabitDetail: jest.fn().mockResolvedValue(undefined),
      getHabitDetail: jest.fn().mockResolvedValue(mockRoute.params.habitId),
    } as unknown as jest.Mocked<HabitDetailUseCases>;

    // Mock HabitDetailRepositoryImpl
    (HabitDetailRepositoryImpl as jest.Mock).mockImplementation(() => ({
      saveHabitDetail: jest.fn(),
      getHabitDetail: jest.fn(),
    }));

    // Mock HabitDetailUseCases
    (HabitDetailUseCases as jest.Mock).mockImplementation(() => mockHabitDetailUseCases);
  });

  it('renders correctly with initial habit data', async () => {
    const { getByText } = render(<HabitDetailScreen />);
    
    await waitFor(() => {
      expect(getByText('Habit Details')).toBeTruthy();
      expect(getByText('✨ Test Habit')).toBeTruthy();
      expect(getByText('Start Day')).toBeTruthy();
      expect(getByText('Duration')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
      expect(getByText('Time')).toBeTruthy();
      expect(getByText('Repeat on')).toBeTruthy();
    });
  });

  it('allows editing description', async () => {
    const { getByPlaceholderText } = render(<HabitDetailScreen />);
    
    await act(async () => {
      const input = getByPlaceholderText('Enter habit description');
      fireEvent.changeText(input, 'New Description');
    });

    await waitFor(() => {
      expect(getByPlaceholderText('Enter habit description').props.value).toBe('New Description');
    });
  });

  it('toggles reminder status', async () => {
    const { getByText } = render(<HabitDetailScreen />);
    
    await act(async () => {
      const reminderToggle = getByText('Enable Reminder');
      fireEvent.press(reminderToggle);
    });

    await waitFor(() => {
      const checkbox = getByText('✓');
      expect(checkbox).toBeTruthy();
    });
  });

  it('toggles days selection', async () => {
    const { getByTestId } = render(<HabitDetailScreen />);
    
    const mondayButton = getByTestId('day-button-Monday');
    const tuesdayButton = getByTestId('day-button-Tuesday');
  
    // Toggle Monday (initially selected) and Tuesday (initially unselected)
    act(() => {
      fireEvent.press(mondayButton);
      fireEvent.press(tuesdayButton);
    });
  
    await waitFor(() => {
        expect(mondayButton.props.style).not.toMatchObject({
          backgroundColor: '#A54F31',
        });
      
        expect(tuesdayButton.props.style).toMatchObject({
          backgroundColor: '#A54F31',
        });
      });
  });
  
  it('shows duration picker when duration button is pressed', async () => {
    const { getByText } = render(<HabitDetailScreen />);
    
    await act(async () => {
      const durationButton = getByText('1 hour 30 minutes');
      fireEvent.press(durationButton);
    });

    await waitFor(() => {
      expect(getByText('Select Duration')).toBeTruthy();
      expect(getByText('Minutes')).toBeTruthy();
      expect(getByText('Hours')).toBeTruthy();
    });
  });

  it('saves changes when save button is pressed', async () => {
    const { getByText } = render(<HabitDetailScreen />);
    
    await act(async () => {
      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(mockHabitDetailUseCases.saveHabitDetail).toHaveBeenCalled();
    });
  });

  it('navigates back when back button is pressed', async () => {
    const { getByTestId } = render(<HabitDetailScreen />);
    
    await act(async () => {
      const backButton = getByTestId('back-button');
      fireEvent.press(backButton);
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('shows error toast when setting past start date', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const { getByText, getByTestId } = render(<HabitDetailScreen />);
    
    await act(async () => {
      const startDayButton = getByText(format(new Date(), 'MMMM d, yyyy'));
      fireEvent.press(startDayButton);
    });

    // Simulate the date picker selection
    await act(async () => {
      const mockDatePickerProps = {
        type: 'set',
        nativeEvent: { timestamp: pastDate.getTime() }
      };
      
      // Find and trigger the DateTimePicker's onChange prop
      const datePickerComponent = getByTestId('mockDateTimePicker');
      if (datePickerComponent) {
        fireEvent(datePickerComponent, 'onChange', mockDatePickerProps, pastDate);
      }
    });

    await waitFor(() => {
      expect(getByText('Cannot set start date in the past')).toBeTruthy();
    });
  });
}); 