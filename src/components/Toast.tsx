import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    onHide: () => void;
    duration?: number;
    style?: ViewStyle;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    onHide,
    duration = 3000,
    style,
}) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(duration),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                styles[type],
                { opacity: fadeAnim },
                style,
            ]}>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.closeButton} onPress={onHide}>×</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex:1,
    },
    success: {
        backgroundColor: Colors.black,
    },
    error: {
        backgroundColor: "red",
    },
    message: {
        color: Colors.palette.neutral100,
        fontSize: 14,
        flex: 1,
        marginRight: 8,
    },
    closeButton: {
        color: Colors.palette.neutral100,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Toast; 