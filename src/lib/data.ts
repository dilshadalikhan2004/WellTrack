import type { User, Habit, MoodOption, MoodLog, Goal, Badge } from './types';
import {
  HeartPulse,
  Brain,
  BookOpen,
  Users,
  Smile,
  GlassWater,
  Bed,
  Dumbbell,
  Book,
  Flame,
  Star,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { subDays } from 'date-fns';
import { PlaceHolderImages } from './placeholder-images';

const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex',
  email: 'alex.doe@example.com',
  avatarUrl: userAvatar?.imageUrl ?? 'https://picsum.photos/seed/avatar/100/100',
  gamification: {
    points: 1250,
    level: 8,
    streak: 14,
  },
};

export const mockHabits: Habit[] = [
  {
    id: 'habit-1',
    name: 'Drink 8 glasses of water',
    category: 'Physical',
    icon: GlassWater,
    goal: 8,
    unit: 'glasses',
    completed: true,
  },
  {
    id: 'habit-2',
    name: 'Sleep 7-9 hours',
    category: 'Physical',
    icon: Bed,
    goal: 8,
    unit: 'hours',
    completed: true,
  },
  {
    id: 'habit-3',
    name: '30 min exercise',
    category: 'Physical',
    icon: Dumbbell,
    goal: 30,
    unit: 'minutes',
    completed: false,
  },
  {
    id: 'habit-4',
    name: 'Study for 2 hours',
    category: 'Academic',
    icon: Book,
    goal: 2,
    unit: 'hours',
    completed: true,
  },
  {
    id: 'habit-5',
    name: 'Meditate for 10 mins',
    category: 'Mental',
    icon: Brain,
    goal: 10,
    unit: 'minutes',
    completed: false,
  },
];

export const moodOptions: MoodOption[] = [
  { label: 'Happy', emoji: '😄', rating: 9 },
  { label: 'Calm', emoji: '😌', rating: 8 },
  { label: 'Motivated', emoji: '💪', rating: 7 },
  { label: 'Sad', emoji: '😢', rating: 3 },
  { label: 'Stressed', emoji: '😫', rating: 2 },
  { label: 'Anxious', emoji: '😟', rating: 1 },
];

export const mockMoodLogs: MoodLog[] = [
  { date: subDays(new Date(), 0), mood: 'Happy', rating: 9 },
  { date: subDays(new Date(), 1), mood: 'Motivated', rating: 7 },
  { date: subDays(new Date(), 2), mood: 'Calm', rating: 8 },
  { date: subDays(new Date(), 3), mood: 'Stressed', rating: 2 },
  { date: subDays(new Date(), 4), mood: 'Happy', rating: 8 },
  { date: subDays(new Date(), 5), mood: 'Sad', rating: 3 },
  { date: subDays(new Date(), 6), mood: 'Motivated', rating: 6 },
  ...Array.from({ length: 150 }, (_, i) => ({
      date: subDays(new Date(), i + 7),
      mood: moodOptions[Math.floor(Math.random() * moodOptions.length)].label,
      rating: Math.floor(Math.random() * 10) + 1
  }))
];

export const mockGoals: Omit<Goal, 'id' | 'progress' | 'userProfileId'>[] = [
  {
    title: 'Achieve a 3.5 GPA this semester',
    category: 'Academic',
    subTasks: [
        { id: 'st-1-1', text: 'Get an A in Math', completed: true },
        { id: 'st-1-2', text: 'Get at least a B+ in History', completed: true },
        { id: 'st-1-3', text: 'Get an A- in Science', completed: true },
        { id: 'st-1-4', text: 'Submit all assignments on time', completed: false },
    ]
  },
  {
    title: 'Run a 5k in under 30 minutes',
    category: 'Fitness',
    subTasks: [
        { id: 'st-2-1', text: 'Run 3 times a week', completed: true },
        { id: 'st-2-2', text: 'Incorporate interval training', completed: true },
        { id: 'st-2-3', text: 'Complete a practice 5k', completed: false },
        { id: 'st-2-4', text: 'Improve pace by 30s', completed: false },
    ]
  },
  {
    title: 'Practice daily mindfulness',
    category: 'Mental Health',
    subTasks: [
        { id: 'st-3-1', text: 'Meditate for 10 mins daily', completed: true },
        { id: 'st-3-2', text: 'Do a digital detox once a week', completed: true },
        { id: 'st-3-3', text: 'Journal thoughts and feelings', completed: true },
    ]
  },
];


export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Early Bird',
    description: '7 consecutive early wake-ups',
    icon: Flame,
    isEarned: true,
  },
  {
    id: 'badge-2',
    name: 'Meditation Master',
    description: '30 days of meditation',
    icon: Star,
    isEarned: true,
  },
  {
    id: 'badge-3',
    name: 'Hydration Hero',
    description: 'Perfect water intake for a week',
    icon: Sparkles,
    isEarned: true,
  },
  {
    id: 'badge-4',
    name: 'Academic Ace',
    description: 'Maintain study routine for a month',
    icon: BookOpen,
    isEarned: false,
  },
  {
    id: 'badge-5',
    name: 'Stress Warrior',
    description: 'Using coping tools during difficult times',
    icon: Trophy,
    isEarned: false,
  },
  {
    id: 'badge-6',
    name: 'Social Butterfly',
    description: 'Connect with friends 3 times a week',
    icon: Users,
    isEarned: true,
  },
  {
    id: 'badge-7',
    name: 'Fitness Fanatic',
    description: 'Complete 15 workouts in a month',
    icon: HeartPulse,
    isEarned: false,
  },
  {
    id: 'badge-8',
    name: 'Mindful Moment',
    description: 'Log your mood for 14 days straight',
    icon: Smile,
    isEarned: false,
  },
];
