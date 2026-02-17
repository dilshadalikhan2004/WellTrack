'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { TrendingUp, Menu, X } from 'lucide-react';
import './PillNav.css';

interface NavItem {
    label: string;
    href: string;
    ariaLabel?: string;
}

interface PillNavProps {
    items: NavItem[];
    className?: string;
    ease?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
    navBackground?: string;
    initialLoadAnimation?: boolean;
}

const PillNav = ({
    items,
    className = '',
    ease = 'power3.easeOut',
    baseColor = '#000',
    pillColor = '#fff',
    hoveredPillTextColor = '#fff', /* When hovered (and bubble expands), text turns white */
    pillTextColor = '#000', /* Default pill text color */
    navBackground,
    initialLoadAnimation = true
}: PillNavProps) => {
    const pathname = usePathname();
    const activeHref = pathname;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
    const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);

    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        // Layout calculation for hover circles
        const layout = () => {
            circleRefs.current.forEach((circle, index) => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                // We use clientWidth/Height to avoid subpixel issues? No, getBoundingClientRect is better usually.
                // But pill might be scaled if animating? 
                // Let's stick to standard logic from the snippet.
                const w = rect.width;
                const h = rect.height;

                // Logic to cover the pill with a circle expanding from bottom center
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector('.pill-label');
                const whiteLabel = pill.querySelector('.pill-label-hover');

                // Initial positions
                // label (black) acts as default. 
                // whiteLabel (white) acts as hover state.
                if (label) gsap.set(label, { y: 0 });
                if (whiteLabel) gsap.set(whiteLabel, { y: h + 12, opacity: 0 }); // Start below

                const tl = gsap.timeline({ paused: true });

                // Expand circle
                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }, 0);

                // Move default label up and out
                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 0.4, ease: 'power2.out', overwrite: 'auto' }, 0);
                }

                // Move hover label up and in
                if (whiteLabel) {
                    // Reset position before animating? No, set initial above.
                    gsap.set(whiteLabel, { y: Math.ceil(h + 20), opacity: 0 }); // Ensure it starts below
                    tl.to(whiteLabel, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        // Run layout after a tick to ensure styles applied
        const timer = setTimeout(layout, 100);
        window.addEventListener('resize', layout);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', layout);
        };
    }, [items]);

    // Mobile menu animation
    useEffect(() => {
        const menu = mobileMenuRef.current;
        if (menu) {
            if (isMobileMenuOpen) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(menu,
                    { opacity: 0, y: -20, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.2)' }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0, y: -20, scale: 0.95, duration: 0.2, ease: 'power2.in',
                    onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); }
                });
            }
        }
    }, [isMobileMenuOpen]);

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (tl) tl.play();
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (tl) tl.reverse();
    };

    const cssVars = {
        ['--base']: baseColor,
        ['--pill-bg']: pillColor,
        ['--hover-text']: hoveredPillTextColor,
        ['--pill-text']: pillTextColor,
        ['--nav-bg']: navBackground
    } as React.CSSProperties;

    return (
        <div className={cn("pill-nav-container", className)}>
            <nav className="pill-nav" style={cssVars}>
                {/* Logo */}
                <Link
                    className="pill-logo group"
                    href="/"
                    aria-label="Home"
                    ref={logoRef}
                >
                    <TrendingUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </Link>

                {/* Desktop Items */}
                <div className="pill-nav-items desktop-only" ref={navItemsRef}>
                    <ul className="pill-list">
                        {items.map((item, i) => {
                            const isActive = activeHref === item.href;
                            return (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className={cn("pill", isActive && "is-active")}
                                        aria-label={item.ariaLabel || item.label}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                    >
                                        <span
                                            className="hover-circle"
                                            ref={(el) => { circleRefs.current[i] = el; }}
                                        />
                                        <span className="label-stack">
                                            <span className="pill-label">{item.label}</span>
                                            <span className="pill-label-hover" aria-hidden="true">
                                                {item.label}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-menu-button mobile-only"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                    ref={hamburgerRef}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-5 h-5 text-white" />
                    ) : (
                        <Menu className="w-5 h-5 text-white" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu Popover */}
            <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef}>
                <ul className="mobile-menu-list">
                    {items.map((item, i) => (
                        <li key={i}>
                            <Link
                                href={item.href}
                                className={cn("mobile-menu-link", activeHref === item.href && "bg-white/10")}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PillNav;
