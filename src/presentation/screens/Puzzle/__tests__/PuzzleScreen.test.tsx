import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PuzzleScreen from '../PuzzleScreen';

let mockCallback: ((event: any) => void) | null = null;


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

// Mock the PuzzleViewModel hook
const mockUsePuzzleViewModel = {
  mathPuzzle: {
    question: '2 + 2 = ?',
    answer: 4,
  },
  blockPuzzle: {
    blocks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    correctSequence: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  answer: '',
  attempts: 3,
  selectedIndex: -1,
  errorText: '',
  setAnswer: jest.fn(),
  handleMathSubmit: jest.fn(),
  handleBlockPress: jest.fn(),
};

jest.mock('../../../viewmodels/PuzzleViewModel', () => ({
  usePuzzleViewModel: () => mockUsePuzzleViewModel,
}));

describe('PuzzleScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockRoute = {
    params: {
      alarmId: 'test-alarm-id',
      puzzleType: 'math',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock values
    Object.assign(mockUsePuzzleViewModel, {
      mathPuzzle: {
        question: '2 + 2 = ?',
        answer: 4,
      },
      blockPuzzle: {
        blocks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        correctSequence: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      answer: '',
      attempts: 3,
      selectedIndex: -1,
      errorText: '',
      setAnswer: jest.fn(),
      handleMathSubmit: jest.fn(),
      handleBlockPress: jest.fn(),
    });
  });

  it('renders math puzzle correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <PuzzleScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    expect(getByText('Solve the puzzle to stop the alarm!')).toBeTruthy();
    expect(getByText('2 + 2 = ?')).toBeTruthy();
    expect(getByPlaceholderText('Enter your answer')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('renders block puzzle correctly', () => {
    const blockPuzzleRoute = {
      params: {
        alarmId: 'test-alarm-id',
        puzzleType: 'block',
      },
    };

    const { getByText, getAllByTestId } = render(
      <PuzzleScreen route={blockPuzzleRoute as any} navigation={mockNavigation as any} />
    );

    expect(getByText('Solve the puzzle to stop the alarm!')).toBeTruthy();
    expect(getByText('Arrange the numbers from 1 to 9 in order')).toBeTruthy();
    
    const blocks = getAllByTestId('puzzle-block-0');
    expect(blocks).toBeTruthy();
  });

  it('handles math puzzle answer input', () => {
    const { getByTestId } = render(
      <PuzzleScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    const input = getByTestId('math-input');
    fireEvent.changeText(input, '4');

    expect(mockUsePuzzleViewModel.setAnswer).toHaveBeenCalledWith('4');
  });

  it('handles math puzzle submission', () => {
    const { getByTestId } = render(
      <PuzzleScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);

    expect(mockUsePuzzleViewModel.handleMathSubmit).toHaveBeenCalled();
  });

  it('shows error message for wrong math answer', () => {
    mockUsePuzzleViewModel.attempts = 2;
    mockUsePuzzleViewModel.errorText = 'Wrong answer! 1 attempts left.';

    const { getByTestId } = render(
      <PuzzleScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    expect(getByTestId('error-text')).toBeTruthy();
  });

  it('handles block puzzle block selection', () => {
    const blockPuzzleRoute = {
      params: {
        alarmId: 'test-alarm-id',
        puzzleType: 'block',
      },
    };

    const { getByTestId } = render(
      <PuzzleScreen route={blockPuzzleRoute as any} navigation={mockNavigation as any} />
    );

    const block = getByTestId('puzzle-block-0');
    fireEvent.press(block);

    expect(mockUsePuzzleViewModel.handleBlockPress).toHaveBeenCalledWith(0);
  });

  it('shows error message for block puzzle', () => {
    const blockPuzzleRoute = {
      params: {
        alarmId: 'test-alarm-id',
        puzzleType: 'block',
      },
    };

    mockUsePuzzleViewModel.errorText = 'Wrong sequence! Try again.';

    const { getByTestId } = render(
      <PuzzleScreen route={blockPuzzleRoute as any} navigation={mockNavigation as any} />
    );

    expect(getByTestId('error-text')).toBeTruthy();
  });

  it('navigates to Dashboard on puzzle success', async () => {
    // Mock the success callback
    const mockSuccessCallback = jest.fn();
    mockUsePuzzleViewModel.handleMathSubmit = jest.fn().mockImplementation(() => {
      mockSuccessCallback();
      mockNavigation.navigate('Dashboard');
    });

    const { getByTestId } = render(
      <PuzzleScreen route={mockRoute as any} navigation={mockNavigation as any} />
    );

    // Trigger the success callback
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Dashboard');
    });
  });
}); 