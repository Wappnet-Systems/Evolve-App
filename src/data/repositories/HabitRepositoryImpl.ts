import { Habit } from '../../domain/models/Habit';
import { HabitRepository } from '../../domain/interfaces/HabitRepository';
import { db } from '../../config/firebase';

export class HabitRepositoryImpl implements HabitRepository {
    private readonly collectionName = 'habits';

    async createHabit(habit: Omit<Habit, 'id'>): Promise<string> {
        try {
            const docRef = await db.collection(this.collectionName).add({
                ...habit,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating habit:', error);
            throw new Error('Failed to create habit');
        }
    }

    async getHabits(): Promise<Habit[]> {
        try {
            const snapshot = await db.collection(this.collectionName).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Habit));
        } catch (error) {
            console.error('Error fetching habits:', error);
            return [];
        }
    }

    async deleteHabit(id: string): Promise<void> {
        try {
            await db.collection(this.collectionName).doc(id).delete();
        } catch (error) {
            console.error('Error deleting habit:', error);
            throw new Error('Failed to delete habit');
        }
    }

    async updateHabit(id: string, habit: Partial<Habit>): Promise<void> {
        try {
            await db.collection(this.collectionName).doc(id).update({
                ...habit,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating habit:', error);
            throw new Error('Failed to update habit');
        }
    }

    async checkHabitExists(name: string): Promise<boolean> {
        try {
            const snapshot = await db.collection(this.collectionName)
                .where('name', '==', name)
                .get();
            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking habit existence:', error);
            throw new Error('Failed to check habit existence');
        }
    }
} 