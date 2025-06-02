import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Image, TouchableOpacity } from 'react-native';
import { TextStyles } from '../constants/textstyle';
import { Colors } from '../constants/colors';
import { icons } from '../constants/images';


interface TextfieldComponentProps extends TextInputProps {
  icon?:any,
  iconSize?: { width: number; height: number }; 
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: object;
  keyboardType?: TextInputProps["keyboardType"];
}

const TextfieldComponent: React.FC<TextfieldComponentProps> = ({ 
  icon,
  iconSize = { width: 16, height: 20 }, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
   keyboardType = "default",
  style 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  return (
    <View style={[styles.inputContainer, style]}>
  
      <Image source={icon} style={[styles.icon, iconSize]} />
      <TextInput
        style={[styles.input]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.graniteGray}
        
      />
        {secureTextEntry && (
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Image
            source={isPasswordVisible ? icons.IC_EYE_OPEN : icons.IC_EYE_CLOSE}
            style={styles.eyeIcon}
            testID='eye-icon'
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    // width: 317,
    // height: 50,
    borderWidth: 1,
    borderColor: Colors.darkGray1,
    borderRadius: 10,
     paddingHorizontal: 10,
    backgroundColor: Colors.extraLightGray,
  },
  icon: {
    
    marginRight: 10,
    marginLeft:10,
  },
  input: {
    flex: 1,
   fontFamily:TextStyles.mediumText,
   fontSize:13,
   color: Colors.graniteGray,
  
  },
  eyeIcon: {
    
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

export default TextfieldComponent;
