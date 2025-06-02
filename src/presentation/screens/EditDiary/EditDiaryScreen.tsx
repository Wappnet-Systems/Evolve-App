import { Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { DiaryRepositoryImpl } from '../../../data/repositories/DiaryRepositoryImpl'
import { DiaryUseCases } from '../../../domain/usecases/DiaryUseCases'
import { EditDiaryPresenter, EditDiaryView } from '../../presenters/EditDiaryPresenter'
import { DiaryDetails, MOODS } from '../../../domain/models/Diary'
import { styles } from './Styles'
import { Colors } from '../../../constants/colors'
import Toast from '../../../components/Toast'

const Icon = MaterialIcons as any;

type RootStackParamList = {
  EditDiary: { taskId: string };
  TaskDetail: { taskId: string; toastMessage?: string };
  MyDairyScreen: { taskId: string; toastMessage?: string };
};

type EditDiaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditDiary'>;
  route: { params: { taskId: string } };
};

const EditDiaryScreen: React.FC<EditDiaryScreenProps> = ({ navigation, route }) => {
  const { taskId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize dependencies
  const diaryRepository = new DiaryRepositoryImpl();
  const diaryUseCases = new DiaryUseCases(diaryRepository);
  const presenter = new EditDiaryPresenter({
    showLoading: () => setIsLoading(true),
    hideLoading: () => setIsLoading(false),
    showSaving: () => setIsSaving(true),
    hideSaving: () => setIsSaving(false),
    showError: (message) => setToast({ message, type: 'error' }),
    showSuccess: (message) => setToast({ message, type: 'success' }),
    setDiaryData: (diary: DiaryDetails) => {
      setTitle(diary.title);
      setContent(diary.content);
      setSelectedMood(diary.mood);
      setSelectedDate(new Date(diary.date));
    },
    navigateBack: (taskId: string, message: string) => {
      navigation.navigate('MyDairyScreen', { taskId, toastMessage: message });
    },
  } as EditDiaryView, diaryUseCases);

  useEffect(() => {
    presenter.loadDiaryDetails(taskId);
  }, [taskId]);

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

  const handleUpdate = async () => {
    await presenter.updateDiary(taskId, {
      title,
      content,
      mood: selectedMood,
      date: selectedDate.toISOString(),
    });
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} testID="activity-indicator" />
      </View>
    );
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
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.addMemories}>
          <Text style={styles.headerTitle}>Edit memories</Text>
        </View>
      </View>

      <TouchableOpacity testID="date-selector" style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
        <Icon name="chevron-left" size={24} color="#000" />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Icon name="chevron-right" size={24} color="#000" />
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
            testID="mood-button"
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
        testID="update-button"
        style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
        onPress={handleUpdate}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>{isSaving ? 'Updating...' : 'Update'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditDiaryScreen 