import { Card, CardContent } from "@/components/ui/card";
import { mockBadges } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AwardGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {mockBadges.map((badge) => (
        <Card
          key={badge.id}
          className={cn(
            'flex flex-col items-center justify-center p-6 text-center transition-all',
            badge.isEarned
              ? 'border-primary/50 bg-accent'
              : 'bg-muted/50 opacity-60'
          )}
        >
          <div
            className={cn(
              'p-4 rounded-full mb-3',
              badge.isEarned ? 'bg-primary/20' : 'bg-muted'
            )}
          >
            <badge.icon
              className={cn(
                'w-10 h-10',
                badge.isEarned ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <p className="font-semibold">{badge.name}</p>
          <p className="text-sm text-muted-foreground">
            {badge.description}
          </p>
        </Card>
      ))}
    </div>
  );
}
