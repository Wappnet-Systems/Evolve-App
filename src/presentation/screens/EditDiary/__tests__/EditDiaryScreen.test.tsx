import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditDiaryScreen from '../EditDiaryScreen';
import { DiaryUseCases } from '../../../../domain/usecases/DiaryUseCases';
import { DiaryRepositoryImpl } from '../../../../data/repositories/DiaryRepositoryImpl';
import { DiaryDetails } from '../../../../domain/models/Diary';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../../../../data/repositories/DiaryRepositoryImpl');
jest.mock('../../../../domain/usecases/DiaryUseCases');
jest.mock('@react-native-community/datetimepicker', () => {
  const mockComponent = require('react-native').View;
  return mockComponent;
});

const mockNavigation: any = {
  goBack: jest.fn(),
  navigate: jest.fn(),
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
  mood: 3,
  date: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

describe('EditDiaryScreen', () => {
  let mockDiaryUseCases: jest.Mocked<DiaryUseCases>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDiaryUseCases = {
      createDiary: jest.fn(),
      updateDiary: jest.fn().mockResolvedValue(mockDiary),
      getDiaryById: jest.fn().mockResolvedValue(mockDiary),
      getAllDiaries: jest.fn(),
      deleteDiary: jest.fn(),
    } as unknown as jest.Mocked<DiaryUseCases>;

    // Mock DiaryRepositoryImpl
    (DiaryRepositoryImpl as jest.Mock).mockImplementation(() => ({
      createDiary: jest.fn(),
      updateDiary: jest.fn(),
      getDiaryById: jest.fn(),
      getAllDiaries: jest.fn(),
      deleteDiary: jest.fn(),
    }));

    // Mock DiaryUseCases
    (DiaryUseCases as jest.Mock).mockImplementation(() => mockDiaryUseCases);
  });

  it('renders loading state initially', () => {
    const { getByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('loads diary details correctly', async () => {
    const { getByText, getByDisplayValue, queryByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    }, { timeout: 3000 });

    expect(getByDisplayValue('Test Diary')).toBeTruthy();
    expect(getByDisplayValue('Test Content')).toBeTruthy();
    expect(getByText('Edit memories')).toBeTruthy();
  });

  it('updates diary when save button is pressed', async () => {
    const { getByText, queryByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    }, { timeout: 3000 });

    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(mockDiaryUseCases.updateDiary).toHaveBeenCalled();
    });
  });

  it('shows updating state while saving', async () => {
    mockDiaryUseCases.updateDiary.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const { getByText, queryByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    }, { timeout: 3000 });

    const updateButton = getByText('Update');
    fireEvent.press(updateButton);

    expect(getByText('Updating...')).toBeTruthy();
  });

  it('navigates back when back button is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    }, { timeout: 3000 });

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('allows mood selection', async () => {
    const { getAllByTestId, queryByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    }, { timeout: 3000 });

    const moodButtons = getAllByTestId('mood-button');
    fireEvent.press(moodButtons[2]); // Select the third mood

    // Verify the mood is selected by checking the style prop
    const buttonStyle = moodButtons[2].props.style;
    const styles = Array.isArray(buttonStyle) ? buttonStyle : [buttonStyle];
    const backgroundColors = styles.map(style => style?.backgroundColor).filter(Boolean);
    expect(backgroundColors).not.toContain('transparent');
  });

  it('allows text input changes', async () => {
    const { getByPlaceholderText, queryByTestId } = render(
      <EditDiaryScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    }, { timeout: 3000 });

    const titleInput = getByPlaceholderText('Heading here');
    const contentInput = getByPlaceholderText('Start typing...');

    fireEvent.changeText(titleInput, 'New Title');
    fireEvent.changeText(contentInput, 'New Content');

    expect(titleInput.props.value).toBe('New Title');
    expect(contentInput.props.value).toBe('New Content');
  });
}); 