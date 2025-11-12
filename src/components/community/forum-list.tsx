
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockForums } from "@/lib/data";
import { ArrowRight, GraduationCap, ShieldQuestion, Brain } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { CommunityForumDoc } from "@/lib/types";

const iconMap = {
    ShieldQuestion: ShieldQuestion,
    GraduationCap: GraduationCap,
    Brain: Brain,
};

export function ForumList() {
    const firestore = useFirestore();
    const forumsCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, `community_forums`);
    }, [firestore]);

    const { data: forums, isLoading } = useCollection<CommunityForumDoc>(forumsCollectionRef);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Forums</CardTitle>
                <CardDescription>Browse discussion topics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && <p>Loading forums...</p>}
                {forums && forums.map(forum => {
                    const Icon = iconMap[forum.iconName as keyof typeof iconMap] || Brain;
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
                 {forums && forums.length === 0 && <p className="text-sm text-center text-muted-foreground">No forums available.</p>}
            </CardContent>
        </Card>
    );
}
