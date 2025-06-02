import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Image } from 'react-native';
import RactangularButton from '../src/components/RactangularButton';

describe('RactangularButton', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(<RactangularButton title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls the onPress function when clicked', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<RactangularButton title="Press Me" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'blue' };
    const { getByTestId } = render(
      <RactangularButton 
        title="Styled Button" 
        onPress={() => {}} 
        style={customStyle}
        testID="button"
      />
    );
  
    const buttonElement = getByTestId('button');
    const buttonStyles = Array.isArray(buttonElement.props.style)
      ? Object.assign({}, ...buttonElement.props.style)
      : buttonElement.props.style;
  
    expect(buttonStyles).toMatchObject(customStyle);
  });
  

  it('renders an icon if provided', () => {
    const testIcon = require('../src/assets/icons/apple.png');
    const { getByTestId } = render(
      <RactangularButton 
        title="With Icon" 
        onPress={() => {}} 
        icon={testIcon} 
      />
    );
  
    expect(getByTestId('icon')).toBeTruthy();
  });
});
