
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ShieldAlert } from 'lucide-react';

const anxietyLevels = [
    { level: 1, emoji: '😌', label: 'Calm' },
    { level: 2, emoji: '🙂', label: 'Slightly Concerned' },
    { level: 3, emoji: '😐', label: 'Worried' },
    { level: 4, emoji: '😟', label: 'Anxious' },
    { level: 5, emoji: '😫', label: 'Overwhelmed' },
];

export function FinancialAnxietyMonitor() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);

    if (user && firestore) {
      const anxietyLogCollection = collection(firestore, `users/${user.uid}/financial_anxiety_logs`);
      addDocumentNonBlocking(anxietyLogCollection, {
        level: level,
        timestamp: serverTimestamp(),
        userProfileId: user.uid,
      });
    }

    toast({
      title: 'Financial Anxiety Logged',
      description: `You've logged your feeling as: ${anxietyLevels.find(l => l.level === level)?.label}`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Financial Anxiety</CardTitle>
        <ShieldAlert className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground">How are you feeling about your finances right now?</p>
        <div className="flex items-center justify-around gap-1">
          {anxietyLevels.map((item) => (
            <Button
              key={item.level}
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-full w-10 h-10 text-xl transition-transform transform hover:scale-110',
                selectedLevel === item.level ? 'bg-accent border-2 border-primary/50 scale-110' : ''
              )}
              onClick={() => handleLevelSelect(item.level)}
              aria-label={`Select anxiety level: ${item.label}`}
            >
              {item.emoji}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

    