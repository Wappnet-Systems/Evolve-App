import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidCategory, AndroidImportance, AndroidVisibility, TriggerType } from '@notifee/react-native';
import { Alarm, AlarmRepository } from '../../domain/models/alarm';
import { parse, isBefore, addDays } from 'date-fns';

export class AlarmRepositoryImpl implements AlarmRepository {
  private readonly STORAGE_KEY = 'alarms';

  async loadAlarms(): Promise<Alarm[]> {
    try {
      const savedAlarms = await AsyncStorage.getItem(this.STORAGE_KEY);
      return savedAlarms ? JSON.parse(savedAlarms) : [];
    } catch (error) {
      console.error('Error loading alarms:', error);
      return [];
    }
  }

  async saveAlarms(alarms: Alarm[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(alarms));
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  }

  async createAlarm(alarm: Alarm): Promise<void> {
    const alarms = await this.loadAlarms();
    const updatedAlarms = [...alarms, alarm];
    await this.saveAlarms(updatedAlarms);
    await this.createTriggerNotification(alarm);
  }

  async deleteAlarm(id: string): Promise<void> {
    const alarms = await this.loadAlarms();
    const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
    await this.saveAlarms(updatedAlarms);
    await notifee.cancelTriggerNotification(id);
  }

  async toggleAlarm(id: string): Promise<void> {
    const alarms = await this.loadAlarms();
    const updatedAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        return { ...alarm, isEnabled: !alarm.isEnabled };
      }
      return alarm;
    });
    await this.saveAlarms(updatedAlarms);

    const alarm = updatedAlarms.find(a => a.id === id);
    if (alarm?.isEnabled) {
      await this.createTriggerNotification(alarm);
    } else {
      await notifee.cancelTriggerNotification(id);
    }
  }

  private async createTriggerNotification(alarm: Alarm): Promise<void> {
    const now = new Date();
    let alarmTime = parse(alarm.time, 'HH:mm', new Date());
    
    if (isBefore(alarmTime, now)) {
      alarmTime = addDays(alarmTime, 1);
    }

    await notifee.createTriggerNotification(
      {
        id: alarm.id,
        title: 'Wake up!',
        body: `It's ${alarm.time}, time to solve your ${alarm.puzzleType} puzzle!`,
        android: {
          channelId: 'alarm',
          smallIcon: 'ic_launcher',
          sound: 'advertising',
          pressAction: { id: 'open-puzzle', launchActivity: 'default' },
          fullScreenAction: { id: 'open-puzzle' },
          importance: AndroidImportance.HIGH,
          category: AndroidCategory.ALARM,
          ongoing: true,
          autoCancel: false,
          loopSound: true,
          visibility: AndroidVisibility.PUBLIC,
          timestamp: alarmTime.getTime(),
        },
        data: { puzzleType: alarm.puzzleType },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: alarmTime.getTime(),
      }
    );
  }
} 