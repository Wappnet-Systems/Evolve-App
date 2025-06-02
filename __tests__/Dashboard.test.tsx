import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from '../src/screens/Dashboard/Dashboard';
import { Colors } from '../src/constants/colors';
import { StatusBar } from 'react-native';

describe('Dashboard Component', () => {
    const renderComponent = () =>
        render(
            <NavigationContainer>
                <Dashboard />
            </NavigationContainer>
        );

    it('renders the Dashboard container correctly', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('dashboard-container')).toBeTruthy();
    });

    it('renders the StatusBar with correct background color and style', () => {
        const { UNSAFE_getByType } = renderComponent();
        const statusBar = UNSAFE_getByType(StatusBar);
        expect(statusBar.props.backgroundColor).toBe(Colors.background);
        expect(statusBar.props.barStyle).toBe('dark-content');
    });

    it('renders the BottomNavigation component correctly', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('bottom-navigation')).toBeTruthy();
    });
});
