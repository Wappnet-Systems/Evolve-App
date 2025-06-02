import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageSourcePropType, Image } from 'react-native';
import {  TextStyles } from '../constants/textstyle';
import { Colors } from '../constants/colors';
import { Dimens } from '../constants/dimens';

interface RectangularButtonProps {
  title: string;
  icon?:ImageSourcePropType;
  onPress: () => void;
  style?:object;
  styleText?:object;
}

const RactangularButton: React.FC<RectangularButtonProps> = ({ title, onPress, style,icon ,styleText}) => {
  return (
    <TouchableOpacity style={[styles.button,Dimens.button, style]} onPress={onPress}
    testID="button">
      <Text style={[styles.buttonText,styleText]}>{title}</Text>
      <Image source={icon} style={{ width: 15, height: 11 }} testID="icon"/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: Colors.primary, 
    

  
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText:{
    fontFamily:TextStyles.semiBoldText,
    color:Colors.white,
    fontSize:20
  }
 
  
});

export default RactangularButton;
