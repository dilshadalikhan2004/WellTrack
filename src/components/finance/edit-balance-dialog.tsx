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
import { Loader2 } from 'lucide-react';
import { type DocumentReference, setDoc } from 'firebase/firestore';
import { useUser } from '@/firebase';

type EditBalanceDialogProps = {
    children: React.ReactNode;
    balanceDocRef: DocumentReference | null;
    currentBalance?: number;
};

export function EditBalanceDialog({ children, balanceDocRef, currentBalance = 0 }: EditBalanceDialogProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount(currentBalance || '');
    }
  }, [open, currentBalance]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!balanceDocRef || !user) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update balance. User not found.',
        });
        return;
    }
    
    setIsSaving(true);
    try {
        await setDoc(balanceDocRef, {
            id: user.uid,
            userProfileId: user.uid,
            currentAmount: Number(amount),
            goal: 0, // Not used, but part of the data model
        }, { merge: true });

        toast({
            title: 'Balance Updated',
            description: 'Your balance has been set successfully.',
        });
        setOpen(false);

    } catch(err) {
        console.error(err);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save your new balance.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="cursor-pointer w-full h-full">
        {children}
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Balance</DialogTitle>
          <DialogDescription>
            Set your current available balance. This will be the starting point for your budget.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="amount">Current Balance (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : e.target.valueAsNumber)}
                placeholder="e.g., 10000.00"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set Balance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
