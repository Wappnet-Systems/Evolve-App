import notifee from '@notifee/react-native';
import { MathPuzzle, BlockPuzzle, PuzzleRepository } from '../../domain/models/puzzle';
import { Vibration } from 'react-native';

export class PuzzleRepositoryImpl implements PuzzleRepository {
  generateMathPuzzle(): MathPuzzle {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;

    if (operator === '*') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    }

    let answer;
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }

    return {
      question: `${num1} ${operator} ${num2} = ?`,
      answer: answer.toString(),
    };
  }

  generateBlockPuzzle(): BlockPuzzle {
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return { blocks: numbers };
  }

  isBlockPuzzleSolved(blocks: number[]): boolean {
    return blocks.every((val, idx) => val === idx + 1);
  }

  async stopAlarm(alarmId: string): Promise<void> {
    await notifee.cancelTriggerNotification(alarmId);
    Vibration.cancel();
  }
} 