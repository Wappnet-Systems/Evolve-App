import { HomeUseCases } from '../../domain/usecases/HomeUseCases';
import { Habit } from '../../domain/models/Habit';

export interface HomeView {
    showLoading: (loading: boolean) => void;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    updateHabits: (habits: Habit[]) => void;
    updateCompletedCount: (count: number) => void;
    getReminderStatus: (habit: Habit) => string;
}

export class HomePresenter {
    private view: HomeView;
    private useCases: HomeUseCases;

    constructor(view: HomeView, useCases: HomeUseCases) {
        this.view = view;
        this.useCases = useCases;
    }

    async loadHabits(date: Date): Promise<void> {
        try {
            this.view.showLoading(true);
            const habits = await this.useCases.getHabits(date);
            this.view.updateHabits(habits);
            this.view.updateCompletedCount(this.useCases.calculateCompletedCount(habits));
        } catch (error) {
            this.view.showError('Failed to load habits');
        } finally {
            this.view.showLoading(false);
        }
    }

    // async completeHabit(habit: Habit): Promise<void> {
    //     console.log('timeeeee', JSON.stringify(habit.time));
        
    //     try {
    //         if (!habit.time) {
    //             this.view.showError('Cannot complete habit without a start date');
    //             return;
    //         }

    //         const now = new Date();
    //         console.log('now', JSON.stringify(now));
            
    //         const habitStartDate = new Date(habit.time);
    //         console.log('habitStartDate', JSON.stringify(habitStartDate));
            
            
    //         // Check if the habit is from a future date
    //         if (now < habitStartDate) {
    //             const diffMs = habitStartDate.getTime() - now.getTime();
    //             const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                
    //             if (diffDays > 0) {
    //                 this.view.showError(`This habit hasn't started yet. It will begin on ${format(habitStartDate, 'MMMM d, yyyy')}`);
    //             } else {
    //                 const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    //                 const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    
    //                 let timeMessage = '';
    //                 if (diffHours > 0) {
    //                     timeMessage = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    //                     if (diffMinutes > 0) {
    //                         timeMessage += ` and ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    //                     }
    //                 } else {
    //                     timeMessage = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    //                 }
                    
    //                 this.view.showError(`This habit hasn't started yet. It will begin in ${timeMessage}`);
    //             }
    //             return;
    //         }

    //         // Parse duration to minutes
    //         let durationMinutes = 0;
    //         if (typeof habit.duration === 'object' && habit.duration !== null) {
    //             const hours = parseInt(habit.duration.hours || '0', 10);
    //             const minutes = parseInt(habit.duration.minutes || '0', 10);
    //             durationMinutes = (hours * 60) + minutes;
    //         }

    //         // For same-day habits, check if duration has passed
    //         if (habitStartDate.getDate() === now.getDate()) {
    //             const habitTime = new Date(habit.time);
    //             habitTime.setFullYear(now.getFullYear());
    //             habitTime.setMonth(now.getMonth());
    //             habitTime.setDate(now.getDate());

    //             const endTimeMs = habitTime.getTime() + (durationMinutes * 60 * 1000);
    //             const nowMs = now.getTime();

    //             if (nowMs < endTimeMs) {
    //                 const remainingMinutes = Math.ceil((endTimeMs - nowMs) / (1000 * 60));
    //                 const hours = Math.floor(remainingMinutes / 60);
    //                 const minutes = remainingMinutes % 60;
    //                 let timeMessage = hours > 0 
    //                     ? `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`
    //                     : `${minutes} minute${minutes > 1 ? 's' : ''}`;

    //                 this.view.showError(`Please wait ${timeMessage} to complete the habit duration.`);
    //                 return;
    //             }
    //         }

    //         this.view.showLoading(true);
    //         await this.useCases.markHabitAsComplete(habit.id);
            
    //         // Update the habit's completion status locally
    //         const updatedHabit = {
    //             ...habit,
    //             lastCompleted: new Date(),
    //             completedDates: [...(habit.completedDates || []), new Date().toISOString().split('T')[0]]
    //         };

    //         // Update the habits list with the completed habit
    //         const currentHabits = await this.useCases.getHabits(new Date());
    //         const updatedHabits = currentHabits.map(h => 
    //             h.id === habit.id ? updatedHabit : h
    //         );

    //         this.view.updateHabits(updatedHabits);
    //         this.view.updateCompletedCount(this.useCases.calculateCompletedCount(updatedHabits));
    //         this.view.showSuccess('Habit marked as completed!');
    //     } catch (error) {
    //         this.view.showError('Failed to mark habit as completed');
    //     } finally {
    //         this.view.showLoading(false);
    //     }
    // }

    async completeHabit(habit: Habit): Promise<void> {
        try {
            if (!habit.time) {
                this.view.showError('Cannot complete habit without a start time');
                return;
            }
    
            const now = new Date();
            const habitStart = new Date(habit.time); // When habit starts (today at specific time)
    
            // If it's still before the habit's start time
            if (now < habitStart) {
                const diffMs = habitStart.getTime() - now.getTime();
                const diffMinutes = Math.ceil(diffMs / (1000 * 60));
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;
    
                const timeMessage = hours > 0
                    ? `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`
                    : `${minutes} minute${minutes > 1 ? 's' : ''}`;
    
                this.view.showError(`This habit hasn't started yet. It will begin in ${timeMessage}`);
                return;
            }
    
            // Get duration
            const durationMinutes = habit.duration
                ? (parseInt(habit.duration.hours || '0', 10) * 60) + parseInt(habit.duration.minutes || '0', 10)
                : 0;
    
            const habitEnd = new Date(habitStart.getTime() + durationMinutes * 60 * 1000);
    
            // If it's in progress and not completed yet
            if (now < habitEnd) {
                const remainingMs = habitEnd.getTime() - now.getTime();
                const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
                const hours = Math.floor(remainingMinutes / 60);
                const minutes = remainingMinutes % 60;
    
                const timeMessage = hours > 0
                    ? `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`
                    : `${minutes} minute${minutes > 1 ? 's' : ''}`;
    
                this.view.showError(`⏳ Please wait ${timeMessage} to complete the habit duration.`);
                return;
            }
    
            // Proceed to complete habit
            this.view.showLoading(true);
            await this.useCases.markHabitAsComplete(habit.id);
    
            const updatedHabit = {
                ...habit,
                lastCompleted: new Date(),
                completedDates: [...(habit.completedDates || []), new Date().toISOString().split('T')[0]],
            };
    
            const currentHabits = await this.useCases.getHabits(new Date());
            const updatedHabits = currentHabits.map(h => h.id === habit.id ? updatedHabit : h);
    
            this.view.updateHabits(updatedHabits);
            this.view.updateCompletedCount(this.useCases.calculateCompletedCount(updatedHabits));
            this.view.showSuccess('✅ Habit marked as completed!');
        } catch (error) {
            this.view.showError('❌ Failed to mark habit as completed');
        } finally {
            this.view.showLoading(false);
        }
    }
    

    async deleteHabit(habitId: string): Promise<void> {
        try {
            this.view.showLoading(true);
            await this.useCases.removeHabit(habitId);
            
            // Update the habits list after deletion
            const currentHabits = await this.useCases.getHabits(new Date());
            const updatedHabits = currentHabits.filter(h => h.id !== habitId);
            
            this.view.updateHabits(updatedHabits);
            this.view.updateCompletedCount(this.useCases.calculateCompletedCount(updatedHabits));
            this.view.showSuccess('Habit deleted successfully!');
            await this.loadHabits(new Date());
        } catch (error) {
            this.view.showError('Failed to delete habit');
        } finally {
            this.view.showLoading(false);
        }
    }

    getReminderStatus(habit: Habit): string {
        if (!habit.time) return 'No reminder';
    
        const now = new Date();
        const habitTime = new Date(habit.time);
    
        // If the habit has a reminder but no scheduled time, return default
        if (!habit.reminder) return 'No reminder';
    
        // Check if habit was completed today
        if (habit.lastCompleted) {
            const lastCompleted = new Date(habit.lastCompleted);
            if (lastCompleted.toDateString() === now.toDateString()) {
                return 'Completed today';
            }
        }
    
        // Calculate time difference
        const diffMs = habitTime.getTime() - now.getTime();
        const diffMins = Math.ceil(diffMs / (1000 * 60));
    
        if (diffMs > 0) {
            // Future event
            if (habitTime.getDate() === now.getDate()) {
                const hours = Math.floor(diffMins / 60);
                const minutes = diffMins % 60;
                return hours > 0 
                    ? `⏰ Starts in ${hours} hour${hours > 1 ? 's' : ''}` 
                    : `⏰ Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
            } else {
                // const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                return diffDays === 1 ? `⏰ Starts tomorrow` : `⏰ Starts in ${diffDays} days`;
            }
        }
//         const diffMs = habitTime.getTime() - now.getTime();
// const diffMins = Math.ceil(diffMs / (1000 * 60));

// if (diffMs > 0) {
//     if (habitTime.getDate() === now.getDate()) {
//         const hours = Math.floor(diffMins / 60);
//         const minutes = diffMins % 60;
//         if (hours > 0 && minutes > 0) {
//             return `⏰ Starts in ${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
//         } else if (hours > 0) {
//             return `⏰ Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
//         } else {
//             return `⏰ Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
//         }
//     } else {
//         const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
//         return diffDays === 1 ? `⏰ Starts tomorrow` : `⏰ Starts in ${diffDays} days`;
//     }
// }

    
        // Check if habit has a duration
        let durationMinutes = 0;
        if (typeof habit.duration === 'object' && habit.duration !== null) {
            const hours = parseInt(habit.duration.hours || '0', 10);
            const minutes = parseInt(habit.duration.minutes || '0', 10);
            durationMinutes = (hours * 60) + minutes;
        }
    
        // Handle completion time validation
        const endTimeMs = habitTime.getTime() + durationMinutes * 60 * 1000;
        const nowMs = now.getTime();
    
        if (nowMs >= habitTime.getTime() && nowMs <= endTimeMs) {
            return `🔔 In progress`;
        }
    
        if (nowMs > endTimeMs) {
            return habitTime.getDate() === now.getDate() ? `⌛️ Needs completion` : `⌛️ Missed yesterday`;
        }
    
        return `⌛️ Due today`;
    }
} 