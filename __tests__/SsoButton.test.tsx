import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SsoButton from '../src/components/SsoButton';

describe('SsoButton', () => {
  it('renders the image correctly', () => {
    const testImage = require('../src/assets/icons/google.png');
    const { getByTestId } = render(
      <SsoButton imageSource={testImage} onPress={() => {}} />
    );
    expect(getByTestId('sso-image')).toBeTruthy();
  });

  it('calls the onPress function when clicked', () => {
    const mockOnPress = jest.fn();
    const testImage = require('../src/assets/icons/google.png');
    const { getByTestId } = render(
      <SsoButton imageSource={testImage} onPress={mockOnPress} testID="sso-button" />
    );

    fireEvent.press(getByTestId('sso-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
it('renders the image correctly', () => {
    const testImage = ''; // Mocked path
    const { getByTestId } = render(
      <SsoButton imageSource={testImage} onPress={() => {}} />
    );
    expect(getByTestId('sso-image')).toBeTruthy();
  });
  
});
