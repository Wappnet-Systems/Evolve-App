import { HomeRepository } from '../interfaces/HomeRepository';
import { Habit } from '../models/Habit';
import { format } from 'date-fns';

export class HomeUseCases {
    constructor(private repository: HomeRepository) {}

    async getHabits(date: Date): Promise<Habit[]> {
        return this.repository.fetchHabits(date);
    }

    async markHabitAsComplete(habitId: string): Promise<void> {
        const completionData = {
            lastCompleted: new Date(),
            completedDates: [new Date().toISOString().split('T')[0]]
        };
        await this.repository.completeHabit(habitId, completionData);
    }

    async removeHabit(habitId: string): Promise<void> {
        await this.repository.deleteHabit(habitId);
    }

    calculateCompletedCount(habits: Habit[]): number {
        return habits.filter(habit => !!habit.lastCompleted).length;
    }

    getReminderStatus(habit: Habit): string {
        if (!habit.reminder) return 'No reminder';

        const now = new Date();
        // const habitTime = new Date(now.toDateString() + ' ' + habit.time);
        const habitTime = new Date(habit.time); // Correct way
        const habitStartDay = new Date(habit.startDay);
        console.log('@@@@@@@@@@', habitStartDay);
        
        habitStartDay.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If habit's start date is in the future
        if (habitStartDay > today) {
            return `Starts on ${format(habitStartDay, 'MMMM d, yyyy')}`;
        }

        // If habit's start date is today but time is in the future
        if (habitStartDay.getTime() === today.getTime() && now < habitTime) {
            return `Due at ${format(habitTime, 'hh:mm a')}`;
        }

        // If habit is already completed today
        if (habit.lastCompleted) {
            const lastCompleted = new Date(habit.lastCompleted);
            if (lastCompleted.toDateString() === now.toDateString()) {
                return 'Completed today';
            }
        }

        // Calculate habit duration in milliseconds
        const hours = parseInt(habit.duration.hours || '0', 10);
        const minutes = parseInt(habit.duration.minutes || '0', 10);
        const durationMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
        const habitEndTime = new Date(habitTime.getTime() + durationMs);

        // If current time is within the habit's duration window
        if (now >= habitTime && now <= habitEndTime) {
            return 'In progress';
        }

        // If the time has passed for today
        if (now > habitEndTime) {
            return 'Overdue';
        }

        return `Due at ${format(habitTime, 'hh:mm a')}`;
    }
} 