import { Habit } from '../models/Habit';

export interface HabitRepository {
    createHabit(habit: Omit<Habit, 'id'>): Promise<string>;
    getHabits(): Promise<Habit[]>;
    deleteHabit(id: string): Promise<void>;
    updateHabit(id: string, habit: Partial<Habit>): Promise<void>;
    checkHabitExists(name: string): Promise<boolean>;
} 