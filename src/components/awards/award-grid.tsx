'use client';

import { Card } from "@/components/ui/card";
import { mockBadges } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Gamification } from "@/lib/types";

type AwardGridProps = {
    gamificationData?: Gamification | null;
}

export function AwardGrid({ gamificationData }: AwardGridProps) {
  const earnedBadges = gamificationData?.badges || [];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {mockBadges.map((badge) => {
        const isEarned = earnedBadges.includes(badge.id);
        return (
          <Card
            key={badge.id}
            className={cn(
              'flex flex-col items-center justify-center p-6 text-center transition-all',
              isEarned
                ? 'border-primary/50 bg-accent'
                : 'bg-muted/50 opacity-60'
            )}
          >
            <div
              className={cn(
                'p-4 rounded-full mb-3',
                isEarned ? 'bg-primary/20' : 'bg-muted'
              )}
            >
              <badge.icon
                className={cn(
                  'w-10 h-10',
                  isEarned ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            </div>
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm text-muted-foreground">
              {badge.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
