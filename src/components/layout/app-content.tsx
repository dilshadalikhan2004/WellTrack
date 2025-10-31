'use client';

import { useUser } from '@/firebase';
import { AuthGate } from '@/components/layout/auth-gate';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
import { FloatingCounselor } from '../counselor/floating-counselor';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <AuthGate>
      <div className="relative flex min-h-screen">
        {user && <AppSidebar />}
        <main className={cn('flex-1', user ? 'md:pl-72' : '')}>
          {children}
        </main>
        {user && <FloatingCounselor />}
      </div>
    </AuthGate>
  );
}
