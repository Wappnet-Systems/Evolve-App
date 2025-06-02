import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import Toast from '../src/components/Toast';

jest.useFakeTimers();

describe('Toast Component', () => {
    it('should render with message and fade in and out', () => {
        const mockOnHide = jest.fn();
        
        const { getByText } = render(
            <Toast message="Success Message" type="success" onHide={mockOnHide} />
        );

        expect(getByText('Success Message')).toBeTruthy();
        expect(getByText('×')).toBeTruthy();

        // Fast-forward animations
        act(() => {
            jest.runAllTimers();
        });

        expect(mockOnHide).toHaveBeenCalled();
    });

    it('should call onHide when close button is pressed', () => {
        const mockOnHide = jest.fn();

        const { getByText } = render(
            <Toast message="Error Message" type="error" onHide={mockOnHide} />
        );

        const closeButton = getByText('×');

        act(() => {
            closeButton.props.onPress();
        });

        expect(mockOnHide).toHaveBeenCalled();
    });
});
