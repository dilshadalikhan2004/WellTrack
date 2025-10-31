'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';
import { mockMoodLogs } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

const last7DaysData = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(new Date(), i);
  const log = mockMoodLogs.find(
    (log) => format(log.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
  return {
    name: format(date, 'EEE'),
    mood: log ? log.rating : 0,
  };
}).reverse();

export function WeeklyMoodChart({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Weekly Mood</CardTitle>
        <CardDescription>Your mood ratings over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
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
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
