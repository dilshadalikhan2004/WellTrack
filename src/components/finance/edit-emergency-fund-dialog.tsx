
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
  onSave: (currentAmount: number) => void;
  initialCurrentAmount?: number;
};

export function EditEmergencyFundDialog({ 
    isOpen, 
    onOpenChange, 
    onSave,
    initialCurrentAmount = 0
}: EditEmergencyFundDialogProps) {
  const { toast } = useToast();
  const [currentAmount, setCurrentAmount] = useState<number | ''>(initialCurrentAmount);

  useEffect(() => {
    if(isOpen) {
      setCurrentAmount(initialCurrentAmount);
    }
  }, [isOpen, initialCurrentAmount]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentAmount === '') {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please provide a balance amount.',
      });
      return;
    }

    onSave(Number(currentAmount));
    
    toast({
      title: 'Balance Updated!',
      description: 'Your balance has been saved.',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Balance</DialogTitle>
          <DialogDescription>
            Update your current balance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="currentAmount">Current Balance (₹)</Label>
              <Input
                id="currentAmount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value === '' ? '' : e.target.valueAsNumber)}
                placeholder="e.g., 250.75"
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
