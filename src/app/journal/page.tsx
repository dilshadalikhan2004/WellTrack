'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Sparkles, NotebookPen, Trash2 } from 'lucide-react';
import { analyzeJournalSentiment, type AnalyzeJournalSentimentOutput } from '@/ai/flows/analyze-journal-sentiment';
import type { JournalEntry, JournalEntryData } from '@/lib/types';
import { format } from 'date-fns';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, Timestamp, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';


export default function JournalPage() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentiment, setSentiment] = useState<AnalyzeJournalSentimentOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const entriesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/journal_entries`);
  }, [firestore, user]);

  const { data: savedEntries, isLoading: entriesLoading } = useCollection<JournalEntryData>(entriesCollectionRef);

  const handleSave = () => {
    if (!entry.trim() || !entriesCollectionRef) {
        toast({
            variant: 'destructive',
            title: 'Empty Entry',
            description: 'Cannot save an empty entry.',
        });
        return;
    }

    const newEntry: Omit<JournalEntry, 'id'> = {
        content: entry,
        // Firebase will convert this to a Timestamp
        createdAt: serverTimestamp(),
        sentiment: sentiment,
        userProfileId: user!.uid,
    };

    addDocumentNonBlocking(entriesCollectionRef, newEntry);

    setEntry('');
    setSentiment(null);

    toast({
      title: 'Entry Saved!',
      description: 'Your journal entry has been saved successfully.',
    });
  };

  const handleDelete = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, `users/${user.uid}/journal_entries`, id);
    deleteDocumentNonBlocking(docRef);
    toast({
        title: 'Entry Deleted',
        description: 'Your journal entry has been removed.',
    });
  };

  const handleAnalyze = async () => {
    if (!entry.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Entry',
        description: 'Please write something before analyzing.',
      });
      return;
    }
    setIsLoading(true);
    setSentiment(null);
    try {
      const result = await analyzeJournalSentiment({ journalEntry: entry });
      setSentiment(result);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the sentiment of your entry.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const sortedEntries = (savedEntries || [])
    .filter(e => e.createdAt) // Ensure createdAt is not null
    .sort((a, b) => {
        const dateA = a.createdAt as Timestamp;
        const dateB = b.createdAt as Timestamp;
        return dateB.toMillis() - dateA.toMillis();
    });


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 hidden md:flex">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
            <NotebookPen className="w-6 h-6" />
            My Journal
        </h1>
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
            <CardDescription>
              Write down your thoughts and feelings. This is a safe space for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="What's on your mind today?"
              className="min-h-[250px] text-base"
            />
            <div className="flex flex-col items-stretch justify-end gap-2 mt-4 sm:flex-row">
              <Button variant="outline" onClick={handleSave} disabled={!entry.trim() || !user}>
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
              <Button onClick={handleAnalyze} disabled={isLoading || !entry.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Analyze Sentiment
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
            <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary" />
            <p className="font-semibold">Analyzing your entry...</p>
            <p className="text-sm text-muted-foreground">The AI is reading between the lines.</p>
          </div>
        )}

        {sentiment && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex items-start gap-4 p-6 text-center border-2 border-dashed rounded-lg bg-accent/50">
              <div className="text-5xl">{sentiment.emoji}</div>
              <div className='text-left'>
                <p className="text-lg font-bold">{sentiment.sentiment}</p>
                <p className="text-muted-foreground">{sentiment.summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {entriesLoading && <p>Loading entries...</p>}

        {sortedEntries.length > 0 && (
          <Card>
            <CardHeader>
                <CardTitle>Past Entries</CardTitle>
                <CardDescription>Review your previous journal entries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedEntries.map((savedEntry) => (
                    <div key={savedEntry.id} className="p-4 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-sm font-semibold text-muted-foreground">
                             {savedEntry.createdAt instanceof Timestamp ? format(savedEntry.createdAt.toDate(), 'MMMM d, yyyy - h:mm a') : 'Just now'}
                           </p>
                           <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => handleDelete(savedEntry.id)}>
                               <Trash2 className="w-4 h-4 text-muted-foreground" />
                           </Button>
                        </div>
                        <p className="whitespace-pre-wrap">{savedEntry.content}</p>
                        {savedEntry.sentiment && (
                             <div className="flex items-start gap-3 p-3 mt-4 text-center border-2 border-dashed rounded-lg bg-accent/50">
                                <div className="text-3xl">{savedEntry.sentiment.emoji}</div>
                                <div className='text-left'>
                                    <p className="font-bold">{savedEntry.sentiment.sentiment}</p>
                                    <p className="text-sm text-muted-foreground">{savedEntry.sentiment.summary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
