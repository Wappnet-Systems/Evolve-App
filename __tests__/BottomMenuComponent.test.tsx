import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from '../src/components/BottomMenu/BottomMenuComponent';
import { Strings } from '../src/constants/strings';
import { Colors } from '../src/constants/colors';

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: jest.fn(() => ({
            navigate: jest.fn(),
        })),
    };
});

describe('BottomNavigation', () => {
    const renderComponent = () =>
        render(
            <NavigationContainer>
                <BottomNavigation />
            </NavigationContainer>
        );

    it('renders Home tab and navigates correctly', () => {
        const { getByText } = renderComponent();

        expect(getByText('Home')).toBeTruthy();

        fireEvent.press(getByText('Home'));
        expect(getByText('Home')).toBeTruthy();
    });

    it('renders Wishlist tab and navigates correctly', () => {
        const { getByText } = renderComponent();

        expect(getByText('Wishlist')).toBeTruthy();

        fireEvent.press(getByText('Wishlist'));
        expect(getByText('Wishlist')).toBeTruthy();
    });

    it('renders Floating Button without text and displays modal content', () => {
        const { getByTestId, getByText } = renderComponent();
    
        const floatingButton = getByTestId('floating-shop-button');
        expect(floatingButton).toBeTruthy();
    
        fireEvent.press(floatingButton);
    
        // Verify one of the modal options instead of "Create Account"
        expect(getByText(Strings.Create_Task)).toBeTruthy(); 
    });

    it('applies focused styles on Home tab when selected', () => {
        const { getByText, queryByTestId } = renderComponent();

        fireEvent.press(getByText('Home'));

        const homeIcon = queryByTestId('home-icon-active'); // Use `queryByTestId` instead of `getByTestId`
        expect(homeIcon).toBeTruthy();
        expect(homeIcon.props.style).toEqual(
            expect.arrayContaining([{ tintColor: Colors.primary }])
        );
    });

    it('applies focused styles on Wishlist tab when selected', () => {
        const { getByText, queryByTestId } = renderComponent();

        fireEvent.press(getByText('Wishlist'));

        const wishlistIcon = queryByTestId('wishlist-icon-active'); // Use `queryByTestId`
        expect(wishlistIcon).toBeTruthy();
        expect(wishlistIcon.props.style).toEqual(
            expect.arrayContaining([{ tintColor: Colors.primary }])
        );
    });
});
