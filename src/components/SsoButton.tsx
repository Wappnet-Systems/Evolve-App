import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Dimens } from '../constants/dimens';

interface SsoButtonProps {
  imageSource: any;
  onPress: () => void;
  style?:object,
  iconSize?: {height: number, width: number},
 
}

const SsoButton: React.FC<SsoButtonProps> = ({ imageSource, onPress, style,iconSize=Dimens.icon.GOOGLESIZE }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]} testID="sso-button">
      <View style={[styles.button,Dimens.roundedButton]}>
        <Image source={imageSource} style={iconSize} testID="sso-image"/>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
 
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
 
});

export default SsoButton;
