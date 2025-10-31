'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { stringify } from 'csv-stringify/browser/esm/sync';
import type { FinancialTransaction } from '@/lib/types';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';

type DownloadReportButtonProps = {
  transactions: FinancialTransaction[];
};

export function DownloadReportButton({ transactions }: DownloadReportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const currentMonthTransactions = transactions.filter((t) => {
        if (!t.timestamp) return false;
        const transactionDate = t.timestamp instanceof Timestamp ? t.timestamp.toDate() : new Date(t.timestamp);
        return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      });

      if (currentMonthTransactions.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Data',
          description: 'There are no transactions for the current month to download.',
        });
        return;
      }

      const dataForCsv = currentMonthTransactions.map(t => ({
        date: t.timestamp ? format((t.timestamp as Timestamp).toDate(), 'yyyy-MM-dd') : '',
        description: t.description,
        category: t.category,
        type: t.type,
        amount: t.amount.toFixed(2),
      }));

      const csvString = stringify(dataForCsv, {
        header: true,
        columns: [
          { key: 'date', header: 'Date' },
          { key: 'description', header: 'Description' },
          { key: 'category', header: 'Category' },
          { key: 'type', header: 'Type' },
          { key: 'amount', header: 'Amount (INR)' },
        ],
      });

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const fileName = `WellTrack_Report_${format(now, 'MMMM-yyyy')}.csv`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Download Started',
        description: 'Your monthly report is being downloaded.',
      });

    } catch (error) {
        console.error("Failed to generate report", error);
        toast({
            variant: 'destructive',
            title: 'Download Failed',
            description: 'Could not generate the report.',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Download Report
    </Button>
  );
}
