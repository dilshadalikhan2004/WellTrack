
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
  Calendar,
  BookHeart,
  Menu,
  ShieldAlert,
  Users,
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
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mood', label: 'Mood', icon: Smile },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/journal', label: 'Journal', icon: NotebookPen },

  { href: '/library', label: 'Library', icon: BookHeart },
  { href: '/awards', label: 'Awards', icon: Trophy },
  { href: '/insights', label: 'Insights', icon: BrainCircuit },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/safety', label: 'Safety Plan', icon: ShieldAlert },
];

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: (typeof navItems)[0] & { onClick: () => void }) {
  const pathname = usePathname();
  return (
    <Button
      variant={pathname === href ? 'secondary' : 'ghost'}
      className="justify-start w-full"
      asChild
      onClick={onClick}
    >
      <Link href={href}>
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}

function NavContent({ onLinkClick }: { onLinkClick: () => void }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      // AuthGate will handle the redirect to '/' since we are now unauthenticated
      // But we can also force it for better UX responsiveness (immediate feedback)
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
    onLinkClick();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 border-b">
        <Link href="/" onClick={onLinkClick}>
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={onLinkClick} />
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
          <Button
            variant="ghost"
            className="justify-start w-full"
            asChild
            onClick={onLinkClick}
          >
            <Link href="/profile">
              <Settings className="w-4 h-4 mr-2" />
              Profile & Settings
            </Link>
          </Button>
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleLinkClick = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-60">
          <SheetHeader className="sr-only">
            <SheetTitle>WellTrack</SheetTitle>
            <SheetDescription>
              Your personal wellness companion.
            </SheetDescription>
          </SheetHeader>
          <NavContent onLinkClick={handleLinkClick} />
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <Logo />
      </Link>
      <div className="w-9 h-9" />
    </header>
  );
}
