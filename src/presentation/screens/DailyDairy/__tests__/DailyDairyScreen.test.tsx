import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DailyDairyScreen from '../DailyDairyScreen';
import { DiaryUseCases } from '../../../../domain/usecases/DiaryUseCases';
import { DiaryRepositoryImpl } from '../../../../data/repositories/DiaryRepositoryImpl';
import { DailyDairyPresenter } from '../../../presenters/DailyDairyPresenter';

// Mock the dependencies
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../../../../data/repositories/DiaryRepositoryImpl');
jest.mock('../../../../domain/usecases/DiaryUseCases');
jest.mock('@react-native-firebase/firestore', () => ({
  FieldValue: {
    serverTimestamp: jest.fn(),
  },
}));

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('DailyDairyScreen', () => {
  let mockDiaryUseCases: jest.Mocked<DiaryUseCases>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDiaryUseCases = {
      createDiary: jest.fn(),
      updateDiary: jest.fn(),
      getDiaryById: jest.fn(),
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

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    expect(getByText('Add memories')).toBeTruthy();
    expect(getByPlaceholderText('Heading here')).toBeTruthy();
    expect(getByPlaceholderText('Start typing...')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('shows date picker when date selector is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    const dateSelector = getByTestId('date-selector');
    expect(queryByTestId('date-picker')).toBeNull();
    
    fireEvent.press(dateSelector);
    expect(queryByTestId('date-picker')).toBeTruthy();
  });

  it('updates mood when mood button is pressed', () => {
    const { getByTestId } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );
  
    const happyMoodButton = getByTestId('mood-satisfied');
  
    let initialStyle = happyMoodButton.props.style;
  
    // Normalize to a flat object if it's an array
    if (Array.isArray(initialStyle)) {
      initialStyle = Object.assign({}, ...initialStyle);
    }
  
    expect(initialStyle.backgroundColor || 'transparent').toBe('transparent');
  
    fireEvent.press(happyMoodButton);
  
    let updatedStyle = happyMoodButton.props.style;
    if (Array.isArray(updatedStyle)) {
      updatedStyle = Object.assign({}, ...updatedStyle);
    }
  
    expect(updatedStyle.backgroundColor).not.toBe('transparent');
  });
  

  it('shows error toast when saving with empty fields', async () => {
    const { getByTestId, findByText } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    const errorMessage = await findByText('Please fill in both title and content');
    expect(errorMessage).toBeTruthy();
  });

  it('successfully creates a diary entry', async () => {
    const mockTaskId = 'test-task-id';
    mockDiaryUseCases.createDiary.mockResolvedValueOnce(mockTaskId);

    const { getByTestId, getByPlaceholderText } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    // Fill in the form
    const titleInput = getByPlaceholderText('Heading here');
    const contentInput = getByPlaceholderText('Start typing...');
    
    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    // Press save button
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockDiaryUseCases.createDiary).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyDairyScreen', {
        taskId: mockTaskId,
        toastMessage: 'Your diary entry has been saved!'
      });
    });
  });

  it('shows loading state while saving', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Heading here'), 'Test Title');
    fireEvent.changeText(getByPlaceholderText('Start typing...'), 'Test Content');

    // Mock a delayed diary creation
    mockDiaryUseCases.createDiary.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve('test-id'), 100))
    );

    // Press save button
    fireEvent.press(getByTestId('save-button'));
    
    // Check for loading state
    expect(getByText('Saving...')).toBeTruthy();

    // Wait for save to complete
    await waitFor(() => {
      expect(getByText('Save')).toBeTruthy();
    });
  });

  it('handles error during diary creation', async () => {
    mockDiaryUseCases.createDiary.mockRejectedValueOnce(new Error('Network error'));

    const { getByTestId, getByPlaceholderText, findByText } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Heading here'), 'Test Title');
    fireEvent.changeText(getByPlaceholderText('Start typing...'), 'Test Content');

    // Press save button
    fireEvent.press(getByTestId('save-button'));

    // Check for error message
    const errorMessage = await findByText('Failed to save diary entry. Please try again.');
    expect(errorMessage).toBeTruthy();
  });

  it('clears form after successful save', async () => {
    mockDiaryUseCases.createDiary.mockResolvedValueOnce('test-id');

    const { getByTestId, getByPlaceholderText } = render(
      <DailyDairyScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Heading here');
    const contentInput = getByPlaceholderText('Start typing...');
    
    // Fill in the form
    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(contentInput, 'Test Content');

    // Press save button
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(titleInput.props.value).toBe('');
      expect(contentInput.props.value).toBe('');
    });
  });
}); 