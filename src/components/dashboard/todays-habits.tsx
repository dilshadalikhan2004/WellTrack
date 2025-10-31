'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { mockHabits } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Habit } from '@/lib/types';
import { useState } from 'react';

export function TodaysHabits({ className }: { className?: string }) {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);

  const handleCheckChange = (habitId: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>
          Check off your habits as you complete them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center p-3 transition-colors rounded-lg bg-muted/50 hover:bg-muted"
            >
              <habit.icon
                className="w-6 h-6 mr-4 text-primary"
                aria-hidden="true"
              />
              <div className="flex-1">
                <p
                  className={cn(
                    'font-medium',
                    habit.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {habit.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Goal: {habit.goal} {habit.unit}
                </p>
              </div>
              <Checkbox
                id={`habit-${habit.id}`}
                checked={habit.completed}
                onCheckedChange={() => handleCheckChange(habit.id)}
                className="w-6 h-6"
                aria-label={`Mark ${habit.name} as ${
                  habit.completed ? 'incomplete' : 'complete'
                }`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
