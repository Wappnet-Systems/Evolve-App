import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { styles } from './Styles'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'
import firestore from '@react-native-firebase/firestore'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Toast from '../../components/Toast'

const Icon = MaterialIcons as any;

type RootStackParamList = {
  DailyDairy: undefined;
  TaskDetail: { taskId: string };
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

  const moods = [
    { id: 0, icon: 'sentiment-very-dissatisfied', color: '#FF6B6B' },
    { id: 1, icon: 'sentiment-dissatisfied', color: '#FFB067' },
    { id: 2, icon: 'sentiment-neutral', color: '#FFD93D' },
    { id: 3, icon: 'sentiment-satisfied', color: '#6BCB77' },
    { id: 4, icon: 'sentiment-very-satisfied', color: '#4D96FF' },
  ]

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
    if (!title.trim() || !content.trim()) {
      setToast({ message: "Please fill in both title and content", type: 'error' });
      return
    }

    setIsLoading(true)
    try {
      // const userId = auth().currentUser?.uid
      // if (!userId) {
      //   throw new Error('User not authenticated')
      // }

      const docRef = await firestore().collection('diaries').add({
        // userId,
        title,
        content,
        mood: selectedMood,
        date: selectedDate.toISOString(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      })

      setToast({ message: 'Your diary entry has been saved!', type: 'success' }); 
      navigation.navigate('MyDairyScreen', { taskId: docRef.id });
      // [
      //   {
      //     text: 'OK',
      //     onPress: () => {
      //       setTitle('')
      //       setContent('')
      //       setSelectedMood(0)
            
      //     },
      //   },
      // ]
    } catch (error) {
      Alert.alert('Error', 'Failed to save diary entry. Please try again.')
      console.error('Save diary error:', error)
    } finally {
      setIsLoading(false)
    }
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

      <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
        <Icon name="chevron-left" size={24} color="#000" />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>

     

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        style={[styles.saveButton, isLoading && { opacity: 0.7 }]} 
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save'}</Text>
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
    </View>
  )
}

export default DailyDairyScreen