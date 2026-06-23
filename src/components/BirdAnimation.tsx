import React from 'react';

// All GSAP animation for the birds is controlled centrally in gsapUtils.ts.
// This component only renders the element; gsapUtils.ts queries ".birds"
// and drives motion-path, opacity, and wing-flap via ScrollTrigger.
const BirdAnimation: React.FC = () => (
    <img
        src="https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bird.gif"
        className="birds"
        alt="Birds in flight"
        aria-hidden="true"
    />
);

export default BirdAnimation;
