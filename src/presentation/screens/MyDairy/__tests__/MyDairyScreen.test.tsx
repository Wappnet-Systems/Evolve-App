import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyDairyScreen from '../MyDairyScreen';
import { DiaryUseCases } from '../../../../domain/usecases/DiaryUseCases';
import { DiaryRepositoryImpl } from '../../../../data/repositories/DiaryRepositoryImpl';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import { Diary } from '../../../../domain/models/Diary';

// Mock the dependencies
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../../../../data/repositories/DiaryRepositoryImpl');
jest.mock('../../../../domain/usecases/DiaryUseCases');
jest.mock('@react-native-firebase/firestore', () => ({
  FieldValue: {
    serverTimestamp: jest.fn(),
  },
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  addListener: jest.fn((event, callback) => {
    if (event === 'focus') {
      callback();
    }
    return jest.fn(); // Return unsubscribe function
  }),
};

const mockRoute: any = {
  params: {},
};

const now = new Date();
const mockDiaries: Diary[] = [
  {
    id: '1',
    title: 'Test Diary 1',
    content: 'Test Content 1',
    mood: 3, // Happy mood
    date: now.toISOString(),
    createdAt: now.toISOString(),
  },
  {
    id: '2',
    title: 'Test Diary 2',
    content: 'Test Content 2',
    mood: 1, // Sad mood
    date: now.toISOString(),
    createdAt: now.toISOString(),
  },
];

describe('MyDairyScreen', () => {
  let mockDiaryUseCases: jest.Mocked<DiaryUseCases>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDiaryUseCases = {
      createDiary: jest.fn(),
      updateDiary: jest.fn(),
      getDiaryById: jest.fn(),
      getAllDiaries: jest.fn().mockResolvedValue(mockDiaries),
      deleteDiary: jest.fn(),
    } as unknown as jest.Mocked<DiaryUseCases>;

    // Mock the implementation for DiaryRepositoryImpl
    (DiaryRepositoryImpl as jest.Mock).mockImplementation(() => ({
      createDiary: jest.fn(),
      updateDiary: jest.fn(),
      getDiaryById: jest.fn(),
      getAllDiaries: jest.fn(),
      deleteDiary: jest.fn(),
    }));

    // Mock the implementation for DiaryUseCases
    (DiaryUseCases as jest.Mock).mockImplementation(() => mockDiaryUseCases);
  });

  it('renders correctly with loading state', () => {
    const { getByText, getByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('My Diary')).toBeTruthy();
    expect(getByTestId('loader')).toBeTruthy();
  });

  it('displays diaries after loading', async () => {
    const { getByText, queryByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
      expect(getByText('Test Diary 1')).toBeTruthy();
      expect(getByText('Test Content 1')).toBeTruthy();
    });
  });

  it('shows empty state when no diaries', async () => {
    // Reset all mocks and set up empty diaries response
    jest.clearAllMocks();
    const mockDiaryUseCases = {
      createDiary: jest.fn(),
      updateDiary: jest.fn(),
      getDiaryById: jest.fn(),
      getAllDiaries: jest.fn().mockResolvedValue([]),
      deleteDiary: jest.fn(),
    } as unknown as jest.Mocked<DiaryUseCases>;

    // Mock the implementation for DiaryUseCases
    (DiaryUseCases as jest.Mock).mockImplementation(() => mockDiaryUseCases);

    const { getByTestId, queryByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading state to finish
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    });

    // Wait for empty state to appear
    await waitFor(() => {
      const emptyState = getByTestId('empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState).toHaveTextContent('No notes yet. Start writing your thoughts!');
    });
  });

  it('navigates to DailyDairy screen when FAB is pressed', () => {
    const { getByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    const fabButton = getByTestId('floating-shop-button');
    fireEvent.press(fabButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DailyDairy');
  });

  it('navigates to DiaryDetail when a diary card is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
      const diaryCard = getByTestId('diary-card-1');
      fireEvent.press(diaryCard);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DiaryDetail', { taskId: '1' });
  });

  it('shows delete confirmation when delete button is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
      const deleteButton = getByTestId('delete-button-1');
      fireEvent.press(deleteButton);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Note',
      'Are you sure you want to delete this diary note?',
      expect.any(Array)
    );
  });

  it('navigates to edit screen when edit button is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
      const editButton = getByTestId('edit-button-1');
      fireEvent.press(editButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditTask', { taskId: '1' });
  });

  it('shows success toast when route params include toastMessage', () => {
    const mockRouteWithToast = {
      params: {
        toastMessage: 'Diary updated successfully!',
      },
    };

    const { getByText } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRouteWithToast} />
    );

    expect(getByText('Diary updated successfully!')).toBeTruthy();
  });

  it('refreshes diaries when screen comes into focus', () => {
    render(<MyDairyScreen navigation={mockNavigation} route={mockRoute} />);

    expect(mockDiaryUseCases.getAllDiaries).toHaveBeenCalledTimes(2); // Once on mount, once on focus
  });

  it('formats diary date correctly', async () => {
    const testDate = new Date();
    const formattedDate = format(testDate, 'dd MMM yy');
    
    const mockDiaryWithDate: Diary[] = [{
      ...mockDiaries[0],
      date: testDate.toISOString(),
    }];
    
    mockDiaryUseCases.getAllDiaries.mockResolvedValueOnce(mockDiaryWithDate);

    const { getByTestId, queryByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
      expect(getByTestId('diary-date-1')).toHaveTextContent(formattedDate);
    });
  });

  it('navigates to Dashboard when back button is pressed', () => {
    const { getByTestId } = render(
      <MyDairyScreen navigation={mockNavigation} route={mockRoute} />
    );

    const backButton = getByTestId('header-back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Dashboard');
  });
}); 