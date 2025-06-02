import React from 'react';
import { render } from '@testing-library/react-native';
import CircularProgress from '../src/components/CircularProgress';

describe('CircularProgress Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<CircularProgress percentage={50} />);
    
    // Check if the percentage text is rendered correctly
    expect(getByText('%50')).toBeTruthy();
  });

  it('renders correctly with custom size and strokeWidth', () => {
    const { getByTestId } = render(
      <CircularProgress percentage={75} size={150} strokeWidth={5} />
    );

    const progressCircle = getByTestId('progress-circle');

    expect(progressCircle.props.strokeWidth).toBe(5);
  });

  it('applies correct strokeDashoffset for given percentage', () => {
    const size = 120;
    const strokeWidth = 3.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = 75;
    const expectedOffset = circumference - (percentage / 100) * circumference;

    const { getByTestId } = render(<CircularProgress percentage={75} />);

    expect(getByTestId('progress-circle').props.strokeDashoffset).toBeCloseTo(expectedOffset);
  });
});
