import firestore from '@react-native-firebase/firestore';
import { Diary } from '../../domain/models/Diary';
import { DiaryRepository } from '../../domain/repositories/DiaryRepository';
import { CreateDiaryDTO, UpdateDiaryDTO } from '../../domain/models/Diary';

export class DiaryRepositoryImpl implements DiaryRepository {
  private collection = firestore().collection('diaries');

  async getAllDiaries(): Promise<Diary[]> {
    try {
      const querySnapshot = await this.collection.orderBy('date', 'desc').get();
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Diary[];
    } catch (error) {
      console.error('Error fetching diaries:', error);
      throw error;
    }
  }

  async getDiaryById(id: string): Promise<Diary | null> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as Diary;
    } catch (error) {
      console.error('Error fetching diary:', error);
      throw error;
    }
  }

  async deleteDiary(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      console.error('Error deleting diary:', error);
      throw error;
    }
  }

  async updateDiary(id: string, diary: UpdateDiaryDTO): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error('Diary entry not found');
    }

    await docRef.update({
      ...diary,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  async createDiary(diary: CreateDiaryDTO): Promise<string> {
    try {
      const docRef = await this.collection.add({
        ...diary,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating diary:', error);
      throw error;
    }
  }
} 