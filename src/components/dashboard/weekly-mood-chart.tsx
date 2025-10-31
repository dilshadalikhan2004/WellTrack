'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartTooltipContent, ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { format, subDays, isSameDay } from 'date-fns';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, type Timestamp } from 'firebase/firestore';
import type { MoodLogData } from '@/app/mood/page';
import { useMemo } from 'react';

const chartConfig = {
  mood: {
    label: 'Mood',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function WeeklyMoodChart({ className }: { className?: string }) {
    const { user } = useUser();
    const firestore = useFirestore();

    const moodLogsCollectionRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/mood_logs`);
    }, [user, firestore]);

    const { data: moodLogs, isLoading } = useCollection<MoodLogData>(moodLogsCollectionRef);

    const last7DaysData = useMemo(() => {
        const logs = moodLogs || [];
        return Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), i);
            const logsOnDate = logs.filter(
                (log) => log.timestamp && isSameDay(log.timestamp.toDate(), date)
            );
            const avgRating = logsOnDate.length > 0
                ? logsOnDate.reduce((sum, log) => sum + log.rating, 0) / logsOnDate.length
                : 0;

            return {
                name: format(date, 'EEE'),
                mood: avgRating,
            };
        }).reverse();
    }, [moodLogs]);


  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Weekly Mood</CardTitle>
        <CardDescription>Your mood ratings over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading mood data...</p> : (
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 10]}
                tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                dataKey="mood"
                fill="var(--color-mood)"
                radius={[4, 4, 0, 0]}
                />
            </BarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
