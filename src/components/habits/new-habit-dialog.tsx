'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Habit } from '@/lib/types';
import { useUser } from '@/firebase';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

type NewHabitData = Omit<Habit, 'id'>;

export function NewHabitDialog({ onAddHabit }: { onAddHabit: (habit: NewHabitData) => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Habit['category'] | ''>('');
  const [goal, setGoal] = useState('');
  
  const resetForm = () => {
    setName('');
    setCategory('');
    setGoal('');
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !category || !goal || !user) {
        toast({
            variant: 'destructive',
            title: 'Missing fields',
            description: 'Please fill out all fields to create a habit.',
        });
        return;
    }

    onAddHabit({ name, category, goal, userProfileId: user.uid });
    
    toast({
      title: 'Habit Created!',
      description: 'Your new habit has been added.',
    });

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Habit</DialogTitle>
          <DialogDescription>
            Define a new habit you want to track.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name">Habit Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water" 
                required 
              />
            </div>
             <div className="space-y-1">
              <Label htmlFor="goal">Goal</Label>
              <Input 
                id="goal" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., 8 glasses" 
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select 
                required 
                value={category}
                onValueChange={(value) => setCategory(value as Habit['category'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physical">Physical</SelectItem>
                  <SelectItem value="Mental">Mental</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
