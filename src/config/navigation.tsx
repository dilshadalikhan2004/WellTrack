import {
    LayoutDashboard,
    Smile,
    Flame,
    Target,
    Calendar,
    NotebookPen,
    BookHeart,
    Users,
    Trophy,
    BrainCircuit,
    ShieldAlert,
    Settings
} from 'lucide-react';
import React from 'react';

export interface NavItem {
    title: string;
    icon: React.ReactNode;
    href: string;
}

export const navigationItems: NavItem[] = [
    { title: 'nav.space', icon: <LayoutDashboard className="h-full w-full" />, href: '/dashboard' },
    { title: 'nav.mood', icon: <Smile className="h-full w-full" />, href: '/mood' },
    { title: 'nav.habits', icon: <Flame className="h-full w-full" />, href: '/habits' },
    { title: 'nav.goals', icon: <Target className="h-full w-full" />, href: '/goals' },
    { title: 'nav.schedule', icon: <Calendar className="h-full w-full" />, href: '/schedule' },
    { title: 'nav.journal', icon: <NotebookPen className="h-full w-full" />, href: '/journal' },
    { title: 'nav.library', icon: <BookHeart className="h-full w-full" />, href: '/library' },
    { title: 'nav.awards', icon: <Trophy className="h-full w-full" />, href: '/awards' },
    { title: 'nav.insights', icon: <BrainCircuit className="h-full w-full" />, href: '/insights' },
    { title: 'nav.community', icon: <Users className="h-full w-full" />, href: '/community' },
    { title: 'nav.safety', icon: <ShieldAlert className="h-full w-full" />, href: '/safety' },
    { title: 'nav.profile', icon: <Settings className="h-full w-full" />, href: '/profile' },
];
