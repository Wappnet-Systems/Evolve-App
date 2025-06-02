import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import { navigationRef } from './src/navigation/navigationService';
import { Alert, Button, InteractionManager, Linking, NativeModules, Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlockedScreen } from './src/components/BlockedScreen';

const { AdminModule, UsageStatsModule,UsageAccessModule } = NativeModules;

let notificationHandled = false;


// const isInRestrictedTime = (startISO: string, endISO: string) => {
//   const now = new Date();
//   const start = new Date(startISO);
//   const end = new Date(endISO);

//   const nowMinutes = now.getHours() * 60 + now.getMinutes();
//   const startMinutes = start.getHours() * 60 + start.getMinutes();
//   const endMinutes = end.getHours() * 60 + end.getMinutes();

//   if (startMinutes < endMinutes) {
//     return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
//   } else {
//     // Restriction spans midnight
//     return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
//   }
// };

function App(): React.JSX.Element {

  // const [isBlocked, setIsBlocked] = useState(false);
  // const [loading, setLoading] = useState(true);

  // const openUsageAccessSettings = () => {
  //   if (Platform.OS === 'android') {
  //     Linking.openSettings(); // Opens the app settings directly
  //     // Optionally: Use a native module or intent to open USAGE_ACCESS_SETTINGS directly
  //   }
  // };

//USAGE SETTING
    // useEffect(() => {
    //   if (Platform.OS === 'android') {
    //     UsageAccessModule.openUsageAccessSettings();
    //   }
    // }, []);

    // Restriction time check
    // useEffect(() => {
    //   const checkRestriction = async () => {
    //     const restriction = await AsyncStorage.getItem('RESTRICTION_TIME');
    //     if (restriction) {
    //       const { startTime, endTime } = JSON.parse(restriction);
    //       const blocked = isInRestrictedTime(startTime, endTime);
    //       setIsBlocked(blocked);
    //     }
    //     setLoading(false);
    //   };
  
    //   checkRestriction();
    //   const interval = setInterval(checkRestriction, 60000); // Check every minute
    //   return () => clearInterval(interval);
    // }, []);

      // Setup notification channel
  useEffect(() => {
    async function setupChannel() {
      await notifee.createChannel({
        id: 'alarm',
        name: 'Alarm Channel',
        importance: AndroidImportance.HIGH,
        sound: 'advertising',
        vibration: true,
        bypassDnd: true,
        lights: true,
        visibility: AndroidVisibility.PUBLIC,
      });
    }

    setupChannel();
  }, []);

    // Foreground notification handling
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (
        (type === EventType.PRESS || type === EventType.ACTION_PRESS) &&
        !notificationHandled
      ) {
        notificationHandled = true;

        const alarmId = detail.notification?.id;
        const puzzleType = detail.notification?.data?.puzzleType || 'math';

        if (alarmId) {
          navigationRef.current?.navigate('PuzzleScreen', {
            alarmId,
            puzzleType,
          });

          await notifee.cancelNotification(alarmId);
          await notifee.stopForegroundService();
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Cold start notification handling
  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification && !notificationHandled) {
        notificationHandled = true;

        const { notification } = initialNotification;
        const alarmId = notification.id;
        const puzzleType = notification.data?.puzzleType;

        if (alarmId) {
          console.log('Navigating to PuzzleScreen after cold start');
          navigationRef.current?.navigate('PuzzleScreen', {
            alarmId,
            puzzleType,
          });

          await notifee.cancelNotification(alarmId);
          await notifee.stopForegroundService();
        }
      }
    });
  }, []);


  // if (loading) return null;

  // if (isBlocked) {
  //   return <BlockedScreen />;
  // }

  // const enableAdmin = () => {
  //   console.log('enableAdmin');
    
  //   AdminModule.activateAdmin();
  // };

  

  // const fetchUsageStats = () => {
  //   UsageStatsModule.getUsageStats({}, (err, result) => {
  //     if (err) {
  //       console.warn("Error getting stats", err);
  //     } else {
  //       console.log("App Usage Stats:", JSON.stringify(result, null, 2));
  //       Alert.alert(JSON.stringify(result, null, 2));
  //     }
  //   });
  // };

  return <AppNavigator navigationRef={navigationRef} />;
  // return (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <Button title="Enable Admin Access" onPress={enableAdmin} />
  //     <Button title="Get App Usage Info" onPress={fetchUsageStats} />

  //   </View>
  // );
}

export default App;


  // useEffect(() => {
  //   async function checkInitialNotification() {
  //     const initialNotification = await notifee.getInitialNotification();
  //     if (initialNotification) {
  //       const { notification } = initialNotification;
  //       const alarmId = notification.id;
  //       const puzzleType = notification.data?.puzzleType;
  
  //       if (alarmId) {
  //         console.log('Opening PuzzleScreen from background notification');
  //         navigationRef.current?.navigate('PuzzleScreen', {
  //           alarmId,
  //           puzzleType,
  //         });
  //       }
  //     }
  //   };
  //   checkInitialNotification();
  // }, []);


// import React, { useEffect, useState } from 'react';

// import AppNavigator from './src/navigation/AppNavigator';
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore'; // If using modular SDK
// import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

// // Replace with your actual Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBUxnH76ZXW5KF5xF9RmGWtbY1xPGVmO0s",
//   authDomain: "evolve-3cb23.firebaseapp.com",
//   databaseURL: "https://evolve-3cb23.firebaseio.com",
//   projectId: "evolve-3cb23",
//   storageBucket: "evolve-3cb23.appspot.com",
//   messagingSenderId: "1013020519727",
//   appId: "1:1013020519727:android:cb35cf21140ce9aeea85da",
//   // ... other configurations
// };

// let firebaseInitialized = false;
// let db: ReturnType<typeof getFirestore> | null = null; // Type for Firestore instance

// function App(): React.JSX.Element {
//   const [loadingFirebase, setLoadingFirebase] = useState(true);
//   const [errorFirebase, setErrorFirebase] = useState<string | null>(null);

//   useEffect(() => {
//     const initializeFirebaseApp = async () => {
//       try {
//         if (!firebaseInitialized) {
//           initializeApp(firebaseConfig);
//           db = getFirestore(); // Initialize Firestore instance
//           firebaseInitialized = true;
//           console.log('Firebase initialized successfully');
//         }
//       } catch (e: any) {
//         console.error('Error initializing Firebase:', e);
//         setErrorFirebase(e.message);
//       } finally {
//         setLoadingFirebase(false);
//       }
//     };

//     initializeFirebaseApp();
//   },);

//   if (loadingFirebase) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator
//           testID="loading-indicator"
//           size="large"
//           color="#007bff"
//         />
//       </View>
//     );
//   }

//   if (errorFirebase) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Firebase Initialization Error:</Text>
//         <Text style={styles.errorText}>{errorFirebase}</Text>
//       </View>
//     );
//   }

//   return <AppNavigator />;
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
// });

// export default App;

// In your App.tsx (or your main entry file)
// import React, { useEffect, useState } from 'react';
// import { initializeApp, getApps } from 'firebase/app';
// import AppNavigator from './src/navigation/AppNavigator';
// import { ActivityIndicator, View, StyleSheet } from 'react-native';

// const firebaseConfig = {
//   apiKey: "AIzaSyBUxnH76ZXW5KF5xF9RmGWtbY1xPGVmO0s",
//   authDomain: "evolve-3cb23.firebaseapp.com",
//   databaseURL: "https://evolve-3cb23.firebaseio.com",
//   projectId: "evolve-3cb23",
//   storageBucket: "evolve-3cb23.appspot.com",
//   messagingSenderId: "1013020519727",
//   appId: "1:1013020519727:android:cb35cf21140ce9aeea85da",
// };

// function App(): React.JSX.Element {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!getApps().length) {
//       try {
//         initializeApp(firebaseConfig);
//       } catch (e) {
//         console.error('Firebase initialization failed:', e);
//       } finally {
//         setLoading(false); // Ensure loading stops
//       }
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="blue" />
//       </View>
//     );
//   }

//   return <AppNavigator />;
// }

// const styles = StyleSheet.create({
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

// export default App;
