
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, PlusCircle } from "lucide-react";
import { mockSafetyPlan } from "@/lib/data";

export function CopingStrategies() {
    // In a real app, this would use state and connect to a database
    const strategies = mockSafetyPlan.copingStrategies;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6" /> My Coping Strategies
                    </CardTitle>
                    <CardDescription>
                        Things I can do to help myself when feeling overwhelmed.
                    </CardDescription>
                </div>
                 <Button size="sm" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Strategy
                </Button>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 list-disc list-inside">
                    {strategies.map(strategy => (
                        <li key={strategy.id} className="p-3 rounded-md bg-muted/50">
                           {strategy.text}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
