
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Pencil } from 'lucide-react';
import type { EmergencyContact } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

type EditContactDialogProps = {
  contact?: EmergencyContact;
  onSave?: (data: Omit<EmergencyContact, 'id' | 'userProfileId'>) => void;
};

export function EditContactDialog({ contact, onSave }: EditContactDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!contact;

  useEffect(() => {
    if (open) {
      setName(contact?.name || '');
      setRelationship(contact?.relationship || '');
      setPhone(contact?.phone || '');
    }
  }, [open, contact]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !relationship || !phone) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out all fields.',
      });
      return;
    }
    
    setIsSaving(true);

    try {
        if (isEditMode && contact && firestore && user) {
            // Update existing contact
            const docRef = doc(firestore, `users/${user.uid}/emergency_contacts`, contact.id);
            await updateDocumentNonBlocking(docRef, { name, relationship, phone });
            toast({ title: "Contact Updated" });
        } else if (onSave) {
            // Add new contact
            onSave({ name, relationship, phone });
        }
        setOpen(false);
    } catch (error) {
        console.error("Error saving contact:", error);
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
                <PlusCircle className="w-4 h-4 mr-2" /> Add Contact
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of your contact.' : 'Add a trusted person to your safety plan.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="relationship">Relationship</Label>
              <Input id="relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder='e.g., Friend, Parent, Therapist' required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
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
