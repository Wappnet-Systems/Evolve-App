import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import LoginPage from '../src/screens/LoginScreen/LoginScreen';

// jest.mock('@react-native-firebase/auth', () => ({
//   signInWithEmailAndPassword: jest.fn(),
// }));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
}));

describe('LoginPage', () => {
    const mockNavigation = { navigate: jest.fn(), replace: jest.fn() };

    it('renders correctly', () => {
        const { getByPlaceholderText } = render(<LoginPage navigation={mockNavigation} />);

        expect(getByPlaceholderText('Username or Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('shows error alert if email or password is empty', async () => {
        const { getByText } = render(<LoginPage navigation={mockNavigation} />);

        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
        });
    });

    it('shows error alert for invalid email', async () => {
        const { getByPlaceholderText, getByText } = render(<LoginPage navigation={mockNavigation} />);

        fireEvent.changeText(getByPlaceholderText('Username or Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Invalid Email', 'The email address is not valid.');
        });
    });

    it('shows error alert for wrong password', async () => {
        const { getByPlaceholderText, getByText } = render(<LoginPage navigation={mockNavigation} />);

        fireEvent.changeText(getByPlaceholderText('Username or Email'), 'user@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Incorrect Password', 'Please check your password.');
        });
    });

    it('shows success console log on successful login', async () => {
        const mockUser = { uid: '12345' };
        const consoleSpy = jest.spyOn(console, 'log');

        const { getByPlaceholderText, getByText } = render(<LoginPage navigation={mockNavigation} />);

        fireEvent.changeText(getByPlaceholderText('Username or Email'), 'user@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'correctpassword');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('USER RESPONSEEE', mockUser);
        });
    });

    it('navigates to ForgotPasswordPage when "Forgot Password?" is clicked', () => {
        const { getByText } = render(<LoginPage navigation={mockNavigation} />);

        fireEvent.press(getByText('Forgot Password?'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPasswordPage');
    });

    it('navigates to SignUpPage when "Sign Up" is clicked', () => {
        const { getByText } = render(<LoginPage navigation={mockNavigation} />);

        fireEvent.press(getByText('Sign Up'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUpPage');
    });
});
