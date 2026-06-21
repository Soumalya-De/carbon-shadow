import React, { useEffect, useRef } from 'react';

/**
 * EmbryonicShadow — canvas-based rendering of the embryonic shadow in the background.
 * Opacity breathes slowly (3% to 6%) and slider values trigger interactive atmospheric effects:
 * - Emails: message trails
 * - AI Prompts: neural fragments
 * - Streaming: data fog
 * - Cloud Storage: archive particles
 * - Video Meetings: pulse waves
 * - Social Media: signal flickers
 */
export function EmbryonicShadow({ traces }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // Keep latest traces in a ref to avoid recreating the animation loop variables
  const tracesRef = useRef(traces);
  useEffect(() => {
    tracesRef.current = traces;
  }, [traces]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = (canvas.width = canvas.offsetWidth);
      height = (canvas.height = canvas.offsetHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── DATA STRUCTURES FOR EFFECTS ──
    // Archive particles (Storage)
    const archiveCount = 50;
    const archives = Array.from({ length: archiveCount }, () => ({
      x: Math.random() * 100, // percentage of width
      y: Math.random() * 100, // percentage of height
      size: 1.5 + Math.random() * 2.5,
      speed: 0.15 + Math.random() * 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
    }));

    // Message trails (Emails)
    const trailCount = 15;
    const trails = Array.from({ length: trailCount }, () => ({
      points: [
        { x: Math.random(), y: Math.random() },
        { x: Math.random(), y: Math.random() },
        { x: Math.random(), y: Math.random() },
        { x: Math.random(), y: Math.random() },
      ],
      progress: Math.random(),
      speed: 0.0012 + Math.random() * 0.0015,
    }));

    // Neural nodes (AI)
    const nodeCount = 25;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: 0.35 + Math.random() * 0.3, // centered x (percentage)
      y: 0.3 + Math.random() * 0.4,  // centered y (percentage)
      vx: (Math.random() - 0.5) * 0.0012,
      vy: (Math.random() - 0.5) * 0.0012,
    }));

    // Expanding pulses (Meetings)
    const pulseCount = 4;
    const pulses = Array.from({ length: pulseCount }, (_, i) => ({
      radius: (i / pulseCount) * 350,
      maxRadius: 350,
    }));

    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const currentTraces = tracesRef.current;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw Core Embryonic Shadow (Breathing slowly, 3% to 6%)
      const baseOpacity = 0.03 + 0.03 * (0.5 + 0.5 * Math.sin(time * 0.008));
      const coreScale = 1.0 + 0.05 * Math.sin(time * 0.012);
      const baseRadius = Math.min(width, height) * 0.24 * coreScale;

      // Core radial gradient
      const shadowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.6);
      shadowGrad.addColorStop(0, `rgba(157, 78, 221, ${baseOpacity})`); // Neon Violet
      shadowGrad.addColorStop(0.3, `rgba(0, 240, 255, ${baseOpacity * 0.55})`); // Neon Cyan
      shadowGrad.addColorStop(0.75, `rgba(13, 8, 28, ${baseOpacity * 0.15})`);
      shadowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Secondary overlapping shadow for asymmetric breathing shape
      const offX = Math.sin(time * 0.006) * 25;
      const offY = Math.cos(time * 0.005) * 20;
      const subGrad = ctx.createRadialGradient(cx + offX, cy + offY, 0, cx + offX, cy + offY, baseRadius * 1.3);
      subGrad.addColorStop(0, `rgba(0, 240, 255, ${baseOpacity * 0.5})`);
      subGrad.addColorStop(0.5, `rgba(157, 78, 221, ${baseOpacity * 0.2})`);
      subGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = subGrad;
      ctx.beginPath();
      ctx.arc(cx + offX, cy + offY, baseRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Emails: Message Trails
      if (currentTraces.emails > 0) {
        const activeTrails = Math.min(trailCount, Math.ceil(currentTraces.emails / 12));
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < activeTrails; i++) {
          const t = trails[i];
          t.progress += t.speed * (1 + currentTraces.emails / 100);
          if (t.progress > 1) {
            t.progress = 0;
            t.points = [
              { x: Math.random(), y: Math.random() },
              { x: Math.random(), y: Math.random() },
              { x: Math.random(), y: Math.random() },
              { x: Math.random(), y: Math.random() },
            ];
          }

          const p0 = { x: t.points[0].x * width, y: t.points[0].y * height };
          const p1 = { x: t.points[1].x * width, y: t.points[1].y * height };
          const p2 = { x: t.points[2].x * width, y: t.points[2].y * height };
          const p3 = { x: t.points[3].x * width, y: t.points[3].y * height };

          // Draw spline
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
          ctx.stroke();

          // Particle position
          const u = t.progress;
          const px = (1 - u) ** 3 * p0.x + 3 * (1 - u) ** 2 * u * p1.x + 3 * (1 - u) * u ** 2 * p2.x + u ** 3 * p3.x;
          const py = (1 - u) ** 3 * p0.y + 3 * (1 - u) ** 2 * u * p1.y + 3 * (1 - u) * u ** 2 * p2.y + u ** 3 * p3.y;

          ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. AI: Neural Fragments
      if (currentTraces.aiPrompts > 0) {
        const activeNodes = Math.min(nodeCount, Math.ceil(currentTraces.aiPrompts / 3.5));
        
        // Move & draw nodes
        for (let i = 0; i < activeNodes; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0.22 || n.x > 0.78) n.vx *= -1;
          if (n.y < 0.18 || n.y > 0.82) n.vy *= -1;

          const nx = n.x * width;
          const ny = n.y * height;
          ctx.fillStyle = 'rgba(157, 78, 221, 0.25)';
          ctx.beginPath();
          ctx.arc(nx, ny, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node links
        ctx.lineWidth = 0.5;
        for (let i = 0; i < activeNodes; i++) {
          for (let j = i + 1; j < activeNodes; j++) {
            const dx = (nodes[i].x - nodes[j].x) * width;
            const dy = (nodes[i].y - nodes[j].y) * height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
              const linkOpacity = (1 - dist / 160) * 0.07 * (currentTraces.aiPrompts / 100);
              ctx.strokeStyle = `rgba(0, 240, 255, ${linkOpacity})`;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x * width, nodes[i].y * height);
              ctx.lineTo(nodes[j].x * width, nodes[j].y * height);
              ctx.stroke();
            }
          }
        }
      }

      // 4. Streaming: Data Fog
      if (currentTraces.streaming > 0) {
        const fogOpacity = (currentTraces.streaming / 12) * 0.05;
        const fogGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.4, cx, cy, Math.max(width, height) * 0.55);
        fogGrad.addColorStop(0, `rgba(157, 78, 221, ${fogOpacity})`);
        fogGrad.addColorStop(0.5, `rgba(0, 240, 255, ${fogOpacity * 0.45})`);
        fogGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(width, height) * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Cloud Storage: Archive Particles
      if (currentTraces.storage > 0) {
        const activeArchives = Math.min(archiveCount, Math.ceil(currentTraces.storage / 3.5));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        for (let i = 0; i < activeArchives; i++) {
          const a = archives[i];
          a.y += a.speed * (1 + currentTraces.storage / 150);
          a.rotation += a.rotSpeed;
          if (a.y > 100) {
            a.y = 0;
            a.x = Math.random() * 100;
          }

          const ax = (a.x / 100) * width;
          const ay = (a.y / 100) * height;

          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(a.rotation);
          ctx.fillRect(-a.size / 2, -a.size / 2, a.size, a.size);
          ctx.restore();
        }
      }

      // 6. Video Meetings: Pulse Waves
      if (currentTraces.meetings > 0) {
        const waveSpeed = 0.4 + (currentTraces.meetings / 8);
        const activePulses = Math.min(pulseCount, Math.ceil(currentTraces.meetings / 10));

        for (let i = 0; i < activePulses; i++) {
          const p = pulses[i];
          p.radius += waveSpeed;
          if (p.radius > p.maxRadius) {
            p.radius = 8;
          }
          const pulseOpacity = (1 - p.radius / p.maxRadius) * 0.07;
          ctx.strokeStyle = `rgba(0, 240, 255, ${pulseOpacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(cx, cy, p.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 7. Social Media: Signal Flickers
      if (currentTraces.social > 0) {
        const flickerChance = currentTraces.social / 8;
        if (Math.random() < flickerChance) {
          const sparkCount = Math.floor(Math.random() * 2) + 1;
          ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
          for (let k = 0; k < sparkCount; k++) {
            const fx = Math.random() * width;
            const fy = Math.random() * height;
            const flen = 8 + Math.random() * 25;
            ctx.fillRect(fx, fy, flen, 0.5);
          }
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
