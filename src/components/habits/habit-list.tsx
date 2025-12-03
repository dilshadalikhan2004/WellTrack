'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Habit } from "@/lib/types";
import { EditHabitDialog } from "./edit-habit-dialog";
import { Book, Brain, Dumbbell } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type HabitListProps = {
    habits: Habit[] | null;
    onUpdateHabit: (habit: Habit) => void;
    onDeleteHabit: (habitId: string) => void;
}

const categoryIcons: Record<Habit['category'], React.ElementType> = {
    Physical: Dumbbell,
    Mental: Brain,
    Academic: Book,
};


export function HabitList({ habits, onUpdateHabit, onDeleteHabit }: HabitListProps) {
    if (!habits) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Your Habits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (habits.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Habits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-40 text-center border-2 border-dashed rounded-lg bg-muted/50">
                        <div>
                            <p className="text-lg font-semibold">No habits yet!</p>
                            <p className="text-muted-foreground">Click "New Habit" to get started.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Habits</CardTitle>
                <CardDescription>Manage your daily and weekly habits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {habits.map((habit) => {
                    const Icon = categoryIcons[habit.category];
                    return (
                        <div key={habit.id} className="flex items-center p-4 border rounded-lg bg-background">
                            <Icon className="w-6 h-6 mr-4 text-primary" />
                            <div className="flex-1">
                                <p className="font-semibold">{habit.name}</p>
                                <p className="text-sm text-muted-foreground">Goal: {habit.goal}</p>
                            </div>
                            <EditHabitDialog habit={habit} onUpdateHabit={onUpdateHabit} onDeleteHabit={onDeleteHabit} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    )
}
