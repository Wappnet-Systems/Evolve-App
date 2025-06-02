import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DiaryDetailScreen from '../DiaryDetailScreen';
import { DiaryUseCases } from '../../../../domain/usecases/DiaryUseCases';
import { DiaryRepositoryImpl } from '../../../../data/repositories/DiaryRepositoryImpl';
import { format } from 'date-fns';
import { DiaryDetails } from '../../../../domain/models/Diary';

// Mock the dependencies
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../../../../data/repositories/DiaryRepositoryImpl');
jest.mock('../../../../domain/usecases/DiaryUseCases');

const mockNavigation: any = {
  goBack: jest.fn(),
};

const mockRoute: any = {
  params: {
    taskId: '1',
  },
};

const mockDiary: DiaryDetails = {
  id: '1',
  title: 'Test Diary',
  content: 'Test Content',
  mood: 3, // Happy mood
  date: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

describe('DiaryDetailScreen', () => {
  let mockDiaryUseCases: jest.Mocked<DiaryUseCases>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDiaryUseCases = {
      createDiary: jest.fn(),
      updateDiary: jest.fn(),
      getDiaryById: jest.fn().mockResolvedValue(mockDiary),
      getAllDiaries: jest.fn(),
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

  it('renders loading state initially', () => {
    const { getByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByTestId('loader')).toBeTruthy();
  });

  it('displays diary details after loading', async () => {
    const { getByText, queryByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    }, { timeout: 3000 });

    // Then check for the diary content
    expect(getByText('Test Diary')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('shows error state when diary is not found', async () => {
    mockDiaryUseCases.getDiaryById.mockResolvedValueOnce(null);

    const { getByText, queryByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    }, { timeout: 3000 });

    expect(getByText('Diary entry not found')).toBeTruthy();
  });

  it('navigates back when back button is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    }, { timeout: 3000 });

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays formatted date correctly', async () => {
    const testDate = new Date();
    const formattedDate = format(testDate, 'dd MMM yyyy');
    
    const mockDiaryWithDate = {
      ...mockDiary,
      date: testDate.toISOString(),
    };
    
    mockDiaryUseCases.getDiaryById.mockResolvedValueOnce(mockDiaryWithDate);

    const { getByTestId, queryByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    }, { timeout: 3000 });

    expect(getByTestId('diary-date')).toHaveTextContent(formattedDate);
  });

  it('shows success toast when route params include toastMessage', async () => {
    const mockRouteWithToast = {
      params: {
        taskId: '1',
        toastMessage: 'Diary updated successfully!',
      },
    };

    const { getByText, queryByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRouteWithToast} />
    );

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    }, { timeout: 3000 });

    expect(getByText('Diary updated successfully!')).toBeTruthy();
  });

  it('displays mood icon and label correctly', async () => {
    const { getByTestId, queryByTestId } = render(
      <DiaryDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    }, { timeout: 3000 });

    expect(getByTestId('mood-icon')).toBeTruthy();
    expect(getByTestId('mood-label')).toHaveTextContent('Happy');
  });
}); 