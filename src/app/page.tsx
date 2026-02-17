'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import { useUser } from '@/firebase';
import { TextReveal } from '@/components/ui/text-reveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import GradientBlinds from '@/components/ui/GradientBlinds';
import { motion } from 'framer-motion';
import { ParticleCard } from '@/components/ui/MagicBento';
import PillNav from '@/components/ui/PillNav';
import {
  Code2,
  Database,
  Lock,
  Sparkles,
  Zap
} from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      <ParticleCard
        className="h-full magic-bento-card--border-glow bg-white/5"
        disableAnimations={false}
        particleCount={6}
        glowColor="168, 85, 247"
      >
        <div className="flex flex-col items-start p-6 text-left h-full">
          <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
            <Icon className="h-6 w-6 text-primary transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
      </ParticleCard>
    </motion.div>
  );
}

export default function LandingPage() {
  const { user } = useUser();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
  ];

  if (user) {
    navItems.push({ label: 'Dashboard', href: '/dashboard' });
  } else {
    navItems.push({ label: 'Login', href: '/login' });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <PillNav
        items={navItems}
        baseColor="#000"
        pillColor="#fff"
        hoveredPillTextColor="#fff"
        pillTextColor="#000"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden min-h-[700px] flex items-center bg-black">
          <div className="absolute inset-0 z-0">
            <GradientBlinds
              gradientColors={['#FF9FFC', '#5227FF']} // Vibrant neon pink/purple
              angle={45} // Diagonal lines like the screenshot
              noise={0.4}
              blindCount={12}
              blindMinWidth={50}
              spotlightRadius={0.3} // Tighter spotlight for more dramatic effect
              spotlightSoftness={0.8}
              spotlightOpacity={1} // Full strength spotlight
              mouseDampening={0.15}
              distortAmount={0.1}
              shineDirection="left"
              // @ts-ignore
              mixBlendMode="normal" // Normal blend to let colors pop against black
              className="opacity-100" // Fully opaque
            />
          </div>
          {/* Subtle radial overlay to focus center, but keep it dark */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none"></div>

          <div className="container relative z-10 py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6 flex flex-col items-center justify-center space-y-4 text-center pointer-events-none">
            <div className="space-y-4 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4 relative z-20">
              <div className="flex justify-center flex-wrap">
                <TextReveal
                  text="Your Personal Wellness Companion"
                  className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white drop-shadow-2xl"
                />
              </div>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl mt-4 font-medium backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl">
                Data-driven tracking for your mind, body, and habits. <span className="text-primary font-bold">AI-powered insights</span> to help you thrive every day.
              </p>
            </div>
            <div className="space-x-4 animate-in fade-in zoom-in duration-1000 delay-200 slide-in-from-bottom-4 pt-6 pointer-events-auto">
              <Button asChild size="lg" className="h-14 px-10 text-xl font-semibold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all hover:scale-105 bg-white text-black hover:bg-gray-100 border-none">
                <Link href={user ? "/dashboard" : "/login"}>
                  {user ? "Go to Dashboard" : "Start Tracking Now"} <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-10 text-xl font-semibold border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                Everything You Need to Succeed
              </h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive tools designed to fit seamlessly into your life.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              <FeatureCard
                icon={TrendingUp}
                title="Mood Tracking"
                description="Monitor your emotional well-being with intuitive daily check-ins and visual trends."
                delay={0.1}
              />
              <FeatureCard
                icon={CheckCircle2}
                title="Habit Builder"
                description="Build lasting habits with streak tracking and customizable daily routines."
                delay={0.2}
              />
              <FeatureCard
                icon={BrainCircuit}
                title="AI Counselor"
                description="Get personalized, 24/7 support and insights powered by advanced AI."
                delay={0.3}
              />
              <FeatureCard
                icon={Users}
                title="Community Support"
                description="Connect with a supportive community to share goals and celebrate wins."
                delay={0.4}
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Safety Plan"
                description="Create a personalized safety plan for moments when you need extra support."
                delay={0.5}
              />
              <FeatureCard
                icon={ArrowRight}
                title="Goal Setting"
                description="Set ambitious goals and break them down into actionable steps."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                How It Works
              </h2>
              <p className="max-w-[700px] text-neutral-400 md:text-xl">
                Your journey to wellness in three simple steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <SpotlightCard className="h-full p-8 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 mb-2 ring-1 ring-blue-500/20">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">1. Track Your Day</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Quickly log your mood, habits, and activities. Our intuitive interface makes it effortless to capture your daily state.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard className="h-full p-8 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-purple-500/10 text-purple-500 mb-2 ring-1 ring-purple-500/20">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">2. AI Analysis</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Our advanced AI Engine processes your data to identify patterns, triggers, and correlation between your habits and mood.
                  </p>
                </div>
              </SpotlightCard>
              <SpotlightCard className="h-full p-8 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-green-500/10 text-green-500 mb-2 ring-1 ring-green-500/20">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">3. Improve & Thrive</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Receive personalized, actionable insights and CBT-based recommendations to improve your well-being over time.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-white/10 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 relative z-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to take control of your wellness?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of students who are improving their lives with WellTrack.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild className="w-full h-12 text-lg font-medium bg-white text-black hover:bg-gray-200" size="lg">
                <Link href={user ? "/dashboard" : "/login"}>
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                </Link>
              </Button>
              <p className="text-xs text-gray-500">
                No credit card required. Secure and private.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 WellTrack. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div >
  );
}


