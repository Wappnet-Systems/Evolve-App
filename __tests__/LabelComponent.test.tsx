import React from 'react';
import { render } from '@testing-library/react-native';
import LabelComponent from '../src/components/LableComponent';

describe('LabelComponent', () => {
  it('renders the value correctly', () => {
    const { getByText } = render(<LabelComponent value="Test Value" />);
    expect(getByText('Test Value')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { color: 'red', fontSize: 20 };
    const { getByText } = render(<LabelComponent value="Styled Text" style={customStyle} />);

    const textElement = getByText('Styled Text');
    expect(textElement.props.style).toMatchObject(customStyle);
  });

  it('renders empty value if no value is provided', () => {
    const { getByText } = render(<LabelComponent value="" />);
    expect(getByText('')).toBeTruthy();
  });
});
