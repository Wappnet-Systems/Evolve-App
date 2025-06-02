import { useState, useEffect } from 'react';
import { Alarm, AlarmRepository } from '../../domain/models/alarm';
import { format } from 'date-fns';
import notifee from '@notifee/react-native';

export const useAlarmPresenter= (repository: AlarmRepository) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPuzzleTypeModal, setShowPuzzleTypeModal] = useState(false);
  const [tempAlarmTime, setTempAlarmTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

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

  const loadAlarms = async () => {
    const loadedAlarms = await repository.loadAlarms();
    setAlarms(loadedAlarms);
  };

  const handleTimePickerChange = (event: any, date?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && date) {
      setTempAlarmTime(date);
      setShowPuzzleTypeModal(true);
    }
  };

  const handlePuzzleTypeSelect = async (type: 'math' | 'block') => {
    setShowPuzzleTypeModal(false);
  setLoading(true);

    if (tempAlarmTime) {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: format(tempAlarmTime, 'HH:mm'),
        isEnabled: true,
        puzzleType: type,
        days: [],
      };

      await repository.createAlarm(newAlarm);
      await loadAlarms();
      setTempAlarmTime(null);
      setLoading(false);
    }
    setShowPuzzleTypeModal(false);
  };

  const handleToggleAlarm = async (id: string) => {
    await repository.toggleAlarm(id);
    loadAlarms();
  };

  const handleDeleteAlarm = async (id: string) => {
    await repository.deleteAlarm(id);
    loadAlarms();
  };

  return {
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
  };
}; 