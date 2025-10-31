'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { HabitLog } from '@/lib/types';
import { eachDayOfInterval, format, startOfMonth, endOfMonth, getDay, isSameDay, subMonths } from 'date-fns';

const getMonthData = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  const firstDayOfMonth = getDay(start);

  const monthData = Array(firstDayOfMonth).fill(null).concat(days);
  return monthData;
};

const months = Array.from({ length: 4 }, (_, i) => {
    return subMonths(new Date(), i);
}).reverse();

export function HabitHeatmap({ habitLogs }: { habitLogs: HabitLog[] | null }) {
  if (!habitLogs) {
    return null; // or a loading skeleton
  }
  
  const data = habitLogs.map(log => ({
    date: log.timestamp.toDate(),
    count: 1 // Represent each log as 1 completion
  }));

  const dailyCounts = data.reduce((acc, curr) => {
    const day = format(curr.date, 'yyyy-MM-dd');
    acc[day] = (acc[day] || 0) + curr.count;
    return acc;
  }, {} as Record<string, number>);


  return (
    <TooltipProvider>
      <div className="flex justify-center gap-4">
        <div className="flex-col text-xs text-muted-foreground gap-1 pt-6 hidden sm:flex">
            <div className="h-4"></div>
            <div className="h-4">Mon</div>
            <div className="h-4"></div>
            <div className="h-4">Wed</div>
            <div className="h-4"></div>
            <div className="h-4">Fri</div>
            <div className="h-4"></div>
        </div>
        {months.map((month) => (
          <div key={month.toString()} className="flex flex-col items-center">
            <div className="mb-2 text-sm font-medium">{format(month, 'MMM')}</div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {getMonthData(month).map((day, index) => {
                if (!day) return <div key={index} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
                
                const dayString = format(day, 'yyyy-MM-dd');
                const count = dailyCounts[dayString] || 0;
                
                let colorClass = 'bg-muted/50';
                if (count > 0) colorClass = 'bg-primary/20';
                if (count > 1) colorClass = 'bg-primary/40';
                if (count > 2) colorClass = 'bg-primary/60';
                if (count > 3) colorClass = 'bg-primary/80';
                if (count > 4) colorClass = 'bg-primary';

                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <div className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm', colorClass)} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{count} habits on {format(day, 'MMM d, yyyy')}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
