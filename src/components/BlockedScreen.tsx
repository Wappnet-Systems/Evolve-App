import { StyleSheet, Text, View } from "react-native";

export const BlockedScreen = () => {
    return (
      <View style={styles.blockedContainer}>
        <Text style={styles.blockedText}>
          App access is restricted during this time.
        </Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    blockedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    blockedText: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
  });
  