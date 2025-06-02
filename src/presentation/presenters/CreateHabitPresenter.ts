import { Habit } from '../../domain/models/Habit';
import { HabitUseCases } from '../../domain/usecases/HabitUseCases';

export interface CreateHabitView {
    showLoading: (loading: boolean) => void;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    updateHabits: (habits: Habit[]) => void;
    navigateToHabitDetail: (habitName: string, habitIcon: string) => void;
    closeModal: () => void;
}

export class CreateHabitPresenter {
    constructor(
        private view: CreateHabitView,
        private useCases: HabitUseCases
    ) {}

    async loadHabits() {
        try {
            this.view.showLoading(true);
            const habits = await this.useCases.getHabits();
            this.view.updateHabits(habits);
        } catch (error) {
            this.view.showError('Failed to load habits');
        } finally {
            this.view.showLoading(false);
        }
    }

    async createHabit(habit: Omit<Habit, 'id'>) {
        try {
            this.view.showLoading(true);
            await this.useCases.createHabit(habit);
            this.view.showSuccess('Habit created successfully');
            this.view.closeModal();
            this.view.navigateToHabitDetail(habit.name, habit.emoji);
            await this.loadHabits();
        } catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Failed to create habit');
        } finally {
            this.view.showLoading(false);
        }
    }

    async deleteHabit(id: string) {
        try {
            this.view.showLoading(true);
            await this.useCases.deleteHabit(id);
            this.view.showSuccess('Habit deleted successfully');
            await this.loadHabits();
        } catch (error) {
            this.view.showError('Failed to delete habit');
        } finally {
            this.view.showLoading(false);
        }
    }
} 