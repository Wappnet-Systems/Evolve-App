export interface HabitDetail {
    id: string;
    name: string;
    emoji: string;
    description: string;
    time: Date;
    reminder: boolean;
    days: string[];
    duration: {
        hours: string;
        minutes: string;
    };
    lastCompleted: Date | null;
    completedDates: string[];
    startDay: Date;
    createdAt?: Date;
    updatedAt?: Date;
} 