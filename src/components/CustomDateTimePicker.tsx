import React from 'react';
import { Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type PickerMode = 'date' | 'time';

interface Props {
  visible: boolean;
  value: Date;
  mode: PickerMode;
  minimumDate?: Date;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  onClose: () => void;
}

const CustomDateTimePicker: React.FC<Props> = ({
  visible,
  value,
  mode,
  minimumDate,
  onChange,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <DateTimePicker
      testID="mockDateTimePicker"
      value={value}
      mode={mode}
      minimumDate={minimumDate}
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={(event, date) => {
        if (event.type === 'set') {
          onChange(event, date);
        }
        onClose();
      }}
    />
  );
};

export default CustomDateTimePicker;
