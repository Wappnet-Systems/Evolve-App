import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Text,
    RefreshControl,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { icons, image } from '../../../constants/images';
import CircularProgress from '../../../components/CircularProgress';
import LinearGradient from 'react-native-linear-gradient';
import Toast from '../../../components/Toast';
import { HomePresenter } from '../../presenters/HomePresenter';
import { HomeUseCases } from '../../../domain/usecases/HomeUseCases';
import { HomeRepositoryImpl } from '../../../data/repositories/HomeRepositoryImpl';
import { Habit } from '../../../domain/models/Habit';
import { RootStackParamList } from '../../../navigation/types';
import { styles } from './Styles';
import { Colors } from '../../../constants/colors';

const ITEMS_PER_PAGE = 5;

type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [completedCount, setCompletedCount] = useState(0);
    const [displayedHabits, setDisplayedHabits] = useState<Habit[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [operationLoading, setOperationLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const weekDays = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
    });

    // Initialize presenter
    const presenter = React.useMemo(() => {
        const repository = new HomeRepositoryImpl();
        const useCases = new HomeUseCases(repository);
        return new HomePresenter({
            showLoading: setLoading,
            showError: (message) => setToast({ message, type: 'error' }),
            showSuccess: (message) => setToast({ message, type: 'success' }),
            updateHabits: (newHabits) => {
                setHabits(newHabits);
                setFilteredHabits(newHabits);
                setDisplayedHabits(newHabits.slice(0, ITEMS_PER_PAGE));
                setHasMore(newHabits.length > ITEMS_PER_PAGE);
            },
            updateCompletedCount: setCompletedCount,
            getReminderStatus: (habit) => useCases.getReminderStatus(habit)
        }, useCases);
    }, []);

    useEffect(() => {
        presenter.loadHabits(selectedDate);
    }, [selectedDate, presenter]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        presenter.loadHabits(selectedDate).finally(() => setRefreshing(false));
    }, [selectedDate, presenter]);

    const loadMoreHabits = () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        const currentLength = displayedHabits.length;
        const nextHabits = filteredHabits.slice(currentLength, currentLength + ITEMS_PER_PAGE);
        
        setDisplayedHabits(prev => [...prev, ...nextHabits]);
        setHasMore(currentLength + ITEMS_PER_PAGE < filteredHabits.length);
        setLoadingMore(false);
    };

    const handleComplete = async (habit: Habit) => {
        setOperationLoading(true);
        await presenter.completeHabit(habit);
        setOperationLoading(false);
    };

    const deleteHabit = async (habitId: string) => {
        setOperationLoading(true);
        await presenter.deleteHabit(habitId);
        setOperationLoading(false);
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

    const getDateLabel = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            return 'Today';
        } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
            return 'Yesterday';
        } else {
            return format(date, 'MMMM d');
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <Text style={styles.greeting}>Hi, Mert 👋</Text>
                <Text style={styles.subGreeting}>Let's make habits together!</Text>
            </View>
            
            <View style={styles.dateSelector}>
                <Text style={styles.dateLabel}>{getDateLabel(selectedDate)}</Text>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.daysContainer}
                testID="scroll-view"
            >
                {weekDays.map((day, index) => (
                    <TouchableOpacity
                        key={index}
                        testID={`day-button-${index}`}
                        style={[
                            styles.dayButton,
                            format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.selectedDay
                        ]}
                        onPress={() => setSelectedDate(day)}
                    >
                        <Text style={[
                            styles.dayName,
                            format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.selectedDayText
                        ]}>
                            {format(day, 'EEE')}
                        </Text>
                        <Text style={[
                            styles.dayNumber,
                            format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.selectedDayText
                        ]}>
                            {format(day, 'd')}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderProgressCard = () => {
        const progressPercentage = filteredHabits.length > 0 
            ? Math.round((completedCount / filteredHabits.length) * 100)
            : 0;
        
        const getProgressMessage = () => {
            if (filteredHabits.length === 0) return "No habits for today";
            if (completedCount === filteredHabits.length) return "All goals completed! 🎉";
            if (completedCount > filteredHabits.length / 2) return "Your daily goals almost done! 🔥";
            return "Keep going! 💪";
        };
        
        return (
            <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.progressCard}
            >
                <View style={styles.progressContent}>
                    <View>
                        <Text style={[styles.progressTitle, { color: Colors.white }]}>{getProgressMessage()}</Text>
                        <Text style={[styles.progressSubtitle, { color: Colors.white }]}>{completedCount} of {filteredHabits.length} completed</Text>
                    </View>
                    <CircularProgress 
                        percentage={progressPercentage}
                        size={60}
                        strokeWidth={3.5}
                        progressColor={progressPercentage === 100 ? Colors.primary : Colors.white}
                        backgroundColor={Colors.primary}
                    />
                </View>
            </LinearGradient>
        );
    };

    const renderHabitsList = () => {
        if (loading) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator testID="initial-loader" size="large" color={Colors.primary} />
                </View>
            );
        }

        return (
            <View style={styles.habitsContainer}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>
                            Habits for {format(selectedDate, 'MMMM d, yyyy')}
                        </Text>
                        {hasMore && (
                            <TouchableOpacity 
                                style={styles.viewAllButton}
                                onPress={loadMoreHabits}
                                testID="view-all-button">
                                <Text style={styles.viewAllText}>VIEW ALL</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <ScrollView 
                    style={styles.habitsScrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                >
                    {operationLoading ? (
                        <View style={styles.loadingMoreContainer}>
                            <ActivityIndicator testID="loading-more" size="large" color={Colors.primary} />
                        </View>
                    ) : displayedHabits.length === 0 ? (
                        <View style={styles.noHabitsContainer}>
                            <Text style={styles.noHabitsText}>No habits scheduled for this day</Text>
                        </View>
                    ) : (
                        <>
                            {displayedHabits.map((habit) => (
                                <TouchableOpacity
                                    key={habit.id}
                                    testID={`habit-card-${habit.id}`}
                                    style={styles.habitCard}
                                    onPress={() => navigation.navigate('HabitDetail', { 
                                        habitId: habit,
                                        habitName: habit.name,
                                        habitIcon: habit.emoji
                                    })}
                                >
                                    <View style={styles.habitLeft}>
                                        <View style={[styles.habitIcon, { backgroundColor: getRandomColor() }]}>
                                            <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                                        </View>
                                        <View style={styles.habitInfo}>
                                            <Text style={styles.habitName}>{habit.name}</Text>
                                            <Text style={styles.habitTime}>
                                                {format(habit.time, 'hh:mm a')} • {habit.duration.hours}h {habit.duration.minutes}m
                                            </Text>
                                            <Text style={styles.habitStatus}>
                                                {presenter.getReminderStatus(habit)}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.habitRight}>
                                        {habit.lastCompleted ? (
                                            <Image 
                                                source={image.COMPLETED} 
                                                style={styles.completedIcon}
                                                testID={`completed-icon-${habit.id}`}
                                            />
                                        ) : (
                                            <TouchableOpacity
                                                testID={`complete-button-${habit.id}`}
                                                style={styles.completeButton}
                                                onPress={() => handleComplete(habit)}
                                                disabled={operationLoading}>
                                                <MaterialCommunityIcons name="check-circle-outline" size={24} color={Colors.palette.primary600} />
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            testID={`delete-button-${habit.id}`}
                                            onPress={() => confirmDeleteHabit(habit.id)}
                                            style={styles.delContainer}
                                            disabled={operationLoading}>
                                            <Image source={icons.IC_DELETE} style={styles.delIcon} />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </ScrollView>
            </View>
        );
    };

    const getRandomColor = () => {
        const colors = ['#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF3E0'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <ScrollView 
            style={styles.container}
            testID="main-scroll-view"
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                    testID="toast-message"
                />
            )}
            {renderHeader()}
            {renderProgressCard()}
            {renderHabitsList()}
        </ScrollView>
    );
};

export default HomeScreen; 