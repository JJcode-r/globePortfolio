import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { RefObject } from "react";

// --- Interface Definitions for ColorMap ---
interface ColorMapItem {
    bg: string;
    text: string;
    sun: string;
    glow: string;
    moonOpacity: number;
}
// ------------------------------------------

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const colorMap: ColorMapItem[] = [
    { bg: "#ffffff", text: "#000000", sun: "#fff7c2", glow: "rgba(255, 245, 200, 0.6)", moonOpacity: 0 },
    { bg: "#ffe5b4", text: "#000000", sun: "#ffe2a0", glow: "rgba(255, 220, 160, 0.6)", moonOpacity: 0 },
    { bg: "#fff7a6", text: "#000000", sun: "#fff788", glow: "rgba(255, 240, 140, 0.6)", moonOpacity: 0 },
    { bg: "#ffb07c", text: "#000000", sun: "#ffa45e", glow: "rgba(255, 160, 90, 0.6)", moonOpacity: 0.3 },
    { bg: "#ffe3b8", text: "#000000", sun: "#ffd68c", glow: "rgba(255, 210, 130, 0.5)", moonOpacity: 0.7 },
    { bg: "#0D1B2A", text: "#ffffff", sun: "#0D1B2A", glow: "rgba(13,27,42,0.4)", moonOpacity: 1 }
];

function safeQuery(selector: string) {
    try {
        return document.querySelector(selector) as HTMLElement | null;
    } catch {
        return null;
    }
}

const computeMoonPath = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return [
        { x: Math.max(120, Math.round(w - 150)), y: Math.max(80, Math.round(h * 0.12)) },
        { x: Math.round(w / 2), y: Math.round(h * 0.28) },
        { x: 30, y: Math.max(80, Math.round(h * 0.12)) }
    ];
};

const computeSunArcPath = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return [
        { x: Math.max(40, Math.round(w * 0.08)), y: Math.max(60, Math.round(h * 0.14)) },
        { x: Math.round(w * 0.5), y: Math.max(40, Math.round(h * 0.09)) },
        { x: Math.max(120, Math.round(w * 0.92)), y: Math.max(120, Math.round(h * 0.32)) }
    ];
};

const computeTopLeftAnchor = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return { x: Math.max(36, Math.round(w * 0.10)), y: Math.max(28, Math.round(h * 0.06)) };
};

const computeBirdsPath = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const startX = w + 200;
    const startY = Math.round(h * 0.3);
    const controlX1 = Math.round(w * 0.75);
    const controlY1 = Math.max(50, Math.round(h * 0.15));
    const controlX2 = Math.round(w * 0.25);
    const controlY2 = Math.round(h * 0.25);
    const endX = -200;
    const endY = Math.round(h * 0.35);

    return [
        { x: startX, y: startY },
        { x: controlX1, y: controlY1 },
        { x: controlX2, y: controlY2 },
        { x: endX, y: endY }
    ];
};


export function setupGsapAnimations(
    sunRef: RefObject<HTMLDivElement | null>,
    moonRef: RefObject<HTMLDivElement | null>,
    heroTitleRef: RefObject<HTMLHeadingElement | null>,
    heroSubtitleRef: RefObject<HTMLParagraphElement | null>,
    sections: HTMLElement[]
) {
    if (!sunRef?.current || !moonRef?.current || !heroTitleRef?.current || !heroSubtitleRef?.current) return;

    const sun = sunRef.current!;
    const moon = moonRef.current!;
    const heroTitle = heroTitleRef.current!;
    const heroSubtitle = heroSubtitleRef.current!;
    const navbar = safeQuery(".navbar");
    const menuToggle = safeQuery(".menu-toggle");
    const birds = safeQuery(".birds-flock");
    const initialBirdPos = computeBirdsPath()[0];

    // Respect OS-level reduced motion preference
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- GSAP Set ---
    gsap.set(sun, {
        position: "fixed", left: "50%", top: "50vh", xPercent: -50, yPercent: -50, zIndex: 1,
        willChange: "transform, left, top, background-color, box-shadow"
    });

    gsap.set(moon, {
        position: "fixed", width: 92, height: 92, borderRadius: "50%", zIndex: 1,
        left: `${Math.max(40, Math.round(window.innerWidth * 0.72))}px`,
        top: `${Math.max(40, Math.round(window.innerHeight * 0.12))}px`,
        opacity: 0, transformOrigin: "50% 50%",
        background:
            "radial-gradient(circle at 35% 34%, rgba(255,255,255,0.96) 0%, rgba(250,250,250,0.92) 28%, rgba(235,235,235,0.88) 55%, rgba(220,220,220,0.82) 100%)," +
            "radial-gradient(circle at 62% 56%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 30%)," +
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 60%)",
        boxShadow: "0 14px 32px rgba(0,0,0,0.14), inset 0 -6px 18px rgba(0,0,0,0.04)"
    });

    if (birds) {
        gsap.set(birds, {
            position: "fixed", x: initialBirdPos.x, y: initialBirdPos.y, zIndex: 0,
            willChange: "transform, opacity", opacity: 0,
            scale: window.innerWidth < 768 ? 0.6 : 1
        });
    }

    gsap.set(heroTitle, { opacity: 0, y: 50 });
    gsap.set(heroSubtitle, { opacity: 0, y: 50 });

    gsap.set(sun, {
        backgroundColor: "#9ca3af", borderRadius: "50%", width: 112, height: 112,
        boxShadow: "0 0 0 rgba(0,0,0,0)", opacity: 0, scale: 0.94
    });

    // Utility: set moon visible state based on a colorMap index
    const setMoonVisibilityForIndex = (index: number) => {
        const map = colorMap[Math.max(0, Math.min(index, colorMap.length - 1))];
        if (map.moonOpacity > 0) {
            gsap.to(moon, { opacity: 1, duration: 0.8, ease: "power3.out", overwrite: true });
        } else {
            gsap.to(moon, { opacity: 0, duration: 0.6, ease: "power3.in", overwrite: true });
        }
    };

    const topLeft = computeTopLeftAnchor();

    // Shared scroll-scrub for sun position — set up after intro (or immediately for reduced-motion)
    const setupSunScrollScrub = () => {
        gsap.to(sun, {
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                // scrub: 1 adds a gentle lag that makes the arc feel physical
                scrub: 1,
                invalidateOnRefresh: true
            },
            motionPath: {
                path: computeSunArcPath(),
                curviness: 1.6
            },
            ease: "none",
            immediateRender: false
        });
    };

    const onResize = () => {
        ScrollTrigger.refresh();
        if (birds) {
            const scaleValue = window.innerWidth < 768 ? 0.6 : 1;
            gsap.to(birds, { scale: scaleValue, duration: 0.3, overwrite: true });
        }
    };

    if (reduceMotion) {
        // Skip all intro motion — snap to final states immediately
        gsap.set(sun, {
            left: topLeft.x, top: topLeft.y, xPercent: 0, yPercent: 0,
            opacity: 1, scale: 1,
            backgroundColor: colorMap[0].sun,
            boxShadow: `0 40px 120px ${colorMap[0].glow}`
        });
        gsap.set(heroTitle, { opacity: 1, y: 0 });
        gsap.set(heroSubtitle, { opacity: 1, y: 0 });

        // Still wire up scroll-based sun position (user-initiated, not auto-playing)
        setupSunScrollScrub();
        window.addEventListener("resize", onResize);
    } else {
        // --- Full Sun Intro Timeline ---
        const sunIntroTimeline = gsap.timeline({
            // power4.out gives a fast initial move that decelerates smoothly into place —
            // more natural than power3.inOut which lingers on the exit too long
            defaults: { ease: "power4.out" },
            onComplete: () => {
                setupSunScrollScrub();
                window.addEventListener("resize", onResize);
                (sunIntroTimeline as any)._onResize = onResize;
            }
        });

        sunIntroTimeline
            .fromTo(
                sun,
                { left: "50%", top: "50vh", xPercent: -50, yPercent: -50, backgroundColor: "#9ca3af", opacity: 0, scale: 0.94 },
                // Slightly shorter duration: snappier arrival, still feels organic
                { left: topLeft.x, top: topLeft.y, xPercent: 0, yPercent: 0, opacity: 1, scale: 1, duration: 1.9 }
            )
            .to(sun, { backgroundColor: colorMap[0].sun, duration: 1.3 }, "-=1.1")
            .to(sun, { boxShadow: `0 40px 120px ${colorMap[0].glow}`, duration: 1.2 }, "-=1.0");
            // Removed: mechanical yoyo bounce — the sun simply arrives at rest

        const heroTimeline = gsap.timeline({ defaults: { duration: 0.95, ease: "power3.out" } });
        heroTimeline.to(heroTitle, { opacity: 1, y: 0 }).to(heroSubtitle, { opacity: 1, y: 0 }, "<0.18>");
        sunIntroTimeline.add(heroTimeline, ">");
    }

    // --- Birds Motion Trigger ---
    if (!reduceMotion && birds && sections.length >= 4) {
        const heroSection = sections[0];
        const flightEndSection = sections[2];

        const birdsTween = gsap.to(birds, {
            motionPath: { path: computeBirdsPath(), curviness: 1.25, align: "self" },
            ease: "none", paused: true, immediateRender: false
        });

        ScrollTrigger.create({
            id: "birds-main",
            trigger: heroSection,
            start: "bottom top",
            endTrigger: flightEndSection,
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,

            onEnter: () => gsap.to(birds, { opacity: 1, duration: 0.4 }),
            onLeaveBack: () => {
                gsap.to(birds, { opacity: 0, duration: 0.4, onComplete: () => { birdsTween.progress(0); }});
            },
            onUpdate: (self) => { birdsTween.progress(self.progress); },
            onRefresh: (self) => {
                const isBeforeStart = self.scroll() < self.start;
                const isAfterEnd = self.scroll() > self.end;
                if (isBeforeStart) {
                    gsap.set(birds, { opacity: 0 }); birdsTween.progress(0);
                } else if (isAfterEnd) {
                    gsap.set(birds, { opacity: 0 }); birdsTween.progress(1);
                } else {
                    gsap.set(birds, { opacity: 1 }); birdsTween.progress(self.progress);
                }
            }
        });

        ScrollTrigger.addEventListener("refreshInit", () => {
            (birdsTween.vars.motionPath as { path: any }).path = computeBirdsPath();
            birdsTween.invalidate();
            const newInitialPos = computeBirdsPath()[0];
            gsap.set(birds, { x: newInitialPos.x, y: newInitialPos.y });
        });
    }


    // --- Moon Motion ---
    const duskSections = Array.from(document.querySelectorAll<HTMLElement>(".dusk"));

    if (duskSections.length) {
        duskSections.forEach((duskSec, idx) => {
            const moonTween = gsap.to(moon, {
                motionPath: { path: computeMoonPath(), curviness: 1.55 },
                ease: "none", paused: true, immediateRender: false
            });

            ScrollTrigger.addEventListener("refreshInit", () => {
                (moonTween.vars.motionPath as { path: any }).path = computeMoonPath();
                moonTween.invalidate();
            });

            ScrollTrigger.create({
                trigger: duskSec,
                start: "top center",
                end: "bottom center",
                // scrub: 1.5 — moon lags behind scroll slightly, feels heavier/more atmospheric
                scrub: reduceMotion ? true : 1.5,
                invalidateOnRefresh: true,
                onEnter: (self) => { setMoonVisibilityForIndex(idx); moonTween.play(); moonTween.progress(self.progress); },
                onUpdate: (self) => {
                    moonTween.progress(self.progress);
                    if (!reduceMotion) {
                        gsap.to(moon, { rotation: 3 * self.progress, duration: 0.1, overwrite: true });
                    }
                },
                onLeave: (_) => {
                    const nextIndex = Math.min(idx + 1, colorMap.length - 1);
                    if (colorMap[nextIndex]?.moonOpacity > 0) { moonTween.progress(1); setMoonVisibilityForIndex(nextIndex); }
                    else { gsap.to(moon, { opacity: 0, duration: 0.6, ease: "power3.in", overwrite: true }); moonTween.pause(); }
                },
                onEnterBack: (self) => { setMoonVisibilityForIndex(idx); moonTween.play(); moonTween.progress(self.progress); },
                onLeaveBack: (_) => {
                    const prevIndex = Math.max(idx - 1, 0);
                    if (colorMap[prevIndex]?.moonOpacity > 0) { setMoonVisibilityForIndex(prevIndex); moonTween.progress(0); }
                    else { gsap.to(moon, { opacity: 0, duration: 0.6, ease: "power3.in", overwrite: true }); moonTween.pause(); }
                }
            });
        });
    } else {
        gsap.set(moon, { opacity: 0 });
    }

    // --- Color Transitions ---
    sections.forEach((sec, i) => {
        const applyMap = (index: number) => {
            const map = colorMap[Math.max(0, Math.min(index, colorMap.length - 1))];
            const dur = reduceMotion ? 0 : 0.85;
            gsap.to(document.body, { backgroundColor: map.bg, color: map.text, duration: dur, ease: "power2.out", overwrite: "auto" });
            gsap.to(sun, { backgroundColor: map.sun, boxShadow: `0 0 60px ${map.glow}`, duration: dur, ease: "power2.out", overwrite: "auto" });
            gsap.to(sun, { opacity: 1 - map.moonOpacity, duration: dur, ease: "power2.out", overwrite: "auto" });

            setMoonVisibilityForIndex(index);

            if (navbar) { index >= colorMap.length - 1 ? navbar.classList.add("dark") : navbar.classList.remove("dark"); }
            if (menuToggle) { index >= colorMap.length - 1 ? menuToggle.classList.add("dark") : menuToggle.classList.remove("dark"); }

            const isNightSection = index >= colorMap.length - 2;
            window.dispatchEvent(new CustomEvent("themeChange", { detail: isNightSection ? "night" : "day" }));

            if (index >= 3 && birds) {
                gsap.to(birds, { opacity: 0, duration: 0.5, overwrite: true });
            }
        };

        ScrollTrigger.create({
            trigger: sec,
            start: "top center", end: "bottom center",
            onEnter: () => applyMap(i), onLeave: () => applyMap(Math.min(i + 1, colorMap.length - 1)),
            onEnterBack: () => applyMap(i), onLeaveBack: () => applyMap(Math.max(i - 1, 0)),
            markers: false
        });
    });

    // Section fade-ins — skip for reduced motion
    if (!reduceMotion) {
        sections.slice(1).forEach((sec) => {
            gsap.from(sec, {
                opacity: 0, y: 30, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: sec, start: "top 80%", invalidateOnRefresh: true }
            });
        });
    }

    // --- Cleanup ---
    return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.killTweensOf(sun);
        gsap.killTweensOf(moon);
        if (birds) gsap.killTweensOf(birds);
        gsap.killTweensOf(heroTitle);
        gsap.killTweensOf(heroSubtitle);
        window.removeEventListener("resize", onResize);
    };
}
