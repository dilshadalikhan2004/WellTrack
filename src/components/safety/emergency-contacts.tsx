
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, PhoneCall, PlusCircle, Trash2 } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { EmergencyContact } from '@/lib/types';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { EditContactDialog } from './edit-contact-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function EmergencyContacts() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const contactsCollectionRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/emergency_contacts`);
    }, [user, firestore]);

    const { data: contacts, isLoading } = useCollection<EmergencyContact>(contactsCollectionRef);

    const handleAddContact = async (contactData: Omit<EmergencyContact, 'id' | 'userProfileId'>) => {
        if (!user || !contactsCollectionRef) return;
        await addDocumentNonBlocking(contactsCollectionRef, {
            ...contactData,
            userProfileId: user.uid,
        });
        toast({ title: 'Contact Added' });
    };

    const handleDeleteContact = async (id: string) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, `users/${user.uid}/emergency_contacts`, id);
        await deleteDocumentNonBlocking(docRef);
        toast({ title: 'Contact Removed' });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-6 h-6" /> Personal Contacts
                    </CardTitle>
                    <CardDescription>
                        Your trusted friends, family, or professionals.
                    </CardDescription>
                </div>
                <EditContactDialog onSave={handleAddContact} />
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                     <div className="space-y-3">
                        <Skeleton className="w-full h-16" />
                        <Skeleton className="w-full h-16" />
                    </div>
                )}
                 {!isLoading && contacts && contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between gap-2 p-4 rounded-lg bg-muted/50">
                        <div>
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        </div>
                        <div className="flex items-center shrink-0">
                            <Button asChild size="sm">
                                <a href={`tel:${contact.phone}`}>
                                    <PhoneCall className="w-4 h-4 mr-2"/>
                                    Call
                                </a>
                            </Button>
                            <EditContactDialog contact={contact} />
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className='w-8 h-8 text-destructive/70 hover:text-destructive'>
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this contact?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. Are you sure you want to permanently delete this contact?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteContact(contact.id)}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                 ))}
                 {!isLoading && (!contacts || contacts.length === 0) && (
                    <div className="flex items-center justify-center h-40 text-center border-2 border-dashed rounded-lg">
                        <div>
                            <p className='font-semibold'>No contacts yet.</p>
                            <p className="text-sm text-muted-foreground">Click "Add Contact" to build your support network.</p>
                        </div>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
