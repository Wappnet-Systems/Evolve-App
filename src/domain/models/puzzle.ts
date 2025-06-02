export type PuzzleType = 'math' | 'block';

export interface MathPuzzle {
  question: string;
  answer: string;
}

export interface BlockPuzzle {
  blocks: number[];
}

export interface PuzzleRepository {
  generateMathPuzzle(): MathPuzzle;
  generateBlockPuzzle(): BlockPuzzle;
  isBlockPuzzleSolved(blocks: number[]): boolean;
  stopAlarm(alarmId: string): Promise<void>;
} 