'use client';

import { GoalList } from "@/components/goals/goal-list";
import { NewGoalDialog } from "@/components/goals/new-goal-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockGoals } from "@/lib/data";
import type { Goal } from "@/lib/types";
import { Target } from "lucide-react";
import { useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);

  const addGoal = (newGoal: Omit<Goal, 'id' | 'progress'>) => {
    setGoals(prevGoals => [
        ...prevGoals,
        {
            ...newGoal,
            id: `goal-${Date.now()}`,
            progress: 0,
        }
    ]);
  }

  const deleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  }

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prevGoals => prevGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prevGoals => 
        prevGoals.map(goal => 
            goal.id === goalId ? { ...goal, progress } : goal
        )
    );
  };

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-semibold">Goal Center</h1>
        <NewGoalDialog onAddGoal={addGoal} />
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Overall Goal Completion
            </CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-3xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} aria-label="Overall goal progress" />
          </CardContent>
        </Card>

        <GoalList 
          goals={goals} 
          onDeleteGoal={deleteGoal} 
          onUpdateGoal={updateGoal}
          onUpdateProgress={updateGoalProgress} 
        />
      </div>
    </div>
  );
}
