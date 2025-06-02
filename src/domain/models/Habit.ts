export interface Habit {
    id: string;
    name: string;
    emoji: string;
    color: string;
    description?: string;
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
    streak: number;
    createdAt?: Date;
    updatedAt?: Date;
    icon: string;
    frequency: string;
    severity: string;
} 