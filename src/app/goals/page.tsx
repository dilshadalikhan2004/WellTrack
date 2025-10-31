'use client';

import { GoalList } from "@/components/goals/goal-list";
import { NewGoalDialog } from "@/components/goals/new-goal-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockGoals } from "@/lib/data";
import type { Goal, SubTask } from "@/lib/types";
import { Target } from "lucide-react";
import { useState, useEffect } from "react";

const calculateProgress = (subTasks: SubTask[]): number => {
  if (subTasks.length === 0) return 0;
  const completed = subTasks.filter(st => st.completed).length;
  return Math.round((completed / subTasks.length) * 100);
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals.map(g => ({...g, progress: calculateProgress(g.subTasks)})));

  useEffect(() => {
    // Recalculate all progress when goals change
    setGoals(currentGoals => currentGoals.map(g => ({
        ...g,
        progress: calculateProgress(g.subTasks)
    })))
  }, []);

  const addGoal = (newGoal: Omit<Goal, 'id' | 'progress'>) => {
    const goalWithProgress = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      progress: calculateProgress(newGoal.subTasks),
    };
    setGoals(prevGoals => [...prevGoals, goalWithProgress]);
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };

  const updateGoal = (updatedGoal: Goal) => {
    const goalWithProgress = {
      ...updatedGoal,
      progress: calculateProgress(updatedGoal.subTasks),
    };
    setGoals(prevGoals => 
      prevGoals.map(goal => goal.id === goalWithProgress.id ? goalWithProgress : goal)
    );
  };
  
  const toggleSubTask = (goalId: string, subTaskId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newSubTasks = goal.subTasks.map(st =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...goal, subTasks: newSubTasks, progress: calculateProgress(newSubTasks) };
        }
        return goal;
      })
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
          onToggleSubTask={toggleSubTask}
        />
      </div>
    </div>
  );
}
