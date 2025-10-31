'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';


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
      <div className="p-2 mt-auto border-t">
        <UserMenu />
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm">
      <div className='flex items-center gap-4'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
             <NavContent />
          </SheetContent>
        </Sheet>
        
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Logo />
        </Link>
      </div>
      
      <UserMenu />
    </header>
  );
}

function UserMenu() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-10 h-10 rounded-full">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Settings className="w-4 h-4 mr-2" />
            Profile & Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
