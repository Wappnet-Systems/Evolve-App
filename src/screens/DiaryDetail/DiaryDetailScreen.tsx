import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Pressable } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { Colors } from '../../constants/colors';
import Toast from '../../components/Toast';
import { styles } from './Styles';

const Icon = MaterialIcons as any;

type RootStackParamList = {
  DiaryDetail: { taskId: string };
  EditTask: { taskId: string };
};

type DiaryDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DiaryDetail'>;
  route: { params: { taskId: string; toastMessage?: string } };
};

type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  createdAt: any;
};

const DiaryDetailScreen: React.FC<DiaryDetailScreenProps> = ({ navigation, route }) => {
  const { taskId, toastMessage } = route.params;
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isEditPressed, setIsEditPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const moods = [
    { id: 0, icon: 'sentiment-very-dissatisfied', color: '#FF6B6B', label: 'Very Sad' },
    { id: 1, icon: 'sentiment-dissatisfied', color: '#FFB067', label: 'Sad' },
    { id: 2, icon: 'sentiment-neutral', color: '#FFD93D', label: 'Neutral' },
    { id: 3, icon: 'sentiment-satisfied', color: '#6BCB77', label: 'Happy' },
    { id: 4, icon: 'sentiment-very-satisfied', color: '#4D96FF', label: 'Very Happy' },
  ];

  useEffect(() => {
    if (toastMessage) {
      setToast({ message: toastMessage, type: 'success' });
    }
  }, [toastMessage]);

  useEffect(() => {
    const fetchDiaryEntry = async () => {
      try {
        const doc = await firestore().collection('diaries').doc(taskId).get();
        if (doc.exists) {
          setDiary({ id: doc.id, ...doc.data() } as DiaryEntry);
          // Fade in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error('Error fetching diary entry:', error);
        setToast({ message: 'Failed to load diary entry', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaryEntry();
  }, [taskId, fadeAnim]);

  const handleShare = () => {
    // Implement share functionality
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerDate}>
          {format(new Date(diary.date), 'dd MMM yyyy')}
        </Text>
        <TouchableOpacity onPress={handleShare}>
          <Icon name="share" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>
     
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.moodContainer}>
            <View style={styles.moodIconContainer}>
              <Icon
                name={moods[diary.mood].icon}
                size={32}
                color={moods[diary.mood].color}
              />
              <Text style={[styles.timestamp, { color: moods[diary.mood].color }]}>
                {moods[diary.mood].label}
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