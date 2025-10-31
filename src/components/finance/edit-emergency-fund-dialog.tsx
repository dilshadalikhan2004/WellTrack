
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type EditEmergencyFundDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (goal: number, currentAmount: number) => void;
  initialGoal?: number;
  initialCurrentAmount?: number;
};

export function EditEmergencyFundDialog({ 
    isOpen, 
    onOpenChange, 
    onSave,
    initialGoal = 1000,
    initialCurrentAmount = 0
}: EditEmergencyFundDialogProps) {
  const { toast } = useToast();
  const [goal, setGoal] = useState<number | ''>(initialGoal);
  const [currentAmount, setCurrentAmount] = useState<number | ''>(initialCurrentAmount);

  useEffect(() => {
    if(isOpen) {
      setGoal(initialGoal);
      setCurrentAmount(initialCurrentAmount);
    }
  }, [isOpen, initialGoal, initialCurrentAmount]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (goal === '' || currentAmount === '') {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    onSave(Number(goal), Number(currentAmount));
    
    toast({
      title: 'Emergency Fund Updated!',
      description: 'Your savings goal has been saved.',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Emergency Fund</DialogTitle>
          <DialogDescription>
            Set your savings goal and update your current progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="goal">Savings Goal</Label>
              <Input
                id="goal"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value === '' ? '' : e.target.valueAsNumber)}
                placeholder="e.g., 1000"
                required
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="currentAmount">Current Amount Saved</Label>
              <Input
                id="currentAmount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value === '' ? '' : e.target.valueAsNumber)}
                placeholder="e.g., 250"
                required
                min="0"
                step="any"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
