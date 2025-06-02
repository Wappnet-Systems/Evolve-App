export type PuzzleType = 'math' | 'block';

export interface Alarm {
  id: string;
  time: string;
  isEnabled: boolean;
  puzzleType: PuzzleType;
  days: string[];
}

export interface AlarmRepository {
  loadAlarms(): Promise<Alarm[]>;
  saveAlarms(alarms: Alarm[]): Promise<void>;
  createAlarm(alarm: Alarm): Promise<void>;
  deleteAlarm(id: string): Promise<void>;
  toggleAlarm(id: string): Promise<void>;
} 