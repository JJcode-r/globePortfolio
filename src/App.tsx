import React, { useRef, useEffect, useState } from 'react';
// import type { RefObject } from 'react'; 
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero';
import About from './components/about';
import { InfiniteTechGrid } from './components/techStack';
import WorkExperience from './components/experience';
import Testimonials from './components/Testimonials';
import WorkflowLoader from './components/workFlow';
import CaseStudiesSlider from './components/caseStudies';
import DiscoverySection from './components/CTAform';
import Footer from './components/Footer';
import BirdAnimation from './components/BirdAnimation';

const App: React.FC = () => {
    // Refs for GSAP targeting (allowing null)
    const sunRef = useRef<HTMLDivElement>(null);
    const moonRef = useRef<HTMLDivElement>(null);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroSubtitleRef = useRef<HTMLParagraphElement>(null);

    // State to hold all section elements for GSAP ScrollTrigger setup
    const [sections, setSections] = useState<HTMLElement[]>([]);

    useEffect(() => {
        const allSections = Array.from(document.querySelectorAll("section, footer")) as HTMLElement[];
        setSections(allSections);
    }, []);

    return (
        <>
            <Navbar />
            <ThemeToggle 
                sunRef={sunRef} 
                moonRef={moonRef} 
                heroTitleRef={heroTitleRef} 
                heroSubtitleRef={heroSubtitleRef}
                sections={sections} 
            />
            <BirdAnimation />
            
            <main>
                <Hero titleRef={heroTitleRef} subtitleRef={heroSubtitleRef} />
                <About />
                <InfiniteTechGrid/>
                <WorkExperience />
                <Testimonials />
                <WorkflowLoader />
                <CaseStudiesSlider />
                <DiscoverySection />
            </main>
            
            <Footer />
        </>
    );
};

export default App;
