import { HabitDetail } from '../models/HabitDetail';

export interface HabitDetailRepository {
    getHabitDetail(id: string): Promise<HabitDetail | null>;
    saveHabitDetail(habit: HabitDetail): Promise<void>;
    updateHabitDetail(id: string, habit: Partial<HabitDetail>): Promise<void>;
    markHabitCompletion(id: string, date: Date): Promise<void>;
    unmarkHabitCompletion(id: string, date: Date): Promise<void>;
} 