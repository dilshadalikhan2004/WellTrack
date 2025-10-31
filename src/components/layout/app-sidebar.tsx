
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Smile,
  Target,
  Trophy,
  BrainCircuit,
  Settings,
  LogOut,
  Flame,
  NotebookPen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mood', label: 'Mood', icon: Smile },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/journal', label: 'Journal', icon: NotebookPen },
  { href: '/awards', label: 'Awards', icon: Trophy },
  { href: '/insights', label: 'Insights', icon: BrainCircuit },
];

function NavContent() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 border-b">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className="justify-start w-full"
              as="a"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      {user && (
        <div className="p-2 border-t">
           <Separator className='my-2' />
          <div className="p-2">
            <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Button variant="ghost" className="justify-start w-full" asChild>
            <Link href="/profile">
              <Settings className="w-4 h-4 mr-2" />
              Profile & Settings
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm">
      <div className='flex items-center gap-4'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                D
               </div>
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
             <SheetHeader>
                <SheetTitle className='sr-only'>Main Navigation</SheetTitle>
             </SheetHeader>
             <NavContent />
          </SheetContent>
        </Sheet>
        
        <div className="text-lg font-semibold font-headline">
          WellTrack
        </div>
      </div>
    </header>
  );
}
