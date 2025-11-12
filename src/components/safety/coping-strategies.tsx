
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { CopingStrategy } from '@/lib/types';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { EditStrategyDialog } from './edit-strategy-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function CopingStrategies() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const strategiesCollectionRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/coping_strategies`);
    }, [user, firestore]);

    const { data: strategies, isLoading } = useCollection<CopingStrategy>(strategiesCollectionRef);

    const handleAddStrategy = async (text: string) => {
        if (!user || !strategiesCollectionRef) return;
        await addDocumentNonBlocking(strategiesCollectionRef, {
            text,
            userProfileId: user.uid,
        });
        toast({ title: 'Strategy Added' });
    };

    const handleDeleteStrategy = async (id: string) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, `users/${user.uid}/coping_strategies`, id);
        await deleteDocumentNonBlocking(docRef);
        toast({ title: 'Strategy Removed' });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6" /> My Coping Strategies
                    </CardTitle>
                    <CardDescription>
                        Things I can do to help myself when feeling overwhelmed.
                    </CardDescription>
                </div>
                 <EditStrategyDialog onSave={handleAddStrategy} />
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-3">
                        <Skeleton className="w-full h-12" />
                        <Skeleton className="w-full h-12" />
                        <Skeleton className="w-full h-12" />
                    </div>
                )}
                {!isLoading && strategies && strategies.length > 0 && (
                    <ul className="space-y-3">
                        {strategies.map(strategy => (
                            <li key={strategy.id} className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50">
                               <span>{strategy.text}</span>
                               <div className='flex items-center shrink-0'>
                                   <EditStrategyDialog strategy={strategy} />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className='w-8 h-8 text-destructive/70 hover:text-destructive'>
                                                <Trash2 className="w-4 h-4"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete this strategy?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. Are you sure you want to permanently delete this coping strategy?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteStrategy(strategy.id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                               </div>
                            </li>
                        ))}
                    </ul>
                )}
                 {!isLoading && (!strategies || strategies.length === 0) && (
                    <div className="flex items-center justify-center h-40 text-center border-2 border-dashed rounded-lg">
                        <div>
                            <p className='font-semibold'>No strategies yet.</p>
                            <p className="text-sm text-muted-foreground">Click "Add Strategy" to build your toolkit.</p>
                        </div>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
