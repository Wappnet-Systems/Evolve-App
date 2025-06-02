import React from 'react';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';

// Mock the navigation
const Stack = createNativeStackNavigator();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock data
const mockHabits = [
  {
    id: 'habit1',
    name: 'Morning Jog',
    emoji: '🏃‍♂️',
    description: 'Jog for 30 minutes',
    time: new Date(),
    duration: { hours: '0', minutes: '30' },
    lastCompleted: null,
    streak: 3,
  },
  {
    id: 'habit2',
    name: 'Read a Book',
    emoji: '📚',
    description: 'Read for 20 minutes',
    time: new Date(),
    duration: { hours: '0', minutes: '20' },
    lastCompleted: new Date(),
    streak: 5,
  },
];

// Create a mock collection reference
const createMockCollection = () => {
  const mockCollection = {
    id: 'habits',
    parent: null,
    path: 'habits',
    add: jest.fn(),
    doc: jest.fn(),
    get: jest.fn().mockResolvedValue({
      docs: mockHabits.map(habit => ({
        id: habit.id,
        data: () => habit,
      })),
    }),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    startAfter: jest.fn().mockReturnThis(),
    startAt: jest.fn().mockReturnThis(),
    endBefore: jest.fn().mockReturnThis(),
    endAt: jest.fn().mockReturnThis(),
    onSnapshot: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    withConverter: jest.fn(),
    count: jest.fn(),
    countFromServer: jest.fn(),
    isEqual: jest.fn(),
    limitToLast: jest.fn().mockReturnThis(),
  };
  return mockCollection;
};

// Mock Firestore
jest.mock('@react-native-firebase/firestore', () => {
  return () => ({
    collection: jest.fn(() => createMockCollection()),
  });
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomePage" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByTestId('loader')).toBeTruthy();
  });

  it('displays habits after loading', async () => {
    const { getByText, queryByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomePage" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    });

    // Check if habits are displayed
    expect(getByText('Morning Jog')).toBeTruthy();
    expect(getByText('Read a Book')).toBeTruthy();
  });

  it('navigates to habit detail when a habit is clicked', async () => {
    const { getByText, queryByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomePage" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    });

    // Click on a habit
    fireEvent.press(getByText('Morning Jog'));

    // Check if navigation was called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('HabitDetail', { habitId: 'habit1' });
  });

  it('updates selected date when clicking on a day button', async () => {
    const { getByTestId, queryByTestId,getAllByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomePage" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    });

    // Click on a day button
    const dayButtons = getAllByTestId('day-button');
fireEvent.press(dayButtons[0]); // Click the first button

    // Wait for the habits to be refetched with the new date
    await waitFor(() => {
      expect(queryByTestId('loader')).toBeNull();
    });
  });

//   it('displays correct progress message when no habits', async () => {
//     jest.spyOn(firestore(), 'collection').mockImplementationOnce(() => ({
//       where: jest.fn().mockReturnThis(),
//       orderBy: jest.fn().mockReturnThis(),
//       get: jest.fn().mockResolvedValue({
//         docs: [],
//       }),
//     }));
  
//     const { getByText, queryByTestId } = render(
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="HomePage" component={HomeScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
  
//     // Wait for loading to complete
//     await waitFor(() => {
//       expect(queryByTestId('loader')).toBeNull();
//     });
  
//     // Debug what is being rendered
//     console.log(screen.debug());
  
//     // Wait for "No habits scheduled for this day" to appear
//     await waitFor(() => {
//       expect(getByText(/no habits scheduled for this day/i)).toBeTruthy();
//     });
//   });
  

//   it('loads more habits when VIEW ALL is clicked', async () => {
//     // Mock more habits
//     const moreHabits = Array.from({ length: 10 }, (_, i) => ({
//       id: `habit${i + 3}`,
//       name: `Habit ${i + 3}`,
//       emoji: '📚',
//       description: `Description ${i + 3}`,
//       time: new Date(),
//       duration: { hours: '0', minutes: '20' },
//       lastCompleted: null,
//       streak: 0,
//     }));

//     jest.spyOn(firestore(), 'collection').mockImplementationOnce(() => ({
//       ...createMockCollection(),
//       get: jest.fn().mockResolvedValue({
//         docs: [...mockHabits, ...moreHabits].map(habit => ({
//           id: habit.id,
//           data: () => habit,
//         })),
//       }),
//     }));

//     const { getByText, queryByTestId } = render(
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name="HomePage" component={HomeScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );

//     // Wait for loading to complete
//     await waitFor(() => {
//       expect(queryByTestId('loader')).toBeNull();
//     });

//     // Click VIEW ALL
//     fireEvent.press(getByText('VIEW ALL'));

//     // Wait for more habits to load
//     await waitFor(() => {
//       expect(getByText('Habit 3')).toBeTruthy();
//     });
//   });
});
