import React, { useEffect } from 'react';
import gsap from 'gsap';
import { setupGsapAnimations } from '../gsapUtils';
import type { RefObject } from 'react'; 

interface CraterPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}


const existingCraters: CraterPosition[] = []; 

function checkCollision(newCraterRect: CraterPosition, existingCraters: CraterPosition[], minDistance: number = 15): boolean {
    for (const existing of existingCraters) {
        const dx = (newCraterRect.left + newCraterRect.width / 2) - (existing.left + existing.width / 2);
        const dy = (newCraterRect.top + newCraterRect.height / 2) - (existing.top + existing.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (newCraterRect.width / 2 + existing.width / 2 + minDistance)) {
            return true;
        }
    }
    return false;
}

function createMoonCraters(moonElement: HTMLDivElement) {
    existingCraters.length = 0; 
    const numCraters = gsap.utils.random(5, 10);
    const moonWidth = parseFloat(getComputedStyle(moonElement).width);
    const moonHeight = parseFloat(getComputedStyle(moonElement).height);

    for (let i = 0; i < numCraters; i++) {
        const crater = document.createElement("div");
        crater.className = "crater";
        const size = gsap.utils.random(15, 40);
        crater.style.width = size + "px";
        crater.style.height = size + "px";
        let attempts = 0;
        const maxAttempts = 50;
        let validPositionFound = false;

        while (!validPositionFound && attempts < maxAttempts) {
            const topPercent = gsap.utils.random(20, 80);
            const leftPercent = gsap.utils.random(20, 80);
            const absTop = (topPercent / 100) * moonHeight;
            const absLeft = (leftPercent / 100) * moonWidth;

            const newCraterPosition: CraterPosition = {
                top: absTop,
                left: absLeft,
                width: size,
                height: size
            };

            if (!checkCollision(newCraterPosition, existingCraters)) {
                crater.style.top = topPercent + "%";
                crater.style.left = leftPercent + "%";
                validPositionFound = true;
                existingCraters.push(newCraterPosition);
            }
            attempts++;
        }
        if (validPositionFound) {
            moonElement.appendChild(crater);
        }
    }
}

interface ThemeToggleProps {
    sunRef: RefObject<HTMLDivElement | null>;
    moonRef: RefObject<HTMLDivElement | null>;
    heroTitleRef: RefObject<HTMLHeadingElement | null>;
    heroSubtitleRef: RefObject<HTMLParagraphElement | null>;
    sections: HTMLElement[];
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ sunRef, moonRef, heroTitleRef, heroSubtitleRef, sections }) => {

    useEffect(() => {
        if (moonRef.current) {
            createMoonCraters(moonRef.current);
        }

        if (sections.length > 0) {
              setupGsapAnimations(sunRef, moonRef, heroTitleRef, heroSubtitleRef, sections);
        }

    }, [sections, sunRef, moonRef, heroTitleRef, heroSubtitleRef]);

    return (
        <>
            <div ref={sunRef} className="sun"></div>
            <div ref={moonRef} className="moon"></div>
        </>
    );
};

export default ThemeToggle;