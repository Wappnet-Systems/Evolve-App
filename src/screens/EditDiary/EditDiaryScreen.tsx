import { Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import firestore from '@react-native-firebase/firestore'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Toast from '../../components/Toast'
import { Colors } from '../../constants/colors'
import { styles } from './Styles'

type RootStackParamList = {
  EditDiary: { taskId: string };
  TaskDetail: { taskId: string };
};

type EditDiaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditDiary'>;
  route: { params: { taskId: string } };
};

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  createdAt: any;
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

  const moods = [
    { id: 0, icon: 'sentiment-very-dissatisfied', color: '#FF6B6B' },
    { id: 1, icon: 'sentiment-dissatisfied', color: '#FFB067' },
    { id: 2, icon: 'sentiment-neutral', color: '#FFD93D' },
    { id: 3, icon: 'sentiment-satisfied', color: '#6BCB77' },
    { id: 4, icon: 'sentiment-very-satisfied', color: '#4D96FF' },
  ]

  useEffect(() => {
    const fetchDiaryEntry = async () => {
      try {
        setIsLoading(true);
        const doc = await firestore().collection('diaries').doc(taskId).get();
        if (doc.exists) {
          const data = doc.data() as DiaryEntry;
          setTitle(data.title);
          setContent(data.content);
          setSelectedMood(data.mood);
          setSelectedDate(new Date(data.date));
        }
      } catch (error) {
        console.error('Error fetching diary entry:', error);
        setToast({ message: 'Failed to load diary entry', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaryEntry();
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
    if (!title.trim() || !content.trim()) {
      setToast({ message: "Please fill in both title and content", type: 'error' });
      return
    }

    setIsSaving(true)
    try {
      await firestore().collection('diaries').doc(taskId).update({
        title,
        content,
        mood: selectedMood,
        date: selectedDate.toISOString(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })

      navigation.navigate('TaskDetail', { taskId, toastMessage: 'Your diary entry has been updated!' });
    } catch (error) {
      console.error('Update diary error:', error)
      setToast({ message: 'Failed to update diary entry', type: 'error' });
    } finally {
      setIsSaving(false)
    }
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.addMemories}>
          <Text style={styles.headerTitle}>Edit memories</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
        <MaterialIcons name="chevron-left" size={24} color="#000" />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <MaterialIcons name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Heading here"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
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
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            testID="mood-button"
            style={[
              styles.moodButton,
              { backgroundColor: selectedMood === mood.id ? mood.color : 'transparent' }
            ]}
            onPress={() => setSelectedMood(mood.id)}
          >
            <MaterialIcons
              name={mood.icon}
              size={24}
              color={selectedMood === mood.id ? '#FFF' : mood.color}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
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