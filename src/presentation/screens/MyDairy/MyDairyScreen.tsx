import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { DiaryRepositoryImpl } from '../../../data/repositories/DiaryRepositoryImpl';
import { DiaryUseCases } from '../../../domain/usecases/DiaryUseCases';
import { DiaryPresenter, DiaryView } from '../../presenters/DiaryPresenter';
import Toast from '../../../components/Toast';
import { Colors } from '../../../constants/colors';
import { Diary, MOODS } from '../../../domain/models/Diary';
import { icons } from '../../../constants/images';


const Icon = MaterialIcons as any;

type RootStackParamList = {
  TaskDetail: { taskId?: string };
  DailyDairy: undefined;
  EditTask: { taskId: string };
  DiaryDetail: { taskId: string };
  Dashboard: undefined;
};

type TaskDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: { params?: { taskId?: string, toastMessage?: string } };
};

const MyDairyScreen: React.FC<TaskDetailScreenProps> = ({ navigation, route }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize dependencies
  const diaryRepository = new DiaryRepositoryImpl();
  const diaryUseCases = new DiaryUseCases(diaryRepository);
  const presenter = new DiaryPresenter({
    showLoading: () => setIsLoading(true),
    hideLoading: () => setIsLoading(false),
    showError: (message) => setToast({ message, type: 'error' }),
    showSuccess: (message) => setToast({ message, type: 'success' }),
    displayDiaries: (newDiaries) => setDiaries(newDiaries),
  } as DiaryView, diaryUseCases);

  useEffect(() => {
    presenter.loadDiaries();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      presenter.loadDiaries();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.toastMessage) {
      setToast({ message: route.params.toastMessage, type: 'success' });
    }
  }, [route.params?.toastMessage]);

  const handleEdit = (taskId: string) => {
    navigation.navigate('EditTask', { taskId });
  };

  const handleDelete = async (taskId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this diary note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => presenter.deleteDiary(taskId),
        },
      ]
    );
  };

  const handleAddTask = () => {
    navigation.navigate('DailyDairy');
  };

  const handleCardPress = (taskId: string) => {
    navigation.navigate('DiaryDetail', { taskId });
  };

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
        <TouchableOpacity testID="header-back-button" onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Diary</Text>
        <TouchableOpacity onPress={() => {}}>
          {/* <Icon name="star-border" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator testID="loader" size="large" color={Colors.primary} />
            </View>
          ) : diaries.length === 0 ? (
            <View testID="empty-state" style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notes yet. Start writing your thoughts!</Text>
            </View>
          ) : (
            diaries.map((diary) => (
              <TouchableOpacity
                key={diary.id}
                testID={`diary-card-${diary.id}`}
                style={styles.taskCard}
                onPress={() => handleCardPress(diary.id)}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.moodContainer}>
                    <Icon
                      name={MOODS[diary.mood].icon}
                      size={24}
                      color={MOODS[diary.mood].color}
                    />
                    <View style={styles.dateTimeContainer}>
                      <Text testID={`diary-date-${diary.id}`} style={styles.dateText}>
                        {format(new Date(diary.date), 'dd MMM yy')}
                      </Text>
                      <Text style={styles.timestamp}>
                        {format(new Date(diary.date), 'HH:mm')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                      testID={`edit-button-${diary.id}`}
                      style={styles.actionButton} 
                      onPress={() => handleEdit(diary.id)}
                    >
                      <Icon name="edit" size={20} color="#666" />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      testID={`delete-button-${diary.id}`}
                      style={styles.actionButton} 
                      onPress={() => handleDelete(diary.id)}
                    >
                      <Icon name="delete" size={20} color="#666" />
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.title}>{diary.title}</Text>
                <Text style={styles.contentText} numberOfLines={1}>{diary.content}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        
        <TouchableOpacity
          style={styles.fab}
          testID="floating-shop-button"
          activeOpacity={0.7}
          onPress={handleAddTask}
        >
          <View style={styles.fabInner}>
            <Image
              source={icons.IC_BOTTOMMENU_CARTUNSELECT}
              style={styles.fabIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyDairyScreen; 