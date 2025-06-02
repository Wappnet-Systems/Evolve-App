import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CreateHabitScreen from '../src/screens/CreateHabit/CreateHabitScreen';
import { Colors } from '../src/constants/colors';
import { format } from 'date-fns';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn()
    }),
    useRoute: () => ({
        params: { habitId: 'habit1' }
    }),
    NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock TextTicker
jest.mock('react-native-text-ticker', () => 'TextTicker');
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
    if (buttons && buttons.length > 1) {
        buttons[1].onPress();
    }
});

// Mock Firestore
const mockDelete = jest.fn(() => Promise.resolve());
const mockUpdate = jest.fn(() => Promise.resolve());
const mockAdd = jest.fn(() => Promise.resolve({ id: 'new-habit-1' }));
const mockGet = jest.fn();
const mockFetchHabits = jest.fn();
const mockWhereGet = jest.fn(() => Promise.resolve({ empty: true }));
const mockServerTimestamp = jest.fn(() => new Date());
const mockArrayUnion = jest.fn(value => [value]);

jest.mock('@react-native-firebase/firestore', () => () => ({
    collection: jest.fn(() => ({
        where: jest.fn(() => ({
            get: mockWhereGet,
        })),
        doc: jest.fn(() => ({
            update: mockUpdate,
            delete: mockDelete,
        })),
        add: mockAdd,
        get: mockGet
    })),
    FieldValue: {
        // serverTimestamp: mockServerTimestamp,
        serverTimestamp: jest.fn(() => new Date('2025-03-28T04:44:57.794Z')),
        arrayUnion: mockArrayUnion
    }
}));

const renderWithNavigation = (component: React.ReactElement) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

const mockHabitData = {
    docs: [
        {
            id: 'habit1',
            data: () => ({
                color: "#A54F31",
                completedDates: [],
                createdAt: { toDate: () => new Date(Date.UTC(2025, 2, 25, 9, 26, 20)) }, // Mock Timestamp
                days: ["Monday"],
                description: "Vb",
                duration: { hours: "0", minutes: "30" },
                emoji: "✨",
                lastCompleted: null,
                name: "Hhhhh",
                reminder: true,
                time: { toDate: () => new Date(Date.UTC(2025, 2, 25, 10, 55, 0)) }, // Mock Timestamp
                updatedAt: { toDate: () => new Date(Date.UTC(2025, 2, 25, 9, 26, 33)) }, // Mock Timestamp
            }),
        },
    ],
};

describe('CreateHabitScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
        // jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
        //     const deleteButton = buttons?.find((button) => button.text === 'Delete');
        //     if (deleteButton && deleteButton.onPress) {
        //         deleteButton.onPress(); // Simulate user pressing "Delete"
        //     }
        // });
    });

    it('renders loading state initially', async () => {
        renderWithNavigation(<CreateHabitScreen />);
        expect(mockGet).toHaveBeenCalled();
    });

    it('displays empty state when no habits exist', async () => {
        mockGet.mockResolvedValueOnce({ docs: [] });
        const { getByText } = renderWithNavigation(<CreateHabitScreen />);

        await waitFor(() => {
            expect(getByText('No habits yet')).toBeTruthy();
        });
    });

    it('opens add habit modal when plus button is clicked', async () => {
        mockGet.mockResolvedValueOnce({ docs: [] });
        const { getByTestId, getByText } = renderWithNavigation(<CreateHabitScreen />);

        await waitFor(() => expect(getByTestId('empty-add-button')).toBeTruthy());

        fireEvent.press(getByTestId('empty-add-button'));

        await waitFor(() => expect(getByText('Create New Habit')).toBeTruthy());
    });

    it('validates habit name before adding', async () => {
        mockGet.mockResolvedValueOnce({ docs: [] });
        const { getByTestId, getByText } = renderWithNavigation(<CreateHabitScreen habits={[]} loading={false} />);

        await waitFor(() => expect(getByTestId('empty-add-button')).toBeTruthy());
        fireEvent.press(getByTestId('empty-add-button'));


        await waitFor(() => expect(getByText('Create New Habit')).toBeTruthy());

        fireEvent.press(getByText('Add Habit'));

        await waitFor(() => {
            expect(getByText('Habit name cannot be empty.')).toBeTruthy();
        });
    });

    // it('successfully adds a new habit', async () => {
    //     // Setup mocks
    //     const mockDate = new Date('2025-03-28T04:44:57.794Z');
        
    //     // Clear and setup mocks
    //     jest.clearAllMocks();
    //     mockServerTimestamp.mockReturnValue(mockDate);
    //     mockGet.mockResolvedValueOnce({ docs: [] });
    //     mockWhereGet.mockResolvedValueOnce({ empty: true });
    //     mockAdd.mockResolvedValueOnce({ id: 'new-habit-1' });

    //     const { getByTestId, getByPlaceholderText, getByText } = renderWithNavigation(<CreateHabitScreen />);

    //     // Wait for initial render
    //     await waitFor(() => {
    //         expect(getByText('No habits yet')).toBeTruthy();
    //     });

    //     // Open modal and wait for it
    //     await act(async () => {
    //         fireEvent.press(getByTestId('empty-add-button'));
    //     });
        
    //     await waitFor(() => {
    //         expect(getByText('Create New Habit')).toBeTruthy();
    //     });

    //     // Fill in the name field
    //     await act(async () => {
    //         fireEvent.changeText(getByPlaceholderText('Enter habit name'), 'New Habit');
    //     });

    //     // Submit the form
    //     await act(async () => {
    //         fireEvent.press(getByText('Add Habit'));
    //     });

    //     // Wait for the add operation to complete
    //     await waitFor(() => {
    //         expect(mockAdd).toHaveBeenCalledWith({
    //             name: 'New Habit',
    //             emoji: '✨',
    //             color: '#A54F31',
    //             duration: { hours: '0', minutes: '0' },
    //             reminder: false,
    //             days: [],
    //             createdAt: mockDate,
    //             updatedAt: mockDate,
    //             description: '',
    //             completedDates: [],
    //             time: expect.any(Date),
    //             lastCompleted: null
    //         });
    //     });
    // });
    

    it('deletes a habit when delete button is clicked', async () => {
        mockGet.mockResolvedValueOnce(mockHabitData);
        const { getByTestId } = renderWithNavigation(<CreateHabitScreen />);
    
        await waitFor(() => expect(getByTestId('delete-button-habit1')).toBeTruthy());
    
        await act(async () => {
            fireEvent.press(getByTestId('delete-button-habit1'));
        });
    
        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Habit',
            'Are you sure you want to delete this habit?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: expect.any(Function), style: 'destructive' }
            ]
            // { cancelable: false }
        );
    
        // Simulate clicking delete
        const deletePress = Alert.alert.mock.calls[0][2][1].onPress;
        await act(async () => {
            deletePress();
        });
    
        expect(mockDelete).toHaveBeenCalled();
    });

    // it('handles habit completion', async () => {
    //     const mockDate = new Date('2025-03-28T08:31:55.166Z');
    //     const mockCompletedDate = format(mockDate, 'yyyy-MM-dd');
        
    //     // Setup mocks
    //     mockServerTimestamp.mockReturnValue(mockDate);
    //     mockArrayUnion.mockReturnValue([mockCompletedDate]);
    //     mockGet.mockResolvedValueOnce(mockHabitData);
    //     mockUpdate.mockImplementation(() => Promise.resolve());

    //     const { getByTestId, queryByTestId } = renderWithNavigation(<CreateHabitScreen />);

    //     // Wait for loading to finish and habit to be rendered
    //     await waitFor(() => {
    //         expect(queryByTestId('loader')).toBeFalsy();
    //         expect(getByTestId('complete-button-habit1')).toBeTruthy();
    //     });
        
    //     // Press complete button
    //     await act(async () => {
    //         fireEvent.press(getByTestId('complete-button-habit1'));
    //     });

    //     // Wait for habit to be completed
    //     await waitFor(() => {
    //         expect(mockUpdate).toHaveBeenCalledWith({
    //             lastCompleted: mockDate,
    //             completedDates: [mockCompletedDate]
    //         });
    //     }, { timeout: 4000 });
    // });
});
