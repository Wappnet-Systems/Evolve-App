import "react-native-gesture-handler/jestSetup";
import "react-native-reanimated";
import "react-native-reanimated/mock";

jest.mock('@react-native-firebase/auth', () => () => ({
  createUserWithEmailAndPassword: jest.fn((email, password) => {
    if (!email || !password) {
      throw { code: 'auth/invalid-email' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw { code: 'auth/invalid-email' }; 
    }
    if (email === 'user@example.com' && password === 'correctpassword') {
      return { user: { uid: '12345' } };
    }
    if (email === 'used@email.com') {
      throw { code: 'auth/email-already-in-use' };
    }
    if (password.length < 6) {
      throw { code: 'auth/weak-password' };
    }
    throw { code: 'auth/unknown-error' };
  }),

  signInWithEmailAndPassword: jest.fn((email, password) => {
    if (!email || !password) {
      throw { code: 'auth/invalid-email' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw { code: 'auth/invalid-email' };
    }
    if (email === 'user@example.com' && password === 'correctpassword') {
      return { user: { uid: '12345' } };
    }
    if (password === 'wrongpassword') {
      throw { code: 'auth/wrong-password' };
    }
    throw { code: 'auth/user-not-found' };
  }),
}));


jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ onChange, testID }: any) => (
      <View testID={testID} onChange={onChange} />
    ),
  };
});

  jest.mock('firebase/app');
jest.mock('firebase/firestore');


jest.mock('@react-native-firebase/firestore', () => {});

jest.mock('react-native/Libraries/Animated/NativeAnimatedModule'); // Suppresses native animation warnings
