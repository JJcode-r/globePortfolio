import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const BirdAnimation: React.FC = () => {
    const birdsRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const birds = birdsRef.current;
        if (!birds) return;

        const setupBirds = () => {
            const birdTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".morning", // Target the section for the scroll start
                    start: "top bottom",
                    end: "bottom top",
                    toggleActions: "play none none reverse",
                    scrub: true,
                }
            });

            // Bird animation path
            birdTimeline.to(birds, {
                opacity: 1,
                duration: 1,
                ease: "power2.inOut"
            })
            .to(birds, {
                motionPath: {
                    path: [
                        { x: -window.innerWidth * 0.2, y: window.innerHeight * 0.6 },
                        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.3 },
                        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.1 }
                    ],
                    curviness: 1.2
                },
                rotation: -15,
                ease: "none",
                duration: 5,
            })
            .to(birds, {
                motionPath: {
                    path: [
                        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.1 },
                        { x: -window.innerWidth * 0.3, y: window.innerHeight * 0.3 }
                    ],
                    curviness: 1.2
                },
                rotation: 15,
                duration: 3,
                ease: "power1.in"
            })
            .to(birds, {
                opacity: 0,
                duration: 0.5,
                ease: "power1.out"
            }, "-=0.5");

            // Flap effect
            gsap.to(birds, {
                scaleY: 0.85,
                yoyo: true,
                repeat: -1,
                duration: 0.2,
                ease: "power1.inOut"
            });
        };
        
        setupBirds();

    }, []);


    return (
        <img 
            ref={birdsRef} 
            src="https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bird.gif" 
            className="birds" 
            alt="A group of birds in flight"
        />
    );
};

export default BirdAnimation;