'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, HeartPulse, Brain, User } from "lucide-react";
import type { Goal } from "@/lib/types";
import { EditGoalDialog } from "./edit-goal-dialog";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

const categoryIcons: Record<Goal['category'], React.ElementType> = {
    Academic: Book,
    Fitness: HeartPulse,
    'Mental Health': Brain,
    Personal: User
};

type GoalListProps = {
    goals: Goal[];
    onDeleteGoal: (goalId: string) => void;
    onUpdateGoal: (goal: Goal) => void;
    onToggleSubTask: (goalId: string, subTaskId: string) => void;
}

export function GoalList({ goals, onDeleteGoal, onUpdateGoal, onToggleSubTask }: GoalListProps) {
    const goalsByCategory = goals.reduce((acc, goal) => {
        (acc[goal.category] = acc[goal.category] || []).push(goal);
        return acc;
    }, {} as Record<Goal['category'], Goal[]>);

    if (goals.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-center border-2 border-dashed rounded-lg bg-muted/50">
                <div>
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
                        <CardContent className="space-y-6">
                            {categoryGoals.map((goal) => (
                                <div key={goal.id}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="font-medium">{goal.title}</span>
                                            {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                                        </div>
                                        <EditGoalDialog goal={goal} onUpdateGoal={onUpdateGoal} onDeleteGoal={onDeleteGoal} />
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                       <Progress value={goal.progress} className="w-full" />
                                        <span className="text-sm font-semibold w-12 text-right">{goal.progress}%</span>
                                    </div>
                                    {goal.subTasks.length > 0 && (
                                        <div className="pl-2 mt-3 space-y-2 border-l-2">
                                            {goal.subTasks.map(subTask => (
                                                <div key={subTask.id} className="flex items-center gap-3">
                                                    <Checkbox 
                                                        id={subTask.id}
                                                        checked={subTask.completed}
                                                        onCheckedChange={() => onToggleSubTask(goal.id, subTask.id)}
                                                    />
                                                    <label htmlFor={subTask.id} className={cn("text-sm", subTask.completed && "line-through text-muted-foreground")}>
                                                        {subTask.text}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}
