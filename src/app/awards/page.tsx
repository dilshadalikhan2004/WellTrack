import { AwardGrid } from "@/components/awards/award-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBadges, mockUser } from "@/lib/data";

export default function AwardsPage() {
    const earnedBadges = mockBadges.filter(b => b.isEarned).length;
    const totalBadges = mockBadges.length;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
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
                <AwardGrid />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
