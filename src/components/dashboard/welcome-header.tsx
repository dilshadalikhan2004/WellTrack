'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { moodOptions } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { MoodOption } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export function WelcomeHeader({ userName }: { userName: string }) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);

    if (user && firestore) {
      const moodLogCollection = collection(firestore, `users/${user.uid}/mood_logs`);
      addDocumentNonBlocking(moodLogCollection, {
        mood: mood.label,
        rating: mood.rating,
        timestamp: serverTimestamp(),
        userProfileId: user.uid,
      });
    }

    toast({
      title: 'Mood Logged!',
      description: `You've logged your mood as: ${mood.label} ${mood.emoji}`,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              Good Morning, {userName}!
            </h2>
            <p className="text-muted-foreground">
              How are you feeling today?
            </p>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-full bg-background">
            {moodOptions.map((mood) => (
              <Button
                key={mood.label}
                variant="ghost"
                size="icon"
                className={cn(
                  'rounded-full w-12 h-12 text-2xl transition-transform transform hover:scale-125 focus:scale-125',
                  selectedMood?.label === mood.label
                    ? 'bg-accent border-2 border-primary/50 scale-125'
                    : ''
                )}
                onClick={() => handleMoodSelect(mood)}
                aria-label={`Select mood: ${mood.label}`}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
