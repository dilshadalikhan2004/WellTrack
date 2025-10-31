
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Wallet, ShieldCheck, Pencil } from 'lucide-react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { EmergencyFund } from '@/lib/types';
import { EditEmergencyFundDialog } from './edit-emergency-fund-dialog';

export function EmergencyFundTracker() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emergencyFundDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // There is only one emergency fund document per user, so the ID is the user's UID.
    return doc(firestore, `users/${user.uid}/emergency_fund`, user.uid);
  }, [firestore, user]);

  const { data: fund, isLoading } = useDoc<EmergencyFund>(emergencyFundDocRef);
  
  const handleSave = async (goal: number, currentAmount: number) => {
    if (!emergencyFundDocRef || !user) return;
    const dataToSave: Omit<EmergencyFund, 'id'> = {
        goal,
        currentAmount,
        userProfileId: user.uid
    };
    await setDoc(emergencyFundDocRef, dataToSave, { merge: true });
  }

  const currentAmount = fund?.currentAmount || 0;
  const goal = fund?.goal || 1000; // Default goal of $1000
  const progress = goal > 0 ? Math.min(Math.round((currentAmount / goal) * 100), 100) : 0;

  if (isLoading) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Emergency Fund</CardTitle>
                <Wallet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Loading...</div>
                <p className="text-xs text-muted-foreground">Fetching your savings goal.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Emergency Fund</CardTitle>
        <Button variant="ghost" size="icon" className="w-6 h-6 -mr-2 -mt-2" onClick={() => setIsDialogOpen(true)}>
            <Pencil className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-2xl font-bold">${currentAmount.toFixed(2)} / <span className='text-lg font-medium text-muted-foreground'>${goal.toFixed(2)}</span></div>
        <Progress value={progress} aria-label="Emergency fund progress" />
        <p className="mt-1 text-xs text-muted-foreground">{progress}% of your goal saved.</p>
      </CardContent>
    </Card>

    <EditEmergencyFundDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialGoal={fund?.goal}
        initialCurrentAmount={fund?.currentAmount}
    />
    </>
  );
}
