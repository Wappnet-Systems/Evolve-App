import { DiaryUseCases } from '../../domain/usecases/DiaryUseCases';
import { DiaryDetails } from '../../domain/models/Diary';

export interface DiaryDetailView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  displayDiary(diary: DiaryDetails): void;
  navigateBack(): void;
  startFadeInAnimation(): void;
}

export class DiaryDetailPresenter {
  constructor(
    private view: DiaryDetailView,
    private diaryUseCases: DiaryUseCases
  ) {}

  async loadDiaryDetails(taskId: string, toastMessage?: string) {
    try {
      this.view.showLoading();
      const diary = await this.diaryUseCases.getDiaryById(taskId);
      
      if (!diary) {
        this.view.showError('Diary entry not found');
        return;
      }

      this.view.displayDiary(diary);
      this.view.startFadeInAnimation();
      
      if (toastMessage) {
        this.view.showSuccess(toastMessage);
      }
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      this.view.showError('Failed to load diary entry');
    } finally {
      this.view.hideLoading();
    }
  }

  handleShare() {
    // Implement share functionality when needed
    // This is a placeholder for future implementation
  }

  handleBack() {
    this.view.navigateBack();
  }
} 