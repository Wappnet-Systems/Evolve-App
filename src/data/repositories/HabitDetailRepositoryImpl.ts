import { HabitDetail } from '../../domain/models/HabitDetail';
import { HabitDetailRepository } from '../../domain/interfaces/HabitDetailRepository';
import firestore from '@react-native-firebase/firestore';

export class HabitDetailRepositoryImpl implements HabitDetailRepository {
    private readonly collectionName = 'habits';

    async getHabitDetail(id: string): Promise<HabitDetail | null> {
        try {
            const doc = await firestore().collection(this.collectionName).doc(id).get();
            if (!doc.exists) return null;

            const data = doc.data();
            
            // Convert Firestore Timestamps to Dates and handle timezone
            // const startDay = data?.startDay?.toDate();
            const startDay = data?.startDay?.toDate() || new Date();
            if (startDay) {
                // Adjust for local timezone
                const localStartDay = new Date(startDay.getTime() + startDay.getTimezoneOffset() * 60000);
                startDay.setHours(localStartDay.getHours()) ;
                startDay.setMinutes(localStartDay.getMinutes());
            }

            // const time = data?.time?.toDate();
            // if (time) {
            //     // Adjust for local timezone
            //     const localTime = new Date(time.getTime() + time.getTimezoneOffset() * 60000);
            //     time.setHours(localTime.getHours());
            //     time.setMinutes(localTime.getMinutes());
            // }

            const time = data?.time?.toDate();
if (time && startDay) {
    // Ensure time carries forward the correct date
    time.setFullYear(startDay.getFullYear(), startDay.getMonth(), startDay.getDate());
}

            return {
                id: doc.id,
                name: data?.name || '',
                emoji: data?.emoji || '',
                description: data?.description || '',
                time: time || new Date(),
                reminder: data?.reminder || false,
                days: data?.days || [],
                duration: data?.duration || { hours: '0', minutes: '0' },
                lastCompleted: data?.lastCompleted?.toDate() || null,
                completedDates: data?.completedDates || [],
                startDay: startDay || new Date(),
                createdAt: data?.createdAt?.toDate(),
                updatedAt: data?.updatedAt?.toDate()
            };
        } catch (error) {
            console.error('Error fetching habit detail:', error);
            throw new Error('Failed to fetch habit detail');
        }
    }

    // async saveHabitDetail(habit: HabitDetail): Promise<void> {
    //     try {
    //         // Convert local dates to UTC before saving
    //         // const startDay = habit.startDay ? new Date(habit.startDay) : null;
    //         // if (startDay) {
    //         //     startDay.setHours(startDay.getHours() - startDay.getTimezoneOffset() / 60);
    //         // }

    //         const startDay = habit.startDay ? firestore.Timestamp.fromDate(new Date(habit.startDay)) : null;


    //         const time = habit.time ? new Date(habit.time) : null;
    //         if (time) {
    //             time.setHours(time.getHours() - time.getTimezoneOffset() / 60);
    //         }

    //         const habitData = {
    //             ...habit,
    //             startDay: startDay ? firestore.Timestamp.fromDate(startDay) : null,
    //             time: time ? firestore.Timestamp.fromDate(time) : null,
    //             lastCompleted: habit.lastCompleted ? firestore.Timestamp.fromDate(habit.lastCompleted) : null,
    //             createdAt: habit.createdAt ? firestore.Timestamp.fromDate(habit.createdAt) : firestore.Timestamp.now(),
    //             updatedAt: firestore.Timestamp.now()
    //         };

    //         await firestore().collection(this.collectionName).doc(habit.id).set(habitData, { merge: true });
    //     } catch (error) {
    //         console.error('Error saving habit detail:', error);
    //         throw new Error('Failed to save habit detail');
    //     }
    // }

    // async saveHabitDetail(habit: HabitDetail): Promise<void> {
    //     try {
    //         // const startDay = habit.startDay instanceof Date ? firestore.Timestamp.fromDate(habit.startDay) : null;
    //         const startDay = habit.time instanceof Date
    // ? firestore.Timestamp.fromDate(habit.time)  // Use time's full date & time
    // : habit.startDay instanceof Date
    //     ? firestore.Timestamp.fromDate(habit.startDay)
    //     : null;
    //         // const time = habit.time instanceof Date ? firestore.Timestamp.fromDate(habit.time) : null;
    //         const time = habit.time instanceof Date && habit.startDay instanceof Date
    // ? firestore.Timestamp.fromDate(
    //     new Date(habit.startDay.getFullYear(), habit.startDay.getMonth(), habit.startDay.getDate(), 
    //              habit.time.getHours(), habit.time.getMinutes(), habit.time.getSeconds())
    //   )
    // : null;
    //         const lastCompleted = habit.lastCompleted instanceof Date ? firestore.Timestamp.fromDate(habit.lastCompleted) : null;
    
    //         const habitData = {
    //             ...habit,
    //             startDay,
    //             time,
    //             lastCompleted,
    //             createdAt: habit.createdAt instanceof Date ? firestore.Timestamp.fromDate(habit.createdAt) : firestore.Timestamp.now(),
    //             updatedAt: firestore.Timestamp.now(),
    //         };
    
    //         await firestore().collection(this.collectionName).doc(habit.id).set(habitData, { merge: true });
    //     } catch (error) {
    //         console.error('Error saving habit detail:', error);
    //         throw new Error('Failed to save habit detail');
    //     }
    // }

    async saveHabitDetail(habit: HabitDetail): Promise<void> {
        try {
            let combinedDateTime: Date | null = null;
    
            if (habit.startDay instanceof Date && habit.time instanceof Date) {
                combinedDateTime = new Date(
                    habit.startDay.getFullYear(),
                    habit.startDay.getMonth(),
                    habit.startDay.getDate(),
                    habit.time.getHours(),
                    habit.time.getMinutes(),
                    habit.time.getSeconds()
                );
            }
    
            const timestamp = combinedDateTime ? firestore.Timestamp.fromDate(combinedDateTime) : null;
    
            const lastCompleted = habit.lastCompleted instanceof Date
                ? firestore.Timestamp.fromDate(habit.lastCompleted)
                : null;
    
            const habitData = {
                ...habit,
                startDay: timestamp, // full date + time
                time: timestamp,     // full date + time
                lastCompleted,
                createdAt: habit.createdAt instanceof Date
                    ? firestore.Timestamp.fromDate(habit.createdAt)
                    : firestore.Timestamp.now(),
                updatedAt: firestore.Timestamp.now(),
            };
    
            await firestore().collection(this.collectionName).doc(habit.id).set(habitData, { merge: true });
        } catch (error) {
            console.error('Error saving habit detail:', error);
            throw new Error('Failed to save habit detail');
        }
    }
    
    

    async updateHabitDetail(id: string, habit: Partial<HabitDetail>): Promise<void> {
        try {
            // Convert local dates to UTC before saving
            const startDay = habit.startDay ? new Date(habit.startDay) : null;
            if (startDay) {
                startDay.setHours(startDay.getHours() - startDay.getTimezoneOffset() / 60);
            }

            const time = habit.time ? new Date(habit.time) : null;
            if (time) {
                time.setHours(time.getHours() - time.getTimezoneOffset() / 60);
            }

            const updateData = {
                ...habit,
                startDay: startDay ? firestore.Timestamp.fromDate(startDay) : null,
                time: time ? firestore.Timestamp.fromDate(time) : null,
                lastCompleted: habit.lastCompleted ? firestore.Timestamp.fromDate(habit.lastCompleted) : null,
                updatedAt: firestore.Timestamp.now()
            };

            await firestore().collection(this.collectionName).doc(id).update(updateData);
        } catch (error) {
            console.error('Error updating habit detail:', error);
            throw new Error('Failed to update habit detail');
        }
    }

    async markHabitCompletion(id: string, date: Date): Promise<void> {
        try {
            const dateString = date.toISOString().split('T')[0];
            await firestore().collection(this.collectionName).doc(id).update({
                lastCompleted: firestore.Timestamp.fromDate(date),
                completedDates: firestore.FieldValue.arrayUnion(dateString),
                updatedAt: firestore.Timestamp.now()
            });
        } catch (error) {
            console.error('Error marking habit completion:', error);
            throw new Error('Failed to mark habit completion');
        }
    }

    async unmarkHabitCompletion(id: string, date: Date): Promise<void> {
        try {
            const dateString = date.toISOString().split('T')[0];
            await firestore().collection(this.collectionName).doc(id).update({
                lastCompleted: null,
                completedDates: firestore.FieldValue.arrayRemove(dateString),
                updatedAt: firestore.Timestamp.now()
            });
        } catch (error) {
            console.error('Error unmarking habit completion:', error);
            throw new Error('Failed to unmark habit completion');
        }
    }
} 