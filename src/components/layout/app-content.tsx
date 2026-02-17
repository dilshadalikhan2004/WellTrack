'use client';

import { useUser } from '@/firebase';
import { AuthGate } from '@/components/layout/auth-gate';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
import { FloatingCounselor } from '../counselor/floating-counselor';
import { usePathname } from 'next/navigation';

import { FloatingDock } from '@/components/ui/FloatingDock';
import { navigationItems } from '@/config/navigation';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const isPublicLayout = pathname === '/' || pathname === '/login' || pathname === '/signup';

  const dockItems = navigationItems;

  if (isUserLoading && !isPublicLayout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (isPublicLayout) {
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
        {/* AppSidebar removed as per user request to use FloatingDock only */}
        <div className="flex flex-col flex-1 pl-0 md:pl-0 lg:pl-0">
          <main className={cn('flex-1 pb-32')}>
            {children}
          </main>
        </div>
        <FloatingCounselor />
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <FloatingDock items={dockItems} />
        </div>
      </div>
    </AuthGate>
  );
}
