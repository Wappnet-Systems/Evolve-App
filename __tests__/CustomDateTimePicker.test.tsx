import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomDateTimePicker from '../src/components/CustomDateTimePicker';

jest.mock('@react-native-community/datetimepicker');

describe('CustomDateTimePicker', () => {
  const testDate = new Date('2025-04-04T10:00:00');
  const mockOnChange = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when visible is false', () => {
    
    const { queryByTestId } = render(
      <CustomDateTimePicker
        visible={false}
        value={testDate}
        mode="date"
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );

    expect(queryByTestId('mockDateTimePicker')).toBeNull();
  });

  it('should render DateTimePicker when visible is true', () => {
    const { getByTestId } = render(
      <CustomDateTimePicker
        visible={true}
        value={testDate}
        mode="date"
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );

    expect(getByTestId('mockDateTimePicker')).toBeTruthy();
  });

  it('should call onClose and onChange when a date is selected', () => {
    const { getByTestId } = render(
      <CustomDateTimePicker
        visible={true}
        value={testDate}
        mode="date"
        onChange={mockOnChange}
        onClose={mockOnClose}
      />
    );

    const picker = getByTestId('mockDateTimePicker');
    fireEvent(picker, 'onChange', { type: 'set' }, new Date('2025-04-05T10:00:00'));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should only call onClose when picker is dismissed', () => {
    const { getByTestId } = render(
        <CustomDateTimePicker
          visible={true}
          value={testDate}
          mode="date"
          onChange={mockOnChange}
          onClose={mockOnClose}
        />
      );

      const picker = getByTestId('mockDateTimePicker');
      fireEvent(picker, 'onChange', { type: 'dismissed' }, undefined);
    
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
});
