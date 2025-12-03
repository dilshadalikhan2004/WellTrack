'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Habit, HabitLog } from '@/lib/types';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, where, query, getDocs } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { isToday } from 'date-fns';
import { useEffect, useState } from 'react';

export function TodaysHabits({ className }: { className?: string }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const habitsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/habits`);
  }, [firestore, user]);
  
  const { data: habits, isLoading: habitsLoading } = useCollection<Habit>(habitsCollectionRef);

  const habitLogsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/habit_logs`);
  }, [firestore, user]);

  const { data: habitLogs, isLoading: logsLoading } = useCollection<HabitLog>(habitLogsCollectionRef);

  const [todaysHabitStatus, setTodaysHabitStatus] = useState<Record<string, { completed: boolean, logId?: string }>>({});

  useEffect(() => {
    if (habits && habitLogs) {
      const newStatus: Record<string, { completed: boolean, logId?: string }> = {};

      const todaysLogs = habitLogs.filter(log => log.timestamp && isToday(log.timestamp.toDate()));
      
      habits.forEach(habit => {
        const logForHabit = todaysLogs.find(log => log.habitId === habit.id);
        newStatus[habit.id] = {
          completed: !!logForHabit,
          logId: logForHabit?.id,
        };
      });
      setTodaysHabitStatus(newStatus);
    }
  }, [habits, habitLogs]);


  const handleCheckChange = async (habitId: string) => {
    if (!habitLogsCollectionRef || !firestore || !user) return;
    
    const habitInfo = todaysHabitStatus[habitId];
    
    if (habitInfo?.completed && habitInfo.logId) {
      // It's completed, so we need to "un-complete" it by deleting the log
      const docRef = doc(firestore, `users/${user.uid}/habit_logs`, habitInfo.logId);
      await deleteDocumentNonBlocking(docRef);
    } else {
      // It's not completed, so we need to add a log entry
      await addDocumentNonBlocking(habitLogsCollectionRef, {
        habitId: habitId,
        timestamp: serverTimestamp(),
        userProfileId: user.uid,
      });
    }
  };

  const isLoading = habitsLoading || logsLoading;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>
          Check off your habits as you complete them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading habits...</p> : (
            <div className="space-y-4">
            {habits && habits.map((habit) => (
                <div
                key={habit.id}
                className="flex items-center p-3 transition-colors rounded-lg bg-muted/50 hover:bg-muted"
                >
                <div className="flex-1">
                    <p
                    className={cn(
                        'font-medium',
                        todaysHabitStatus[habit.id]?.completed && 'line-through text-muted-foreground'
                    )}
                    >
                    {habit.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                    Goal: {habit.goal}
                    </p>
                </div>
                <Checkbox
                    id={`habit-${habit.id}`}
                    checked={todaysHabitStatus[habit.id]?.completed || false}
                    onCheckedChange={() => handleCheckChange(habit.id)}
                    className="w-6 h-6"
                    aria-label={`Mark ${habit.name} as ${
                        todaysHabitStatus[habit.id]?.completed ? 'incomplete' : 'complete'
                    }`}
                />
                </div>
            ))}
             {(!habits || habits.length === 0) && <p className='text-sm text-center text-muted-foreground'>No habits defined yet. Go to the Habits page to add one!</p>}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
