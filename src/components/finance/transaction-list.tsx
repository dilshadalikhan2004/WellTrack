
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { FinancialTransaction } from "@/lib/types";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Utensils, Bus, Home, Film, ShoppingBag, Gift, Briefcase, HandCoins, Wallet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Timestamp } from "firebase/firestore";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const categoryIcons: Record<string, React.ElementType> = {
    Food: Utensils,
    Transport: Bus,
    Housing: Home,
    Entertainment: Film,
    Shopping: ShoppingBag,
    'Pocket Money': HandCoins,
    Salary: Briefcase,
    Gift: Gift,
    'Side Hustle': HandCoins,
    Other: Wallet,
};

type TransactionListProps = {
    transactions: FinancialTransaction[];
    isLoading: boolean;
    onDeleteTransaction: (transaction: FinancialTransaction) => void;
    className?: string;
}

export function TransactionList({ transactions, isLoading, onDeleteTransaction, className }: TransactionListProps) {

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Loading transactions...</p>}
                {!isLoading && transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed rounded-lg bg-muted/50">
                        <Wallet className="w-10 h-10 mb-4 text-muted-foreground" />
                        <p className="font-semibold">No transactions yet!</p>
                        <p className="text-sm text-muted-foreground">Click "Add Transaction" to get started.</p>
                    </div>
                )}
                {!isLoading && transactions.length > 0 && (
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {transactions.map(t => {
                            const Icon = t.type === 'income' 
                                ? TrendingUp 
                                : categoryIcons[t.category] || Wallet;
                            const color = t.type === 'income' ? 'text-green-500' : 'text-red-500';
                            const sign = t.type === 'income' ? '+' : '-';

                             return (
                                <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg bg-background">
                                    <div className={cn("p-2 rounded-full bg-muted", t.type === 'income' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50')}>
                                        <Icon className={cn("w-5 h-5", t.type === 'income' ? 'text-green-600' : 'text-red-600')} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{t.description}</p>
                                        <p className="text-sm text-muted-foreground">{t.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn("font-semibold", color)}>{sign}₹{t.amount.toFixed(2)}</p>
                                        {t.timestamp && <p className="text-xs text-muted-foreground">
                                            {format((t.timestamp as Timestamp).toDate(), 'MMM d, yyyy')}
                                        </p>}
                                    </div>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this transaction and update your balance.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => onDeleteTransaction(t)}>
                                                Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
