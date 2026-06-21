import React, { useEffect, useRef } from 'react';
import { useCarbonShadow } from '../../context/CarbonShadowContext';

/**
 * Ambient background particle engine reacting to global carbon footprint state.
 * Rendered as transparent overlay (no opaque fill) to preserve Scene1's cosmic background.
 * Optimized with useRef to ensure butterly smooth 60 FPS slider interactions.
 */
export function ParticleBackground() {
  const canvasRef = useRef(null);
  const { footprint, scene } = useCarbonShadow();
  const animationFrameId = useRef(null);

  // Keep latest footprint in ref to avoid tearing down the canvas loop on every slider tick
  const footprintRef = useRef(footprint);
  useEffect(() => {
    footprintRef.current = footprint;
  }, [footprint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Pre-create the maximum number of particles
    const MAX_PARTICLES = 250;
    const particles = Array.from({ length: MAX_PARTICLES }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5),
      vy: -Math.random() - 0.1,
      size: Math.random() * 1.8 + 0.3,
      wiggleSeed: Math.random() * 100,
      wiggleSpeed: 0.01 + Math.random() * 0.02
    }));

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Extract current coefficients dynamically
      const currentFootprint = footprintRef.current;
      const footprintVal = currentFootprint ? currentFootprint.totalDailyGrams : 200;
      const normalizedFootprint = Math.min(1.0, Math.max(0.05, footprintVal / 1800.0));
      
      const activeCount = Math.round(100 + normalizedFootprint * 150);
      const baseSpeed = 0.15 + normalizedFootprint * 1.0;
      const chaosCoeff = normalizedFootprint * 0.5;

      // Define colors strictly based on the Cyan, Violet, and White theme
      let colors = ['rgba(0, 240, 255, 0.22)', 'rgba(157, 78, 221, 0.18)', 'rgba(255, 255, 255, 0.18)'];
      if (normalizedFootprint < 0.25) {
        // Lighter presence - mostly Cyan and White
        colors = ['rgba(0, 240, 255, 0.22)', 'rgba(255, 255, 255, 0.18)', 'rgba(0, 240, 255, 0.15)'];
      } else if (normalizedFootprint > 0.65) {
        // Heavier presence - mostly Violet and Cyan
        colors = ['rgba(157, 78, 221, 0.25)', 'rgba(0, 240, 255, 0.22)', 'rgba(157, 78, 221, 0.18)'];
      }

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i];
        p.vy = -baseSpeed - 0.1;
        p.vx = (Math.random() - 0.5) * baseSpeed * 0.15; // subtle drift updates

        p.y += p.vy;
        p.x += p.vx + Math.sin(time + p.wiggleSeed) * chaosCoeff;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // Run once on mount

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: scene === 1 ? 0 : 1, transition: 'opacity 0.8s ease' }}
    />
  );
}

