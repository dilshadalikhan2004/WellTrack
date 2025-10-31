
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const PUBLIC_PATHS = ['/login', '/signup'];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is determined
    }

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (user && isPublicPath) {
      // If user is logged in and tries to access a public page, redirect to home
      router.replace('/');
    } else if (!user && !isPublicPath) {
      // If user is not logged in and tries to access a protected page, redirect to login
      router.replace('/login');
    }
  }, [user, isUserLoading, router, pathname]);

  // While loading, or if conditions aren't met for redirection, show a loading state or nothing
  if (isUserLoading || (!user && !PUBLIC_PATHS.includes(pathname)) || (user && PUBLIC_PATHS.includes(pathname))) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
