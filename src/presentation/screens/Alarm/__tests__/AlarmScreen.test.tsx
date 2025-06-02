import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AlarmRepositoryImpl } from '../../../../data/repositories/AlarmRepositoryImpl';
import notifee from '@notifee/react-native';
import { useAlarmPresenter } from '../../../presenters/AlarmPresenter';
import AlarmScreen from '../AlarmScreen';

// Create a mock callback storage
let mockCallback: ((event: any) => void) | null = null;

// Mock the dependencies
jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn().mockResolvedValue({
    ios: { criticalAlert: true },
    android: { alarm: true }
  }),
  onForegroundEvent: jest.fn().mockImplementation(callback => {
    mockCallback = callback;
    return () => {
      mockCallback = null;
    };
  }),
  EventType: {
    PRESS: 'PRESS',
    DELIVERED: 'DELIVERED',
  },
}));

// Mock the AlarmPresenter hook
const mockUseAlarmPresenter = {
  alarms: [],
  showTimePicker: false,
  selectedTime: new Date(),
  showPuzzleTypeModal: false,
  setShowTimePicker: jest.fn(),
  handleTimePickerChange: jest.fn(),
  handlePuzzleTypeSelect: jest.fn(),
  handleToggleAlarm: jest.fn(),
  handleDeleteAlarm: jest.fn(),
  setShowPuzzleTypeModal: jest.fn(),
  loading: false,
};

jest.mock('../../../presenters/AlarmPresenter', () => ({
  useAlarmPresenter: () => mockUseAlarmPresenter,
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('AlarmScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockAlarms = [
    {
      id: '1',
      time: '08:00',
      days: ['Mon', 'Wed', 'Fri'],
      isEnabled: true,
    },
    {
      id: '2',
      time: '09:00',
      days: ['Tue', 'Thu'],
      isEnabled: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = null;
    // Reset mock values
    Object.assign(mockUseAlarmPresenter, {
      alarms: mockAlarms,
      showTimePicker: false,
      selectedTime: new Date(),
      showPuzzleTypeModal: false,
      setShowTimePicker: jest.fn(),
      handleTimePickerChange: jest.fn(),
      handlePuzzleTypeSelect: jest.fn(),
      handleToggleAlarm: jest.fn(),
      handleDeleteAlarm: jest.fn(),
      setShowPuzzleTypeModal: jest.fn(),
      loading: false,
    });
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <AlarmScreen navigation={mockNavigation as any} />
    );

    expect(getByText('Alarms')).toBeTruthy();
    expect(getByTestId('header-back-button')).toBeTruthy();
  });

  it('displays loading indicator when loading is true', () => {
    mockUseAlarmPresenter.loading = true;

    const { getByTestId } = render(
      <AlarmScreen navigation={mockNavigation as any} />
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders alarm list correctly', () => {
    const { getByText } = render(
      <AlarmScreen navigation={mockNavigation as any} />
    );

    expect(getByText('08:00')).toBeTruthy();
    expect(getByText('09:00')).toBeTruthy();
  });

  it('handles alarm toggle', () => {
    const handleToggleAlarm = jest.fn();
    mockUseAlarmPresenter.handleToggleAlarm = handleToggleAlarm;

    const { getAllByRole } = render(
      <AlarmScreen navigation={mockNavigation as any} />
    );

    const switches = getAllByRole('switch');
    fireEvent(switches[0], 'valueChange', true);

    expect(handleToggleAlarm).toHaveBeenCalledWith('1');
  });

  it('shows delete confirmation dialog', () => {
    const { getAllByTestId } = render(
      <AlarmScreen navigation={mockNavigation as any} />
    );

    const deleteButtons = getAllByTestId('delete-alarm-button');
    fireEvent.press(deleteButtons[0]);

    // Note: You might need to mock Alert.alert to test this properly
  });

  it('handles time picker visibility', () => {
    const setShowTimePicker = jest.fn();
    mockUseAlarmPresenter.setShowTimePicker = setShowTimePicker;

    const { getByTestId } = render(
      <AlarmScreen navigation={mockNavigation as any} />
    );

    const addButton = getByTestId('add-alarm-button');
    fireEvent.press(addButton);

    expect(setShowTimePicker).toHaveBeenCalledWith(true);
  });

  it('requests notification permissions on mount', async () => {
    render(<AlarmScreen navigation={mockNavigation as any} />);

    await waitFor(() => {
      expect(notifee.requestPermission).toHaveBeenCalled();
    });
  });

  it('sets up notification event listener on mount', () => {
    render(<AlarmScreen navigation={mockNavigation as any} />);

    expect(notifee.onForegroundEvent).toHaveBeenCalled();
  });

  it('navigates to PuzzleScreen when notification is received', async () => {
    render(<AlarmScreen navigation={mockNavigation as any} />);

    if (!mockCallback) {
      throw new Error('Callback not set');
    }

    await mockCallback({
      type: 'PRESS',
      detail: {
        notification: {
          id: 'test-alarm-id',
          data: {
            puzzleType: 'math',
          },
        },
      },
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PuzzleScreen', {
      alarmId: 'test-alarm-id',
      puzzleType: 'math',
    });
  });
}); 