import { DiaryUseCases } from '../../domain/usecases/DiaryUseCases';
import { Diary } from '../../domain/models/Diary';

export interface DiaryView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  showSuccess(message: string): void;
  displayDiaries(diaries: Diary[]): void;
}

export class DiaryPresenter {
  constructor(
    private view: DiaryView,
    private diaryUseCases: DiaryUseCases
  ) {}

  async loadDiaries() {
    try {
      this.view.showLoading();
      const diaries = await this.diaryUseCases.getAllDiaries();
      this.view.displayDiaries(diaries);
    } catch (error) {
      this.view.showError('Failed to load diary entries');
    } finally {
      this.view.hideLoading();
    }
  }

  async deleteDiary(id: string) {
    try {
      await this.diaryUseCases.deleteDiary(id);
      this.view.showSuccess('Your diary note has been deleted!');
      await this.loadDiaries();
    } catch (error) {
      this.view.showError('Failed to delete entry');
    }
  }
} 