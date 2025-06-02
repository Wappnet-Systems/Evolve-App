import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Vibration,
  BackHandler,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import notifee from '@notifee/react-native';
import Sound from 'react-native-sound';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Alarm: undefined;
  PuzzleScreen: { alarmId: string };
};

type PuzzleScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PuzzleScreen'>;
  route: { params: { alarmId: string; puzzleType: 'math' | 'block' } };};

// Math puzzle generator
const generateMathPuzzle = () => {
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let num1 = Math.floor(Math.random() * 20) + 1;
  let num2 = Math.floor(Math.random() * 20) + 1;

  // Ensure multiplication isn't too difficult
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
};

const generateBlockPuzzle = () => {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
};

const PuzzleScreen: React.FC<PuzzleScreenProps> = ({ navigation, route }) => {
  const { alarmId, puzzleType } = route.params;

  const [puzzle, setPuzzle] = useState(generateMathPuzzle());
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [alarm, setAlarm] = useState<Sound | null>(null);
  const alarmRef = useRef<Sound | null>(null);
  const [blocks, setBlocks] = useState<number[]>(generateBlockPuzzle());
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const [errorText, setErrorText] = useState('');

useEffect(() => {
  if (puzzleType === 'math') {
    setPuzzle(generateMathPuzzle());
  } else if (puzzleType === 'block') {
    setBlocks(generateBlockPuzzle());
  }
}, [puzzleType]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Block back button
        return true;
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => subscription.remove();
    }, [])
  );


  useEffect(() => {
    // Initialize alarm sound
    const sound = new Sound('advertising.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('Failed to load alarm sound:', error);
        return;
      }
      sound.setNumberOfLoops(-1); // Loop indefinitely
      sound.play();
      alarmRef.current = sound;
      // setAlarm(sound);
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
  const handleSubmit = () => {
    if (answer === puzzle.answer) {
      // Stop alarm and vibration
      alarmRef.current?.stop();
      alarmRef.current?.release();
      Vibration.cancel();
  
      // Cancel notification
      notifee.cancelTriggerNotification(route.params.alarmId);
  
      Alert.alert('Good Morning!', 'You solved the puzzle!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AlarmScreen'),
        },
      ]);
    } else {
      setAttempts(prev => prev + 1);
      setAnswer('');
      if (attempts >= 2) {
        setPuzzle(generateMathPuzzle());
        setAttempts(0);
      }
    }
  };

  const isSolved = (arr: number[]) => arr.every((val, idx) => val === idx + 1);

const handleBlockPress = (index: number) => {
  if (selectedIndex === null) {
    setSelectedIndex(index);
  } else {
    const newBlocks = [...blocks];
    [newBlocks[selectedIndex], newBlocks[index]] = [
      newBlocks[index],
      newBlocks[selectedIndex],
    ];
    setBlocks(newBlocks);
    setSelectedIndex(null);

    if (isSolved(newBlocks)) {
      setErrorText('');
      Alert.alert('Well Done!', 'You solved the block puzzle.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AlarmScreen'),
        },
      ]);
      alarmRef.current?.stop();
      alarmRef.current?.release();
      Vibration.cancel();
      notifee.cancelTriggerNotification(route.params.alarmId);
    }
    else {
      setErrorText('Not solved yet! Keep arranging.');
    }
  }
};
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve to Stop the Alarm</Text>

      {puzzleType === 'math' ? (
  <>
    <Text style={styles.puzzleText}>{puzzle.question}</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={answer}
      onChangeText={setAnswer}
      placeholder="Enter your answer"
      placeholderTextColor="#666"
    />
    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
    {attempts > 0 && (
      <Text style={styles.attemptsText}>
        Wrong answer! Attempts remaining: {3 - attempts}
      </Text>
    )}
  </>
) : (
  <>
    <Text style={styles.puzzleQuestionText}>
      Arrange the numbers from 1 to 9 in order
    </Text>
    {errorText ? (
      <Text style={styles.errorText}>{errorText}</Text>
    ) : null}

    <View style={styles.grid}>
      {blocks.map((number, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.block,
            selectedIndex === index && styles.selectedBlock,
          ]}
          onPress={() => handleBlockPress(index)}
        >
          <Text style={styles.blockText}>{number}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  puzzleContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  puzzleText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4D96FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  attemptsText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 40,
  },
  block: {
    width: 80,
    height: 80,
    backgroundColor: '#4D96FF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
  },
  selectedBlock: {
    backgroundColor: '#FF6B6B',
  },
  blockText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  puzzleQuestionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 10,
  },
  
  
});

export default PuzzleScreen; 