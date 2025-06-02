export type RootStackParamList = {
    LoginPage: undefined;
    SignUpPage: undefined;
    GetStartPage: undefined;
    Dashboard: {
        showToast?: boolean;
        toastMessage?: string;
        toastType?: 'success' | 'error';
    };
    CreateHabit: {
        showToast?: boolean;
        toastMessage?: string;
        toastType?: 'success' | 'error';
    } | undefined;
    HabitDetail: {
        habitName?: string;
        habitIcon?: string;
        habitId?: {
            id: string;
            name: string;
            emoji: string;
            description: string;
            time: Date;
            reminder: boolean;
            days: string[];
            duration: { hours: string; minutes: string };
            lastCompleted: Date | null;
            completedDates: string[];
            startDay: Date;
        };
    };
    MobileAddiction: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Profile: undefined;
    Settings: undefined;
}; 