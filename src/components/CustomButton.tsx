import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageSourcePropType, Image, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Dimens } from '../constants/dimens';
import { TextStyles } from '../constants/textstyle';

interface RectangularButtonProps {
    title: string;
    icon?: ImageSourcePropType;
    onPress?: () => void;
    style?: ViewStyle;
    styleText?: TextStyle;
    disabled?: boolean;
}

const CustomButton: React.FC<RectangularButtonProps> = ({ title, onPress, style, icon, styleText, disabled = false }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                Dimens.button,
                style,
                disabled && styles.disabledButton,
            ]}
            onPress={onPress}
            disabled={disabled}>
            <Text style={[styles.buttonText, styleText, disabled && styles.disabledText]}>{title}</Text>
            {/* <Image source={icon} style={{ width: 15, height: 11 }} /> */}
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
    buttonText: {
        fontFamily: TextStyles.semiBoldText,
        color: Colors.white,
        fontSize: 20
    },
    disabledButton: {
        backgroundColor: Colors.palette.neutral300,
        opacity: 0.7,
    },
    disabledText: {
        color: Colors.palette.neutral500,
    },
});

export default CustomButton;
