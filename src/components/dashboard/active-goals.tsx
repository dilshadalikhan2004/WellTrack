import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockGoals } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import type { SubTask } from '@/lib/types';

const calculateProgress = (subTasks: SubTask[]): number => {
    if (!subTasks || subTasks.length === 0) return 0;
    const completed = subTasks.filter(st => st.completed).length;
    return Math.round((completed / subTasks.length) * 100);
};

export function ActiveGoals({ className }: { className?: string }) {
  const goalsWithProgress = mockGoals.map(goal => ({
    ...goal,
    progress: calculateProgress(goal.subTasks)
  }));
  
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Active Goals</CardTitle>
        <CardDescription>Your progress towards a better you.</CardDescription>
      </CardHeader>
      <CardContent>
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
        </div>
      </CardContent>
    </Card>
  );
}
