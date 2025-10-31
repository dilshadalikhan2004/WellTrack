'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { TodaysHabits } from '@/components/dashboard/todays-habits';
import { WeeklyMoodChart } from '@/components/dashboard/weekly-mood-chart';
import { ActiveGoals } from '@/components/dashboard/active-goals';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function DashboardPage() {
  const { user } = useUser();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <WelcomeHeader userName={userName} />
        <QuickStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <TodaysHabits className="lg:col-span-4" />
          <WeeklyMoodChart className="lg:col-span-3" />
          <ActiveGoals className="lg:col-span-3" />
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Your personalized wellness report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center border-2 border-dashed rounded-lg bg-accent/50">
                <Sparkles className="w-10 h-10 mx-auto mb-2 text-accent-foreground/50" />
                <p className="mb-4 text-sm text-muted-foreground">
                  Discover patterns and get recommendations to boost your
                  well-being.
                </p>
                <Button asChild>
                  <Link href="/insights">Generate My Report</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Latest Achievement</CardTitle>
              <CardDescription>Keep up the great work!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="p-4 mb-2 rounded-full bg-accent">
                <Sparkles className="w-12 h-12 text-accent-foreground" />
              </div>
              <p className="mb-1 font-semibold">Hydration Hero</p>
              <p className="text-sm text-muted-foreground">
                Perfect water intake for a week.
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/awards">View All Awards</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
