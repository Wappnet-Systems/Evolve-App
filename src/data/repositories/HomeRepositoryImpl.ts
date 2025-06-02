import { HomeRepository } from '../../domain/interfaces/HomeRepository';
import { Habit } from '../../domain/models/Habit';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';

export class HomeRepositoryImpl implements HomeRepository {
    async fetchHabits(date: Date): Promise<Habit[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const habitsSnapshot = await firestore()
            .collection('habits')
            .get();

        return habitsSnapshot.docs
            .map(doc => {
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
                    days: data.days,
                    startDay: data.startDay?.toDate ? data.startDay.toDate() : new Date(data.startDay),
                    completedDates: data.completedDates || [],
                    icon: data.icon || '✨',
                    frequency: data.frequency || 'daily',
                    severity: data.severity || 'medium'
                };
            })
            .filter(habit => {
                // Check if the habit's start day matches exactly with the selected date
                const habitStartDay = new Date(habit.startDay);
                habitStartDay.setHours(0, 0, 0, 0);
                const selectedDate = new Date(date);
                selectedDate.setHours(0, 0, 0, 0);
                
                return habitStartDay.getTime() === selectedDate.getTime();
            });
    }

    async completeHabit(habitId: string, completionData: {
        lastCompleted: Date;
        completedDates: string[];
    }): Promise<void> {
        await firestore()
            .collection('habits')
            .doc(habitId)
            .update({
                lastCompleted: firestore.FieldValue.serverTimestamp(),
                completedDates: firestore.FieldValue.arrayUnion(format(new Date(), 'yyyy-MM-dd'))
            });
    }

    async deleteHabit(habitId: string): Promise<void> {
        await firestore()
            .collection('habits')
            .doc(habitId)
            .delete();
    }
} 