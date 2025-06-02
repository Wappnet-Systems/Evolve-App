import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Pressable } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { DiaryDetails, MOODS } from '../../../domain/models/Diary';
import { DiaryRepositoryImpl } from '../../../data/repositories/DiaryRepositoryImpl';
import { DiaryUseCases } from '../../../domain/usecases/DiaryUseCases';
import { DiaryDetailPresenter, DiaryDetailView } from '../../presenters/DiaryDetailPresenter';
import { styles } from './Styles';
import { Colors } from '../../../constants/colors';
import Toast from '../../../components/Toast';

const Icon = MaterialIcons as any;

type RootStackParamList = {
  DiaryDetail: { taskId: string };
  EditTask: { taskId: string };
};

type DiaryDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DiaryDetail'>;
  route: { params: { taskId: string; toastMessage?: string } };
};

const DiaryDetailScreen: React.FC<DiaryDetailScreenProps> = ({ navigation, route }) => {
  const { taskId, toastMessage } = route.params;
  const [diary, setDiary] = useState<DiaryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize dependencies
  const diaryRepository = new DiaryRepositoryImpl();
  const diaryUseCases = new DiaryUseCases(diaryRepository);
  const presenter = new DiaryDetailPresenter({
    showLoading: () => setIsLoading(true),
    hideLoading: () => setIsLoading(false),
    showError: (message) => setToast({ message, type: 'error' }),
    showSuccess: (message) => setToast({ message, type: 'success' }),
    displayDiary: (diaryData) => setDiary(diaryData),
    navigateBack: () => navigation.goBack(),
    startFadeInAnimation: () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  } as DiaryDetailView, diaryUseCases);

  useEffect(() => {
    presenter.loadDiaryDetails(taskId, toastMessage);
  }, [taskId, toastMessage]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loader" size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!diary) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Diary entry not found</Text>
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
        <TouchableOpacity testID="back-button" onPress={() => presenter.handleBack()}>
          <Icon name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text testID="diary-date" style={styles.headerDate}>
          {format(new Date(diary.date), 'dd MMM yyyy')}
        </Text>
        <TouchableOpacity onPress={() => presenter.handleShare()}>
          <Icon name="share" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>
     
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.moodContainer}>
            <View style={styles.moodIconContainer}>
              <Icon
                testID="mood-icon"
                name={MOODS[diary.mood].icon}
                size={32}
                color={MOODS[diary.mood].color}
              />
              <Text testID="mood-label" style={[styles.timestamp, { color: MOODS[diary.mood].color }]}>
                {MOODS[diary.mood].label}
              </Text>
            </View>
            <Text style={styles.timestamp}>
              {format(new Date(diary.date), 'HH:mm')}
            </Text>
          </View>

          <Text style={styles.title}>{diary.title}</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{diary.content}</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default DiaryDetailScreen; 