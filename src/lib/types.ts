
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

export type UserProfile = {
    id: string;
    username: string;
    email: string;
    age?: number;
    sex?: string;
}

export type Habit = {
  id: string;
  name: string;
  category: 'Physical' | 'Mental' | 'Academic';
  goal: string;
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
  id?: string;
  date?: Date; // This is client-side processed
  timestamp: Timestamp;
  mood: MoodOption['label'];
  rating: number;
  userProfileId: string;
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

export type FinancialTransaction = {
    id: string;
    userProfileId: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    timestamp: Timestamp | any;
    isArchived?: boolean;
}

export type FinancialAnxietyLog = {
    id: string;
    userProfileId: string;
    level: number; // 1 (low) to 5 (high)
    timestamp: Timestamp;
}

export type EmergencyFund = {
    id: string; // Should be user's UID
    userProfileId: string;
    goal: number;
    currentAmount: number;
}

export type GenerateFinancialTipsOutput = {
  tips: string[];
  summary: string;
};

export type Resource = {
    id: string;
    title: string;
    description: string;
    type: 'infographic' | 'video' | 'podcast' | 'course' | 'talk' | 'book' | 'research';
    category: string;
    imageUrl: string;
    contentUrl?: string;
    duration?: number; // in minutes
}

export type EmergencyContact = {
    id: string;
    userProfileId: string;
    name: string;
    relationship: string;
    phone: string;
};

export type CopingStrategy = {
    id: string;
    userProfileId: string;
    text: string;
};


export type SafetyPlan = {
  emergencyContacts: EmergencyContact[];
  copingStrategies: CopingStrategy[];
};

export type CommunityForum = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType; // Kept for client-side mapping
};

export type ForumPost = {
  id: string;
  communityForumId: string;
  title: string;
  userProfileId: string;
  timestamp: Timestamp | null;
  content: string;
  replies?: number;
  author?: {
    name: string;
    avatarUrl?: string;
  };
};

export type ForumPostReply = {
  id: string;
  postId: string;
  userProfileId: string;
  timestamp: Timestamp | null;
  content: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
};

// Firestore document structure for CommunityForum
export type CommunityForumDoc = {
    id: string;
    name: string;
    description: string;
    iconName: string; // Storing icon name as a string
}

export type ForumCategory = {
    id: string;
    name: string;
    description: string;
}

export type ScheduleItem = {
    id: string;
    title: string;
    date: Date;
    type: 'assignment' | 'exam' | 'event';
    description?: string;
    userProfileId: string;
    timestamp: Timestamp;
};
