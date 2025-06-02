import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import firestore from '@react-native-firebase/firestore';
import EditDiaryScreen from '../src/screens/EditDiary/EditDiaryScreen';

const mockUpdate = jest.fn(() => Promise.resolve());
const mockTimestamp = {
  toDate: () => new Date(),
  isEqual: (other: any) => other === mockTimestamp,
  valueOf: () => new Date().valueOf(),
};

jest.mock('@react-native-firebase/firestore', () => {
  const mockServerTimestamp = jest.fn(() => ({
    toDate: () => new Date(),
    isEqual: (other: any) => other === mockServerTimestamp(),
    valueOf: () => new Date().valueOf(),
  }));

  const mock = () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          exists: true,
          data: () => ({
            title: 'Test Title',
            content: 'Test Content',
            mood: 0,
            date: '2024-03-20',
          }),
        })),
        update: mockUpdate,
      })),
    })),
    FieldValue: {
      serverTimestamp: mockServerTimestamp,
      arrayRemove: jest.fn(),
      arrayUnion: jest.fn(),
      delete: jest.fn(),
      increment: jest.fn(),
    },
  });
  mock.FieldValue = mock().FieldValue;
  return mock;
});

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ value, onChange }: any) => {
      return React.createElement('View', {
        testID: 'date-picker',
        value,
        onChange,
      });
    },
  };
});

describe('EditDiaryScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockRoute = {
    params: {
      taskId: '123',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    const component = render(
      <EditDiaryScreen navigation={mockNavigation as any} route={mockRoute} />
    );
    return { component };
  };

  it('renders correctly with loading state', async () => {
    const { component } = setup();
    expect(component.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('loads and displays diary entry data', async () => {
    const { component } = setup();
    await waitFor(() => {
      expect(component.getByDisplayValue('Test Title')).toBeTruthy();
      expect(component.getByDisplayValue('Test Content')).toBeTruthy();
    });
  });

  it('updates title and content', async () => {
    const { component } = setup();
    await waitFor(() => {
      const titleInput = component.getByPlaceholderText('Heading here');
      const contentInput = component.getByPlaceholderText('Start typing...');
      fireEvent.changeText(titleInput, 'Updated Title');
      fireEvent.changeText(contentInput, 'Updated Content');
    });

    expect(component.getByDisplayValue('Updated Title')).toBeTruthy();
    expect(component.getByDisplayValue('Updated Content')).toBeTruthy();
  });

  it('shows date picker when date selector is pressed', async () => {
    const { component } = setup();
    await waitFor(() => {
      const dateSelector = component.getByText('Wednesday, March 20, 2024');
      fireEvent.press(dateSelector);
    });
    expect(component.getByTestId('date-picker')).toBeTruthy();
  });

  it('updates selected mood when mood button is pressed', async () => {
    const { component } = setup();
    await waitFor(() => {
      const moodButtons = component.getAllByTestId('mood-button');
      fireEvent.press(moodButtons[0]);
    });

    const moodButtons = component.getAllByTestId('mood-button');
    const buttonStyle = Array.isArray(moodButtons[0].props.style) 
      ? moodButtons[0].props.style[0] 
      : moodButtons[0].props.style;
    expect(buttonStyle.backgroundColor).toBe('#FF6B6B');
  });

  it('shows error toast when trying to save with empty fields', async () => {
    const { component } = setup();
    await waitFor(() => {
      const titleInput = component.getByPlaceholderText('Heading here');
      fireEvent.changeText(titleInput, '');
    });

    const updateButton = component.getByText('Update');
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(component.getByText('Please fill in both title and content')).toBeTruthy();
    });
  });

  it('successfully updates diary entry', async () => {
    const { component } = setup();

    await waitFor(() => {
      const titleInput = component.getByPlaceholderText('Heading here');
      const contentInput = component.getByPlaceholderText('Start typing...');
      fireEvent.changeText(titleInput, 'Updated Title');
      fireEvent.changeText(contentInput, 'Updated Content');
    });

    const moodButtons = component.getAllByTestId('mood-button');
    fireEvent.press(moodButtons[1]); // Select second mood

    const updateButton = component.getByText('Update');
    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        title: 'Updated Title',
        content: 'Updated Content',
        mood: 1,
        date: expect.any(String),
        updatedAt: expect.any(Object),
      });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('TaskDetail', {
        taskId: '123',
        toastMessage: 'Your diary entry has been updated!'
      });
    });
  });

  it('shows error toast when update fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUpdate.mockRejectedValueOnce(new Error('Update failed'));

    const { component } = setup();

    await waitFor(() => {
      const titleInput = component.getByPlaceholderText('Heading here');
      const contentInput = component.getByPlaceholderText('Start typing...');
      fireEvent.changeText(titleInput, 'Updated Title');
      fireEvent.changeText(contentInput, 'Updated Content');
    });

    const updateButton = component.getByText('Update');
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(component.getByText('Failed to update diary entry')).toBeTruthy();
    });
  });
}); 