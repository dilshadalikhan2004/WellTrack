'use client';

import { useState, useRef, useEffect } from 'react';
import { ParticleCard } from '@/components/ui/MagicBento';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Square, Wind } from 'lucide-react';

export function BreathingExercise({ className }: { className?: string }) {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [text, setText] = useState('Ready?');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            let stepTime = 0;
            const cycleLength = 10000; // 4s in, 2s hold, 4s out = 10s?? No basic 4-7-8 is 19s. Let's do Box Breathing 4-4-4-4.
            // Or simpler: 4s Inhale, 4s Hold, 4s Exhale, 4s Hold. (Box).
            // Let's do simple 4s In, 4s Out for UI simplicity.

            const inhaleDuration = 4000;
            const holdDuration = 2000; // short pause
            const exhaleDuration = 4000;

            const totalCycle = inhaleDuration + holdDuration + exhaleDuration;

            const runCycle = () => {
                const now = Date.now();
                const loop = () => {
                    const elapsed = (Date.now() - now) % totalCycle;

                    if (elapsed < inhaleDuration) {
                        setPhase('inhale');
                        setText('Inhale...');
                        setProgress((elapsed / inhaleDuration) * 100);
                    } else if (elapsed < inhaleDuration + holdDuration) {
                        setPhase('hold');
                        setText('Hold');
                        setProgress(100);
                    } else {
                        setPhase('exhale');
                        setText('Exhale...');
                        // 100 -> 0
                        const exElapsed = elapsed - (inhaleDuration + holdDuration);
                        setProgress(100 - (exElapsed / exhaleDuration) * 100);
                    }

                    if (isActive) requestAnimationFrame(loop);
                };
                loop();
            };

            interval = setInterval(() => {
                // cycle triggers
            }, 100); // just for cleanup? actually RAF handles it better

            runCycle();
        } else {
            setText('Ready?');
            setProgress(0);
            setPhase('inhale');
        }

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <ParticleCard
            className={cn("h-full magic-bento-card--border-glow", className)}
            disableAnimations={false}
            particleCount={12}
            glowColor="14, 165, 233" // Sky blue
        >
            <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-sky-500/20 rounded-lg">
                        <Wind className="w-5 h-5 text-sky-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Instant Calm</h3>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Breathing Circle */}
                    <div className="relative flex items-center justify-center w-32 h-32">
                        <div
                            className={cn(
                                "absolute inset-0 rounded-full border-4 border-sky-500/30 transition-all [transition-duration:4000ms] ease-in-out",
                                isActive && phase === 'inhale' ? "scale-100 opacity-100" : "",
                                isActive && phase === 'hold' ? "scale-110 border-sky-400" : "",
                                isActive && phase === 'exhale' ? "scale-50 opacity-50" : "",
                                !isActive && "scale-75 opacity-30"
                            )}
                        />
                        <div
                            className={cn(
                                "w-full h-full rounded-full bg-sky-500/10 blur-xl absolute transition-all [transition-duration:4000ms]",
                                isActive && phase === 'inhale' ? "scale-100" : "",
                                isActive && phase === 'exhale' ? "scale-50" : "",
                                !isActive && "scale-0"
                            )}
                        />

                        <span className="text-2xl font-bold text-white transition-all drop-shadow-md">{text}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center w-full">
                    <Button
                        onClick={() => setIsActive(!isActive)}
                        variant={isActive ? "destructive" : "default"}
                        size="default"
                        className={cn(
                            "w-full transition-all font-semibold tracking-wide shadow-lg",
                            isActive
                                ? "bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30 shadow-red-500/10"
                                : "bg-sky-500 text-black hover:bg-sky-400 shadow-sky-500/20 hover:shadow-sky-500/40"
                        )}
                    >
                        {isActive ? (
                            <>
                                <Square className="w-4 h-4 mr-2 fill-current" /> Stop Session
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2 fill-current" /> Start Breathing
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </ParticleCard>
    );
}
