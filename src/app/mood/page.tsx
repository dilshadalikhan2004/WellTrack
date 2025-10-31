import { MoodHeatmap } from '@/components/mood/mood-heatmap';
import { MoodTrendChart } from '@/components/mood/mood-trend-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockMoodLogs } from '@/lib/data';

export default function MoodPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-semibold">Mood Analytics</h1>
      </header>
      <div className="flex-1 p-4 space-y-4 bg-muted/40 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Mood Calendar</CardTitle>
            <CardDescription>
              Your daily mood ratings over the past few months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodHeatmap data={mockMoodLogs} />
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
            <MoodTrendChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
