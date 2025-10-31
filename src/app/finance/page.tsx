
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Landmark, TrendingDown, Bot } from 'lucide-react';
import { NewTransactionDialog } from '@/components/finance/new-transaction-dialog';
import { TransactionList } from '@/components/finance/transaction-list';
import { FinancialAnxietyMonitor } from '@/components/finance/financial-anxiety-monitor';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import type { FinancialTransaction } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useMemo } from 'react';
import { EmergencyFundTracker } from '@/components/finance/emergency-fund-tracker';


export default function FinancePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const transactionsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/financial_transactions`);
  }, [firestore, user]);

  const { data: transactions, isLoading } = useCollection<FinancialTransaction>(transactionsCollectionRef);

  const handleAddTransaction = (data: Omit<FinancialTransaction, 'id' | 'userProfileId' | 'timestamp'>) => {
    if (!transactionsCollectionRef || !user || !firestore) return;
    
    // 1. Add the transaction document
    addDocumentNonBlocking(transactionsCollectionRef, { ...data, userProfileId: user.uid, timestamp: serverTimestamp() });

    // 2. Update the balance
    const emergencyFundDocRef = doc(firestore, `users/${user.uid}/emergency_fund`, user.uid);
    const amount = data.type === 'income' ? data.amount : -data.amount;
    
    // Use updateDoc with increment for atomic updates
    updateDoc(emergencyFundDocRef, {
      currentAmount: increment(amount)
    }).catch(err => {
        // This might happen if the document doesn't exist yet, we can choose to set it.
        if (err.code === 'not-found') {
            const { setDocumentNonBlocking } = require('@/firebase/non-blocking-updates');
            setDocumentNonBlocking(emergencyFundDocRef, { currentAmount: amount, userProfileId: user.uid }, { merge: true });
        }
    });
  };
  
  const totalExpenses = useMemo(() => {
    if (!transactions) return 0;
    return transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    const safeTransactions = transactions || [];
    return [...safeTransactions].sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        // Ensure timestamps are converted to milliseconds for comparison
        const timeA = a.timestamp.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
        const timeB = b.timestamp.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
        return timeB - timeA;
    });
  }, [transactions]);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Landmark className="w-6 h-6" />
            Financial Wellness
        </h1>
        <NewTransactionDialog onAddTransaction={handleAddTransaction} />
      </header>
      <main className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EmergencyFundTracker />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="w-4 h-4 text-red-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-red-600">-₹{totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">All spending this month</p>
                </CardContent>
            </Card>
             <FinancialAnxietyMonitor />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
            <TransactionList transactions={sortedTransactions} isLoading={isLoading} className="lg:col-span-2" />
            
            <div className="space-y-6 lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Bot className="w-5 h-5 text-primary"/> AI Financial Tips
                        </CardTitle>
                        <CardDescription>Get AI-powered recommendations based on your spending.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">Analyze My Spending</Button>
                         <p className="mt-2 text-xs text-center text-muted-foreground">Coming soon!</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
