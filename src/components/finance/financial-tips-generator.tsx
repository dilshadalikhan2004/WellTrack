
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bot, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { generateFinancialTips, type GenerateFinancialTipsOutput } from '@/ai/flows/generate-financial-tips';
import type { FinancialTransaction } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

type FinancialTipsGeneratorProps = {
  transactions: FinancialTransaction[];
};

export function FinancialTipsGenerator({ transactions }: FinancialTipsGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateFinancialTipsOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);

    if (transactions.length < 3) {
        toast({
            variant: 'destructive',
            title: 'Not Enough Data',
            description: 'Log at least 3 transactions to get personalized tips.',
        });
        setIsLoading(false);
        return;
    }

    try {
      const formattedTransactions = transactions.map(t => ({
        ...t,
        timestamp: (t.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      }));
      
      const response = await generateFinancialTips({
        transactions: formattedTransactions,
        balance: 0, // Balance not critical for this version of tips
      });
      setResult(response);
    } catch (error) {
      console.error('Error generating financial tips:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not generate financial tips at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" /> AI Financial Tips
        </CardTitle>
        <CardDescription>Get AI-powered recommendations based on your spending.</CardDescription>
      </CardHeader>
      <CardContent>
        {!result && (
          <div className="p-4 text-center border-2 border-dashed rounded-lg bg-accent/50">
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-accent-foreground/50" />
            <p className="mb-4 text-sm text-muted-foreground">
              Discover patterns in your spending and get smart tips to save money.
            </p>
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate Tips
            </Button>
          </div>
        )}
        
        {isLoading && !result && (
             <div className="flex flex-col items-center justify-center p-10">
                <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary" />
                <p className="font-semibold">Analyzing your spending...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Summary</h4>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold">Your Personalised Tips</h4>
              <ul className="mt-2 space-y-2 list-none">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 mt-1 text-yellow-500 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
