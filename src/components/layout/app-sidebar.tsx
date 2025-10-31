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
  Landmark,
  BookHeart,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mood', label: 'Mood', icon: Smile },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/journal', label: 'Journal', icon: NotebookPen },
  { href: '/finance', label: 'Finance', icon: Landmark },
  { href: '/library', label: 'Library', icon: BookHeart },
  { href: '/awards', label: 'Awards', icon: Trophy },
  { href: '/insights', label: 'Insights', icon: BrainCircuit },
];

function NavLink({ href, label, icon: Icon }: (typeof navItems)[0]) {
  const pathname = usePathname();
  return (
    <Link href={href} passHref>
      <Button
        variant={pathname === href ? 'secondary' : 'ghost'}
        className="justify-start w-full"
        as="a"
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
}

function NavContent() {
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
    <div className="flex flex-col h-full w-60">
      <div className="flex items-center h-16 px-4 border-b">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>
      {user && (
        <div className="p-2 border-t">
          <Separator className="my-2" />
          <div className="p-2">
            <p className="text-sm font-medium leading-none">
              {user.displayName || user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Link href="/profile" passHref>
            <Button variant="ghost" className="justify-start w-full" as="a">
              <Settings className="w-4 h-4 mr-2" />
              Profile & Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="justify-start w-full"
            onClick={handleLogout}
          >
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
    <>
      <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Main navigation links for the WellTrack application.
              </SheetDescription>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="flex justify-center flex-1">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Logo />
          </Link>
        </div>
        {/* Placeholder for right-side header items if needed */}
        <div className="w-9 h-9" />
      </header>
    </>
  );
}
