'use client';

import { useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.2, // Small delay before typing starts
        },
    },
};

const defaultChildVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
    },
};

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    useEffect(() => {
        if (isInView) {
            // Add manual delay via setTimeout if needed, or rely on variants
            if (delay > 0) {
                setTimeout(() => controls.start('visible'), delay * 1000);
            } else {
                controls.start('visible');
            }
        }
    }, [isInView, controls, delay]);

    const words = text.split(' ');

    return (
        <motion.h2
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={defaultContainerVariants}
            className={className}
        >
            {words.map((word, i) => (
                <span key={i} className="inline-block mr-2 last:mr-0">
                    {word.split('').map((char, index) => (
                        <motion.span
                            key={`${i}-${index}`}
                            variants={defaultChildVariants}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.h2>
    );
}
