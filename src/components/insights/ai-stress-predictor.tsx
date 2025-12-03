
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { predictStressPeriod } from '@/ai/flows/provide-ai-stress-prediction';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { MoodLog, ScheduleItem } from '@/lib/types';

type PredictedPeriod = {
  date: string;
  reason: string;
}

export function AiStressPredictor() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictedPeriod[] | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const moodLogsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/mood_logs`);
  }, [user, firestore]);

  const scheduleCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/schedule`);
  }, [user, firestore]);

  const { data: moodLogs } = useCollection<MoodLog>(moodLogsCollectionRef);
  const { data: scheduleItems } = useCollection<ScheduleItem>(scheduleCollectionRef);

  const schedule = useMemo(() => {
    const assignments = scheduleItems?.filter(item => item.type === 'assignment' || item.type === 'exam').map(item => ({
      name: item.title,
      dueDate: new Date(item.date).toISOString()
    })) || [];
    
    const events = scheduleItems?.filter(item => item.type === 'event').map(item => ({
      name: item.title,
      date: new Date(item.date).toISOString()
    })) || [];
    
    return {
      assignments,
      events
    };
  }, [scheduleItems]);

  const pastStressPatterns = useMemo(() => {
    return moodLogs
      ?.filter(log => log.rating <= 4)
      .map(log => ({ 
        date: log.timestamp?.toDate().toISOString() || new Date().toISOString(), 
        rating: log.rating 
      }))
      .slice(0, 10) || [];
  }, [moodLogs]);

  const handleGenerate = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please log in to use this feature.',
      });
      return;
    }

    setIsLoading(true);
    setPredictions(null);
    try {
      const result = await predictStressPeriod({
        schedule: JSON.stringify(schedule),
        pastStressPatterns: JSON.stringify(pastStressPatterns),
      });
      setPredictions(JSON.parse(result.predictedStressPeriods));
    } catch (error) {
      console.error('Error predicting stress periods:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to predict stress periods. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="shadow-lg">
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 mr-2" />
          )}
          Predict High-Stress Periods
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
          <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary" />
          <p className="font-semibold">Forecasting your schedule...</p>
          <p className="text-sm text-muted-foreground">The AI is looking ahead for you.</p>
        </div>
      )}

      {predictions && (
        <div className="p-6 border rounded-lg bg-background">
          <h3 className="mb-4 text-lg font-semibold">Potential Stress Hotspots</h3>
          <ul className="space-y-3">
             {predictions.map((prediction, index) => (
                <li key={index} className="flex items-start p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
                    <AlertTriangle className="w-5 h-5 mr-3 mt-1 text-amber-600 dark:text-amber-500" />
                    <div>
                        <p className="font-semibold">
                            Around {new Date(prediction.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-muted-foreground">{prediction.reason}</p>
                    </div>
                </li>
             ))}
          </ul>
        </div>
      )}

      {!isLoading && !predictions && (
        <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-lg bg-accent/30">
          <Sparkles className="w-8 h-8 mb-4 text-muted-foreground" />
          <p className="font-semibold">Ready for your forecast?</p>
          <p className="text-sm text-muted-foreground">Click the button to analyze your upcoming schedule.</p>
        </div>
      )}
    </div>
  );
}
