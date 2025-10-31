
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartTooltipContent, ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { format, subDays, isSameDay } from 'date-fns';
import type { MoodLog } from '@/lib/types';

const chartConfig = {
  rating: {
    label: 'Rating',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MoodTrendChart({ data }: { data: MoodLog[] }) {

  const last30DaysData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const logsOnDate = data.filter((log) => isSameDay(log.date, date));
    const avgRating = logsOnDate.length > 0
      ? logsOnDate.reduce((sum, log) => sum + log.rating, 0) / logsOnDate.length
      : null;

    return {
      date: format(date, 'MMM d'),
      rating: avgRating,
    };
  }).reverse();

  return (
    <div className="w-full h-[400px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={last30DaysData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
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
            />
            <Tooltip
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
