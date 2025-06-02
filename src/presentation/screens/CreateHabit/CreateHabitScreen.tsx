import React, { FC, useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, Modal, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Strings } from '../../../constants/strings';
import { ToolbarComponent } from '../../../components/Toolbar/ToolbarComponent';
import { Habit } from '../../../domain/models/Habit';
import { CreateHabitPresenter } from '../../presenters/CreateHabitPresenter';
import { HabitUseCases } from '../../../domain/usecases/HabitUseCases';
import { HabitRepositoryImpl } from '../../../data/repositories/HabitRepositoryImpl';
import { RootStackParamList } from '../../../navigation/types';
import { styles } from './Styles';
import { Colors } from '../../../constants/colors';
import { habitCategories } from '../../../constants/habitCategories';
import { commonEmojis } from '../../../constants/commonEmojis';
import TextfieldComponent from '../../../components/TextFieldComponent';
import CustomButton from '../../../components/CustomButton';

type CreateHabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateHabitScreen: FC = () => {
    const navigation = useNavigation<CreateHabitScreenNavigationProp>();
    const [loading, setLoading] = useState(false);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newHabitName, setNewHabitName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('✨');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [showHabitList, setShowHabitList] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Initialize presenter
    const presenter = React.useMemo(() => {
        const repository = new HabitRepositoryImpl();
        const useCases = new HabitUseCases(repository);
        return new CreateHabitPresenter({
            showLoading: setLoading,
            showError: (message) => setError(message),
            showSuccess: (message) => {
                // Handle success message
                console.log(message);
            },
            updateHabits: setHabits,
            navigateToHabitDetail: (habitName, habitIcon) => {
                navigation.navigate('HabitDetail', { habitName, habitIcon });
            },
            closeModal: () => setModalVisible(false)
        }, useCases);
    }, [navigation]);

    useEffect(() => {
        presenter.loadHabits();
    }, [presenter]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: modalVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [modalVisible]);

    const handleCategoryPress = (category: any) => {
        if (selectedCategory?.id === category.id) {
            setShowHabitList(false);
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
            setShowHabitList(true);
        }
    };

    const handleCreateHabit = async () => {
        if (!newHabitName.trim()) {
            setError('Habit name cannot be empty');
            return;
        }

        const habit: Omit<Habit, 'id'> = {
            name: newHabitName,
            emoji: selectedEmoji,
            color: Colors.palette.primary600,
            duration: { hours: '0', minutes: '0' },
            reminder: false,
            time: new Date(),
            days: [],
            lastCompleted: null
        };

        await presenter.createHabit(habit);
    };

    return (
        <View style={styles.container}>
            <ToolbarComponent
                title="Create a Habit"
                showBackButton={true}
                onBackPress={() => {
                    if (showHabitList) {
                        setShowHabitList(false);
                        setSelectedCategory(null);
                    } else {
                        navigation.goBack();
                    }
                }}
            />
            <ScrollView contentContainerStyle={styles.subContainer}>
                {habitCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryCard, { backgroundColor: category.color }]}
                        onPress={() => handleCategoryPress(category)}>
                        <View style={styles.categoryContent}>
                            <Text style={styles.categoryTitle}>{category.name}</Text>
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                        </View>
                        {selectedCategory?.id === category.id && showHabitList && (
                            <View style={styles.habitListContent}>
                                {category.habits.map((habit, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.habitListItem}
                                        onPress={() => {
                                            setNewHabitName(habit.name);
                                            setSelectedEmoji(habit.icon);
                                            navigation.navigate('HabitDetail', {
                                                habitName: habit.name,
                                                habitIcon: habit.icon
                                            });
                                        }}>
                                        <Text style={styles.habitIcon}>{habit.icon}</Text>
                                        <Text style={styles.habitListItemText}>{habit.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                <View style={styles.orContainer}>
                    <Text style={styles.orText}>Or</Text>
                </View>

                <TouchableOpacity
                    style={[styles.categoryCard, { backgroundColor: '#64B5F6' }]}
                    onPress={() => setModalVisible(true)}>
                    <View style={styles.categoryContent}>
                        <Text style={styles.categoryTitle}>Custom Habit</Text>
                        <Text style={styles.categoryIcon}>🦊</Text>
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}>
                    <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create New Habit</Text>

                            {error && (
                                <Text testID="error-message" style={styles.errorText}>
                                    {error}
                                </Text>
                            )}

                            <View style={styles.emojiSelectorContainer}>
                                <TouchableOpacity
                                    style={styles.emojiSelectorButton}
                                    onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
                                </TouchableOpacity>
                                <Text style={styles.emojiLabel}>Select Emoji (Optional)</Text>
                            </View>

                            {showEmojiPicker && (
                                <ScrollView
                                    horizontal
                                    style={styles.emojiPicker}
                                    showsHorizontalScrollIndicator={false}>
                                    {commonEmojis.map((emoji, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.emojiOption}
                                            onPress={() => {
                                                setSelectedEmoji(emoji);
                                                setShowEmojiPicker(false);
                                            }}>
                                            <Text style={styles.emojiOptionText}>{emoji}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}

                            <TextfieldComponent
                                style={styles.input}
                                placeholder={Strings.Enter_habit_name}
                                value={newHabitName}
                                onChangeText={setNewHabitName}
                            />

                            <View style={styles.modalButtons}>
                                
                                <CustomButton
                                    title={Strings.Cancel}
                                    style={styles.cancelBtn}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedEmoji("✨");
                                        setNewHabitName('');
                                    }}
                                    styleText={styles.buttonText}
                                    disabled={loading}
                                />
                                <CustomButton
                                    title={loading ? "Adding..." : Strings.Add_Habit}
                                    style={styles.addHabitcelBtn}
                                    onPress={handleCreateHabit}
                                    styleText={styles.buttonText}
                                    disabled={loading}
                                />
                                {/* <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedEmoji('✨');
                                        setNewHabitName('');
                                    }}>
                                    <Text style={styles.buttonText}>{Strings.Cancel}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.addHabitcelBtn}
                                    onPress={handleCreateHabit}>
                                    <Text style={styles.buttonText}>
                                        {loading ? 'Adding...' : Strings.Add_Habit}
                                    </Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </Animated.View>
                </Modal>
            </ScrollView>
        </View>
    );
};

export default CreateHabitScreen; 