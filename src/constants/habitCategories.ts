import { Colors } from './colors';

export interface HabitTemplate {
    name: string;
    icon: string;
}

export interface HabitCategory {
    id: string;
    name: string;
    color: string;
    icon: string;
    habits: HabitTemplate[];
}

export const habitCategories: HabitCategory[] = [
    {
        id: 'physical_fitness',
        name: 'Physical Fitness',
        color: '#FFB74D',
        icon: '💪',
        habits: [
            { name: 'Take a Walk', icon: '👟' },
            { name: 'Run', icon: '🏃' },
            { name: 'Stretch', icon: '🧘‍♂️' },
            { name: 'Stand', icon: '🧍‍♂️' },
            { name: 'Yoga', icon: '🧘' },
            { name: 'Cycling', icon: '🚲' },
            { name: 'Swim', icon: '🏊‍♂️' },
            { name: 'Burn Calorie', icon: '🔥' },
            { name: 'Exercise', icon: '💪' },
        ]
    },
    {
        id: 'mindfulness',
        name: 'Mindfulness',
        color: '#9575CD',
        icon: '🌸',
        habits: [
            { name: 'Meditate', icon: '🧘‍♂️' },
            { name: 'Journal', icon: '📔' },
            { name: 'Breathe', icon: '🫁' },
            { name: 'Read', icon: '📚' },
        ]
    },
    {
        id: 'health',
        name: 'Health',
        color: '#81C784',
        icon: '💚',
        habits: [
            { name: 'Take Medicine', icon: '💊' },
            { name: 'Drink Water', icon: '💧' },
            { name: 'Sleep Early', icon: '😴' },
            { name: 'Eat Healthy', icon: '🥗' },
        ]
    },
    {
        id: 'life',
        name: 'Life',
        color: '#EF5350',
        icon: '❤️',
        habits: [
            { name: 'Family Time', icon: '👨‍👩‍👧‍👦' },
            { name: 'Hobby', icon: '🎨' },
            { name: 'Social', icon: '👥' },
            { name: 'Learn', icon: '📚' },
        ]
    }
]; 