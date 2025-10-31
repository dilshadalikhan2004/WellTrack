
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Landmark, TrendingDown, Wallet, RotateCcw } from 'lucide-react';
import { NewTransactionDialog } from '@/components/finance/new-transaction-dialog';
import { TransactionList } from '@/components/finance/transaction-list';
import { FinancialAnxietyMonitor } from '@/components/finance/financial-anxiety-monitor';
import { useCollection, useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, serverTimestamp, doc, updateDoc, increment, setDoc, writeBatch, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { EmergencyFund, FinancialTransaction } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { EditBalanceDialog } from '@/components/finance/edit-balance-dialog';
import { DownloadReportButton } from '@/components/finance/download-report-button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { startOfMonth, endOfMonth } from 'date-fns';


export default function FinancePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const transactionsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Query to get only non-archived transactions
    return query(collection(firestore, `users/${user.uid}/financial_transactions`), where('isArchived', '!=', true));
  }, [firestore, user]);

  const balanceDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}/emergency_fund`, user.uid);
  }, [firestore, user]);

  const { data: transactions = [], isLoading: transactionsLoading } = useCollection<FinancialTransaction>(transactionsCollectionRef);
  const { data: balanceData, isLoading: balanceLoading } = useDoc<EmergencyFund>(balanceDocRef);
  

  const handleAddTransaction = async (data: Omit<FinancialTransaction, 'id' | 'userProfileId' | 'timestamp'>) => {
    if (!transactionsCollectionRef || !user || !firestore || !balanceDocRef) return;
    // Since the collection ref is a query, we need the base collection for adding docs
    const baseCollectionRef = collection(firestore, `users/${user.uid}/financial_transactions`);
    addDocumentNonBlocking(baseCollectionRef, { ...data, userProfileId: user.uid, timestamp: serverTimestamp(), isArchived: false });
    
    // Update balance
    const amount = data.type === 'income' ? data.amount : -data.amount;
    try {
        await updateDoc(balanceDocRef, { currentAmount: increment(amount) });
    } catch (e) {
        // If the doc doesn't exist, create it.
        await setDoc(balanceDocRef, { 
            currentAmount: amount, 
            goal: 0, 
            userProfileId: user.uid,
            id: user.uid,
        }, { merge: true });
    }
  };
  
  const handleResetExpenses = async () => {
    if (!firestore || !user) return;
    setIsResetting(true);

    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      
      // We need a new query here to find documents to archive, including already archived ones to avoid re-querying them.
      const baseCollectionRef = collection(firestore, `users/${user.uid}/financial_transactions`);
      const q = query(
        baseCollectionRef,
        where('type', '==', 'expense'),
        where('timestamp', '>=', monthStart),
        where('timestamp', '<=', monthEnd)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast({ title: "Nothing to reset", description: "No expenses found for the current month." });
        return;
      }
      
      const batch = writeBatch(firestore);
      let expensesToResetAmount = 0;
      
      querySnapshot.forEach(document => {
        const data = document.data() as FinancialTransaction;
        // Only act on non-archived documents to avoid double-counting balance adjustments
        if (!data.isArchived) {
          batch.update(document.ref, { isArchived: true });
          expensesToResetAmount += data.amount;
        }
      });

      // Add the reset amount back to the balance
      batch.update(balanceDocRef, { currentAmount: increment(expensesToResetAmount) });
      
      await batch.commit();

      toast({
        title: "Expenses Reset!",
        description: "Your expenses for this month have been archived and your balance adjusted.",
      });

    } catch (error) {
      console.error("Failed to reset expenses:", error);
      toast({
        variant: 'destructive',
        title: "Reset Failed",
        description: "Could not reset monthly expenses.",
      });
    } finally {
      setIsResetting(false);
    }
  };


  const { totalExpenses } = useMemo(() => {
    const expenses = (transactions || []).filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
        totalExpenses: expenses,
    };
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return [...(transactions || [])].sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        const timeA = a.timestamp.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
        const timeB = b.timestamp.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
        return timeB - timeA;
    });
  }, [transactions]);

  const isLoading = transactionsLoading || balanceLoading;


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Landmark className="w-6 h-6" />
            Financial Wellness
        </h1>
        <div className="flex items-center gap-2">
          <DownloadReportButton transactions={transactions} />
          <NewTransactionDialog onAddTransaction={handleAddTransaction} />
        </div>
      </header>
      <main className="flex-1 p-4 space-y-6 bg-muted/40 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EditBalanceDialog balanceDocRef={balanceDocRef} currentBalance={balanceData?.currentAmount}>
              <Card className="cursor-pointer hover:border-primary/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">₹{balanceData?.currentAmount?.toFixed(2) || '0.00'}</div>
                  <p className="text-xs text-muted-foreground">Click to edit your balance</p>
                  </CardContent>
              </Card>
            </EditBalanceDialog>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-6 h-6 -mr-2 -mt-2">
                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Monthly Expenses?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will archive all expense transactions from the current month and add their total back to your balance. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetExpenses} disabled={isResetting}>
                          {isResetting && <RotateCcw className="w-4 h-4 mr-2 animate-spin" />}
                          Yes, Reset Expenses
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-red-600">-₹{totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total spending this month</p>
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
                        <p className="mt-2 text-xs text-center text-muted-foreground">This feature is coming soon! It will analyze your spending and provide personalized tips to help you save money and reduce financial stress.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
