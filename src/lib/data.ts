
import type { User, Habit, MoodOption, MoodLog, Goal, Badge, SafetyPlan, CommunityForum, ForumPost, CommunityForumDoc } from './types';
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
  ShieldQuestion,
  GraduationCap,
} from 'lucide-react';
import { subDays } from 'date-fns';
import { PlaceHolderImages } from './placeholder-images';

const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

ShieldQuestion.displayName = 'ShieldQuestion';
GraduationCap.displayName = 'GraduationCap';
Brain.displayName = 'Brain';


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
    userProfileId: 'user-1',
    name: 'Drink 8 glasses of water',
    category: 'Physical',
    goal: '8',
  },
  {
    id: 'habit-2',
    userProfileId: 'user-1',
    name: 'Sleep 7-9 hours',
    category: 'Physical',
    goal: '8',
  },
  {
    id: 'habit-3',
    userProfileId: 'user-1',
    name: '30 min exercise',
    category: 'Physical',
    goal: '30',
  },
  {
    id: 'habit-4',
    userProfileId: 'user-1',
    name: 'Study for 2 hours',
    category: 'Academic',
    goal: '2',
  },
  {
    id: 'habit-5',
    userProfileId: 'user-1',
    name: 'Meditate for 10 mins',
    category: 'Mental',
    goal: '10',
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
  { date: subDays(new Date(), 0), mood: 'Happy', rating: 9, userProfileId: 'user-1', timestamp: {} as any },
  { date: subDays(new Date(), 1), mood: 'Motivated', rating: 7, userProfileId: 'user-1', timestamp: {} as any },
  { date: subDays(new Date(), 2), mood: 'Calm', rating: 8, userProfileId: 'user-1', timestamp: {} as any },
  { date: subDays(new Date(), 3), mood: 'Stressed', rating: 2, userProfileId: 'user-1', timestamp: {} as any },
  { date: subDays(new Date(), 4), mood: 'Happy', rating: 8, userProfileId: 'user-1', timestamp: {} as any },
  { date: subDays(new Date(), 5), mood: 'Sad', rating: 3, userProfileId: 'user-1', timestamp: {} as any },
  { date: subDays(new Date(), 6), mood: 'Motivated', rating: 6, userProfileId: 'user-1', timestamp: {} as any },
  ...Array.from({ length: 150 }, (_, i) => ({
      date: subDays(new Date(), i + 7),
      mood: moodOptions[Math.floor(Math.random() * moodOptions.length)].label,
      rating: Math.floor(Math.random() * 10) + 1,
      userProfileId: 'user-1', 
      timestamp: {} as any
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

export const mockSafetyPlan: SafetyPlan = {
  emergencyContacts: [
    { id: 'ec-1', name: 'Dr. Emily Carter', relationship: 'Therapist', phone: '123-456-7890' },
    { id: 'ec-2', name: 'Alex Johnson', relationship: 'Close Friend', phone: '234-567-8901' },
    { id: 'ec-3', name: 'Campus Support', relationship: 'University Service', phone: '345-678-9012' },
  ],
  copingStrategies: [
    { id: 'cs-1', text: 'Practice 4-7-8 breathing for 5 minutes.' },
    { id: 'cs-2', text: 'Listen to my "Calm" playlist on Spotify.' },
    { id: 'cs-3', text: 'Use the 5-4-3-2-1 grounding technique.' },
    { id: 'cs-4', text: 'Go for a short walk outside, even for just 10 minutes.' },
    { id: 'cs-5', text: 'Write down everything I\'m feeling in my journal.' },
  ],
};

export const mockForums: CommunityForum[] = [
  { id: 'forum-3', name: 'General Wellness', description: 'A place for general chat about mental well-being and self-care.', icon: Brain },
  { id: 'forum-1', name: 'Anxiety Support', description: 'Share experiences and coping mechanisms for anxiety.', icon: ShieldQuestion },
  { id: 'forum-2', name: 'Exam Stress', description: 'Discuss study strategies and ways to manage pressure during exams.', icon: GraduationCap },
];


export const mockForumPosts: ForumPost[] = [
    {
        id: 'post-1',
        communityForumId: 'forum-2',
        title: 'Mid-terms are really getting to me',
        author: { name: 'StudentA', avatarUrl: 'https://picsum.photos/seed/avatar1/40/40' },
        timestamp: subDays(new Date(), 1),
        content: "I have 3 exams in 2 days and I feel like I can't keep up. How does everyone else deal with this pressure?",
        replies: 12,
    },
    {
        id: 'post-2',
        communityForumId: 'forum-1',
        title: 'Feeling overwhelmed in social situations',
        author: { name: 'User246', avatarUrl: 'https://picsum.photos/seed/avatar2/40/40' },
        timestamp: subDays(new Date(), 2),
        content: "Lately, I've been finding it really hard to be in crowded places. Does anyone have any tips for managing social anxiety?",
        replies: 8,
    },
    {
        id: 'post-3',
        communityForumId: 'forum-3',
        title: 'What are your favorite self-care activities?',
        author: { name: 'WellnessSeeker', avatarUrl: 'https://picsum.photos/seed/avatar3/40/40' },
        timestamp: subDays(new Date(), 4),
        content: "Looking for some new ideas for self-care that aren't just bubble baths. What do you all do to relax and recharge?",
        replies: 23,
    }
];
