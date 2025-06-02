import { Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { styles } from './Styles'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { DiaryRepositoryImpl } from '../../../data/repositories/DiaryRepositoryImpl'
import { DiaryUseCases } from '../../../domain/usecases/DiaryUseCases'
import { DailyDairyPresenter, DailyDairyView } from '../../presenters/DailyDairyPresenter'
import Toast from '../../../components/Toast'
import { MOODS } from '../../../domain/models/Diary'

const Icon = MaterialIcons as any;

type RootStackParamList = {
  DailyDairy: undefined;
  MyDairyScreen: { taskId: string };
};

type DailyDairyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DailyDairy'>;
};

const DailyDairyScreen: React.FC<DailyDairyScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize dependencies
  const diaryRepository = new DiaryRepositoryImpl();
  const diaryUseCases = new DiaryUseCases(diaryRepository);
  const presenter = new DailyDairyPresenter({
    showLoading: () => setIsLoading(true),
    hideLoading: () => setIsLoading(false),
    showError: (message) => setToast({ message, type: 'error' }),
    showSuccess: (message) => setToast({ message, type: 'success' }),
    navigateBack: (taskId, toastMessage) => {
      navigation.navigate('MyDairyScreen', {
        taskId,
        toastMessage,
      });
    },
    clearForm: () => {
      setTitle('');
      setContent('');
      setSelectedMood(0);
    },
  } as DailyDairyView, diaryUseCases);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    })
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setSelectedDate(selectedDate)
    }
  }

  const handleSave = async () => {
    await presenter.createDiary({
      title,
      content,
      mood: selectedMood,
      date: selectedDate.toISOString(),
    });
  }

  return (
    <View style={styles.container}>
      {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.addMemories}>
        <Text style={styles.headerTitle}>Add memories</Text>
        </View>
      </View>

      <TouchableOpacity 
        testID="date-selector"
        style={styles.dateSelector} 
        onPress={() => setShowDatePicker(true)}
      >
        <Icon name="chevron-left" size={24} color="#000" />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>

     

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <TextInput
          testID="title-input"
            style={styles.titleInput}
            placeholder="Heading here"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            testID="content-input"
            style={styles.contentInput}
            placeholder="Start typing..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.moodSelector}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            testID={`mood-${mood.icon.replace('sentiment-', '')}`}
            style={[
              styles.moodButton,
              { backgroundColor: selectedMood === mood.id ? mood.color : 'transparent' }
            ]}
            onPress={() => setSelectedMood(mood.id)}
          >
            <Icon
              name={mood.icon}
              size={24}
              color={selectedMood === mood.id ? '#FFF' : mood.color}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
       testID="save-button"
        style={[styles.saveButton, isLoading && { opacity: 0.7 }]} 
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
         testID="date-picker"
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  )
}

export default DailyDairyScreen