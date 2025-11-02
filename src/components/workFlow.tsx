import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// NOTE: GSAP libraries are now loaded via CDN scripts below to fix compilation errors.
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/all';

// --- 🛠️ Configuration ---
const WORKFLOW_STEPS = [
	'Discovery', 
	'UI/UX Design',
	'Development',
	'Testing & QA',
	'Deployment',
	'Iteration',
	'Maintenance',
];

const ANIMATION_DURATION_MS = 14000; // total duration of full progress bar loop
const SEGMENTS = WORKFLOW_STEPS.length;

// --- CSS Constants ---
const TRACK_BACKGROUND = 'bg-white/10'; 
const DOT_COLOR = 'bg-white/40';
const FILL_GRADIENT = 'bg-[linear-gradient(90deg,#3b82f6,#06b6d4,#eab308,#f97316)]'; 

// Static styles (background size and box shadow) that apply regardless of animation state
const BASE_FILL_STYLES: React.CSSProperties = {
	backgroundSize: '400% 100%',
	boxShadow: '0 0 20px rgba(59, 130, 246, .8)', 
};

// The string for the CSS animation property
const FILL_ANIMATION_STRING = `fill ${ANIMATION_DURATION_MS / 1000}s linear infinite, shimmer 8s ease infinite`;

// Helper component to inject GSAP CDNs
const GSAPScripts = () => (
	<>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" async></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" async></script>
	</>
);


const WorkflowLoader: React.FC = () => {
	const componentRef = useRef<HTMLDivElement>(null); 
	const fillRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0); 
	const [hasScrolledIn, setHasScrolledIn] = useState(false); // State to control animation start
	// Ref to hold the GSAP timeline instance for cleanup
	const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);

	const currentIndex = useMemo(() => Math.min(SEGMENTS - 1, Math.floor(progress * SEGMENTS)), [progress]);

	// --- GSAP Setup and Entry Animation (Sets hasScrolledIn) ---
	useEffect(() => {
		let timeoutId: number;

		const checkAndInitializeGsap = () => {
			// Access GSAP and ScrollTrigger from the global window object
			// Use type assertion for window access since the global types aren't guaranteed in the TSX environment
			const gsapInstance = (window as any).gsap;
			const ScrollTriggerInstance = (window as any).ScrollTrigger;

			// Check if both libraries are fully loaded
			if (!gsapInstance || !ScrollTriggerInstance) {
				// Not ready yet, retry in 100ms
				timeoutId = window.setTimeout(checkAndInitializeGsap, 100);
				return;
			}

			// --- GSAP initialization is now guaranteed to run after scripts load ---

			// Register plugin (safe to call repeatedly once GSAP is fully loaded)
			gsapInstance.registerPlugin(ScrollTriggerInstance);
			
			const el = componentRef.current;
			if (!el) return;

			// Setup the animation timeline
			gsapInstance.set(el, { opacity: 0, y: 50 }); 
			
			const tl = gsapInstance.timeline({
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					once: true,
					onEnter: () => {
						gsapInstance.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
						setHasScrolledIn(true);
					},
				},
			});
			
			// Store the timeline for cleanup
			gsapTimelineRef.current = tl; 
		};

		// Start initialization attempt
		checkAndInitializeGsap();

		// Cleanup function for useEffect
		return () => {
			clearTimeout(timeoutId);
			
			const tl = gsapTimelineRef.current;
			const ScrollTriggerInstance = (window as any).ScrollTrigger;

			if (tl && ScrollTriggerInstance) {
				tl.kill();
				// Ensure we clean up the ScrollTrigger instance associated with the timeline
				if (tl.scrollTrigger) {
					// FIX TS2339: Asserting tl.scrollTrigger as 'any' to allow access to '.id'
					ScrollTriggerInstance.getById((tl.scrollTrigger as any).id)?.kill();
				}
			}
		};
	}, []); // Empty dependency array ensures it runs once on mount.

	// --- Progress Animation Loop with Synchronized Dots ---
	useEffect(() => {
		// Only start the animation loop if the component has scrolled into view
		if (!hasScrolledIn) return;

		let animationFrameId: number;
		const startTime = performance.now();

		const animateProgress = (timestamp: number) => {
			const elapsedTime = (timestamp - startTime) % ANIMATION_DURATION_MS;
			const currentProgress = elapsedTime / ANIMATION_DURATION_MS;
			setProgress(currentProgress);

			// Fill bar width
			if (fillRef.current) {
				fillRef.current.style.width = `${currentProgress * 100}%`;
			}

			animationFrameId = requestAnimationFrame(animateProgress);
		};

		animationFrameId = requestAnimationFrame(animateProgress);
		// Clean up the requestAnimationFrame loop
		return () => cancelAnimationFrame(animationFrameId);
	}, [hasScrolledIn]); // Dependency on hasScrolledIn

	// --- Step Label Classes ---
	const getStepClassDesktop = useCallback((index: number) => {
		let classes = 'label relative text-center text-gray-300 font-medium max-w-[100px] opacity-60 transition-all duration-600 ease-out whitespace-nowrap transform -rotate-[25deg] translate-y-[10px] scale-90 origin-top-left';
		if (index < currentIndex) classes += ' opacity-80 scale-100 translate-y-0 text-gray-400';
		if (index === currentIndex) classes += ' opacity-100 text-yellow-400 font-bold scale-[1.1] translate-y-0 shadow-yellow-400/40';
		classes += ' hidden md:flex lg:flex';
		return classes;
	}, [currentIndex]);

	// --- Dot Classes ---
	const getDotClass = useCallback((index: number) => {
		let classes = `dot w-5 h-5 rounded-full ${DOT_COLOR} transition-all duration-300 ease-out shadow-[0_0_0_2px_rgba(255,255,255,0.1),inset_0_0_8px_rgba(0,0,0,0.4)]`;
		if (index === currentIndex) {
			classes += ' !bg-white scale-[1.3] shadow-[0_0_25px_10px_rgba(60,140,250,0.5),0_0_45px_#f97316] animate-pulse';
		}
		classes += ' max-md:w-4 max-md:h-4 max-md:!scale-[1.2] max-md:animate-[pulse-sm_1.6s_ease-in-out_infinite]';
		return classes;
	}, [currentIndex]);

	return (
		<div className="relative flex justify-center items-center min-h-screen p-5 bg-[#0b0f14] overflow-hidden"
			style={{
				background: 'radial-gradient(circle at top, #16222a, #0b0f14 80%)',
				fontFamily: 'Inter, system-ui, sans-serif'
			}}
		>
			{/* Inject GSAP CDN scripts */}
			<GSAPScripts />

			{/* 🌌 Static Stars (Now conditional on hasScrolledIn) */}
			{hasScrolledIn && (
				<div className="absolute inset-0 overflow-hidden">
					{Array.from({ length: 40 }).map((_, i) => (
						<div
							key={i}
							className="star absolute rounded-full bg-white opacity-70"
							style={{
								width: `${Math.random() * 2 + 2}px`,
								height: `${Math.random() * 2 + 2}px`,
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
							}}
						/>
					))}
				</div>
			)}

			{/* Workflow Loader */}
			<div 
				ref={componentRef} 
				id='workflow'
				className="loader-wrap w-full max-w-[780px] relative p-12 rounded-3xl backdrop-blur-md border border-[rgba(255,255,255,0.08)] shadow-2xl z-10 max-md:p-8"
				style={{
					background: 'rgba(255, 255, 255, 0.05)',
					boxShadow: '0 10px 28px rgba(0, 0, 0, 0.6), 0 0 25px #3b82f6' 
				}}
			>
				{/* Heading */}
				<div className="loader-title text-white font-extrabold tracking-wide mb-3 text-3xl text-center">
					My Strategy 
				</div>
				<p className="text-gray-400 text-center mb-8 max-w-lg mx-auto text-sm">
				Every project is a journey. Here’s how I transform ideas into immersive, high-performing digital experiences, step by step.    </p>
				
				{/* Timeline */}
				<div className="timeline relative h-[150px] md:h-[150px] max-md:h-[100px]">
					{/* Track */}
					<div className={`track absolute left-0 right-0 h-3 rounded-full overflow-hidden ${TRACK_BACKGROUND} top-10 max-md:top-[30px] max-md:h-2`}>
						<div 
							ref={fillRef}
							className={`fill absolute left-0 top-0 h-full w-0 rounded-full ${FILL_GRADIENT}`}
							style={{
								...BASE_FILL_STYLES,
								// Conditionally apply the CSS animation (shimmer)
								animation: hasScrolledIn ? FILL_ANIMATION_STRING : 'none',
							}}
						/>
					</div>

					{/* Dots */}
					<div className="dots absolute left-0 right-0 flex justify-between top-9 max-md:top-[26px]">
						{WORKFLOW_STEPS.map((_, i) => (
							<div key={i} className={getDotClass(i)} />
						))}
					</div>

					{/* Labels (Desktop) */}
					<div className="labels absolute left-0 right-0 justify-between top-[90px] max-md:top-[60px] hidden md:flex">
						{WORKFLOW_STEPS.map((label, i) => (
							<div key={i} className={getStepClassDesktop(i)}>
								{label}
							</div>
						))}
					</div>
				</div>

				{/* Mobile Card View */}
				<div className="mt-8 md:hidden">
					<h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider text-center">Current Phase:</h3>
					<div 
							className="p-4 rounded-xl border border-blue-500/20 shadow-xl"
							style={{
								background: 'rgba(255, 255, 255, 0.03)',
								boxShadow: '0 0 20px rgba(59, 130, 246, .4)'
							}}
						>
							{WORKFLOW_STEPS.map((label, i) => (
								<div 
									key={i} 
									className={`text-base py-1 transition-all duration-300 ${
										i === currentIndex 
										? 'text-yellow-400 font-bold' 
										: 'text-gray-400'
									}`}
								>
									<span className={`inline-block mr-2 w-2 h-2 rounded-full ${
										i < currentIndex ? 'bg-green-500' : 
										i === currentIndex ? 'bg-yellow-400 animate-pulse-light' : 
										'bg-gray-700'
									}`}></span>
									{label}
								</div>
							))}
					</div>
				</div>
			</div>

			{/* Keyframes - REMOVED 'global' and 'jsx' props */}
			<style>{`
				@keyframes fill { 0% { width: 0%; } 100% { width: 100%; } }
				@keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
				@keyframes pulse { 0%, 100% { transform: scale(1.3); } 50% { transform: scale(1.5); } }
				@keyframes pulse-sm { 0%, 100% { transform: scale(1.2); } 50% { transform: scale(1.4); } }
				@keyframes pulse-light { 0%,100%{opacity:1;}50%{opacity:0.5;} }
				.animate-pulse-light { animation: pulse-light 1.6s ease-in-out infinite; }
				.shadow-yellow-400\\/40 { text-shadow: 0 0 10px rgba(251, 191, 36, 0.4); }
			`}</style>
		</div>
	);
};

export default WorkflowLoader;
