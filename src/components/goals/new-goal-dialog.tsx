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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Goal, SubTask } from '@/lib/types';
import { useUser } from '@/firebase';
import { PlusCircle, Plus, X } from 'lucide-react';
import { useState } from 'react';

type NewGoalData = Omit<Goal, 'id' | 'progress'>;

export function NewGoalDialog({ onAddGoal }: { onAddGoal: (goal: NewGoalData) => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Goal['category'] | ''>('');
  const [description, setDescription] = useState('');
  const [subTasks, setSubTasks] = useState<Omit<SubTask, 'id' | 'completed'>[]>([]);
  const [currentSubTask, setCurrentSubTask] = useState('');

  const handleAddSubTask = () => {
    if(currentSubTask.trim()){
      setSubTasks([...subTasks, { text: currentSubTask.trim() }]);
      setCurrentSubTask('');
    }
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setSubTasks([]);
    setCurrentSubTask('');
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !category || !user) {
        toast({
            variant: 'destructive',
            title: 'Missing fields',
            description: 'Please provide a title and category.',
        });
        return;
    }

    const finalSubTasks = subTasks.map((st, i) => ({
      ...st,
      id: `subtask-${Date.now()}-${i}`,
      completed: false,
    }));

    onAddGoal({ title, category, description, subTasks: finalSubTasks, userProfileId: user.uid });
    
    toast({
      title: 'Goal Created!',
      description: 'Your new goal has been added to your list.',
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
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Goal</DialogTitle>
          <DialogDescription>
            Define a new goal and break it down into smaller sub-tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Read 12 books" 
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select 
                required 
                value={category}
                onValueChange={(value) => setCategory(value as Goal['category'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal and why it's important..."
              />
            </div>
            <div className='space-y-2'>
              <Label>Sub-tasks</Label>
              <div className="p-2 space-y-2 border rounded-lg bg-muted/50">
                {subTasks.map((subTask, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-2 text-sm rounded-md bg-background">
                    <span>{subTask.text}</span>
                    <Button type="button" variant="ghost" size="icon" className="w-5 h-5" onClick={() => handleRemoveSubTask(index)}>
                      <X className="w-3 h-3"/>
                    </Button>
                  </div>
                ))}
                 {subTasks.length === 0 && <p className="text-xs text-center text-muted-foreground">Add some steps to your goal.</p>}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={currentSubTask}
                  onChange={(e) => setCurrentSubTask(e.target.value)}
                  placeholder="Add a sub-task..."
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSubTask();}}}
                />
                <Button type="button" onClick={handleAddSubTask}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
