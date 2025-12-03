'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { MoodLog } from '@/lib/types';
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

export function MoodHeatmap({ data }: { data: MoodLog[] }) {

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
        {months.map((monthDate) => (
          <div key={monthDate.toString()} className="flex flex-col items-center">
            <div className="mb-2 text-sm font-medium">{format(monthDate, 'MMM')}</div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {getMonthData(monthDate).map((day, index) => {
                if (!day) return <div key={index} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
                
                const log = data.find(d => isSameDay(d.date, day));
                
                let colorClass = 'bg-muted/50';
                if (log) {
                    if (log.rating > 8) colorClass = 'bg-primary';
                    else if (log.rating > 6) colorClass = 'bg-primary/75';
                    else if (log.rating > 4) colorClass = 'bg-chart-2';
                    else if (log.rating > 2) colorClass = 'bg-chart-4';
                    else colorClass = 'bg-destructive/75';
                }

                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <div className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm', colorClass)} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{log ? `${log.mood} (${log.rating}/10)` : 'No data'} on {format(day, 'MMM d, yyyy')}</p>
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
