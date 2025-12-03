'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Flame, Star, Target } from 'lucide-react';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Gamification, HabitLog, MoodLog } from '@/lib/types';
import { useMemo } from 'react';
import { differenceInDays, isToday, startOfDay, subDays } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

export function QuickStats() {
  const { user } = useUser();
  const firestore = useFirestore();

  const gamificationDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/gamification`, user.uid);
  }, [firestore, user]);

  const { data: gamificationData, isLoading: gamificationLoading } = useDoc<Gamification>(gamificationDocRef);

  const habitLogsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/habit_logs`);
  }, [firestore, user]);

  const { data: habitLogs, isLoading: habitLogsLoading } = useCollection<HabitLog>(habitLogsCollectionRef);
  
  const moodLogsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/mood_logs`);
    }, [user, firestore]);
    
  const { data: moodLogs, isLoading: moodLogsLoading } = useCollection<MoodLog>(moodLogsCollectionRef);

  const { streak, wellnessScore } = useMemo(() => {
    // Streak Calculation
    let currentStreak = 0;
    if (habitLogs && habitLogs.length > 0) {
        const sortedLogs = habitLogs
            .filter(l => l.timestamp)
            .map(l => l.timestamp.toDate())
            .sort((a, b) => b.getTime() - a.getTime());
        const uniqueDays = [...new Set(sortedLogs.map(d => startOfDay(d).toISOString()))].map(iso => new Date(iso));
        
        if (uniqueDays.length > 0) {
            let lastDate = new Date();
            if (isToday(uniqueDays[0]) || differenceInDays(new Date(), uniqueDays[0]) === 1) {
                currentStreak = 1;
                lastDate = uniqueDays[0];
            }

            for (let i = 1; i < uniqueDays.length; i++) {
                const diff = differenceInDays(lastDate, uniqueDays[i]);
                if (diff === 1) {
                    currentStreak++;
                    lastDate = uniqueDays[i];
                } else {
                    break;
                }
            }
        }
    }

    // Wellness Score Calculation
    let score = 50; // Start with a baseline
    if (moodLogs) {
        const recentMoodLogs = moodLogs.filter(log => log.timestamp && differenceInDays(new Date(), log.timestamp.toDate()) <= 7);
        if (recentMoodLogs.length > 0) {
            const avgMood = recentMoodLogs.reduce((acc, log) => acc + log.rating, 0) / recentMoodLogs.length;
            score += (avgMood - 5) * 4; // Add/subtract points based on mood rating (scale 1-10)
        }
    }
     if (habitLogs) {
        const recentHabitLogs = habitLogs.filter(log => log.timestamp && differenceInDays(new Date(), log.timestamp.toDate()) <= 7);
        score += recentHabitLogs.length * 2; // Add points for each habit logged in the last week
     }


    return { 
        streak: currentStreak,
        wellnessScore: Math.max(0, Math.min(100, Math.round(score))) // Clamp between 0 and 100
    };

  }, [habitLogs, moodLogs]);
  
  const isLoading = gamificationLoading || habitLogsLoading || moodLogsLoading;

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
                    <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-1/2 h-8 mb-2" />
                    <Skeleton className="w-1/3 h-4" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <Flame className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-1/2 h-8 mb-2" />
                    <Skeleton className="w-1/3 h-4" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Star className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-1/2 h-8 mb-2" />
                    <Skeleton className="w-1/3 h-4" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
          <Target className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wellnessScore}/100</div>
          <p className="text-xs text-muted-foreground">Based on recent activity & mood</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak} Days</div>
          <p className="text-xs text-muted-foreground">You're on a roll!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Star className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {gamificationData?.points?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">Level {gamificationData?.level || 1}</p>
        </CardContent>
      </Card>
    </div>
  );
}
