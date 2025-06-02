import React, { FC, useState, useEffect } from 'react';
import { View, ViewStyle, ScrollView, TouchableOpacity, Platform, Modal, Text, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { styles } from './Styles';
import { Colors } from '../../constants/colors';
import { Strings } from '../../constants/strings';
import { ToolbarComponent } from '../../components/Toolbar/ToolbarComponent';
import TextfieldComponent from '../../components/TextFieldComponent';
import CustomButton from '../../components/CustomButton';
import LabelComponent from '../../components/LableComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../components/Toast';
import { RootStackParamList } from '../../navigation/types';
import { format } from 'date-fns';

interface HabitDetail {
    id: string;
    name: string;
    emoji: string;
    description: string;
    time: Date;
    reminder: boolean;
    days: string[];
    duration: {
        hours: string;
        minutes: string;
    };
    lastCompleted: Date | null;
    completedDates: string[];
    startDay: Date;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;

const HabitDetailScreen: FC = () => {
    const navigation = useNavigation();
    const route = useRoute<HabitDetailScreenRouteProp>();
    const { habitName, habitIcon } = route.params;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [habit, setHabit] = useState<HabitDetail | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDurationPicker, setShowDurationPicker] = useState(false);
    const [selectedType, setSelectedType] = useState<'hour' | 'min'>('min');
    const [tempDuration, setTempDuration] = useState({ hours: '0', minutes: '30' });
    const [habitDuration, setHabitDuration] = useState("");
    const [operationLoading, setOperationLoading] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [showStartDayPicker, setShowStartDayPicker] = useState(false);
    const [showCompletionDatePicker, setShowCompletionDatePicker] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState<'start' | 'completion'>('start');

    useEffect(() => {
        // Initialize habit with the passed parameters
        setHabit({
            id: '', // Will be set when saved to Firestore
            name: habitName,
            emoji: habitIcon,
            description: '',
            time: new Date(),
            reminder: false,
            days: [],
            duration: { hours: '0', minutes: '0' },
            lastCompleted: null,
            completedDates: [],
            startDay: new Date()
        });
        setLoading(false);
    }, [habitName, habitIcon]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: showDurationPicker ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showDurationPicker]);

    const fetchHabitDetails = async () => {
        try {
            setLoading(true);
            const doc = await firestore().collection('habits').doc(habit?.id || '').get();
            if (doc.exists) {
                const data = doc.data();
                const habitTime = data?.time?.toDate() || new Date();
                setSelectedDate(habitTime);
                setHabit(prev => ({
                    ...prev,
                    time: habitTime,
                    duration: {
                        hours: data?.duration?.hours || '0',
                        minutes: data?.duration?.minutes || '0'
                    },
                    lastCompleted: data?.lastCompleted ? data.lastCompleted.toDate() : null,
                    completedDates: data?.completedDates || [],
                    startDay: data?.startDay?.toDate() || new Date()
                }));
            }
        } catch (error) {
            setToast({ message: 'Failed to fetch habit details', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!habit?.description.trim()) {
            setToast({ message: 'Please enter a habit description', type: 'error' });
            return;
        }

        if (habit?.days.length === 0) {
            setToast({ message: 'Please select at least one day', type: 'error' });
            return;
        }

        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const habitData = {
                name: habit?.name,
                emoji: habit?.emoji,
                description: habit?.description,
                time: habit?.time,
                reminder: habit?.reminder,
                days: habit?.days,
                duration: habit?.duration,
                startDay: habit?.startDay,
                lastCompleted: null,
                completedDates: [],
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp()
            };

            if (habit?.id) {
                // Update existing habit
                await firestore().collection('habits').doc(habit.id).update({
                    ...habitData,
                    updatedAt: firestore.FieldValue.serverTimestamp()
                });
            } else {
                // Create new habit
                const docRef = await firestore().collection('habits').add(habitData);
                setHabit(prev => prev ? { ...prev, id: docRef.id } : null);
            }

            const message = 'Habit saved successfully!';
            navigation.navigate('Dashboard', { 
                showToast: true,
                toastMessage: message,
                toastType: 'success'
            });
            
        } catch (error) {
            console.error('Error saving habit:', error);
            setToast({ message: 'Failed to save habit details', type: 'error' });
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    const toggleDay = (day: string) => {
        setHabit(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day],
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

        setHabit(prev => prev ? {
            ...prev,
            startDay: date
        } : null);
        setShowStartDayPicker(false);
    };

    // const handleCompletionDateSelect = async (date: Date) => {
    //     if (!habit?.startDay) return;

    //     const now = new Date();

    //     // Check if the selected date is before the habit's start date
    //     // if (date < habit.startDay) {
    //     //     setToast({ 
    //     //         message: `Cannot mark completion before habit start date (${format(habit.startDay, 'MMMM d, yyyy')})`, 
    //     //         type: 'error' 
    //     //     });
    //     //     return;
    //     // }

    //     // Check if the selected date is in the future
    //     // if (date > now) {
    //     //     setToast({ 
    //     //         message: 'Cannot mark completion for future dates', 
    //     //         type: 'error' 
    //     //     });
    //     //     return;
    //     // }

    //     setSelectedDate(date);
    //     const dateString = format(date, 'yyyy-MM-dd');
        
    //     try {
    //         const isCompleted = habit.completedDates.includes(dateString);
    //         const newCompletedDates = isCompleted
    //             ? habit.completedDates.filter(d => d !== dateString)
    //             : [...habit.completedDates, dateString];

    //         setHabit(prev => prev ? {
    //             ...prev,
    //             completedDates: newCompletedDates,
    //             lastCompleted: isCompleted ? null : date
    //         } : null);

    //         await firestore().collection('habits').doc(habit?.id || '').update({
    //             completedDates: newCompletedDates,
    //             lastCompleted: isCompleted ? null : date
    //         });

    //         setToast({ 
    //             message: isCompleted ? 'Habit marked as incomplete' : 'Habit marked as complete', 
    //             type: 'success' 
    //         });
    //     } catch (error) {
    //         setToast({ message: 'Failed to update habit completion', type: 'error' });
    //     }
    //     setShowCompletionDatePicker(false);
    // };

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
        setHabit(prev => ({
            ...prev,
            duration: {
                hours: tempDuration.hours,
                minutes: tempDuration.minutes
            },
        }));
        setShowDurationPicker(false);
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

                {/* <View style={styles.section}>
                    <LabelComponent value="Completion Date" style={styles.sectionTitle} />
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => {
                            setDatePickerMode('completion');
                            setShowCompletionDatePicker(true);
                        }}
                    >
                        <LabelComponent
                            value={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select date'}
                            style={styles.dateText}
                        />
                    </TouchableOpacity>
                </View> */}

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
                        onChangeText={(text) => setHabit(prev => ({ ...prev, description: text }))}
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
                            value={habit?.time.toLocaleTimeString()}
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
                        onPress={() => setHabit(prev => ({ ...prev, reminder: !prev.reminder }))}>
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
                    <DateTimePicker
                        value={habit?.startDay || new Date()}
                        mode="date"
                        minimumDate={new Date()}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, date) => {
                            setShowStartDayPicker(false);
                            if (date) {
                                handleStartDaySelect(date);
                            }
                        }}
                    />
                )}

                {/* {showCompletionDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        minimumDate={habit?.startDay ? new Date(habit.startDay) : new Date()}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, date) => {
                            setShowCompletionDatePicker(false);
                            if (date) {
                                handleCompletionDateSelect(date);
                            }
                        }}
                    />
                )} */}

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