
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockForums } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export function ForumList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Forums</CardTitle>
                <CardDescription>Browse discussion topics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockForums.map(forum => {
                    const Icon = forum.icon;
                    return (
                        <div key={forum.id} className="p-4 transition-colors border rounded-lg hover:bg-accent/50">
                            <div className="flex items-start gap-4">
                                <Icon className="w-6 h-6 mt-1 text-primary" />
                                <div>
                                    <h4 className="font-semibold">{forum.name}</h4>
                                    <p className="text-sm text-muted-foreground">{forum.description}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="ml-auto shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
