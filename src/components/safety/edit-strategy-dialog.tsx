
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
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Pencil } from 'lucide-react';
import type { CopingStrategy } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

type EditStrategyDialogProps = {
  strategy?: CopingStrategy;
  onSave?: (text: string) => void;
};

export function EditStrategyDialog({ strategy, onSave }: EditStrategyDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!strategy;

  useEffect(() => {
    if (open) {
      setText(strategy?.text || '');
    }
  }, [open, strategy]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Strategy cannot be empty',
      });
      return;
    }
    
    setIsSaving(true);

    try {
        if (isEditMode && strategy && firestore && user) {
            const docRef = doc(firestore, `users/${user.uid}/coping_strategies`, strategy.id);
            await updateDocumentNonBlocking(docRef, { text });
            toast({ title: "Strategy Updated" });
        } else if (onSave) {
            onSave(text);
        }
        setOpen(false);
    } catch (error) {
        console.error("Error saving strategy:", error);
        toast({ variant: 'destructive', title: "Save failed" });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
            <Button variant="ghost" size="icon" className='w-8 h-8'>
                <Pencil className="w-4 h-4"/>
            </Button>
        ) : (
            <Button size="sm" variant="outline">
                <PlusCircle className="w-4 h-4 mr-2" /> Add Strategy
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Strategy' : 'Add New Coping Strategy'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update this coping strategy.' : 'Describe a simple action you can take to calm down.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="text">Strategy</Label>
              <Textarea
                 id="text" 
                 value={text} 
                 onChange={(e) => setText(e.target.value)} 
                 required 
                 placeholder='e.g., "Practice 4-7-8 breathing for 5 minutes."'
                 className='min-h-[100px]'
              />
            </div>
          </div>
          <DialogFooter>
             <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
             </DialogClose>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
