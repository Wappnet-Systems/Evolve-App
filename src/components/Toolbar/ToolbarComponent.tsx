import React from 'react';
import {
  Image,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './Styles';
import TextTicker from 'react-native-text-ticker';
import { icons } from '../../constants/images';
interface ToolbarProps {
  customStyle?: StyleProp<ViewStyle>;
  customTextStyle?: StyleProp<ViewStyle>;
  customTextIconStyle?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
  username?: string;
  title?: string;
  rightIconSource?: number | string;
  notificationIconSource?: number | string;
  onRightIconPress?: () => void;
  onNotificationIconPress?: () => void;
  onBackPress?: () => void;
  onlyTitle?: boolean;
  notificationCount?: number;
  isTextTicker?: boolean;
}

export const ToolbarComponent: React.FC<ToolbarProps> = ({
  customStyle,
  customTextIconStyle,
  customTextStyle,
  showBackButton = false,
  username,
  title,
  rightIconSource,
  notificationIconSource,
  onRightIconPress,
  onNotificationIconPress,
  onBackPress,
  onlyTitle = false,
  notificationCount,
  isTextTicker = false,
}) => {
  return (
    <View style={[styles.container, customStyle]}>
      {onlyTitle ? (
        <Text style={styles.onlyTitle}>{title}</Text>
      ) : (
        <>
          {showBackButton && (
            <TouchableOpacity
              testID="back-button"
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.8}>
              <Image
                source={icons.IC_BACK_ARROW}
                style={[styles.backIcon, customTextIconStyle]}
              />
            </TouchableOpacity>
          )}

          {!showBackButton ? (
            <Text style={styles.username}>{username}</Text>
          ) : (
            <Text style={[styles.title, customTextStyle]}>{title}</Text>
          )}

          {isTextTicker && (
            <TextTicker
              style={[styles.titleTicker, customTextStyle]}
              duration={2000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}>
              {title}
            </TextTicker>
          )}

          {rightIconSource && !showBackButton && (
            <View style={styles.rightIconWrapper}>
              <TouchableOpacity
                testID="notification-icon"
                style={styles.rightIcon}
                onPress={onNotificationIconPress}>
                <Image
                  source={notificationIconSource}
                  style={styles.rightIconImage}
                  resizeMode="contain"
                />
                {notificationCount && notificationCount > 0 ? (
                  <View  testID="notification-badge" style={styles.notificationBadge}>
                    <Text testID="notification-count" style={styles.notificationCount}>
                      {notificationCount}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                testID="right-icon"
                style={styles.rightIcon}
                onPress={onRightIconPress}>
                <Image
                  source={rightIconSource}
                  style={styles.rightIconImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};
