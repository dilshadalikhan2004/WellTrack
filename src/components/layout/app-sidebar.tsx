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
  Bot,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';


const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mood', label: 'Mood', icon: Smile },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/journal', label: 'Journal', icon: NotebookPen },
  { href: '/counselor', label: 'AI Counselor', icon: Bot },
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
    <>
      {/* Mobile Sidebar */}
      <div className="sticky top-0 z-20 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm md:hidden">
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
        <div className="flex items-center justify-center flex-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Logo />
            </Link>
        </div>
        <div className='w-9'/>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-72 border-r bg-card md:block">
        <NavContent />
      </aside>
    </>
  );
}

function UserMenu() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

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
        <Button variant="ghost" className="w-full h-auto py-2 justify-start">
          <div className="flex items-center w-full gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user.photoURL || userAvatar?.imageUrl}
                alt={user.displayName || 'User'}
                data-ai-hint={userAvatar?.imageHint}
              />
              <AvatarFallback>
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
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
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Settings
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
