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
  DialogClose,
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
import { Pencil, Trash2 } from 'lucide-react';
import { useState, type FormEvent, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

type EditHabitDialogProps = {
  habit: Habit;
  onUpdateHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
};

export function EditHabitDialog({ habit, onUpdateHabit, onDeleteHabit }: EditHabitDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState<Habit['category']>(habit.category);
  const [goal, setGoal] = useState(habit.goal);

  useEffect(() => {
    if (open) {
      setName(habit.name);
      setCategory(habit.category);
      setGoal(habit.goal);
    }
  }, [open, habit]);


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !category || !goal) {
        toast({
            variant: 'destructive',
            title: 'Missing fields',
            description: 'Please fill out all fields.',
        });
        return;
    }

    onUpdateHabit({ 
        ...habit, 
        name, 
        category, 
        goal,
    });
    
    toast({
      title: 'Habit Updated!',
      description: 'Your habit has been successfully updated.',
    });

    setOpen(false);
  };

  const handleDelete = () => {
    onDeleteHabit(habit.id);
    toast({
        title: 'Habit Deleted',
        description: 'The habit has been removed.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
            <Pencil className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Make changes to your habit here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name-edit">
                Name
              </Label>
              <Input 
                id="name-edit" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read 12 books" 
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="goal-edit">
                Goal
              </Label>
              <Input 
                id="goal-edit" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., 8 glasses" 
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category-edit">
                Category
              </Label>
              <Select 
                required 
                value={category}
                onValueChange={(value) => setCategory(value as Habit['category'])}
              >
                <SelectTrigger id="category-edit">
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
          <DialogFooter className='justify-between pt-4'>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your habit.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className='flex gap-2'>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
