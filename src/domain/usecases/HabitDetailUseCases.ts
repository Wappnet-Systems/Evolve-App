import { HabitDetail } from '../models/HabitDetail';
import { HabitDetailRepository } from '../interfaces/HabitDetailRepository';

export class HabitDetailUseCases {
    constructor(private repository: HabitDetailRepository) {}

    async getHabitDetail(id: string): Promise<HabitDetail | null> {
        return this.repository.getHabitDetail(id);
    }

    async saveHabitDetail(habit: HabitDetail): Promise<void> {
        if (!habit.description.trim()) {
            throw new Error('Please enter a habit description');
        }
    
        if (habit.days.length === 0) {
            throw new Error('Please select at least one day');
        }
    
        if (habit.startDay instanceof Date && habit.time instanceof Date) {
            const combinedDateTime = new Date(
                habit.startDay.getFullYear(),
                habit.startDay.getMonth(),
                habit.startDay.getDate(),
                habit.time.getHours(),
                habit.time.getMinutes(),
                habit.time.getSeconds()
            );
    
            const now = new Date();
    
            if (combinedDateTime < now) {
                throw new Error('Selected date and time is in the past. Please choose a future time or day.');
            }
        }
    
        return this.repository.saveHabitDetail(habit);
    }    

    async updateHabitDetail(id: string, habit: Partial<HabitDetail>): Promise<void> {
        return this.repository.updateHabitDetail(id, habit);
    }

    async toggleHabitCompletion(id: string, date: Date): Promise<void> {
        const habit = await this.getHabitDetail(id);
        if (!habit) throw new Error('Habit not found');

        const dateString = date.toISOString().split('T')[0];
        const isCompleted = habit.completedDates.includes(dateString);

        if (isCompleted) {
            await this.repository.unmarkHabitCompletion(id, date);
        } else {
            await this.repository.markHabitCompletion(id, date);
        }
    }
} 