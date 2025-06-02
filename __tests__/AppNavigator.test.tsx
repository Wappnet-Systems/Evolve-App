import React from 'react';
import { render,fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from '../src/navigation/AppNavigator';
import LoginPage from '../src/screens/LoginScreen/LoginScreen';
import SignupPage from '../src/screens/SignupScreen/SignUpScreen';

const Stack = createNativeStackNavigator();

describe('AppNavigator', () => {
  it('renders the LoginPage initially', async () => {
    const { findByText } = render(<AppNavigator />);

    const loginText = await findByText('Login');
    expect(loginText).toBeTruthy();
  });


  it('navigates to SignUpPage when triggered', async () => {
    const { getByTestId, findByText } = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpPage" component={SignupPage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  
    const signupButton = getByTestId('signup-button');
    fireEvent.press(signupButton);
  
    const signUpPageText = await findByText('Create an account');
    expect(signUpPageText).toBeTruthy();
  });
});
