import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { styles } from './Style';
import { PuzzleRepositoryImpl } from '../../../data/repositories/PuzzleRepositoryImpl';
import { PuzzleType } from '../../../domain/models/puzzle';
import { usePuzzleViewModel } from '../../viewmodels/PuzzleViewModel';

interface PuzzleScreenProps {
  route: {
    params: {
      alarmId: string;
      puzzleType: PuzzleType;
    };
  };
  navigation: any;
}

const PuzzleScreen: React.FC<PuzzleScreenProps> = ({ route, navigation }) => {
  const { alarmId, puzzleType } = route.params;
  const repository = new PuzzleRepositoryImpl();

  const {
    mathPuzzle,
    blockPuzzle,
    answer,
    attempts,
    selectedIndex,
    errorText,
    setAnswer,
    handleMathSubmit,
    handleBlockPress,
  } = usePuzzleViewModel(
    repository,
    alarmId,
    puzzleType,
    () => {
      Alert.alert('Success', 'Alarm stopped!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    }
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve the puzzle to stop the alarm!</Text>

      {puzzleType === 'math' ? (
        // <View style={styles.mathContainer}>
        <>
          <Text style={styles.puzzleText}>{mathPuzzle.question}</Text>
          <TextInput
            testID="math-input"
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            keyboardType="numeric"
            placeholder="Enter your answer"
          />
          <TouchableOpacity 
            testID="submit-button"
            style={styles.submitButton} 
            onPress={handleMathSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {attempts > 0 && (
            <Text testID="error-text" style={styles.errorText}>
              Wrong answer! {3 - attempts} attempts left.
            </Text>
          )}
        </>
        // </View>
      ) : (
        // <View style={styles.blockContainer}>
        <>
          <Text style={styles.puzzleQuestionText}>
      Arrange the numbers from 1 to 9 in order
    </Text>
    {errorText ? (
      <Text testID="error-text" style={styles.errorText}>{errorText}</Text>
    ) : null}
          <View style={styles.grid}>
            {blockPuzzle.blocks.map((number, index) => (
              <TouchableOpacity
                testID={`puzzle-block-${index}`}
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
          {/* {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null} */}
        {/* </View> */}
        </>
      )}
    </View>
  );
};

export default PuzzleScreen; 