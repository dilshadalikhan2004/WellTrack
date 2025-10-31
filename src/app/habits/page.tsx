'use client';

import { HabitHeatmap } from '@/components/habits/habit-heatmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Habit, HabitLog } from '@/lib/types';
import { useMemo } from 'react';
import { differenceInDays, isToday, startOfDay } from 'date-fns';
import { HabitList } from '@/components/habits/habit-list';
import { NewHabitDialog } from '@/components/habits/new-habit-dialog';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function HabitsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const habitsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/habits`);
  }, [firestore, user]);

  const { data: habits = [], isLoading: habitsLoading } = useCollection<Habit>(habitsCollectionRef);

  const habitLogsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/habit_logs`);
  }, [firestore, user]);

  const { data: habitLogs = [], isLoading: logsLoading } = useCollection<HabitLog>(habitLogsCollectionRef);

  const { streak, completionRate } = useMemo(() => {
    if (!habitLogs || habitLogs.length === 0) {
      return { streak: 0, completionRate: 0 };
    }

    const sortedLogs = habitLogs.map(l => l.timestamp.toDate()).sort((a, b) => b.getTime() - a.getTime());
    const uniqueDays = [...new Set(sortedLogs.map(d => startOfDay(d).toISOString()))].map(iso => new Date(iso));
    
    let currentStreak = 0;
    if (uniqueDays.length > 0) {
        let lastDate = new Date();
        if (isToday(uniqueDays[0])) {
            currentStreak = 1;
            lastDate = uniqueDays[0];
        } else if (differenceInDays(new Date(), uniqueDays[0]) === 1) {
            currentStreak = 1;
            lastDate = uniqueDays[0];
        } else {
            return { streak: 0, completionRate: 0};
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

    const totalDaysWithLogs = uniqueDays.length;
    if(totalDaysWithLogs === 0) return { streak: currentStreak, completionRate: 0};
    const firstDay = uniqueDays[uniqueDays.length - 1];
    const totalDaysTracked = differenceInDays(new Date(), firstDay) + 1;
    const rate = totalDaysTracked > 0 ? (totalDaysWithLogs / totalDaysTracked) * 100 : 0;

    return { streak: currentStreak, completionRate: Math.round(rate) };
  }, [habitLogs]);

  const addHabit = async (newHabit: Omit<Habit, 'id'>) => {
    if (!habitsCollectionRef) return;
    addDocumentNonBlocking(habitsCollectionRef, newHabit);
  };

  const deleteHabit = async (habitId: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/habits`, habitId);
    deleteDocumentNonBlocking(docRef);
  };

  const updateHabit = async (updatedHabit: Habit) => {
    if (!firestore || !user) return;
    const { id, ...habitData } = updatedHabit;
    const docRef = doc(firestore, `users/${user.uid}/habits`, id);
    updateDocumentNonBlocking(docRef, habitData);
  };

  const isLoading = habitsLoading || logsLoading;

  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-10 items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 hidden md:flex">
        <h1 className="text-xl font-semibold">Habit Tracking</h1>
        <NewHabitDialog onAddHabit={addHabit} />
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        {isLoading ? <p>Loading habit data...</p> : (
            <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Current Streak
                        </CardTitle>
                        <Flame className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{streak} Days</div>
                        <p className="text-xs text-muted-foreground">
                            Keep the fire burning!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Completion Rate
                        </CardTitle>
                        <Target className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Consistency over all time.
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            <HabitList
                habits={habits}
                onUpdateHabit={updateHabit}
                onDeleteHabit={deleteHabit}
              />

            <Card>
                <CardHeader>
                    <CardTitle>Habit Consistency</CardTitle>
                    <CardDescription>
                    Your habit completion over the last few months. Darker shades mean more habits completed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <HabitHeatmap habitLogs={habitLogs}/>
                </CardContent>
            </Card>
        </>
        )}
      </div>
    </div>
  );
}
