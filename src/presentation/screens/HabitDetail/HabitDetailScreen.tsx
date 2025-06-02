import React, { FC, useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, Modal, Text, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Strings } from '../../../constants/strings';
import { ToolbarComponent } from '../../../components/Toolbar/ToolbarComponent';
import TextfieldComponent from '../../../components/TextFieldComponent';
import CustomButton from '../../../components/CustomButton';
import LabelComponent from '../../../components/LableComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../../../navigation/types';
import { format } from 'date-fns';
import { HabitDetailPresenter } from '../../presenters/HabitDetailPresenter';
import { HabitDetailUseCases } from '../../../domain/usecases/HabitDetailUseCases';
import { HabitDetailRepositoryImpl } from '../../../data/repositories/HabitDetailRepositoryImpl';
import { HabitDetail } from '../../../domain/models/HabitDetail';
import { styles } from './Styles';
import Toast from '../../../components/Toast';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;

const HabitDetailScreen: FC = () => {
    const navigation = useNavigation();
    const route = useRoute<HabitDetailScreenRouteProp>();
    const { habitName, habitIcon,habitId } = route.params;
    const [loading, setLoading] = useState(true);
    const [habit, setHabit] = useState<HabitDetail | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDurationPicker, setShowDurationPicker] = useState(false);
    const [selectedType, setSelectedType] = useState<'hour' | 'min'>('min');
    const [tempDuration, setTempDuration] = useState({ hours: '0', minutes: '30' });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showStartDayPicker, setShowStartDayPicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState<'start' | 'completion'>('start');

    // console.log('HABIT ID', JSON.stringify(habitId));
    

    // Initialize presenter
    const presenter = React.useMemo(() => {
        const repository = new HabitDetailRepositoryImpl();
        const useCases = new HabitDetailUseCases(repository);
        return new HabitDetailPresenter({
            showLoading: setLoading,
            showError: (message) => setToast({ message, type: 'error' }),
            showSuccess: (message) => setToast({ message, type: 'success' }),
            updateHabit: setHabit,
            navigateToDashboard: (message) => {
                navigation.navigate('Dashboard', {
                    showToast: true,
                    toastMessage: message,
                    toastType: 'success'
                });
            }
        }, useCases);
    }, [navigation]);

    useEffect(() => {
        // Initialize habit with the passed parameters
        setHabit({
            id: habitId?.id || '', // Default to an empty string if habitId?.id is undefined
            name: habitName || habitId?.name || '',
            emoji: habitIcon || habitId?.emoji || '',
            description: habitId?.description || '',
            time: habitId?.time ? new Date(habitId.time) : new Date(), 
            reminder: habitId?.reminder ?? false, // Use nullish coalescing for booleans
            days: habitId?.days || [],
            duration: habitId?.duration || { hours: '0', minutes: '0' },
            lastCompleted: habitId?.lastCompleted || null,
            completedDates: habitId?.completedDates || [],
            startDay: habitId?.startDay ? new Date(habitId.startDay) : new Date()
        });
    
        setLoading(false);
    }, [habitName, habitIcon, habitId]); // Added `habitId` as a dependency

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: showDurationPicker ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showDurationPicker]);

    const handleSave = async () => {
        if (!habit) return;
        await presenter.saveHabitDetail(habit);
    };

    const toggleDay = (day: string) => {
        if (!habit) return;
        setHabit(prev => ({
            ...prev!,
            days: prev!.days.includes(day)
                ? prev!.days.filter(d => d !== day)
                : [...prev!.days, day],
        }));
    };

    const handleStartDaySelect = async(date: Date) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date < now) {
            setToast({ 
                message: 'Cannot set start date in the past', 
                type: 'error' 
            });
            return;
        }

        if (!habit) return;
        setHabit(prev => prev ? {
            ...prev,
            startDay: date
        } : null);
        setShowStartDayPicker(false);
    };

    const handleDurationSelect = (value: string) => {
        if (selectedType === 'hour') {
            setTempDuration(prev => ({ ...prev, hours: value }));
        } else {
            setTempDuration(prev => ({ ...prev, minutes: value }));
        }
    };

    const getTimeValues = () => {
        if (selectedType === 'hour') {
            return Array.from({ length: 24 }, (_, i) => i.toString());
        } else {
            return Array.from({ length: 12 }, (_, i) => ((i + 1) * 5).toString());
        }
    };

    const formatDuration = (duration: { hours: string; minutes: string }) => {
        if (!duration || (!duration.hours && !duration.minutes)) {
            return "Select duration";
        }

        const hours = parseInt(duration.hours || '0');
        const minutes = parseInt(duration.minutes || '0');
        
        if (hours === 0) {
            return `${minutes} minutes`;
        } else if (minutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
        }
    };

    const confirmDuration = () => {
        if (!habit) return;
        setHabit(prev => ({
            ...prev!,
            duration: {
                hours: tempDuration.hours,
                minutes: tempDuration.minutes
            },
        }));
        setShowDurationPicker(false);
    };

    const handleTimeSelect = (event: any, selectedTime?: Date) => {
        setShowDatePicker(false);
        if (selectedTime && habit) {
            setHabit(prev => prev ? {
                ...prev,
                time: selectedTime
            } : null);
        }
    };

    return (
        <View style={styles.container}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}
            <ToolbarComponent
                title={Strings.Habit_Details}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
            
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <LabelComponent value={`${habit?.emoji} ${habit?.name}`} style={styles.habitTitle} />
                </View>

                <View style={styles.section}>
                    <LabelComponent value="Start Day" style={styles.sectionTitle} />
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => {
                            setDatePickerMode('start');
                            setShowStartDayPicker(true);
                        }}
                    >
                        <LabelComponent
                            value={habit?.startDay ? format(habit.startDay, 'MMMM d, yyyy') : 'Select start day'}
                            style={styles.dateText}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <LabelComponent value="Duration" style={styles.sectionTitle} />
                    <TouchableOpacity
                        style={styles.durationButton}
                        onPress={() => {
                            setTempDuration({
                                hours: habit?.duration.hours || '0',
                                minutes: habit?.duration.minutes || '0'
                            });
                            setShowDurationPicker(true);
                        }}>
                        <LabelComponent
                            value={formatDuration(habit?.duration) || "Select duration"}
                            style={styles.durationText}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <LabelComponent value="Description" style={styles.sectionTitle} />
                    <TextfieldComponent
                        style={styles.input}
                        placeholder="Enter habit description"
                        value={habit?.description}
                        onChangeText={(text) => setHabit(prev => prev ? { ...prev, description: text } : null)}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.section}>
                    <LabelComponent value="Time" style={styles.sectionTitle} />
                    <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => setShowDatePicker(true)}>
                        <LabelComponent
                            value={habit?.time ? format(habit.time, 'hh:mm a') : 'Select time'}
                            style={styles.timeText}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <LabelComponent value="Repeat on" style={styles.sectionTitle} />
                    <View style={styles.daysContainer}>
                        {DAYS_OF_WEEK.map((day) => (
                            <TouchableOpacity
                                key={day}
                                testID={`day-button-${day}`}    
                                style={[
                                    styles.dayButton,
                                    habit?.days.includes(day) && styles.selectedDay,
                                ]}
                                onPress={() => toggleDay(day)}>
                                <LabelComponent
                                    value={day.slice(0, 3)}
                                    style={[
                                        styles.dayText,
                                        habit?.days.includes(day) && styles.selectedDayText,
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.reminderContainer}
                        onPress={() => setHabit(prev => prev ? { ...prev, reminder: !prev.reminder } : null)}>
                        <View style={[
                            styles.checkbox,
                            habit?.reminder && styles.checkedBox
                        ]}>
                            {habit?.reminder && (
                                <LabelComponent value="✓" style={styles.checkmark} />
                            )}
                        </View>
                        <LabelComponent value="Enable Reminder" style={styles.reminderText} />
                    </TouchableOpacity>
                </View>

                {showStartDayPicker && (
                    <CustomDateTimePicker
                        testID="custom-date-picker"
                        visible={showStartDayPicker}
                        value={habit?.startDay || new Date()}
                        mode="date"
                        minimumDate={new Date()}
                        onChange={(event, date) => {
                            if (date) handleStartDaySelect(date);
                        }}
                        onClose={() => setShowStartDayPicker(false)}
                    />
                )}

                {showDatePicker && (
                    <CustomDateTimePicker
                        visible={showDatePicker}
                        value={habit?.time || new Date()}
                        mode="time"
                        onChange={handleTimeSelect}
                        onClose={() => setShowDatePicker(false)}
                    />
                )}

                <CustomButton
                    title={loading ? "Saving..." : "Save Changes"}
                    style={loading ? styles.disabledButton : styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                    styleText={styles.saveBtnTxt}
                />

                <Modal
                    visible={showDurationPicker}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowDurationPicker(false)}>
                    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                        <View style={styles.durationPickerContainer}>
                            <View style={styles.durationPickerHeader}>
                                <Text style={styles.durationPickerTitle}>Select Duration</Text>
                                <View style={styles.typeToggleContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.typeToggleButton,
                                            selectedType === 'min' && styles.selectedTypeButton
                                        ]}
                                        onPress={() => setSelectedType('min')}>
                                        <Text style={[
                                            styles.typeToggleText,
                                            selectedType === 'min' && styles.selectedTypeText
                                        ]}>Minutes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.typeToggleButton,
                                            selectedType === 'hour' && styles.selectedTypeButton
                                        ]}
                                        onPress={() => setSelectedType('hour')}>
                                        <Text style={[
                                            styles.typeToggleText,
                                            selectedType === 'hour' && styles.selectedTypeText
                                        ]}>Hours</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView 
                                style={styles.durationPickerScroll}
                                showsVerticalScrollIndicator={false}>
                                {getTimeValues().map((value) => (
                                    <TouchableOpacity
                                        key={value}
                                        style={[
                                            styles.durationOption,
                                            (selectedType === 'hour' ? tempDuration.hours === value : tempDuration.minutes === value) && styles.selectedDuration
                                        ]}
                                        onPress={() => handleDurationSelect(value)}>
                                        <Text style={[
                                            styles.durationOptionText,
                                            (selectedType === 'hour' ? tempDuration.hours === value : tempDuration.minutes === value) && styles.selectedDurationText
                                        ]}>
                                            {value} {selectedType === 'hour' ? 'hours' : 'minutes'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.durationPickerButtons}>
                                <TouchableOpacity
                                    style={[styles.durationPickerButton, styles.cancelButton]}
                                    onPress={() => setShowDurationPicker(false)}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.durationPickerButton, styles.confirmButton]}
                                    onPress={confirmDuration}>
                                    <Text style={[styles.buttonText, styles.confirmButtonText]}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </Modal>
            </ScrollView>
        </View>
    );
};

export default HabitDetailScreen; 