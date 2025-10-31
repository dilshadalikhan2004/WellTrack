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

export function ActiveGoals({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Active Goals</CardTitle>
        <CardDescription>Your progress towards a better you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockGoals.map((goal) => (
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
