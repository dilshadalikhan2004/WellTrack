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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Goal, SubTask } from '@/lib/types';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { useState, type FormEvent, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

type EditGoalDialogProps = {
  goal: Goal;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
};

export function EditGoalDialog({ goal, onUpdateGoal, onDeleteGoal }: EditGoalDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [category, setCategory] = useState<Goal['category']>(goal.category);
  const [description, setDescription] = useState(goal.description || '');
  const [subTasks, setSubTasks] = useState<SubTask[]>(goal.subTasks);
  const [currentSubTask, setCurrentSubTask] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(goal.title);
      setCategory(goal.category);
      setDescription(goal.description || '');
      setSubTasks(goal.subTasks);
      setCurrentSubTask('');
    }
  }, [open, goal]);

  const handleAddSubTask = () => {
    if(currentSubTask.trim()){
      const newSubTask: SubTask = {
        id: `subtask-${Date.now()}`,
        text: currentSubTask.trim(),
        completed: false
      };
      setSubTasks([...subTasks, newSubTask]);
      setCurrentSubTask('');
    }
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== id));
  };
  
  const handleToggleSubTask = (id: string) => {
    setSubTasks(subTasks.map(st => st.id === id ? {...st, completed: !st.completed} : st));
  }


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !category) {
        toast({
            variant: 'destructive',
            title: 'Missing fields',
            description: 'Please provide a title and category.',
        });
        return;
    }

    onUpdateGoal({ 
        ...goal, 
        title, 
        category, 
        description,
        subTasks
    });
    
    toast({
      title: 'Goal Updated!',
      description: 'Your goal has been successfully updated.',
    });

    setOpen(false);
  };

  const handleDelete = () => {
    onDeleteGoal(goal.id);
    toast({
        title: 'Goal Deleted',
        description: 'The goal has been removed.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-6 h-6">
            <Pencil className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Make changes to your goal here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="title-edit">
                Title
              </Label>
              <Input 
                id="title-edit" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Read 12 books" 
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
                onValueChange={(value) => setCategory(value as Goal['category'])}
              >
                <SelectTrigger id="category-edit">
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
              <Label htmlFor="description-edit">
                Description
              </Label>
              <Textarea
                id="description-edit"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal and why it's important..."
              />
            </div>
             <div className='space-y-2'>
              <Label>Sub-tasks</Label>
              <div className="p-2 space-y-2 border rounded-lg bg-muted/50">
                {subTasks.map((subTask) => (
                  <div key={subTask.id} className="flex items-center justify-between gap-2 p-2 text-sm rounded-md bg-background">
                    <span>{subTask.text}</span>
                    <Button type="button" variant="ghost" size="icon" className="w-5 h-5" onClick={() => handleRemoveSubTask(subTask.id)}>
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
                            This action cannot be undone. This will permanently delete your goal.
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
