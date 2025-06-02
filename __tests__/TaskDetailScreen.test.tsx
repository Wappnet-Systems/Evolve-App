import React from 'react';
import { render, fireEvent, waitFor, act, RenderAPI, within } from '@testing-library/react-native';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import TaskDetailScreen from '../src/screens/MyDairy/MyDairyScreen';

// Mock the navigation prop
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  addListener: jest.fn().mockReturnValue(jest.fn()),
};

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock firestore
const mockTasks = [
  {
    id: '1',
    title: 'Test Title 1',
    content: 'Test Content 1',
    mood: 3,
    date: '2024-03-20T00:00:00.000Z',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Test Title 2',
    content: 'Test Content 2',
    mood: 4,
    date: '2024-03-19T00:00:00.000Z',
    createdAt: new Date(),
  },
];

const mockQuerySnapshot = {
  docs: mockTasks.map(task => ({
    id: task.id,
    data: () => task,
  })),
};

const mockGet = jest.fn().mockResolvedValue(mockQuerySnapshot);
const mockDelete = jest.fn().mockResolvedValue(undefined);
const mockCollection = jest.fn(() => ({
  orderBy: jest.fn().mockReturnValue({
    get: mockGet,
  }),
  doc: jest.fn(() => ({
    delete: mockDelete,
  })),
}));

jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = jest.fn(() => ({
    collection: mockCollection,
  }));
  
  return {
    __esModule: true,
    default: mockFirestore,
  };
});

describe('TaskDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with loading state', () => {
    const { getByTestId } = render(
      <TaskDetailScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );
    expect(getByTestId('loader')).toBeTruthy();
  });

  it('renders empty state when no tasks', async () => {
    mockGet.mockResolvedValueOnce({ docs: [] });

    const component = render(
      <TaskDetailScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );

    await waitFor(() => {
      expect(component.getByText('No notes yet. Start writing your thoughts!')).toBeTruthy();
    });
  });

  it('renders tasks list when tasks exist', async () => {
    const component = render(
      <TaskDetailScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );

    await waitFor(() => {
      expect(component.getByText('Test Title 1')).toBeTruthy();
      expect(component.getByText('Test Content 1')).toBeTruthy();
      expect(component.getByText('Test Title 2')).toBeTruthy();
      expect(component.getByText('Test Content 2')).toBeTruthy();
    });
  });

  it('navigates to DailyDairy when add button is pressed', async () => {
    const component = render(
      <TaskDetailScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );

    await waitFor(() => {
      const addButton = component.getByTestId('floating-shop-button');
      fireEvent.press(addButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DailyDairy');
  });

  it('navigates to EditTaskDetail when edit button is pressed', async () => {
    const component = render(
      <TaskDetailScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );

    await waitFor(() => {
      const taskCard = component.getByText('Test Title 1').parent?.parent;
      if (!taskCard) {
        throw new Error('Task card not found');
      }
      const editButtons = within(taskCard).getAllByText('Edit');
      fireEvent.press(editButtons[0]);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditTaskDetail', { taskId: '1' });
  });

  it('shows delete confirmation and deletes task when confirmed', async () => {
    const component = render(
      <TaskDetailScreen navigation={mockNavigation as any} route={{ params: {} }} />
    );

    await waitFor(() => {
      const taskCard = component.getByText('Test Title 1').parent?.parent;
      if (!taskCard) {
        throw new Error('Task card not found');
      }
      const deleteButtons = within(taskCard).getAllByText('Delete');
      fireEvent.press(deleteButtons[0]);
    });

    // Simulate Alert confirmation
    const alertCallback = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;
    await act(async () => {
      await alertCallback();
    });

    expect(mockDelete).toHaveBeenCalled();
  });

  it('shows toast message from route params', async () => {
    const component = render(
      <TaskDetailScreen 
        navigation={mockNavigation as any} 
        route={{ 
          params: { 
            toastMessage: 'Test toast message' 
          } 
        }} 
      />
    );

    await waitFor(() => {
      expect(component.getByText('Test toast message')).toBeTruthy();
    });
  });
}); 