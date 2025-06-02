import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import SignupPage from '../src/screens/SignupScreen/SignUpScreen';

jest.mock('@react-native-firebase/auth');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('SignupPage Tests', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupPage navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Username or Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('ConfirmPassword')).toBeTruthy();
    expect(getByText('Create Account')).toBeTruthy();
  });

  it('shows error alert when fields are empty', async () => {
    const { getByText } = render(<SignupPage navigation={mockNavigation} />);

    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'All fields are required.');
    });
  });

  it('shows error alert when passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupPage navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('ConfirmPassword'), 'password456');
    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match.');
    });
  });

  it('shows success console log on successful signup', async () => {
    const mockUser = { uid: '12345' };
    const consoleSpy = jest.spyOn(console, 'log');

    auth().createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const { getByPlaceholderText, getByText } = render(
      <SignupPage navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'correctpassword');
    fireEvent.changeText(getByPlaceholderText('ConfirmPassword'), 'correctpassword');
    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('USER SIGNUP RESPONSEEE', mockUser);
    });
  });

  it('shows error alert when email is already in use', async () => {
    auth().createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/email-already-in-use',
    });

    const { getByPlaceholderText, getByText } = render(
      <SignupPage navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'used@email.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('ConfirmPassword'), 'password123');
    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'This email is already in use.');
    });
  });

  it('shows error alert for invalid email format', async () => {
    auth().createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/invalid-email',
    });

    const { getByPlaceholderText, getByText } = render(
      <SignupPage navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('ConfirmPassword'), 'password123');
    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'The email address is invalid.');
    });
  });

  it('shows error alert for weak password', async () => {
    auth().createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/weak-password',
    });

    const { getByPlaceholderText, getByText } = render(
      <SignupPage navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123');
    fireEvent.changeText(getByPlaceholderText('ConfirmPassword'), '123');
    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'The password is too weak. Try adding numbers and special characters.'
      );
    });
  });

  it('navigates to the Login screen when "Login" is clicked', () => {
    const { getByText } = render(<SignupPage navigation={mockNavigation} />);

    fireEvent.press(getByText('Login'));

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
