'use client';

import { GoalList } from "@/components/goals/goal-list";
import { NewGoalDialog } from "@/components/goals/new-goal-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@/lib/types";
import { Target } from "lucide-react";
import { useMemo } from "react";
import { useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, type Firestore } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const calculateProgress = (subTasks: Goal['subTasks']): number => {
  if (!subTasks || subTasks.length === 0) return 0;
  const completed = subTasks.filter(st => st.completed).length;
  return Math.round((completed / subTasks.length) * 100);
};

export default function GoalsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);

  const { data: goals = [], isLoading } = useCollection<Omit<Goal, 'id' | 'progress'>>(goalsCollectionRef);

  const goalsWithProgress = useMemo(() => {
    return (goals || []).map(g => ({
      ...g,
      progress: calculateProgress(g.subTasks),
    }));
  }, [goals]);

  const addGoal = async (newGoal: Omit<Goal, 'id' | 'progress'>) => {
    if (!goalsCollectionRef) return;
    addDocumentNonBlocking(goalsCollectionRef, newGoal);
  };

  const deleteGoal = async (goalId: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/goals`, goalId);
    deleteDocumentNonBlocking(docRef);
  };

  const updateGoal = async (updatedGoal: Goal) => {
    if (!firestore || !user) return;
    const { id, ...goalData } = updatedGoal;
    const docRef = doc(firestore, `users/${user.uid}/goals`, id);
    // Omit progress from being saved as it's calculated
    const { progress, ...rest } = goalData;
    updateDocumentNonBlocking(docRef, rest);
  };

  const toggleSubTask = (goalId: string, subTaskId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !firestore || !user) return;

    const newSubTasks = goal.subTasks.map(st =>
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );

    const docRef = doc(firestore, `users/${user.uid}/goals`, goalId);
    updateDocumentNonBlocking(docRef, { subTasks: newSubTasks });
  };

  const overallProgress = useMemo(() => {
    if (goalsWithProgress.length === 0) return 0;
    const totalProgress = goalsWithProgress.reduce((acc, goal) => acc + goal.progress, 0);
    return Math.round(totalProgress / goalsWithProgress.length);
  }, [goalsWithProgress]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 hidden md:flex">
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

        {isLoading ? (
          <p>Loading goals...</p>
        ) : (
          <GoalList
            goals={goalsWithProgress}
            onDeleteGoal={deleteGoal}
            onUpdateGoal={updateGoal}
            onToggleSubTask={toggleSubTask}
          />
        )}
      </div>
    </div>
  );
}
