'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, HeartPulse, Brain, User, Trash2 } from "lucide-react";
import type { Goal } from "@/lib/types";
import { Button } from "../ui/button";
import { EditGoalDialog } from "./edit-goal-dialog";
import { Slider } from "../ui/slider";

const categoryIcons: Record<Goal['category'], React.ElementType> = {
    Academic: Book,
    Fitness: HeartPulse,
    'Mental Health': Brain,
    Personal: User
};

type GoalListProps = {
    goals: Goal[], 
    onDeleteGoal: (goalId: string) => void,
    onUpdateGoal: (goal: Goal) => void;
    onUpdateProgress: (goalId: string, progress: number) => void;
}

export function GoalList({ goals, onDeleteGoal, onUpdateGoal, onUpdateProgress }: GoalListProps) {
    const goalsByCategory = goals.reduce((acc, goal) => {
        (acc[goal.category] = acc[goal.category] || []).push(goal);
        return acc;
    }, {} as Record<Goal['category'], Goal[]>);

    if (goals.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-center border-2 border-dashed rounded-lg bg-muted/50">
                <div >
                    <p className="text-lg font-semibold">No goals yet!</p>
                    <p className="text-muted-foreground">Click "New Goal" to get started.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(goalsByCategory).map(([category, categoryGoals]) => {
                const Icon = categoryIcons[category as Goal['category']];
                return (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-primary" />
                                {category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {categoryGoals.map((goal) => (
                                <div key={goal.id}>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{goal.title}</span>
                                        <EditGoalDialog goal={goal} onUpdateGoal={onUpdateGoal} onDeleteGoal={onDeleteGoal} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <Slider
                                            value={[goal.progress]}
                                            onValueChange={([value]) => onUpdateProgress(goal.id, value)}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                            aria-label={`${goal.title} progress slider`}
                                        />
                                        <span className="text-sm font-semibold w-12 text-right">{goal.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}
