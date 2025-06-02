import React, { FC, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle, RefreshControl, Animated, Platform } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native"
import { styles } from "./Styles"
import layout from "../../utils/layout"
import { Colors } from "../../constants/colors"
import LabelComponent from "../../components/LableComponent"
import CustomButton from "../../components/CustomButton"
import firestore from '@react-native-firebase/firestore';
import { ToolbarComponent } from "../../components/Toolbar/ToolbarComponent"
import { Strings } from "../../constants/strings"
import TextfieldComponent from "../../components/TextFieldComponent"
import { icons, image } from "../../constants/images"
import Toast from "../../components/Toast"
import { RootStackParamList } from "../../navigation/types"
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

type CreateHabitScreenRouteProp = RouteProp<RootStackParamList, 'CreateHabit'>;
type CreateHabitScreenNavigationProp = NavigationProp<RootStackParamList>;

interface Habit {
    id: string;
    emoji: string;
    name: string;
    color: string;
    description?: string;
    time?: Date;
    reminder?: boolean;
    days?: string[];
    lastCompleted?: Date;
    duration: {
        hours: string;
        minutes: string;
    };
}

interface HabitCategory {
    id: string;
    name: string;
    color: string;
    icon: string;
    habits: {
        name: string;
        icon: string;
    }[];
}

const commonEmojis = ["✨", "🧘", "🎨", "🏀", "💡", "🈯️", "📚", "🎯", "🎮", "🎵", "🎬", "📱", "💻", "📖", "✍️", "🎪", "🎭", "🎪", "🎨", "🎭"];

const existingHabits = [
    {
        emoji: "🧘",
        name: "Health",
        color: Colors.palette.accent400
    },
    {
        emoji: "🎨",
        name: "Arts",
        color: Colors.palette.secondary400,
    },
    {
        emoji: "🏀",
        name: "Sports",
        color: Colors.palette.neutral500,
    },
    {
        emoji: "💡",
        name: "Skills Development",
        color: Colors.palette.neutral500,
    },
    {
        emoji: "🈯️",
        name: "Language",
        color: Colors.palette.neutral500,
    },
    {
        emoji: "📚",
        name: "Mindfullness",
        color: Colors.palette.neutral500,
    },
]

const habitCategories: HabitCategory[] = [
    {
        id: 'physical_fitness',
        name: 'Physical Fitness',
        color: '#FFB74D',
        icon: '💪',
        habits: [
            { name: 'Take a Walk', icon: '👟' },
            { name: 'Run', icon: '🏃' },
            { name: 'Stretch', icon: '🧘‍♂️' },
            { name: 'Stand', icon: '🧍‍♂️' },
            { name: 'Yoga', icon: '🧘' },
            { name: 'Cycling', icon: '🚲' },
            { name: 'Swim', icon: '🏊‍♂️' },
            { name: 'Burn Calorie', icon: '🔥' },
            { name: 'Exercise', icon: '💪' },
        ]
    },
    {
        id: 'mindfulness',
        name: 'Mindfulness',
        color: '#9575CD',
        icon: '🌸',
        habits: [
            { name: 'Meditate', icon: '🧘‍♂️' },
            { name: 'Journal', icon: '📔' },
            { name: 'Breathe', icon: '🫁' },
            { name: 'Read', icon: '📚' },
        ]
    },
    {
        id: 'health',
        name: 'Health',
        color: '#81C784',
        icon: '💚',
        habits: [
            { name: 'Take Medicine', icon: '💊' },
            { name: 'Drink Water', icon: '💧' },
            { name: 'Sleep Early', icon: '😴' },
            { name: 'Eat Healthy', icon: '🥗' },
        ]
    },
    {
        id: 'life',
        name: 'Life',
        color: '#EF5350',
        icon: '❤️',
        habits: [
            { name: 'Family Time', icon: '👨‍👩‍👧‍👦' },
            { name: 'Hobby', icon: '🎨' },
            { name: 'Social', icon: '👥' },
            { name: 'Learn', icon: '📚' },
        ]
    }
];

const getReminderStatus = (habit: Habit) => {
    if (!habit.time) return '';

    const now = new Date();
    const habitTime = new Date(habit.time);

    // Check if the habit has started
    if (now < habitTime) {
        const diffMs = habitTime.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / (1000 * 60));

        if (habitTime.getDate() === now.getDate()) {
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;

            return hours > 0 
                ? `⏰ Starts in ${hours} hour${hours > 1 ? 's' : ''}` 
                : `⏰ Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            return diffDays === 1 ? `⏰ Starts tomorrow` : `⏰ Starts in ${diffDays} days`;
        }
    }

    // Parse duration to minutes
    let durationMinutes = 0;
    if (typeof habit.duration === 'object' && habit.duration !== null) {
        const hours = parseInt(habit.duration.hours || '0', 10);
        const minutes = parseInt(habit.duration.minutes || '0', 10);
        durationMinutes = (hours * 60) + minutes;
    }

    // Check for completion validity
    if (habit.lastCompleted) {
        const lastCompleted = new Date(habit.lastCompleted);
        const completedMs = lastCompleted.getTime();
        const habitStartMs = habitTime.getTime();
        const minCompletionTimeMs = habitStartMs + (durationMinutes * 60 * 1000);

        if (
            lastCompleted.getFullYear() === now.getFullYear() &&
            lastCompleted.getMonth() === now.getMonth() &&
            lastCompleted.getDate() === now.getDate()
        ) {
            if (completedMs >= minCompletionTimeMs) {
                const hours = lastCompleted.getHours();
                const minutes = lastCompleted.getMinutes();
                const period = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;
                const formattedMinutes = minutes.toString().padStart(2, '0');
                return `✨ Completed at ${formattedHours}:${formattedMinutes} ${period}`;
            } else {
                return `⚠️ Completed too early`;
            }
        }
    }

    // Calculate end time of the habit
    const endTimeMs = habitTime.getTime() + durationMinutes * 60 * 1000;
    const nowMs = now.getTime();

    if (nowMs >= habitTime.getTime() && nowMs <= endTimeMs) {
        return `🔔 In progress`;
    }

    if (nowMs > endTimeMs) {
        return habitTime.getDate() === now.getDate() ? `⌛️ Needs completion` : `⌛️ Missed yesterday`;
    }

    return `⌛️ Due today`;
};


const CreateHabitScreen: FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [operationLoading, setOperationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newHabitName, setNewHabitName] = useState("");
    const [selectedEmoji, setSelectedEmoji] = useState("✨");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [habitDuration, setHabitDuration] = useState("");
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const navigation = useNavigation<CreateHabitScreenNavigationProp>();
    const route = useRoute<CreateHabitScreenRouteProp>();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDurationPicker, setShowDurationPicker] = useState(false);
    const [selectedType, setSelectedType] = useState<'hour' | 'min'>('min');
    const [tempDuration, setTempDuration] = useState({ hours: '0', minutes: '30' });
    const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null);
    const [showHabitList, setShowHabitList] = useState(false);

    const fetchHabits = async () => {
        try {
            setError(null);
            const snapshot = await firestore()
                .collection('habits')
                .get();

            const fetchedHabits: Habit[] = snapshot.docs.map(doc => ({
                id: doc.id,
                emoji: doc.data().emoji || "✨",
                name: doc.data().name || "",
                color: doc.data().color || Colors.palette.primary600,
                description: doc.data().description,
                time: doc.data().time?.toDate(),
                reminder: doc.data().reminder,
                days: doc.data().days,
                lastCompleted: doc.data().lastCompleted?.toDate(),
                duration: doc.data().duration,
            }));

            setHabits(fetchedHabits);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            setError("Failed to fetch habits. Please try again.");
            setToast({ message: "Failed to fetch habits. Please try again.", type: 'error' });
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    useEffect(() => {
        if (route.params?.showToast) {
            setToast({
                message: route.params.toastMessage || '',
                type: route.params.toastType || 'success'
            });
            navigation.setParams({});
        }
    }, [route.params?.showToast]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchHabits();
    }, []);

    const handleComplete = async (habit: Habit) => {
        console.log("🚀 handleComplete called for habit:", habit.id);

        try {
            if (!habit.time) {
                setToast({ message: "Cannot complete habit without a start date", type: 'error' });
                return;
            }

            const now = new Date();
            const habitStartDate = new Date(habit.time);
            
            // Only prevent completion if the habit starts on a future date
            if (habitStartDate.getDate() !== now.getDate() ||
                habitStartDate.getMonth() !== now.getMonth() ||
                habitStartDate.getFullYear() !== now.getFullYear()) {
                if (now < habitStartDate) {
                    setToast({ 
                        message: `This habit starts on ${format(habitStartDate, 'MMMM d, yyyy')}. Cannot complete before start date.`, 
                        type: 'error' 
                    });
                    return;
                }
            }

            // Parse duration to minutes
            let durationMinutes = 0;
            if (typeof habit.duration === 'object' && habit.duration !== null) {
                const hours = parseInt(habit.duration.hours || '0', 10);
                const minutes = parseInt(habit.duration.minutes || '0', 10);
                durationMinutes = (hours * 60) + minutes;
            } else if (typeof habit.duration === 'string') {
                const durationMatch = habit.duration.match(/(\d+)\s*(min|hour)/);
                if (durationMatch) {
                    const value = parseInt(durationMatch[1]);
                    const unit = durationMatch[2];
                    durationMinutes = unit === 'hour' ? value * 60 : value;
                }
            }

            const habitTime = new Date(habit.time);
            habitTime.setFullYear(now.getFullYear());
            habitTime.setMonth(now.getMonth());
            habitTime.setDate(now.getDate());

            const endTimeMs = habitTime.getTime() + (durationMinutes * 60 * 1000);
            const nowMs = now.getTime();

            // For same-day habits, check if enough time has passed since start time
            if (habitStartDate.getDate() === now.getDate() &&
                habitStartDate.getMonth() === now.getMonth() &&
                habitStartDate.getFullYear() === now.getFullYear() &&
                now < habitStartDate) {
                const diffMs = habitStartDate.getTime() - now.getTime();
                const diffMins = Math.round(diffMs / (1000 * 60));
                const hours = Math.floor(diffMins / 60);
                const minutes = diffMins % 60;
                
                let timeMessage = hours > 0 
                    ? `${hours} hour${hours > 1 ? 's' : ''}`
                    : `${minutes} minute${minutes > 1 ? 's' : ''}`;
                    
                setToast({ 
                    message: `Please wait ${timeMessage} before marking this habit as complete.`, 
                    type: 'error' 
                });
                return;
            }

            // Check if duration has passed
            if (nowMs < endTimeMs) {
                console.log('nowMs', nowMs);
                console.log('endTimeMs', endTimeMs);
                
                const remainingMinutes = Math.ceil((endTimeMs - nowMs) / (1000 * 60));
                const hours = Math.floor(remainingMinutes / 60);
                const minutes = remainingMinutes % 60;
                let timeMessage = hours > 0 
                    ? `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`
                    : `${minutes} minute${minutes > 1 ? 's' : ''}`;

                setToast({ 
                    message: `Please wait ${timeMessage} to complete the habit duration.`, 
                    type: 'error' 
                });
                return;
            }

            setOperationLoading(true);
            const completionData = {
                lastCompleted: firestore.FieldValue.serverTimestamp(),
                completedDates: firestore.FieldValue.arrayUnion(format(now, 'yyyy-MM-dd'))
            };
            console.log("Updating habit:", habit.id, completionData);

            await firestore().collection('habits').doc(habit.id).update(completionData);

            console.log("Habit updated successfully");

            setToast({ message: "Habit marked as completed!", type: 'success' });
            fetchHabits();
        } catch (error) {
            console.error('Error completing habit:', error);
            setToast({ message: "Failed to mark habit as completed.", type: 'error' });
        } finally {
            setOperationLoading(false);
        }
    };
  
    const addNewHabit = async () => {
        console.log("Submitting habit..."); // Debug log

        if (!newHabitName.trim()) {
            setToast({ message: "Habit name cannot be empty.", type: 'error' });
            return;
        }

        setOperationLoading(true);
        try {
            const snapshot = await firestore()
                .collection('habits')
                .where("name", "==", newHabitName)
                .get();

            if (!snapshot.empty) {
                setError("This habit already exists.");
                setToast({ message: "This habit already exists.", type: 'error' });
                setOperationLoading(false);
                return;
            }

            // Parse duration if provided
            let durationObj = null;
            if (habitDuration.trim()) {
                const durationMatch = habitDuration.trim().match(/(\d+)\s*(hour|min)/i);
                if (durationMatch) {
                    const value = parseInt(durationMatch[1]);
                    const unit = durationMatch[2].toLowerCase();
                    durationObj = {
                        hours: unit === 'hour' ? value.toString() : '0',
                        minutes: unit === 'min' ? value.toString() : '0'
                    };
                }
            }

            const habitData = {
                emoji: selectedEmoji,
                name: newHabitName,
                color: Colors.palette.primary600,
                duration: durationObj || { hours: '0', minutes: '0' },
                createdAt: firestore.FieldValue.serverTimestamp(),
                reminder: false,
                time: selectedDate,
                days: [],
                lastCompleted: null
            };

            await firestore().collection('habits').add(habitData);

             navigation.navigate('HabitDetail', { 
                                                habitName: habitData.name,
                                                habitIcon: habitData.emoji
                                            });
            // setToast({ message: "Habit added successfully!", type: 'success' });
            setModalVisible(false);
            setNewHabitName("");
            setSelectedEmoji("✨");
            setHabitDuration("");
            setSelectedDate(new Date());
            fetchHabits();
        } catch (error) {
            setError("Failed to add habit. Please try again.");
            setToast({ message: "Failed to add habit. Please try again.", type: 'error' });
        } finally {
            setOperationLoading(false);
        }
    };

    const deleteHabit = async (habitId: string) => {
        setOperationLoading(true);
        try {
            await firestore().collection('habits').doc(habitId).delete();
            setToast({ message: "Habit deleted successfully!", type: 'success' });
            fetchHabits();
        } catch (error) {
            setError("Failed to delete habit.");
            setToast({ message: "Failed to delete habit.", type: 'error' });
        } finally {
            setOperationLoading(false);
        }
    };

    const confirmDeleteHabit = (habitId: string) => {
        Alert.alert(
            "Delete Habit",
            "Are you sure you want to delete this habit?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteHabit(habitId),
                },
            ]
        );
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: modalVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [modalVisible]);

    const formatDuration = (duration: any) => {
        if (typeof duration === 'object' && duration !== null) {
            // Handle object format { hours: "0", minutes: "30" }
            const hours = parseInt(duration.hours || '0', 10);
            const minutes = parseInt(duration.minutes || '0', 10);
            return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
        } else if (typeof duration === 'string') {
            // Handle string format like "30 min"
            return duration;
        }
        return ''; // Default empty string if undefined
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

    const confirmDuration = () => {
        const hours = parseInt(tempDuration.hours);
        const minutes = parseInt(tempDuration.minutes);
        
        let durationText = '';
        if (hours === 0) {
            durationText = `${minutes} min`;
        } else if (minutes === 0) {
            durationText = `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            durationText = `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
        }
        
        setHabitDuration(durationText);
        setShowDurationPicker(false);
    };

    const handleCategoryPress = (category: HabitCategory) => {
        if (selectedCategory?.id === category.id) {
            // If clicking the same category, close the list
            setShowHabitList(false);
            setSelectedCategory(null);
        } else {
            // If clicking a different category, show its list
            setSelectedCategory(category);
            setShowHabitList(true);
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
                title="Create a Habit"
                showBackButton={true}
                onBackPress={() => {
                    if (showHabitList) {
                        setShowHabitList(false);
                        setSelectedCategory(null);
                    } else {
                        navigation.goBack();
                    }
                }}
            />
            <ScrollView 
                contentContainerStyle={styles.subContainer} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {habitCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryCard, 
                            { 
                                backgroundColor: category.color,
                                opacity: selectedCategory?.id === category.id ? 0.8 : 1 // Visual feedback for selected category
                            }
                        ]}
                        onPress={() => handleCategoryPress(category)}>
                        <View style={styles.categoryContent}>
                            <Text style={styles.categoryTitle}>{category.name}</Text>
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                        </View>
                        {selectedCategory?.id === category.id && showHabitList && (
                            <View style={styles.habitListContent}>
                                {category.habits.map((habit, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.habitListItem}
                                        onPress={() => {
                                            setNewHabitName(habit.name);
                                            setSelectedEmoji(habit.icon);
                                            navigation.navigate('HabitDetail', { 
                                                habitName: habit.name,
                                                habitIcon: habit.icon
                                            });
                                        }}>
                                        <Text style={styles.habitIcon}>{habit.icon}</Text>
                                        <Text style={styles.habitListItemText}>{habit.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                <View style={styles.orContainer}>
                    <Text style={styles.orText}>Or</Text>
                </View>

                <TouchableOpacity
                    style={[styles.categoryCard, { backgroundColor: '#64B5F6' }]}
                    onPress={() => setModalVisible(true)}>
                    <View style={styles.categoryContent}>
                        <Text style={styles.categoryTitle}>Custom Habit</Text>
                        <Text style={styles.categoryIcon}>🦊</Text>
                    </View>
                </TouchableOpacity>

                <Modal 
                    visible={modalVisible} 
                    transparent 
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}>
                    <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create New Habit</Text>
                            
                            <View style={styles.emojiSelectorContainer}>
                                <TouchableOpacity 
                                    style={styles.emojiSelectorButton}
                                    onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                                    disabled={operationLoading}>
                                    <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
                                </TouchableOpacity>
                                <Text style={styles.emojiLabel}>Select Emoji (Optional)</Text>
                            </View>

                            {showEmojiPicker && (
                                <ScrollView 
                                    horizontal 
                                    style={styles.emojiPicker}
                                    showsHorizontalScrollIndicator={false}>
                                    {commonEmojis.map((emoji, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.emojiOption}
                                            onPress={() => {
                                                setSelectedEmoji(emoji);
                                                setShowEmojiPicker(false);
                                            }}>
                                            <Text style={styles.emojiOptionText}>{emoji}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}

                            <TextfieldComponent
                                style={styles.input}
                                placeholder={Strings.Enter_habit_name}
                                value={newHabitName}
                                onChangeText={setNewHabitName}
                                editable={!operationLoading}
                            />

                            {/* <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                                disabled={operationLoading}>
                                <Text style={styles.dateButtonText}>
                                    Start Date: {format(selectedDate, 'MMMM d, yyyy')}
                                </Text>
                            </TouchableOpacity> */}

                            {/* <TouchableOpacity
                                style={styles.durationButton}
                                onPress={() => {
                                    setTempDuration({
                                        hours: '0',
                                        minutes: '30'
                                    });
                                    setShowDurationPicker(true);
                                }}
                                disabled={operationLoading}>
                                <Text style={styles.durationButtonText}>
                                    {habitDuration || "Select duration"}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) {
                                            setSelectedDate(date);
                                        }
                                    }}
                                />
                            )} */}

                            <View style={styles.modalButtons}>
                                <CustomButton
                                    title={Strings.Cancel}
                                    style={styles.cancelBtn}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedEmoji("✨");
                                        setSelectedDate(new Date());
                                    }}
                                    styleText={styles.buttonText}
                                    disabled={operationLoading}
                                />
                                <CustomButton
                                    title={operationLoading ? "Adding..." : Strings.Add_Habit}
                                    style={styles.addHabitcelBtn}
                                    onPress={addNewHabit}
                                    styleText={styles.buttonText}
                                    disabled={operationLoading}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </Modal>
            </ScrollView>

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
        </View>
    )
}

export default CreateHabitScreen


