import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Image, Text } from 'react-native';

interface LableComponentProps extends TextInputProps {
  value:string
 
  style?:object
}

const LabelComponent: React.FC<LableComponentProps> = ({ 
 
  value, 
  
  style
 
}) => {
  return (
   <View>
    <Text style={  style}> {value}</Text>
   </View>
  );
};



export default LabelComponent;
