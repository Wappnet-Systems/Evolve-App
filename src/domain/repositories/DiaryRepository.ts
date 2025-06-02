import { Diary, CreateDiaryDTO, UpdateDiaryDTO } from '../models/Diary';

export interface DiaryRepository {
  createDiary(diary: CreateDiaryDTO): Promise<string>;
  updateDiary(id: string, diary: UpdateDiaryDTO): Promise<void>;
  getDiaryById(id: string): Promise<Diary | null>;
  getAllDiaries(): Promise<Diary[]>;
  deleteDiary(id: string): Promise<void>;
} 