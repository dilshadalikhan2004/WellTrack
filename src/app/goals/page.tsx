'use client';

import { GoalList } from "@/components/goals/goal-list";
import { NewGoalDialog } from "@/components/goals/new-goal-dialog";
import { mockGoals } from "@/lib/data";
import type { Goal } from "@/lib/types";
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-semibold">Goal Center</h1>
        <NewGoalDialog onAddGoal={addGoal} />
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <GoalList goals={goals} />
      </div>
    </div>
  );
}
