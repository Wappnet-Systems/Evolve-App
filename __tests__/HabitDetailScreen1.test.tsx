import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HabitDetailScreen from '../src/screens/HabitDetail/HabitDetailScreen';
import firestore from '@react-native-firebase/firestore';
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

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock Firestore
const mockUpdate = jest.fn(() => Promise.resolve());
const mockGet = jest.fn();
const mockServerTimestamp = jest.fn(() => new Date());
jest.mock('@react-native-firebase/firestore', () => {
    return () => ({
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                update: mockUpdate,
                get: mockGet,
                id: 'habit1',
                firestore: {},
                parent: {},
                path: 'habits/habit1',
                exists: true,
                metadata: {},
                ref: {},
                data: () => ({})
            }))
        })),
        FieldValue: {
            serverTimestamp: mockServerTimestamp
        }
    });
});

const mockHabitData = {
    exists: true,
    id: 'habit1',
    data: () => ({
        name: 'Test Habit',
        emoji: '✨',
        description: 'Test Description',
        time: { toDate: () => new Date('2023-01-01T10:00:00') },
        reminder: true,
        days: ['Monday', 'Wednesday'],
        duration: {
            hours: '1',
            minutes: '30'
        },
        lastCompleted: null,
        completedDates: [],
        updatedAt: { toDate: () => new Date('2023-01-01T10:00:00') }
    })
};

describe('HabitDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGet.mockResolvedValueOnce(mockHabitData);
    });

    jest.setTimeout(10000);

    const renderWithNavigation = (component: React.ReactElement) => {
        return render(
            <NavigationContainer>
                {component}
            </NavigationContainer>
        );
    };

    it('renders loading state initially', async () => {
        renderWithNavigation(<HabitDetailScreen />);
        expect(mockGet).toHaveBeenCalled();
    });

    it('loads and displays habit details correctly', async () => {
        const { getByText, getByPlaceholderText } = renderWithNavigation(<HabitDetailScreen />);

        await waitFor(() => {
            // Check for habit title
            expect(getByText('✨ Test Habit')).toBeTruthy();

            // Check for description in TextInput
            const descriptionInput = getByPlaceholderText('Enter habit description');
            console.log('Input before change:', descriptionInput.props.value);
            expect(descriptionInput.props.value).toBe('Test Description');
            console.log('Input after change:', descriptionInput.props.value);

            // Check for duration
            expect(getByText('1 hour 30 minutes')).toBeTruthy();
            console.log('MockUpdate calls:', mockUpdate.mock.calls);



            // Check for days
            expect(getByText('Mon')).toBeTruthy();
            expect(getByText('Wed')).toBeTruthy();
        }, { timeout: 3000 });
    });

    // it('handles description update with comprehensive checks', async () => {
    //     // Arrange
    //     const { getByPlaceholderText, getByText } = renderWithNavigation(<HabitDetailScreen />);

    //     // Wait for initial render and verify initial state
    //     await waitFor(() => {
    //         const descriptionInput = getByPlaceholderText('Enter habit description');
            
    //         // Verify initial description
    //         expect(descriptionInput.props.value).toBe('Test Description');

    //         // Change description
    //         fireEvent.changeText(descriptionInput, 'Updated Description');

    //         // Verify description changed
    //         expect(descriptionInput.props.value).toBe('Updated Description');
    //     }, { timeout: 5000 });

    //     // Save changes
    //     await act(async () => {
    //         const saveButton = getByText('Save Changes');
    //         fireEvent.press(saveButton);
    //     });

    //     // Verify Firestore update
    //     await waitFor(() => {
    //         expect(mockUpdate).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 description: 'Updated Description'
    //             })
    //         );
    //     }, { timeout: 5000 });
    // });

    // it('toggles days selection and saves', async () => {
    //     const { getByText } = renderWithNavigation(<HabitDetailScreen />);
    
    //     // Wait for initial render
    //     await waitFor(() => {
    //         expect(getByText('Mon')).toBeTruthy();
    //     }, { timeout: 3000 });
    
    //     // Toggle day
    //     await act(async () => {
    //         fireEvent.press(getByText('Mon'));
    //     });
    
    //     // Save changes
    //     await act(async () => {
    //         fireEvent.press(getByText('Save Changes'));
    //     });
    
    //     // Verify update
    //     await waitFor(() => {
    //         expect(mockUpdate).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 days: ['Wednesday']
    //             })
    //         );
    //     }, { timeout: 5000 });
    // });

    // it('toggles reminder setting', async () => {
    //     const { getByText } = renderWithNavigation(<HabitDetailScreen />);
    
    //     // Wait for initial render
    //     await waitFor(() => {
    //         expect(getByText('Enable Reminder')).toBeTruthy();
    //     }, { timeout: 3000 });
    
    //     // Toggle reminder
    //     await act(async () => {
    //         fireEvent.press(getByText('Enable Reminder'));
    //     });
    
    //     // Save changes
    //     await act(async () => {
    //         fireEvent.press(getByText('Save Changes'));
    //     });
    
    //     // Verify update
    //     await waitFor(() => {
    //         expect(mockUpdate).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 reminder: false
    //             })
    //         );
    //     }, { timeout: 5000 });
    // });

    it('validates empty description', async () => {
        const { getByPlaceholderText, getByText } = renderWithNavigation(<HabitDetailScreen />);

        await waitFor(() => {
            expect(getByPlaceholderText('Enter habit description')).toBeTruthy();
        });

        fireEvent.changeText(getByPlaceholderText('Enter habit description'), '');

        await act(async () => {
            fireEvent.press(getByText('Save Changes'));
        });

        await waitFor(() => {
            expect(getByText('Please enter a habit description')).toBeTruthy();
        });
    });

    it('validates empty days selection', async () => {
        const { getByText } = renderWithNavigation(<HabitDetailScreen />);

        await waitFor(() => {
            expect(getByText('Mon')).toBeTruthy();
        });

        // Clear all selected days
        await act(async () => {
            fireEvent.press(getByText('Mon'));
            fireEvent.press(getByText('Wed'));
        });

        await act(async () => {
            fireEvent.press(getByText('Save Changes'));
        });

        await waitFor(() => {
            expect(getByText('Please select at least one day')).toBeTruthy();
        });
    });
    // it('handles duration selection', async () => {
    //     const { getByText } = renderWithNavigation(<HabitDetailScreen />);
    
    //     // Wait for initial render
    //     await waitFor(() => {
    //         expect(getByText('1 hour 30 minutes')).toBeTruthy();
    //     }, { timeout: 3000 });
    
    //     // Open duration picker
    //     await act(async () => {
    //         fireEvent.press(getByText('1 hour 30 minutes'));
    //     });
    
    //     // Select 2 hours
    //     await act(async () => {
    //         fireEvent.press(getByText('2 hours'));
    //         fireEvent.press(getByText('Confirm'));
    //     });
    
    //     // Save changes
    //     await act(async () => {
    //         fireEvent.press(getByText('Save Changes'));
    //     });
    
    //     // Verify update
    //     await waitFor(() => {
    //         expect(mockUpdate).toHaveBeenCalledWith(
    //             expect.objectContaining({
    //                 duration: { hours: '2', minutes: '30' }
    //             })
    //         );
    //     }, { timeout: 5000 });
    // });

}); 