import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { icons } from '../src/constants/images';
import TextfieldComponent from '../src/components/TextFieldComponent';


describe('TextfieldComponent', () => {

  it('renders the placeholder correctly', () => {
    const { getByPlaceholderText } = render(
      <TextfieldComponent placeholder="Enter your name" value="" onChangeText={() => {}} icon={icons.IC_USER} />
    );
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();
  });

  it('displays the entered text correctly', () => {
    const { getByPlaceholderText } = render(
      <TextfieldComponent placeholder="Enter text" value="Hello" onChangeText={() => {}} icon={icons.IC_USER} />
    );
    expect(getByPlaceholderText('Enter text').props.value).toBe('Hello');
  });

  it('calls onChangeText when text is changed', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <TextfieldComponent placeholder="Type here" value="" onChangeText={mockOnChangeText} icon={icons.IC_USER} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Type here'), 'New Text');
    expect(mockOnChangeText).toHaveBeenCalledWith('New Text');
  });

  it('toggles password visibility correctly', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <TextfieldComponent
        placeholder="Password"
        value="password123"
        onChangeText={() => {}}
        secureTextEntry={true}
        icon={icons.IC_USER}
      />
    );

    const eyeIcon = getByTestId('eye-icon');
    
    expect(getByPlaceholderText('Password').props.secureTextEntry).toBe(true);

    fireEvent.press(eyeIcon);
    expect(getByPlaceholderText('Password').props.secureTextEntry).toBe(false);

    fireEvent.press(eyeIcon);
    expect(getByPlaceholderText('Password').props.secureTextEntry).toBe(true);
  });
});
