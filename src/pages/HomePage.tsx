import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';
import Hero from '../components/Hero';
import About from '../components/about';
import Services from '../components/Services';
import TechnicalFluency from '../components/TechnicalFluency';
import WorkExperience from '../components/experience';
import Testimonials from '../components/Testimonials';
import WorkflowLoader from '../components/workFlow';
import DiscoverySection from '../components/CTAform';
import Footer from '../components/Footer';
import ExitIntentModal from '../components/ExitIntentModal';

const HomePage: React.FC = () => {
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const { hash } = useLocation();

  const [sections, setSections] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const allSections = Array.from(
      document.querySelectorAll('section, footer')
    ) as HTMLElement[];
    setSections(allSections);
  }, []);

  useEffect(() => {
    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--vh-full', `${h}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.visualViewport?.addEventListener('resize', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.visualViewport?.removeEventListener('resize', setVh);
    };
  }, []);

  // Arriving from another route with a hash (e.g. /#discovery from the
  // projects page) should land on that section, and open the form if asked.
  useEffect(() => {
    const id = hash.replace('#', '');
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (id === 'discovery') {
        window.dispatchEvent(new Event('openDiscoveryForm'));
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [hash]);

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
      <main>
        <Hero titleRef={heroTitleRef} subtitleRef={heroSubtitleRef} />
        <WorkExperience />
        <TechnicalFluency />
        <About />
        <Services />
        <Testimonials />
        <WorkflowLoader />
        <DiscoverySection />
      </main>

      <Footer />

      <ExitIntentModal />
    </>
  );
};

export default HomePage;
