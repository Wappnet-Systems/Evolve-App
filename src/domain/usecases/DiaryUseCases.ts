import { Diary } from '../models/Diary';
import { DiaryRepository } from '../repositories/DiaryRepository';
import { CreateDiaryDTO, UpdateDiaryDTO } from '../models/Diary';

export class DiaryUseCases {
  constructor(private diaryRepository: DiaryRepository) {}

  async getAllDiaries(): Promise<Diary[]> {
    return this.diaryRepository.getAllDiaries();
  }

  async getDiaryById(id: string): Promise<Diary | null> {
    return this.diaryRepository.getDiaryById(id);
  }

  async deleteDiary(id: string): Promise<void> {
    const diary = await this.diaryRepository.getDiaryById(id);
    if (!diary) {
      throw new Error('Diary entry not found');
    }
    await this.diaryRepository.deleteDiary(id);
  }

  async updateDiary(id: string, diary: UpdateDiaryDTO): Promise<void> {
    const existingDiary = await this.diaryRepository.getDiaryById(id);
    if (!existingDiary) {
      throw new Error('Diary entry not found');
    }
    await this.diaryRepository.updateDiary(id, diary);
  }

  async createDiary(diary: CreateDiaryDTO): Promise<string> {
    return this.diaryRepository.createDiary(diary);
  }
} 