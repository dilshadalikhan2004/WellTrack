import { type LucideIcon } from 'lucide-react';

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
  id:string;
  name: string;
  category: 'Physical' | 'Mental' | 'Academic';
  icon: LucideIcon;
  goal: number;
  unit: string;
  completed: boolean;
};

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
  progress: number; // This will be calculated from subTasks
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

export type JournalEntry = {
    id: string;
    content: string;
    createdAt: Date;
    sentiment?: AnalyzeJournalSentimentOutput | null;
};
