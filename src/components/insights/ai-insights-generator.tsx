'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedInsights } from '@/ai/flows/generate-personalized-insights';
import { Loader2, Sparkles } from 'lucide-react';
import { mockGoals, mockHabits, mockMoodLogs } from '@/lib/data';

export function AiInsightsGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const result = await generatePersonalizedInsights({
        moodData: JSON.stringify(mockMoodLogs.slice(0, 15)),
        habitData: JSON.stringify(mockHabits),
        sleepData: JSON.stringify([
          { date: '2024-07-20', hours: 7.5, quality: 4 },
          { date: '2024-07-19', hours: 6, quality: 2 },
        ]),
        exerciseData: JSON.stringify([
          { date: '2024-07-20', type: 'Running', duration: 30 },
        ]),
        waterIntakeData: JSON.stringify([
          { date: '2024-07-20', glasses: 8 },
          { date: '2024-07-19', glasses: 5 },
        ]),
        goalData: JSON.stringify(mockGoals),
      });
      setInsights(result.insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate insights. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          size="lg"
          className="shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 mr-2" />
          )}
          Generate My Weekly Report
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
          <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary" />
          <p className="font-semibold">Analyzing your data...</p>
          <p className="text-sm text-muted-foreground">
            This may take a moment.
          </p>
        </div>
      )}

      {insights && (
        <div className="p-6 border rounded-lg bg-background">
          <h3 className="mb-4 text-lg font-semibold font-headline">Your Personalized Insights</h3>
          <div
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-headline prose-p:text-foreground/80 prose-li:text-foreground/80"
            dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }}
          />
        </div>
      )}

      {!isLoading && !insights && (
         <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-lg bg-accent/30">
          <Sparkles className="w-8 h-8 mb-4 text-muted-foreground" />
          <p className="font-semibold">Ready for your report?</p>
          <p className="text-sm text-muted-foreground">
            Click the button above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
