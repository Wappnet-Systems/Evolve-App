import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToolbarComponent } from '../src/components/Toolbar/ToolbarComponent';
import { icons } from '../src/constants/images';

describe('ToolbarComponent', () => {
    it('should render title when onlyTitle is true', () => {
        const { getByText } = render(<ToolbarComponent title="Test Title" onlyTitle={true} />);
        expect(getByText('Test Title')).toBeTruthy();
    });

    it('should render back button when showBackButton is true', () => {
        const mockOnBackPress = jest.fn();
        const { getByTestId } = render(
            <ToolbarComponent showBackButton={true} onBackPress={mockOnBackPress} />
        );

        const backButton = getByTestId('back-button');
        expect(backButton).toBeTruthy();

        fireEvent.press(backButton);
        expect(mockOnBackPress).toHaveBeenCalled();
    });

    it('should render username when showBackButton is false', () => {
        const { getByText } = render(<ToolbarComponent username="Test User" showBackButton={false} />);
        expect(getByText('Test User')).toBeTruthy();
    });

    it('should render notification icon and trigger onNotificationIconPress when pressed', () => {
        const mockOnNotificationPress = jest.fn();
        const { getByTestId } = render(
            <ToolbarComponent
                notificationIconSource={{ uri: 'https://example.com/icon.png' }}
                onNotificationIconPress={mockOnNotificationPress}
                showBackButton={false}
                rightIconSource={{ uri: 'https://example.com/icon2.png' }}
            />
        );

        const notificationButton = getByTestId('notification-icon');
        fireEvent.press(notificationButton);
        expect(mockOnNotificationPress).toHaveBeenCalled();
    });

    it('should render right icon and trigger onRightIconPress when pressed', () => {
        const mockOnRightIconPress = jest.fn();
        const { getByTestId } = render(
            <ToolbarComponent
                rightIconSource={{ uri: 'https://example.com/icon.png' }}
                onRightIconPress={mockOnRightIconPress}
                showBackButton={false}
            />
        );

        const rightIconButton = getByTestId('right-icon');
        fireEvent.press(rightIconButton);
        expect(mockOnRightIconPress).toHaveBeenCalled();
    });

    it('should render notification count when notificationCount is greater than 0', () => {

        const { getByTestId, debug } = render(
            <ToolbarComponent
                notificationCount={5}
                notificationIconSource={{ uri: 'https://example.com/icon.png' }}
                rightIconSource={{ uri: 'https://example.com/right-icon.png' }} // Ensure it's provided
                showBackButton={false}
            />
        );

        expect(getByTestId('notification-count')).toHaveTextContent('5');
    });
});
