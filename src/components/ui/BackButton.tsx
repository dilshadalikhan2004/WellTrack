'use client';
import { ChevronLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { t } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    // Don't show back button on landing page or auth pages if desired, 
    // but user said "every page". 
    // However, usually back button on Landing Page (root) might not make sense if there is no history?
    // Or it might just go "back" in browser history.
    // I'll leave it enabled globally for now, maybe exclude strict root '/' if it's the home.
    if (pathname === '/') return null;

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed top-4 left-4 z-40 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors shadow-lg"
            onClick={() => router.back()}
        >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('nav.back')}</span>
        </motion.button>
    );
}
