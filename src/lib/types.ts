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
  category: 'Physical' | 'Mental' | 'Academic' | 'Social' | 'Self-Care';
  icon: React.ElementType;
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

export type Goal = {
  id: string;
  title: string;
  category: 'Academic' | 'Fitness' | 'Mental Health' | 'Personal';
  progress: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isEarned: boolean;
};
