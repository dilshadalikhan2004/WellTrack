'use client';

import { useUser } from '@/firebase';
import { AuthGate } from '@/components/layout/auth-gate';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
import { FloatingCounselor } from '../counselor/floating-counselor';
import { usePathname } from 'next/navigation';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isUserLoading && !isLoginPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }
  
  if(isLoginPage) {
    return (
       <AuthGate>
          <main className='flex-1'>
            {children}
          </main>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <div className="relative flex flex-col min-h-screen">
        <AppSidebar />
        <div>
            <main className={cn('flex-1')}>
            {children}
            </main>
        </div>
        <FloatingCounselor />
      </div>
    </AuthGate>
  );
}
