import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../src/components/CustomButton';

describe('CustomButton Component', () => {
    const mockOnPress = jest.fn();

    it('renders correctly with given title', () => {
        const { getByText } = render(
            <CustomButton title="Click Me" onPress={mockOnPress} />
        );

        expect(getByText('Click Me')).toBeTruthy();
    });

    it('calls onPress when the button is pressed', () => {
        const { getByText } = render(
            <CustomButton title="Press Me" onPress={mockOnPress} />
        );

        const button = getByText('Press Me');
        fireEvent.press(button);

        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('applies custom styles correctly', () => {
        const { getByText } = render(
            <CustomButton 
                title="Styled Button" 
                onPress={mockOnPress} 
                style={{ backgroundColor: 'red' }}
                styleText={{ color: 'blue' }}
            />
        );

        const button = getByText('Styled Button');
        expect(button).toBeTruthy();
    });
});
