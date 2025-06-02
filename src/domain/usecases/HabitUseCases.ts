import { Habit } from '../models/Habit';
import { HabitRepository } from '../interfaces/HabitRepository';

export class HabitUseCases {
    constructor(private repository: HabitRepository) {}

    async createHabit(habit: Omit<Habit, 'id'>): Promise<string> {
        const exists = await this.repository.checkHabitExists(habit.name);
        if (exists) {
            throw new Error('Habit with this name already exists');
        }
        return this.repository.createHabit(habit);
    }

    async getHabits(): Promise<Habit[]> {
        return this.repository.getHabits();
    }

    async deleteHabit(id: string): Promise<void> {
        return this.repository.deleteHabit(id);
    }

    async updateHabit(id: string, habit: Partial<Habit>): Promise<void> {
        return this.repository.updateHabit(id, habit);
    }

    async getHabit(id: string): Promise<Habit | null> {
        return this.repository.getHabit(id);
    }

    async getAllHabits(): Promise<Habit[]> {
        return this.repository.getAllHabits();
    }

    async toggleHabitCompletion(id: string, date: Date): Promise<void> {
        const habit = await this.getHabit(id);
        if (!habit) throw new Error('Habit not found');

        const dateString = date.toISOString().split('T')[0];
        const isCompleted = habit.completedDates.includes(dateString);
        
        const newCompletedDates = isCompleted
            ? habit.completedDates.filter(d => d !== dateString)
            : [...habit.completedDates, dateString];

        await this.updateHabit(id, {
            completedDates: newCompletedDates,
            lastCompleted: isCompleted ? null : date
        });
    }

    async updateHabitStreak(id: string): Promise<void> {
        const habit = await this.getHabit(id);
        if (!habit) throw new Error('Habit not found');

        const today = new Date();
        const lastCompleted = habit.lastCompleted;
        
        if (!lastCompleted) {
            await this.updateHabit(id, { streak: 0 });
            return;
        }

        const daysDiff = Math.floor((today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
            await this.updateHabit(id, { streak: habit.streak + 1 });
        } else {
            await this.updateHabit(id, { streak: 0 });
        }
    }
} 