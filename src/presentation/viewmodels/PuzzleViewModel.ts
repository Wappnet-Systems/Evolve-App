import { useState, useEffect, useRef } from 'react';
import { PuzzleRepository, MathPuzzle, BlockPuzzle, PuzzleType } from '../../domain/models/puzzle';
import Sound from 'react-native-sound';
import { Vibration } from 'react-native';

export const usePuzzleViewModel = (
  repository: PuzzleRepository,
  alarmId: string,
  puzzleType: PuzzleType,
  onSuccess: () => void
) => {
  const [mathPuzzle, setMathPuzzle] = useState<MathPuzzle>(repository.generateMathPuzzle());
  const [blockPuzzle, setBlockPuzzle] = useState<BlockPuzzle>(repository.generateBlockPuzzle());
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [errorText, setErrorText] = useState('');
  const alarmRef = useRef<Sound | null>(null);
  const [showModal, setShowModal] = useState(true); // controls modal visibility


  useEffect(() => {
    // Initialize alarm sound
    const sound = new Sound('advertising.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load alarm sound:', error);
        return;
      }
      sound.setNumberOfLoops(-1);
      sound.play();
      alarmRef.current = sound;
    });

    // Start vibration pattern
    const PATTERN = [1000, 2000, 1000];
    Vibration.vibrate(PATTERN, true);

    return () => {
      alarmRef.current?.stop();
      alarmRef.current?.release();
      Vibration.cancel();
    };
  }, []);

  const handleMathSubmit = () => {
    if (answer === mathPuzzle.answer) {
      handleSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setAnswer('');
      if (attempts >= 2) {
        setMathPuzzle(repository.generateMathPuzzle());
        setAttempts(0);
      }
    }
  };

  const handleBlockPress = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newBlocks = [...blockPuzzle.blocks];
      [newBlocks[selectedIndex], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[selectedIndex],
      ];
      setBlockPuzzle({ blocks: newBlocks });
      setSelectedIndex(null);

      if (repository.isBlockPuzzleSolved(newBlocks)) {
        handleSuccess();
      } else {
        setErrorText('Not solved yet! Keep arranging.');
      }
    }
  };

  const handleSuccess = async () => {
    alarmRef.current?.stop();
    alarmRef.current?.release();
    await repository.stopAlarm(alarmId);
    onSuccess();
  };

  return {
    mathPuzzle,
    blockPuzzle,
    answer,
    attempts,
    selectedIndex,
    errorText,
    setAnswer,
    handleMathSubmit,
    handleBlockPress,
  };
}; 