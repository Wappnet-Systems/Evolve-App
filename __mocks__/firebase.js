jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
    getApps: jest.fn(() => []),
  }));
  
  jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
  }));

  // __mocks__/firebase.js
export const mockFirestore = {
  collection: jest.fn(() => mockFirestore),
  get: jest.fn(),
  add: jest.fn(),
  doc: jest.fn(() => mockFirestore),
  update: jest.fn(),
  delete: jest.fn(),
  where: jest.fn(() => mockFirestore),
  FieldValue: {
    serverTimestamp: jest.fn(() => 'serverTimestamp'),
    arrayUnion: jest.fn((value) => value),
  },
};

jest.mock('@react-native-firebase/firestore', () => () => mockFirestore);

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn(), setParams: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');

  