
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Landmark, TrendingDown, Bot, TrendingUp, Wallet } from 'lucide-react';
import { NewTransactionDialog } from '@/components/finance/new-transaction-dialog';
import { TransactionList } from '@/components/finance/transaction-list';
import { FinancialAnxietyMonitor } from '@/components/finance/financial-anxiety-monitor';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import type { FinancialTransaction } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { startOfMonth, isWithinInterval } from 'date-fns';


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
    addDocumentNonBlocking(transactionsCollectionRef, { ...data, userProfileId: user.uid, timestamp: serverTimestamp() });
  };
  
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const safeTransactions = transactions || [];
    const now = new Date();
    const monthStart = startOfMonth(now);

    const currentMonthTransactions = safeTransactions.filter(t => {
        if (!t.timestamp) return false;
        const transactionDate = t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
        return isWithinInterval(transactionDate, { start: monthStart, end: now });
    });
    
    const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
    };
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
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                <Wallet className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">This month's income minus expenses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-600">+₹{totalIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total income this month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="w-4 h-4 text-red-500" />
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
