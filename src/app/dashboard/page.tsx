'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { TodaysHabits } from '@/components/dashboard/todays-habits';
import { WeeklyMoodChart } from '@/components/dashboard/weekly-mood-chart';
import { ActiveGoals } from '@/components/dashboard/active-goals';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { GlobalSpotlight, ParticleCard } from '@/components/ui/MagicBento';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { BreathingExercise } from '@/components/dashboard/BreathingExercise';

export default function DashboardPage() {
  const { user } = useUser();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const gridRef = useRef<HTMLDivElement>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Reset top padding since PillNav is gone. */}
      <div className="flex-1 p-4 space-y-4 md:p-8 pt-8 pb-32" ref={gridRef}>
        <GlobalSpotlight gridRef={gridRef} glowColor="132, 0, 255" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <WelcomeHeader userName={userName} />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <QuickStats />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        >
          <motion.div variants={item} className="lg:col-span-4 h-full">
            <ParticleCard className="h-full magic-bento-card--border-glow" disableAnimations={false} particleCount={8}>
              <TodaysHabits className="h-full bg-transparent border-none" />
            </ParticleCard>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-3 h-full">
            <ParticleCard className="h-full magic-bento-card--border-glow" disableAnimations={false} particleCount={8}>
              <WeeklyMoodChart className="h-full bg-transparent border-none" />
            </ParticleCard>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-3 h-full">
            <ParticleCard className="h-full magic-bento-card--border-glow" disableAnimations={false} particleCount={8}>
              <ActiveGoals className="h-full bg-transparent border-none" />
            </ParticleCard>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-2 h-full">
            <ParticleCard className="h-full magic-bento-card--border-glow" disableAnimations={false} particleCount={12} glowColor="168, 85, 247">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your personalized wellness report.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center border-2 border-dashed border-white/10 rounded-lg bg-black/20">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <p className="mb-4 text-sm text-gray-400">
                    Discover patterns and get recommendations to boost your
                    well-being.
                  </p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/insights">Generate My Report</Link>
                  </Button>
                </div>
              </CardContent>
            </ParticleCard>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-2 h-full">
            <BreathingExercise />
          </motion.div>
        </motion.div>
      </div>


      {/* FloatingDock removed from here as it's global now */}
    </div>
  );
}
