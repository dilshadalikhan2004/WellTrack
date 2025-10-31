'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { eachDayOfInterval, format, startOfMonth, endOfMonth, getDay, isSameDay } from 'date-fns';

const habitData = Array.from({ length: 120 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date,
    count: Math.floor(Math.random() * 6), // 0-5 habits completed
  };
});

const getMonthData = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  const firstDayOfMonth = getDay(start);

  const monthData = Array(firstDayOfMonth).fill(null).concat(days);
  return monthData;
};

const months = Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d;
  }).reverse();

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HabitHeatmap() {
  return (
    <TooltipProvider>
      <div className="flex gap-4 overflow-x-auto">
        <div className="flex flex-col text-xs text-muted-foreground gap-1 pt-6">
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
                if (!day) return <div key={index} className="w-4 h-4" />;
                
                const data = habitData.find(d => isSameDay(d.date, day));
                const count = data ? data.count : 0;
                
                let colorClass = 'bg-muted/50';
                if (count > 0) colorClass = 'bg-primary/20';
                if (count > 1) colorClass = 'bg-primary/40';
                if (count > 2) colorClass = 'bg-primary/60';
                if (count > 3) colorClass = 'bg-primary/80';
                if (count > 4) colorClass = 'bg-primary';

                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <div className={cn('w-4 h-4 rounded-sm', colorClass)} />
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
