import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockGoals } from "@/lib/data";
import { Book, HeartPulse, Brain, User } from "lucide-react";
import type { Goal } from "@/lib/types";

const categoryIcons: Record<Goal['category'], React.ElementType> = {
    Academic: Book,
    Fitness: HeartPulse,
    'Mental Health': Brain,
    Personal: User
};

const goalsByCategory = mockGoals.reduce((acc, goal) => {
    (acc[goal.category] = acc[goal.category] || []).push(goal);
    return acc;
}, {} as Record<Goal['category'], Goal[]>);

export function GoalList() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(goalsByCategory).map(([category, goals]) => {
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
                            {goals.map((goal) => (
                                <div key={goal.id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{goal.title}</span>
                                        <span className="text-sm font-semibold">{goal.progress}%</span>
                                    </div>
                                    <Progress value={goal.progress} aria-label={`${goal.title} progress`} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}
