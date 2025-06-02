import { DiaryUseCases } from '../../domain/usecases/DiaryUseCases';
import { DiaryDetails, UpdateDiaryDTO } from '../../domain/models/Diary';

export interface EditDiaryView {
  showLoading(): void;
  hideLoading(): void;
  showSaving(): void;
  hideSaving(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  setDiaryData(diary: DiaryDetails): void;
  navigateBack(taskId: string, message: string): void;
}

export class EditDiaryPresenter {
  constructor(
    private view: EditDiaryView,
    private diaryUseCases: DiaryUseCases
  ) {}

  async loadDiaryDetails(taskId: string) {
    try {
      this.view.showLoading();
      const diary = await this.diaryUseCases.getDiaryById(taskId);
      
      if (!diary) {
        this.view.showError('Diary entry not found');
        return;
      }

      this.view.setDiaryData(diary);
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      this.view.showError('Failed to load diary entry');
    } finally {
      this.view.hideLoading();
    }
  }

  async updateDiary(taskId: string, updateData: UpdateDiaryDTO) {
    if (!updateData.title.trim() || !updateData.content.trim()) {
      this.view.showError('Please fill in both title and content');
      return;
    }

    try {
      this.view.showSaving();
      await this.diaryUseCases.updateDiary(taskId, updateData);
      const successMessage = 'Your diary entry has been updated!';
      this.view.showSuccess(successMessage);
      this.view.navigateBack(taskId, successMessage);
    } catch (error) {
      console.error('Update diary error:', error);
      const errorMessage = error instanceof Error && error.message === 'Diary entry not found'
        ? 'Diary entry not found. It may have been deleted.'
        : 'Failed to update diary entry. Please try again.';
      this.view.showError(errorMessage);
    } finally {
      this.view.hideSaving();
    }
  }
} 