import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { AppContent } from '@/components/layout/app-content';
import { GlobalErrorBoundary } from '@/components/global-error-boundary';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'WellTrack',
  description: 'Comprehensive Student Health & Habit Tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', ptSans.variable)}>
        <FirebaseClientProvider>
          <GlobalErrorBoundary>
            <div className="absolute top-0 left-0 -z-10 h-full w-full bg-background">
              <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/20 opacity-50 blur-[80px]"></div>
            </div>
            <AppContent>{children}</AppContent>
            <Toaster />
          </GlobalErrorBoundary>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
