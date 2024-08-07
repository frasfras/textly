import React, { useState, useEffect } from "react";

const BlazingText = ({ text, fontSize = 48, glowColor = "#ffff00", glowIntensity = 0.5 }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const animateFlame = () => {
      setOffset((prevOffset) => (prevOffset + 1) % 100);
    };

    const intervalId = setInterval(animateFlame, 50);
    return () => clearInterval(intervalId);
  }, []);

  // Calculate blur based on intensity (0 to 1)
  const blurAmount = 2 + glowIntensity * 3;

  return (
    <svg width="100%" height="200" viewBox="0 0 800 200">
      <defs>
        <filter id="flames" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="50%" stopColor="#ff8c00" />
          <stop offset="100%" stopColor="#ffff00" />
        </linearGradient>

        <mask id="flameMask">
          <rect width="100%" height="200" fill="white" />
          <rect width="100%" height="200" fill="url(#flamePattern)" />
        </mask>

        <pattern id="flamePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y={(offset % 20) - 20} width="4" height="20" fill="black">
            <animate attributeName="y" from="-20" to="0" dur="1s" repeatCount="indefinite" />
          </rect>
        </pattern>

        <filter id="glow">
          <feFlood floodColor={glowColor} result="glow-color" />
          <feComposite in="glow-color" in2="SourceAlpha" operator="in" result="glow-alpha" />
          <feGaussianBlur in="glow-alpha" stdDeviation={blurAmount} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#glow)">
        <g filter="url(#flames)">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="url(#fireGradient)" fontSize={fontSize} fontWeight="bold" mask="url(#flameMask)">
            {text}
          </text>
        </g>
      </g>
    </svg>
  );
};

export default BlazingText;
