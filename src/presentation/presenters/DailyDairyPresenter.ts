import { DiaryUseCases } from '../../domain/usecases/DiaryUseCases';
import { CreateDiaryDTO } from '../../domain/models/Diary';

export interface DailyDairyView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  clearForm(): void;
  navigateBack(taskId: string, message: string,): void;
}

export class DailyDairyPresenter {
  constructor(
    private view: DailyDairyView,
    private diaryUseCases: DiaryUseCases
  ) {}

  async createDiary(diary: CreateDiaryDTO) {
    if (!diary.title.trim() || !diary.content.trim()) {
      this.view.showError('Please fill in both title and content');
      return;
    }

    try {
      this.view.showLoading();
      const taskId = await this.diaryUseCases.createDiary(diary);
      const successMessage = 'Your diary entry has been saved!';
      this.view.showSuccess(successMessage);
      this.view.clearForm();
      this.view.navigateBack(taskId, successMessage);
    } catch (error) {
      this.view.showError('Failed to save diary entry. Please try again.');
    } finally {
      this.view.hideLoading();
    }
  }
} 