import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Flame, Star, Target } from 'lucide-react';
import { mockUser } from '@/lib/data';

export function QuickStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
          <Target className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">88/100</div>
          <p className="text-xs text-muted-foreground">+5 from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockUser.gamification.streak} Days</div>
          <p className="text-xs text-muted-foreground">You're on a roll!</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Star className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mockUser.gamification.points.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Level {mockUser.gamification.level}</p>
        </CardContent>
      </Card>
    </div>
  );
}
