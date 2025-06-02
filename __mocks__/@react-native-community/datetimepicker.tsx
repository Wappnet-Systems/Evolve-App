import React from 'react';
import { Text, View } from 'react-native';

const DateTimePicker = (props: any) => {
  const { testID = 'mockDateTimePicker', onChange } = props;

  return (
    <View testID={testID}>
      <Text>DateTimePicker</Text>
    </View>
  );
};

export default DateTimePicker;
