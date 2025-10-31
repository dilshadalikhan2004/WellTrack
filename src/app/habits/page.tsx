import { HabitHeatmap } from '@/components/habits/habit-heatmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target } from 'lucide-react';

export default function HabitsPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-semibold">Habit Tracking</h1>
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Current Streak
              </CardTitle>
              <Flame className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14 Days</div>
              <p className="text-xs text-muted-foreground">
                +2 days since last week
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
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">
                +5% since last month
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Habit Consistency</CardTitle>
            <CardDescription>
              Your habit completion over the last few months. Darker shades mean more habits completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HabitHeatmap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
