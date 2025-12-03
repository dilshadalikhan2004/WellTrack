
'use client';

import { MoodHeatmap } from '@/components/mood/mood-heatmap';
import { MoodTrendChart } from '@/components/mood/mood-trend-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, type Timestamp } from 'firebase/firestore';

export type MoodLogData = {
  id: string;
  mood: string;
  rating: number;
  timestamp: Timestamp | null;
  userProfileId: string;
};

export default function MoodPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const moodLogsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/mood_logs`);
  }, [user, firestore]);

  const { data: moodLogs, isLoading } = useCollection<MoodLogData>(moodLogsCollectionRef);

  const processedMoodLogs = (moodLogs || [])
    .filter(log => log.timestamp) // Filter out logs where timestamp is null
    .map(log => ({
      ...log,
      date: log.timestamp!.toDate()
    }));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 hidden h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6 md:flex md:items-center">
        <h1 className="text-xl font-semibold">Mood Analytics</h1>
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <p>Loading mood data...</p>
          </div>
        )}
        {!isLoading && (!processedMoodLogs || processedMoodLogs.length === 0) && (
            <Card>
                <CardHeader>
                    <CardTitle>No Mood Data Yet</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-center text-muted-foreground py-12'>Log your mood on the dashboard to see your analytics here!</p>
                </CardContent>
            </Card>
        )}
        {!isLoading && processedMoodLogs && processedMoodLogs.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Mood Calendar</CardTitle>
                <CardDescription>
                  Your daily mood ratings over the past few months.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <MoodHeatmap data={processedMoodLogs} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
                <CardDescription>
                  Your average mood rating over the last 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodTrendChart data={processedMoodLogs} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
