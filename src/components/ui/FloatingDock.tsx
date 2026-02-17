'use client';

import { cn } from '@/lib/utils';
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/config/navigation';
import { t } from '@/lib/i18n';

export const FloatingDock = ({
    items,
    desktopClassName,
    mobileClassName,
}: {
    items: NavItem[];
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop items={items} className={desktopClassName} />
            <FloatingDockMobile items={items} className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({
    items,
    className,
}: {
    items: NavItem[];
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={cn('relative block md:hidden', className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center min-w-max"
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.9,
                                    transition: {
                                        delay: idx * 0.05,
                                    },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    key={item.title}
                                    className="flex items-center gap-3 px-4 py-3 rounded-full bg-neutral-900/95 backdrop-blur-md border border-white/10 shadow-xl w-full min-w-[160px] hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="h-5 w-5 text-primary">
                                        {item.icon}
                                    </div>
                                    <span className="text-sm font-medium text-neutral-200">
                                        {t(item.title)}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center border border-gray-200 dark:border-neutral-800 shadow-md transition-all group"
                aria-label={t(open ? 'dock.close' : 'dock.open')}
                aria-expanded={open}
                aria-haspopup="true"
            >
                <LayoutGrid
                    className={cn("h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-primary transition-transform duration-300", open && "rotate-180")}
                    aria-hidden="true"
                />
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({
    items,
    className,
}: {
    items: NavItem[];
    className?: string;
}) => {
    let mouseX = useMotionValue(Infinity);
    const [open, setOpen] = useState(false);

    return (
        <div className={cn('mx-auto hidden md:flex items-center gap-4', className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        onMouseMove={(e) => mouseX.set(e.pageX)}
                        onMouseLeave={() => mouseX.set(Infinity)}
                        className="flex h-16 gap-4 items-end rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 px-4 pb-3"
                    >
                        {items.map((item) => (
                            <IconContainer mouseX={mouseX} key={item.title} {...item} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen(!open)}
                className="h-16 w-16 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg hover:bg-white/5 transition-all group"
                aria-label={t(open ? 'dock.close' : 'dock.open')}
                aria-expanded={open}
                aria-haspopup="true"
            >
                <LayoutGrid
                    className={cn("h-6 w-6 text-neutral-400 group-hover:text-primary transition-transform duration-300", open && "rotate-180")}
                    aria-hidden="true"
                />
            </button>
        </div>
    );
};

function IconContainer({
    mouseX,
    title,
    icon,
    href,
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    href: string;
}) {
    let ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isActive = pathname === href;

    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

    let width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    let height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    return (
        <Link href={href}>
            <motion.div
                ref={ref}
                style={{ width, height } as any}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "aspect-square rounded-full flex items-center justify-center relative shadow-lg group",
                    isActive
                        ? "bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(132,0,255,0.4)]"
                        : "bg-neutral-900/80 border border-white/5 hover:shadow-[0_0_20px_rgba(132,0,255,0.3)] hover:border-primary/50 hover:bg-primary/10"
                )}
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: '-50%' }}
                            animate={{ opacity: 1, y: -10, x: '-50%' }}
                            exit={{ opacity: 0, y: 2, x: '-50%' }}
                            className="px-2 py-0.5 whitespace-pre rounded-md border bg-neutral-900 border-white/10 text-white absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs backdrop-blur-sm pointer-events-none"
                        >
                            {t(title)}
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className={cn(
                    "flex items-center justify-center w-full h-full transition-colors duration-200",
                    isActive ? "text-primary" : "text-neutral-400 group-hover:text-primary"
                )}>
                    {icon}
                </div>
            </motion.div>
        </Link>
    );
}
