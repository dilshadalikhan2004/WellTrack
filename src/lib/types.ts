import { type LucideIcon } from 'lucide-react';
import { type Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  gamification: {
    points: number;
    level: number;
    streak: number;
  };
};

export type Habit = {
  id: string;
  name: string;
  category: 'Physical' | 'Mental' | 'Academic';
  goal: string;
  frequency: string;
  userProfileId: string;
};

export type HabitLog = {
    id: string;
    habitId: string;
    timestamp: Timestamp;
    notes?: string;
    userProfileId: string;
}

export type MoodOption = {
  label: 'Anxious' | 'Stressed' | 'Happy' | 'Sad' | 'Motivated' | 'Calm';
  emoji: string;
  rating: number;
};

export type MoodLog = {
  date: Date;
  mood: MoodOption['label'];
  rating: number;
};

export type SubTask = {
    id: string;
    text: string;
    completed: boolean;
};

export type Goal = {
  id: string;
  title: string;
  category: 'Academic' | 'Fitness' | 'Mental Health' | 'Personal';
  description?: string;
  subTasks: SubTask[];
  progress: number; // This is calculated client-side, not stored in Firestore
  userProfileId: string;
};

export type Badge = {
  id:string;
  name: string;
  description: string;
  icon: React.ElementType;
  isEarned: boolean;
};

export type AnalyzeJournalSentimentOutput = {
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  emoji: string;
  summary: string;
};

// Represents the data fetched from Firestore, including ID
export type JournalEntry = {
    id: string;
    content: string;
    createdAt: Timestamp | any; // Firestore timestamp
    sentiment?: AnalyzeJournalSentimentOutput | null;
    userProfileId: string;
};

// Represents the data structure for creating a new entry in Firestore
export type JournalEntryData = {
    id?: string; // id is optional on write
    content: string;
    createdAt: any; // Can be serverTimestamp()
    sentiment?: AnalyzeJournalSentimentOutput | null;
    userProfileId: string;
}

export type ChatMessage = {
  id?: string;
  role: 'user' | 'model';
  content: string;
  timestamp?: Timestamp;
  userProfileId: string;
};

export type Gamification = {
    id: string;
    userProfileId: string;
    points: number;
    level: number;
    badges: string[]; // Array of badge IDs
}
