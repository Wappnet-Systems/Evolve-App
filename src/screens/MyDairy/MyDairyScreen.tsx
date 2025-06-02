import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { Colors } from '../../constants/colors';
import Toast from '../../components/Toast';
import { icons } from '../../constants/images';

// Add type declaration for MaterialIcons
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

type TaskData = {
  id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  createdAt: any;
};

const MyDairyScreen: React.FC<TaskDetailScreenProps> = ({ navigation, route }) => {
  const [tasks, setTasks] = React.useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const moods = [
    { id: 0, icon: 'sentiment-very-dissatisfied', color: '#FF6B6B' },
    { id: 1, icon: 'sentiment-dissatisfied', color: '#FFB067' },
    { id: 2, icon: 'sentiment-neutral', color: '#FFD93D' },
    { id: 3, icon: 'sentiment-satisfied', color: '#6BCB77' },
    { id: 4, icon: 'sentiment-very-satisfied', color: '#4D96FF' },
  ];

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('diaries')
          .orderBy('date', 'desc')
          .get();

        const fetchedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TaskData[];

        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'Failed to load diary entries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add focus listener to refresh data when returning to screen
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fetchTasks = async () => {
        try {
          const querySnapshot = await firestore()
            .collection('diaries')
            .orderBy('date', 'desc')
            .get();

          const fetchedTasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as TaskData[];

          setTasks(fetchedTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
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

  const handleShare = () => {
    // Implement share functionality
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
          onPress: async () => {
            try {
              await firestore()
                .collection('diaries')
                .doc(taskId)
                .delete();
              
              // Update local state immediately
              setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
              
              // Show success message
              setToast({ message: 'Your diary note has been deleted!', type: 'success' });
              
              // Refresh the list after a short delay to ensure Firebase sync
              setTimeout(() => {
                const fetchTasks = async () => {
                  try {
                    const querySnapshot = await firestore()
                      .collection('diaries')
                      .orderBy('date', 'desc')
                      .get();

                    const fetchedTasks = querySnapshot.docs.map(doc => ({
                      id: doc.id,
                      ...doc.data()
                    })) as TaskData[];

                    setTasks(fetchedTasks);
                  } catch (error) {
                    console.error('Error fetching tasks:', error);
                  }
                };

                fetchTasks();
              }, 500);
            } catch (error) {
              console.error('Error deleting task:', error);
              setToast({ message: 'Failed to delete entry', type: 'error' });
            }
          },
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
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
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
                        <ActivityIndicator testID= "loader" size="large" color={Colors.primary} />
                    </View>
                ) : 
          tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No notes yet. Start writing your thoughts!</Text>
  </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => handleCardPress(task.id)}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.moodContainer}>
                    <Icon
                      name={moods[task.mood].icon}
                      size={24}
                      color={moods[task.mood].color}
                    />
                    <View style={styles.dateTimeContainer}>
                      <Text style={styles.dateText}>
                        {format(new Date(task.date), 'dd MMM yy')}
                      </Text>
                      <Text style={styles.timestamp}>
                        {format(new Date(task.date), 'HH:mm')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(task.id)}>
                      <Icon name="edit" size={20} color="#666" />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(task.id)}>
                      <Icon name="delete" size={20} color="#666" />
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.contentText}  numberOfLines={1}>{task.content}</Text>
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