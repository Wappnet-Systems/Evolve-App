import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './Styles';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { AlarmRepositoryImpl } from '../../../data/repositories/AlarmRepositoryImpl';
import { useAlarmPresenter } from '../../presenters/AlarmPresenter';
import { Colors } from '../../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee,{ EventType } from '@notifee/react-native';

const Icon = MaterialIcons as any;

type RootStackParamList = {
  Alarm: undefined;
  PuzzleScreen: { alarmId: string; puzzleType: string };
};

type AlarmScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Alarm'>;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmScreen: React.FC<AlarmScreenProps> = ({ navigation }) => {
  const repository = new AlarmRepositoryImpl();
  const {
    alarms,
    showTimePicker,
    selectedTime,
    showPuzzleTypeModal,
    setShowTimePicker,
    handleTimePickerChange,
    handlePuzzleTypeSelect,
    handleToggleAlarm,
    handleDeleteAlarm,
    setShowPuzzleTypeModal,
    loading
  } = useAlarmPresenter(repository);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // useEffect(() => {
  //   loadAlarms();
  // }, []);

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

  // const loadAlarms = async () => {
  //   try {
  //     const savedAlarms = await AsyncStorage.getItem('alarms');
  //     if (savedAlarms) {
  //       setAlarms(JSON.parse(savedAlarms));
  //     }
  //   } catch (error) {
  //     console.error('Error loading alarms:', error);
  //   }
  // };


  const confirmDeleteAlarm = (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteAlarm(id),
        },
      ],
      { cancelable: true }
    );
  };  

  const renderAlarm = ({ item }: { item: any }) => (
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
          onValueChange={() => handleToggleAlarm(item.id)}
        />
        <TouchableOpacity
          testID="delete-alarm-button"
          style={styles.deleteButton}
          onPress={() => confirmDeleteAlarm(item.id)}>
          <MaterialIcons name="delete" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} testID="activity-indicator" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity testID="header-back-button" onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alarms</Text>
        <TouchableOpacity onPress={() => {}} />
      </View>

      <FlatList
        data={alarms}
        renderItem={renderAlarm}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.alarmList}
      />

      <TouchableOpacity
        testID="add-alarm-button"
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
          onChange={handleTimePickerChange}
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
                onPress={() => handlePuzzleTypeSelect(type as 'math' | 'block')}>
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