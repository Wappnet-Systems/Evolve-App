import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  Platform,
  AppState,
  AppStateStatus,
  Linking,
  BackHandler,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { parse, isBefore, addDays } from 'date-fns';
import notifee, { 
  TriggerType, 
  AndroidImportance, 
  EventType, 
  AndroidCategory,
  TimestampTrigger,
  Event,
  TriggerNotification,
  AndroidVisibility,
} from '@notifee/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './Styles';
import { useFocusEffect } from '@react-navigation/native';

const Icon = MaterialIcons as any;

type RootStackParamList = {
  Alarm: undefined;
  PuzzleScreen: { alarmId: string, puzzleType: string };
};

type AlarmScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Alarm'>;
};

type Alarm = {
  id: string;
  time: string;
  isEnabled: boolean;
  puzzleType: 'math' | 'block';
  days: string[];
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmScreen: React.FC<AlarmScreenProps> = ({ navigation }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPuzzleTypeModal, setShowPuzzleTypeModal] = useState(false);
const [tempAlarmTime, setTempAlarmTime] = useState<Date | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Block back button
        return true;
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    loadAlarms();
  }, []);

  useEffect(() => {
    async function requestPermissions() {
      const settings = await notifee.requestPermission();
      if (settings.ios?.criticalAlert || settings.android?.alarm) {
        console.log('Alarm permission granted');
      } else {
        console.log('Alarm permission denied');
      }
    }
    requestPermissions();
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (
        (type === EventType.PRESS || type === EventType.DELIVERED) &&
        detail?.notification?.data?.puzzleType
      ) {
        const alarmId = detail.notification?.id;
        const puzzleType = detail.notification.data.puzzleType;
  
        console.log('Navigating to PuzzleScreen automatically due to foreground notification...');
        navigation.navigate('PuzzleScreen', { alarmId,puzzleType });
      }
    });
  
    return () => unsubscribe();
  }, []);

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem('alarms');
      if (savedAlarms) {
        setAlarms(JSON.parse(savedAlarms));
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
    }
  };

  const saveAlarms = async (updatedAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  };


  const createTriggerNotification = async (alarm: Alarm) => {
    const now = new Date();
  
    // Parse alarm time into a Date object
    let alarmTime = parse(alarm.time, 'HH:mm', new Date());
  
    // If the alarm time has already passed today, schedule it for tomorrow
    if (isBefore(alarmTime, now)) {
      alarmTime = addDays(alarmTime, 1);
    }
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: alarmTime.getTime(),
      // alarmManager: true, // This ensures the alarm works even when app is killed
    };
  
    // Create notification
    await notifee.createTriggerNotification(
      {
        id: alarm.id,
        title: 'Wake up!',
        body: `It's ${alarm.time}, time to solve your ${alarm.puzzleType} puzzle!`,
        android: {
          channelId: 'alarm',
          smallIcon: 'ic_launcher',
          sound: 'advertising',
          pressAction: {
            id: 'open-puzzle',
            launchActivity: 'default',
          },
          fullScreenAction: {
            id: 'open-puzzle',
          },
          importance: AndroidImportance.HIGH,
          category: AndroidCategory.ALARM,
          ongoing: true, // Makes the notification persistent
          autoCancel: false, // Prevents notification from auto-canceling
          loopSound: true, // Makes the sound loop continuously
          visibility: AndroidVisibility.PUBLIC,
          // Add vibration pattern for more attention
          // vibrationPattern: [0, 1000, 1000, 1000, 1000],
          timestamp: alarmTime.getTime(),
        },
        data: {
          puzzleType: alarm.puzzleType,
        },
      },
      trigger
    );

      // Check scheduled notifications
  const triggers = await notifee.getTriggerNotifications();
  console.log('Scheduled notifications:', triggers.map(t => ({
    id: t.notification.id,
    time: new Date((t.trigger as TimestampTrigger).timestamp).toLocaleTimeString(),
  })));
};

  const toggleAlarm = async (id: string) => {
    const updatedAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        return { ...alarm, isEnabled: !alarm.isEnabled };
      }
      return alarm;
    });
    setAlarms(updatedAlarms);
    await saveAlarms(updatedAlarms);

    const alarm = updatedAlarms.find(a => a.id === id);
    if (alarm?.isEnabled) {
      await createTriggerNotification(alarm);
    } else {
      await notifee.cancelTriggerNotification(id);
    }
  };

  const deleteAlarm = async (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
            setAlarms(updatedAlarms);
            await saveAlarms(updatedAlarms);
            await notifee.cancelTriggerNotification(id);
          },
        },
      ],
    );
  };

  const renderAlarm = ({ item }: { item: Alarm }) => (
    <View style={styles.alarmItem}>
      <View style={styles.alarmTimeContainer}>
        <Text style={styles.alarmTime}>{item.time}</Text>
        <View style={styles.daysContainer}>
          {DAYS.map(day => (
            <Text
              key={day}
              style={[
                styles.dayText,
                item.days.includes(day) && styles.selectedDay,
              ]}>
              {day}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.alarmActions}>
        <Switch
          value={item.isEnabled}
          onValueChange={() => toggleAlarm(item.id)}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteAlarm(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Alarms</Text>
      </View> */}
        <View style={styles.header}>
        <TouchableOpacity testID="header-back-button" onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alarms</Text>
        <TouchableOpacity onPress={() => {}}>
          {/* <Icon name="star-border" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>


      <FlatList
        data={alarms}
        renderItem={renderAlarm}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.alarmList}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowTimePicker(true)}>
        <MaterialIcons name="add-alarm" size={24} color="#FFF" />
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);
            // if (event.type === 'set' && date) {
            //   // Create the alarm with the date directly from the picker
            //   const newAlarm: Alarm = {
            //     id: Date.now().toString(),
            //     time: format(date, 'HH:mm'),
            //     isEnabled: true,
            //     puzzleType: 'math',
            //     days: [],
            //   };
            //   setShowPuzzleTypeModal(true); // Show puzzle type modal

            //   // Update state and create notification
            //   setAlarms(prevAlarms => {
            //     const updatedAlarms = [...prevAlarms, newAlarm];
            //     // Save alarms and create notification after state update
            //     saveAlarms(updatedAlarms);
            //     createTriggerNotification(newAlarm);
            //     return updatedAlarms;
            //   });
            // }
            if (event.type === 'set' && date) {
              setTempAlarmTime(date);
              setShowPuzzleTypeModal(true); // Open puzzle type modal
            }
            
          }}
        />
      )}

<Modal visible={showPuzzleTypeModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Choose Puzzle Type</Text>

      {['math', 'block'].map(type => (
        <TouchableOpacity
          key={type}
          style={styles.modalButton}
          onPress={() => {
            if (tempAlarmTime) {
              const newAlarm: Alarm = {
                id: Date.now().toString(),
                time: format(tempAlarmTime, 'HH:mm'),
                isEnabled: true,
                puzzleType: type as Alarm['puzzleType'],
                days: [],
              };

              const updatedAlarms = [...alarms, newAlarm];
              setAlarms(updatedAlarms);
              saveAlarms(updatedAlarms);
              createTriggerNotification(newAlarm);
              setTempAlarmTime(null);
            }
            setShowPuzzleTypeModal(false);
          }}
        >
          <Text style={styles.modalButtonText}>{type.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => setShowPuzzleTypeModal(false)}>
        <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default AlarmScreen; 