import { Leaf } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg text-primary">
      <Leaf className="w-7 h-7" />
      <span className="font-headline">WellTrack</span>
    </div>
  );
}
