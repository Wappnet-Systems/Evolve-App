export interface Diary {
  id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  createdAt: any;
}

export interface CreateDiaryDTO {
  title: string;
  content: string;
  mood: number;
  date: string;
}

export interface UpdateDiaryDTO {
  title: string;
  content: string;
  mood: number;
  date: string;
}

export interface DiaryDetails {
  id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  createdAt: any;
}

export interface DiaryMood {
  id: number;
  icon: string;
  color: string;
  label: string;
}

export const MOODS: DiaryMood[] = [
  { id: 0, icon: 'sentiment-very-dissatisfied', color: '#FF6B6B', label: 'Very Sad' },
  { id: 1, icon: 'sentiment-dissatisfied', color: '#FFB067', label: 'Sad' },
  { id: 2, icon: 'sentiment-neutral', color: '#FFD93D', label: 'Neutral' },
  { id: 3, icon: 'sentiment-satisfied', color: '#6BCB77', label: 'Happy' },
  { id: 4, icon: 'sentiment-very-satisfied', color: '#4D96FF', label: 'Very Happy' },
]; 