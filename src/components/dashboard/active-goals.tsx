'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import type { Goal } from '@/lib/types';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

const calculateProgress = (subTasks: Goal['subTasks']): number => {
    if (!subTasks || subTasks.length === 0) return 0;
    const completed = subTasks.filter(st => st.completed).length;
    return Math.round((completed / subTasks.length) * 100);
};

export function ActiveGoals({ className }: { className?: string }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);
  
  const { data: goals = [], isLoading } = useCollection<Omit<Goal, 'id'| 'progress'>>(goalsCollectionRef);

  const goalsWithProgress = useMemo(() => {
    return (goals || []).map(goal => ({
      ...goal,
      progress: calculateProgress(goal.subTasks)
    })).slice(0, 3); // show latest 3 goals
  }, [goals]);
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Active Goals</CardTitle>
        <CardDescription>Your progress towards a better you.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading goals...</p> : (
          <div className="space-y-6">
            {goalsWithProgress.map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <Badge variant="secondary" className="capitalize">
                    {goal.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={goal.progress} aria-label={`${goal.title} progress`} />
                  <span className="text-sm font-semibold">{goal.progress}%</span>
                </div>
              </div>
            ))}
            {goalsWithProgress.length === 0 && <p className='text-sm text-muted-foreground text-center'>No active goals yet. Go to the Goals page to add one!</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
