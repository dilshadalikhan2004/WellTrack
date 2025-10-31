
'use client';

import { useState } from 'react';
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
import { PlusCircle } from 'lucide-react';
import type { FinancialTransaction } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type NewTransactionData = Omit<FinancialTransaction, 'id' | 'userProfileId' | 'timestamp'>;

export function NewTransactionDialog({ onAddTransaction }: { onAddTransaction: (data: NewTransactionData) => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState('');

  const resetForm = () => {
    setType('expense');
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description || !amount || !category) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    onAddTransaction({ type, description, amount: Number(amount), category });
    
    toast({
      title: 'Transaction Added!',
      description: 'Your transaction has been logged successfully.',
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
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a New Transaction</DialogTitle>
          <DialogDescription>
            Record your income or expenses to keep track of your budget.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup defaultValue="expense" value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="r-expense" />
                  <Label htmlFor="r-expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="r-income" />
                  <Label htmlFor="r-income">Income</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Coffee with friends"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.valueAsNumber)}
                        placeholder="e.g., 5.50"
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="category">Category</Label>
                    <Select required value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {type === 'expense' ? (
                                <>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Housing">Housing</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value="Salary">Salary</SelectItem>
                                    <SelectItem value="Gift">Gift</SelectItem>
                                    <SelectItem value="Side Hustle">Side Hustle</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    