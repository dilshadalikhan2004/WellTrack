'use client';

import { AwardGrid } from "@/components/awards/award-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBadges } from "@/lib/data";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Gamification } from "@/lib/types";

export default function AwardsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const gamificationDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, `users/${user.uid}/gamification`, user.uid);
    }, [firestore, user]);

    const { data: gamificationData, isLoading } = useDoc<Gamification>(gamificationDocRef);
    
    const earnedBadges = gamificationData?.badges?.length || 0;
    const totalBadges = mockBadges.length;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
        <h1 className="text-xl font-semibold">Achievements</h1>
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Your Badge Collection</CardTitle>
                <CardDescription>
                    You've earned {earnedBadges} out of {totalBadges} badges. Keep it up!
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <p>Loading badges...</p> : <AwardGrid gamificationData={gamificationData} />}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
