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
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

export function NewGoalDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to save the new goal would go here
    toast({
      title: 'Goal Created!',
      description: 'Your new goal has been added to your list.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Goal</DialogTitle>
          <DialogDescription>
            Define a new SMART goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" placeholder="e.g., Read 12 books" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your goal and why it's important..."
                className="col-span-3"
              />
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
