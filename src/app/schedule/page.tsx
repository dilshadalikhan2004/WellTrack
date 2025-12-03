'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import type { ScheduleItem } from '@/lib/types';

export default function SchedulePage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'assignment' | 'exam' | 'event'>('assignment');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const scheduleCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/schedule`);
  }, [user, firestore]);

  const { data: scheduleItems } = useCollection<ScheduleItem>(scheduleCollectionRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !title || !date) return;

    setIsLoading(true);
    try {
      await addDoc(collection(firestore, `users/${user.uid}/schedule`), {
        title,
        date: new Date(date + (time ? `T${time}` : '')),
        type,
        description,
        userProfileId: user.uid,
        timestamp: serverTimestamp(),
      });

      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
      
      toast({
        title: 'Schedule Item Added',
        description: 'Your schedule has been updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add schedule item.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        <h1 className="text-2xl font-bold">My Schedule</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Schedule Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Assignment, exam, or event name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time (Optional)</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details..."
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Adding...' : 'Add to Schedule'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleItems?.length ? (
                scheduleItems
                  .sort((a, b) => {
                    const dateA = a.date instanceof Date ? a.date : new Date(a.date.seconds * 1000);
                    const dateB = b.date instanceof Date ? b.date : new Date(b.date.seconds * 1000);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.date instanceof Date ? item.date.toLocaleDateString() : new Date(item.date.seconds * 1000).toLocaleDateString()}
                            {item.date.toString().includes('T') && item.date instanceof Date && ` at ${item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                          </p>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {item.type}
                          </span>
                          {item.description && (
                            <p className="text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No schedule items yet. Add your first item!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}