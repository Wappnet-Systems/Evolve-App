import { HabitDetail } from '../../domain/models/HabitDetail';
import { HabitDetailUseCases } from '../../domain/usecases/HabitDetailUseCases';

export interface HabitDetailView {
    showLoading: (loading: boolean) => void;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    updateHabit: (habit: HabitDetail | null) => void;
    navigateToDashboard: (message: string) => void;
}

export class HabitDetailPresenter {
    constructor(
        private view: HabitDetailView,
        private useCases: HabitDetailUseCases
    ) {}

    async loadHabitDetail(id: string) {
        try {
            this.view.showLoading(true);
            const habit = await this.useCases.getHabitDetail(id);
            this.view.updateHabit(habit);
        } catch (error) {
            this.view.showError('Failed to load habit details');
        } finally {
            this.view.showLoading(false);
        }
    }

    async saveHabitDetail(habit: HabitDetail) {
        try {
            this.view.showLoading(true);
            // Reset completion status when saving changes, but preserve startDay
            const habitToSave = {
                ...habit,
                lastCompleted: null,
                completedDates: []
            };
            await this.useCases.saveHabitDetail(habitToSave);
            this.view.navigateToDashboard('Habit saved successfully!');
        } catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Failed to save habit');
        } finally {
            this.view.showLoading(false);
        }
    }

    async updateHabitDetail(id: string, habit: Partial<HabitDetail>) {
        try {
            this.view.showLoading(true);
            await this.useCases.updateHabitDetail(id, habit);
            this.view.showSuccess('Habit updated successfully!');
        } catch (error) {
            this.view.showError('Failed to update habit');
        } finally {
            this.view.showLoading(false);
        }
    }

    async toggleHabitCompletion(id: string, date: Date) {
        try {
            this.view.showLoading(true);
            await this.useCases.toggleHabitCompletion(id, date);
            const habit = await this.useCases.getHabitDetail(id);
            this.view.updateHabit(habit);
            this.view.showSuccess('Habit completion status updated');
        } catch (error) {
            this.view.showError('Failed to update habit completion');
        } finally {
            this.view.showLoading(false);
        }
    }
} 