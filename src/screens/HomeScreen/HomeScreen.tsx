import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './Styles';
import { icons, image } from '../../constants/images';
import CircularProgress from '../../components/CircularProgress';
import LinearGradient from 'react-native-linear-gradient';
import Toast from '../../components/Toast';

type RootStackParamList = {
  HomePage: undefined;
  HabitDetail: { habitId: string };
  CreateHabit: undefined;
};

interface Habit {
  id: string;
  name: string;
  emoji: string;
  description: string;
  time: Date;
  duration: {
    hours: string;
    minutes: string;
  };
  lastCompleted: Date | null;
  streak: number;
  color?: string;
  reminder?: boolean;
  days?: string[];
}

const ITEMS_PER_PAGE = 5;

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
                // return `✨ Completed at ${formattedHours}:${formattedMinutes} ${period}`;
                return `Completed`;
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

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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


  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching habits...');

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      console.log('Querying Firestore...');

      // const habitsSnapshot = await firestore()
      //   .collection('habits')
      //   .where('time', '>=', startOfDay)
      //   .where('time', '<=', endOfDay)
      //   .get();

      const habitsSnapshot = await firestore()
  .collection('habits')
  .where('time', '>=', firestore.Timestamp.fromDate(startOfDay))
  .where('time', '<=', firestore.Timestamp.fromDate(endOfDay))
  .get();
  
      console.log('Firestore result:', habitsSnapshot);

      const habitsData: Habit[] = habitsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          emoji: data.emoji || '✨',
          description: data.description || '',
          time: data.time?.toDate ? data.time.toDate() : new Date(data.time),
          duration: data.duration || { hours: '0', minutes: '0' },
          lastCompleted: data.lastCompleted?.toDate ? data.lastCompleted.toDate() : null,
          streak: data.streak || 0,
          color: data.color,
          reminder: data.reminder,
          days: data.days
        };
      });
      console.log('habitsData', JSON.stringify(habitsData));
      

      setHabits(habitsData);
      setFilteredHabits(habitsData);
      setDisplayedHabits(habitsData.slice(0, ITEMS_PER_PAGE));
      setHasMore(habitsData.length > ITEMS_PER_PAGE);
      calculateCompletedCount(habitsData);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);
 
  

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // const calculateCompletedCount = (habitsData: Habit[]) => {
  //   const completed = habitsData.filter(habit => 
  //     habit.lastCompleted && 
  //     isSameDay(habit.lastCompleted, selectedDate)
  //   ).length;
  //   console.log('COMPLETED COUNT', completed);
    
  //   setCompletedCount(completed);
  // };


const calculateCompletedCount = (habitsData: Habit[]) => {
  if (!habitsData || habitsData.length === 0) {
    setCompletedCount(0);
    return;
  }

  const completed = habitsData.filter(habit => {
    // If lastCompleted exists, consider the habit as completed
    return !!habit.lastCompleted;
  }).length;

  console.log('COMPLETED COUNT:', completed);
  
  setCompletedCount(completed);
};


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchHabits().finally(() => setRefreshing(false));
  }, []);

  const loadMoreHabits = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const currentLength = displayedHabits.length;
    const nextHabits = filteredHabits.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    
    setDisplayedHabits(prev => [...prev, ...nextHabits]);
    setHasMore(currentLength + ITEMS_PER_PAGE < filteredHabits.length);
    setLoadingMore(false);
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
        {/* <Text style={styles.dateLabel}>Today</Text> */}
        <Text style={styles.dateLabel}>{getDateLabel(selectedDate)}</Text>
        {/* <TouchableOpacity style={styles.clubsButton}>
          <Text style={styles.clubsText}>Clubs</Text>
          <View style={styles.clubsBadge}>
            <Text style={styles.clubsCount}>2</Text>
          </View>
        </TouchableOpacity> */}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daysContainer}
      >
        {weekDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            testID="day-button"
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
    // Calculate percentage based on completed tasks
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

  const handleComplete = async (habit: Habit) => {
    console.log("🚀 handleComplete called for habit:", habit.id);

    try {
      if (!habit.time) {
        setToast({ message: "Cannot complete habit without a start date", type: 'error' });
        return;
      }

      const now = new Date();
      const habitStartDate = new Date(habit.time);
      
      // Check if the habit is from a past date
      const isPastDate = habitStartDate.getDate() !== now.getDate() ||
        habitStartDate.getMonth() !== now.getMonth() ||
        habitStartDate.getFullYear() !== now.getFullYear();

      // If it's a future date, prevent completion
      if (isPastDate && now < habitStartDate) {
        setToast({ 
          message: `This habit starts on ${format(habitStartDate, 'MMMM d, yyyy')}. Cannot complete before start date.`, 
          type: 'error' 
        });
        return;
      }

      // Parse duration to minutes
      let durationMinutes = 0;
      if (typeof habit.duration === 'object' && habit.duration !== null) {
        const hours = parseInt(habit.duration.hours || '0', 10);
        const minutes = parseInt(habit.duration.minutes || '0', 10);
        durationMinutes = (hours * 60) + minutes;
      }

      // For same-day habits, check if enough time has passed since start time
      if (!isPastDate && now < habitStartDate) {
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

      // For same-day habits, check if duration has passed
      if (!isPastDate) {
        const habitTime = new Date(habit.time);
        habitTime.setFullYear(now.getFullYear());
        habitTime.setMonth(now.getMonth());
        habitTime.setDate(now.getDate());

        const endTimeMs = habitTime.getTime() + (durationMinutes * 60 * 1000);
        const nowMs = now.getTime();

        if (nowMs < endTimeMs) {
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

  const deleteHabit = async (habitId: string) => {
    setOperationLoading(true);
    try {
      await firestore().collection('habits').doc(habitId).delete();
      setToast({ message: "Habit deleted successfully!", type: 'success' });
      fetchHabits();
    } catch (error) {
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

  const renderHabitsList = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator testID="loader" size="large" color={Colors.primary} />
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
                onPress={loadMoreHabits}>
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
          {displayedHabits.length === 0 ? (
            <View style={styles.noHabitsContainer}>
              <Text style={styles.noHabitsText}>No habits scheduled for this day</Text>
            </View>
          ) : (
            <>
              {displayedHabits.map((habit) => (
                console.log('DISPLYA HABIT', JSON.stringify(habit)),
                
                <TouchableOpacity
                  key={habit.id}
                  style={styles.habitCard}
                  onPress={() => navigation.navigate('HabitDetail', { habitId: habit})}
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
                        {getReminderStatus(habit)}
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
              {loadingMore && (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              )}
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
      testID="scroll-view"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
      {renderHeader()}
      {renderProgressCard()}
      {renderHabitsList()}
    </ScrollView>
  );
};

export default HomeScreen;