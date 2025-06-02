import { Habit } from '../models/Habit';

export interface HomeRepository {
    fetchHabits(date: Date): Promise<Habit[]>;
    completeHabit(habitId: string, completionData: {
        lastCompleted: Date;
        completedDates: string[];
    }): Promise<void>;
    deleteHabit(habitId: string): Promise<void>;
} 