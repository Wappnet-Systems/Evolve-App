import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DailyDairyScreen from '../src/screens/DailyDairy/DailyDairyScreen';

// Mock the navigation prop
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock firestore
const mockAdd = jest.fn().mockResolvedValue({ id: 'test-id' });
const mockCollection = jest.fn(() => ({
  add: mockAdd,
}));

const mockServerTimestamp = jest.fn().mockReturnValue(new Date());

jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = jest.fn(() => ({
    collection: mockCollection,
  }));
  
  // @ts-ignore
  mockFirestore.FieldValue = {
    serverTimestamp: jest.fn().mockReturnValue(new Date()),
  };
  
  return {
    __esModule: true,
    default: mockFirestore,
  };
});

describe('DailyDairyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <DailyDairyScreen navigation={mockNavigation as any} />
    );

    expect(getByPlaceholderText('Heading here')).toBeTruthy();
    expect(getByPlaceholderText('Start typing...')).toBeTruthy();
    expect(getByText('Add memories')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('handles title and content input', () => {
    const { getByPlaceholderText } = render(
      <DailyDairyScreen navigation={mockNavigation as any} />
    );

    const titleInput = getByPlaceholderText('Heading here');
    const contentInput = getByPlaceholderText('Start typing...');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    expect(titleInput.props.value).toBe('Test Title');
    expect(contentInput.props.value).toBe('Test Content');
  });

  it('shows error toast when saving with empty fields', async () => {
    const { getByText } = render(
      <DailyDairyScreen navigation={mockNavigation as any} />
    );

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Please fill in both title and content')).toBeTruthy();
    });
  });

  it('successfully saves diary entry', async () => {
    const { getByPlaceholderText, getByText } = render(
      <DailyDairyScreen navigation={mockNavigation as any} />
    );

    const titleInput = getByPlaceholderText('Heading here');
    const contentInput = getByPlaceholderText('Start typing...');
    const saveButton = getByText('Save');

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Title',
        content: 'Test Content',
        mood: 0,
      }));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('TaskDetail', {
        taskId: 'test-id',
      });
    });
  });

  it('handles mood selection', () => {
    const { getByTestId } = render(
      <DailyDairyScreen navigation={mockNavigation as any} />
    );

    const moodButtons = [
      { id: 0, testId: 'mood-very-dissatisfied' },
      { id: 1, testId: 'mood-dissatisfied' },
      { id: 2, testId: 'mood-neutral' },
      { id: 3, testId: 'mood-satisfied' },
      { id: 4, testId: 'mood-very-satisfied' },
    ];

    moodButtons.forEach(({ testId }) => {
      const moodButton = getByTestId(testId);
      fireEvent.press(moodButton);
    });
  });
}); 