import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateHabitScreen from '../CreateHabitScreen';
import { HabitUseCases } from '../../../../domain/usecases/HabitUseCases';
import { HabitRepositoryImpl } from '../../../../data/repositories/HabitRepositoryImpl';
import { habitCategories } from '../../../../constants/habitCategories';

// Mock Firebase
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

// Mock other dependencies
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../../../../data/repositories/HabitRepositoryImpl');
jest.mock('../../../../domain/usecases/HabitUseCases');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

describe('CreateHabitScreen', () => {
  let mockHabitUseCases: jest.Mocked<HabitUseCases>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHabitUseCases = {
      createHabit: jest.fn().mockResolvedValue(undefined),
      getAllHabits: jest.fn().mockResolvedValue([]),
      getHabitById: jest.fn(),
      updateHabit: jest.fn(),
      deleteHabit: jest.fn(),
    } as unknown as jest.Mocked<HabitUseCases>;

    // Mock HabitRepositoryImpl
    (HabitRepositoryImpl as jest.Mock).mockImplementation(() => ({
      createHabit: jest.fn(),
      getAllHabits: jest.fn(),
      getHabitById: jest.fn(),
      updateHabit: jest.fn(),
      deleteHabit: jest.fn(),
    }));

    // Mock HabitUseCases
    (HabitUseCases as jest.Mock).mockImplementation(() => mockHabitUseCases);
  });

  it('renders correctly with initial state', () => {
    const { getByText } = render(<CreateHabitScreen />);
    expect(getByText('Create a Habit')).toBeTruthy();
    expect(getByText('Or')).toBeTruthy();
    expect(getByText('Custom Habit')).toBeTruthy();
  });

  it('displays all habit categories', () => {
    const { getByText } = render(<CreateHabitScreen />);
    habitCategories.forEach(category => {
      expect(getByText(category.name)).toBeTruthy();
    });
  });

  it('opens custom habit modal when custom habit button is pressed', () => {
    const { getByText } = render(<CreateHabitScreen />);
    const customHabitButton = getByText('Custom Habit');
    fireEvent.press(customHabitButton);
    expect(getByText('Create New Habit')).toBeTruthy();
  });

  it('shows habit list when category is pressed', () => {
    const { getByText } = render(<CreateHabitScreen />);
    const firstCategory = habitCategories[0];
    fireEvent.press(getByText(firstCategory.name));
    firstCategory.habits.forEach(habit => {
      expect(getByText(habit.name)).toBeTruthy();
    });
  });

  it('hides habit list when same category is pressed again', () => {
    const { getByText, queryByText } = render(<CreateHabitScreen />);
    const firstCategory = habitCategories[0];
    const firstHabit = firstCategory.habits[0];
    
    // First press to show
    fireEvent.press(getByText(firstCategory.name));
    expect(getByText(firstHabit.name)).toBeTruthy();
    
    // Second press to hide
    fireEvent.press(getByText(firstCategory.name));
    expect(queryByText(firstHabit.name)).toBeNull();
  });

  it('allows creating a custom habit', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateHabitScreen />);
    
    // Open custom habit modal
    fireEvent.press(getByText('Custom Habit'));
    
    // Enter habit name
    const input = getByPlaceholderText('Enter habit name');
    fireEvent.changeText(input, 'New Test Habit');
    
    // Press add habit button
    const addButton = getByText('Add Habit');
    fireEvent.press(addButton);
    
    await waitFor(() => {
      expect(mockHabitUseCases.createHabit).toHaveBeenCalled();
    });
  });

  it('allows emoji selection', () => {
    const { getByText } = render(<CreateHabitScreen />);
    
    // Open custom habit modal
    fireEvent.press(getByText('Custom Habit'));
    
    // Initial emoji should be visible
    expect(getByText('✨')).toBeTruthy();
    
    // Press emoji selector
    fireEvent.press(getByText('✨'));
    
    // Verify emoji picker is shown
    expect(getByText('Select Emoji (Optional)')).toBeTruthy();
  });

  it('closes modal on cancel', () => {
    const { getByText, queryByText } = render(<CreateHabitScreen />);
    
    // Open custom habit modal
    fireEvent.press(getByText('Custom Habit'));
    expect(getByText('Create New Habit')).toBeTruthy();
    
    // Press cancel button
    fireEvent.press(getByText('Cancel'));
    expect(queryByText('Create New Habit')).toBeNull();
  });
}); 