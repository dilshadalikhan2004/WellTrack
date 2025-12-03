import { Activity } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg text-primary">
      <div className="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center rounded-full font-bold text-lg">
        D
      </div>
      <span className="font-headline">WellTrack</span>
    </div>
  );
}
