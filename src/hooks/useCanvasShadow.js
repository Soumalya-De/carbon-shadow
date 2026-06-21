import { useEffect, useRef } from 'react';

// Perfectly proportioned, standing, gender-neutral human icon silhouette
const humanPath = new Path2D(
  // Head: center (80, 35), radius 11
  "M 80, 24 a 11,11 0 1,1 -0.1,0 Z " +
  // Neck & Shoulders & Arms & Torso & Legs
  // Start at left neck: (76, 48)
  "M 76, 48 " +
  // Curve down to left shoulder
  "C 76, 51 68, 52 61, 54 " +
  // Left arm outer edge down
  "L 57, 85 " +
  // Rounded hand tip
  "C 56, 88 60, 90 61, 85 " +
  // Left arm inner edge up to armpit (65, 55)
  "L 64, 55 " +
  // Left torso side, curving slightly inward for waist, then outward for hip (70, 104)
  "C 66, 68 67, 82 70, 104 " +
  // Left leg outer edge down to foot
  "L 69, 141 " +
  // Rounded foot
  "C 69, 144 75, 144 75, 141 " +
  // Left leg inner edge up to crotch
  "L 77, 104 " +
  // Crotch point (80, 102)
  "L 80, 101 " +
  // Right leg inner edge down
  "L 83, 104 " +
  "L 85, 141 " +
  // Rounded foot
  "C 85, 144 91, 144 91, 141 " +
  // Right leg outer edge up to hip (90, 104)
  "L 90, 104 " +
  // Right torso side up to armpit (95, 55)
  "C 93, 82 94, 68 96, 55 " +
  // Right arm inner edge down to hand
  "L 99, 85 " +
  // Rounded hand tip
  "C 100, 90 104, 88 103, 85 " +
  // Right arm outer edge up
  "L 99, 54 " +
  // Right shoulder curve to neck (84, 48)
  "C 92, 52 84, 51 84, 48 " +
  "Z"
);

/**
 * Custom hook to render the organic Canvas Shadow Entity.
 * Renders a large, breathing human-like digital ghost silhouette with particle shedding.
 * Persists loop parameters in Refs so the animation doesn't vanish or jump on re-renders.
 * Supports a full-body standing gender-neutral silhouette with glowing edge gradients.
 * @param {HTMLCanvasElement} canvasRef The target canvas
 * @param {Object} footprint Calculated carbon footprint
 * @param {Object} archetype Shadow archetype info
 * @param {Object} traces Digital traces
 * @param {string} variant "current" | "future"
 */
export function useCanvasShadow(canvasRef, footprint, archetype, traces, variant = "current", scaleMultiplier = 1.0) {
  const animationFrameId = useRef(null);

  // Refs to persist animation state across component re-renders
  const timeRef = useRef(0);
  const particlesRef = useRef([]);
  const shedParticlesRef = useRef([]);
  const prevVariantRef = useRef(variant);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Initial sizes
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Choose strictly theme colors: Cyan, Violet, White
    let coreColor = "#00f0ff"; // Cyan
    let edgeColor = "#9d4edd"; // Violet
    
    if (archetype) {
      if (archetype.weight === "Light") {
        coreColor = "#00f0ff"; // Cyan
        edgeColor = "#ffffff"; // White
      } else if (archetype.weight === "Moderate") {
        coreColor = "#00f0ff"; // Cyan
        edgeColor = "#9d4edd"; // Violet
      } else if (archetype.weight === "Heavy") {
        coreColor = "#9d4edd"; // Violet
        edgeColor = "#ffffff"; // White
      } else if (archetype.weight === "Very Heavy") {
        coreColor = "#9d4edd"; // Violet
        edgeColor = "#00f0ff"; // Cyan
      }
    }

    // Adapt colors for future alternative view (emerald-cyan theme)
    if (variant === "future") {
      coreColor = "#00f5d4"; // Emerald Green
      edgeColor = "#00ffff"; // Cyan
    }

    // Reset time if variant changes
    if (prevVariantRef.current !== variant) {
      timeRef.current = 0;
      prevVariantRef.current = variant;
    }

    // Initialize particles scaled to the user's carbon footprint (Heavy user has more particles)
    const annualKg = footprint ? footprint.totalAnnualKg : 150;
    let particleCount = Math.max(150, Math.min(950, Math.round(annualKg * 1.5 + 100)));
    if (variant === "future") {
      // 58% fewer particles (increased density from 0.30 to 0.42)
      particleCount = Math.round(particleCount * 0.42);
    }
    
    // Determine Cyan/Violet ratio: heavy user has more Violet, light user has more Cyan/White
    const violetRatio = variant === "future" ? 0 : Math.max(0.1, Math.min(0.9, annualKg / 400));

    if (particlesRef.current.length === 0 || particlesRef.current.length !== particleCount) {
      const arr = [];
      for (let i = 0; i < particleCount; i++) {
        const rand = Math.random();
        let segment = "torso";
        let rx = 0, ry = 0;
        
        if (rand < 0.15) {
          segment = "head";
          const theta = Math.random() * Math.PI * 2;
          const r = Math.random() * 11;
          rx = 80 + Math.cos(theta) * r;
          ry = 35 + Math.sin(theta) * r;
        } else if (rand < 0.60) {
          segment = "torso";
          rx = 71 + Math.random() * 18;
          ry = 53 + Math.random() * 50;
        } else if (rand < 0.75) {
          segment = "arms";
          const isLeft = Math.random() < 0.5;
          rx = isLeft ? (59 + Math.random() * 6) : (95 + Math.random() * 6);
          ry = 55 + Math.random() * 32;
        } else {
          segment = "legs";
          const isLeft = Math.random() < 0.5;
          rx = isLeft ? (71 + Math.random() * 5) : (84 + Math.random() * 5);
          ry = 105 + Math.random() * 38;
        }

        const sizeVal = variant === "future" ? (Math.random() * 2.2 + 0.8) : (Math.random() * 4.0 + 1.8);
        const alphaVal = variant === "future" ? (Math.random() * 0.28 + 0.25) : (Math.random() * 0.35 + 0.15);

        arr.push({
          segment,
          relX: rx,
          relY: ry,
          baseSize: sizeVal,
          size: sizeVal,
          speedFactor: 0.6 + Math.random() * 0.8,
          wiggleSeed: Math.random() * 100,
          color: Math.random() < violetRatio ? edgeColor : coreColor,
          alpha: alphaVal
        });
      }
      particlesRef.current = arr;
    } else {
      // Dynamic color updating for existing particles on parameter change
      particlesRef.current.forEach(p => {
        p.color = Math.random() < violetRatio ? edgeColor : coreColor;
      });
    }

    // Initialize shedding particles (re-use if already initialized)
    const shedCount = Math.max(50, Math.min(180, Math.round(annualKg * 0.5)));
    if (shedParticlesRef.current.length === 0 || shedParticlesRef.current.length !== shedCount) {
      shedParticlesRef.current = Array.from({ length: shedCount }, () => ({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.7,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random(),
        decay: 0.003 + Math.random() * 0.006,
        color: Math.random() < violetRatio ? edgeColor : coreColor
      }));
    } else {
      shedParticlesRef.current.forEach(sp => {
        sp.color = Math.random() < violetRatio ? edgeColor : coreColor;
      });
    }

    const render = () => {
      if (!canvas) return;

      // Update width and height dynamically on layout changes to prevent disappearing
      const currentWidth = canvas.offsetWidth;
      const currentHeight = canvas.offsetHeight;
      if (currentWidth !== width || currentHeight !== height) {
        width = canvas.width = currentWidth;
        height = canvas.height = currentHeight;
      }

      if (width === 0 || height === 0) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Characteristic size of the canvas
      const size = Math.min(width, height);

      // Real-time precise clock in seconds
      const currTime = Date.now() / 1000;
      const centerX = width / 2;
      const centerY = height * 0.53;

      // FIXED shadow size — completely independent of user input.
      // Only particle count/color/wiggle changes with footprint; the body never resizes.
      // scale = height * 0.0068 keeps the full figure (121 units tall) inside any viewport.
      const scale = height * 0.0068 * scaleMultiplier;

      // annualFootprint and normalizedFootprint are used ONLY for particle density,
      // colors, and wiggle animation speed — NOT for body sizing.
      const annualFootprint = footprint ? footprint.totalAnnualKg : 150;
      const normalizedFootprint = Math.min(annualFootprint / 400, 1.0);

      // Organic breathing: slow imperceptible cycle (exactly 4-second period, oscillating 98% to 102%)
      const breathingPeriod = 4.0;
      const scaleBreathing = 1.0 + 0.02 * Math.sin((currTime * 2 * Math.PI) / breathingPeriod);
      const activeScale = scale * scaleBreathing;

      const H = 121 * activeScale;
      // Vertically adjust center offset to shift the shadow down and prevent head clipping
      const centerYAdjustment = H * 0.06;
      const centerYWithOffset = centerY + centerYAdjustment;
      const yBase = centerYWithOffset - H * 0.48;

      // Materialization alpha fade-in over 2 seconds
      const fadeInAlpha = Math.min(1.0, (currTime % 100000) / 0.96); // prevent large start offset drift

      // Slowed down wiggling multipliers to create a calm micro-shimmer/ripple instead of a weird dance
      let speedMultiplier = Math.max(0.12, Math.min(0.48, 0.15 + normalizedFootprint * 0.10));
      let wiggleMultiplier = Math.max(0.2, Math.min(1.2, 0.3 + normalizedFootprint * 0.3));
      if (variant === "future") {
        speedMultiplier *= 0.50;
        wiggleMultiplier *= 0.50;
      }

      // Local helper to map and perturb coordinates
      const getPerturbed = (x, y, timeOffset = 0) => {
        const distFromCenter = Math.abs(x - 80);
        // Extremities (limbs, hands, feet) wiggle slightly more; core torso remains stable
        const baseWiggleX = (0.2 + distFromCenter * 0.04 + (y > 100 ? (y - 100) * 0.03 : 0));
        const baseWiggleY = (0.15 + distFromCenter * 0.03);
        
        const wiggleAmpX = baseWiggleX * wiggleMultiplier * activeScale * 1.5;
        const wiggleAmpY = baseWiggleY * wiggleMultiplier * activeScale * 1.5;
        
        // Double harmonic wiggle: secondary wave overlay breaks simple periodic repetition
        const basePhase = (currTime + timeOffset) * speedMultiplier;
        const phaseX = (x * 0.03 + y * 0.04) + basePhase * 1.4 + Math.sin(basePhase * 0.65) * 0.4;
        const phaseY = (x * 0.04 - y * 0.03) + basePhase * 1.1 + Math.cos(basePhase * 0.55) * 0.3;
        
        const dx = Math.sin(phaseX) * wiggleAmpX;
        const dy = Math.cos(phaseY) * wiggleAmpY;
        
        return {
          x: centerX + (x - 80) * activeScale + dx,
          y: centerYWithOffset + (y - 84.5) * activeScale + dy
        };
      };

      const drawHeadPath = (context, timeOffset = 0) => {
        const headCenter = { x: 80, y: 35 };
        const headRadius = 11;
        for (let i = 0; i <= 24; i++) {
          const theta = (i / 24) * Math.PI * 2;
          const hx = headCenter.x + Math.cos(theta) * headRadius;
          const hy = headCenter.y + Math.sin(theta) * headRadius;
          const pt = getPerturbed(hx, hy, timeOffset);
          if (i === 0) context.moveTo(pt.x, pt.y);
          else context.lineTo(pt.x, pt.y);
        }
      };

      const drawBodyPath = (context, timeOffset = 0) => {
        const p = (x, y) => getPerturbed(x, y, timeOffset);

        // Start at left neck: (76, 48)
        const start = p(76, 48);
        context.moveTo(start.x, start.y);

        // Curve to left shoulder: C 76, 51 68, 52 61, 54
        const c1 = p(76, 51);
        const c2 = p(68, 52);
        const e1 = p(61, 54);
        context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, e1.x, e1.y);

        // Left arm outer: L 57, 85
        const e2 = p(57, 85);
        context.lineTo(e2.x, e2.y);

        // Left hand: C 56, 88 60, 90 61, 85
        const c3 = p(56, 88);
        const c4 = p(60, 90);
        const e3 = p(61, 85);
        context.bezierCurveTo(c3.x, c3.y, c4.x, c4.y, e3.x, e3.y);

        // Left arm inner: L 64, 55
        const e4 = p(64, 55);
        context.lineTo(e4.x, e4.y);

        // Left waist: C 66, 68 67, 82 70, 104
        const c5 = p(66, 68);
        const c6 = p(67, 82);
        const e5 = p(70, 104);
        context.bezierCurveTo(c5.x, c5.y, c6.x, c6.y, e5.x, e5.y);

        // Left leg outer: L 69, 141
        const e6 = p(69, 141);
        context.lineTo(e6.x, e6.y);

        // Left foot: C 69, 144 75, 144 75, 141
        const c7 = p(69, 144);
        const c8 = p(75, 144);
        const e7 = p(75, 141);
        context.bezierCurveTo(c7.x, c7.y, c8.x, c8.y, e7.x, e7.y);

        // Left leg inner: L 77, 104
        const e8 = p(77, 104);
        context.lineTo(e8.x, e8.y);

        // Crotch: L 80, 101
        const e9 = p(80, 101);
        context.lineTo(e9.x, e9.y);

        // Right leg inner: L 83, 104
        const e10 = p(83, 104);
        context.lineTo(e10.x, e10.y);

        // Right leg outer: L 85, 141
        const e11 = p(85, 141);
        context.lineTo(e11.x, e11.y);

        // Right foot: C 85, 144 91, 144 91, 141
        const c9 = p(85, 144);
        const c10 = p(91, 144);
        const e12 = p(91, 141);
        context.bezierCurveTo(c9.x, c9.y, c10.x, c10.y, e12.x, e12.y);

        // Right leg outer: L 90, 104
        const e13 = p(90, 104);
        context.lineTo(e13.x, e13.y);

        // Right waist: C 93, 82 94, 68 96, 55
        const c11 = p(93, 82);
        const c12 = p(94, 68);
        const e14 = p(96, 55);
        context.bezierCurveTo(c11.x, c11.y, c12.x, c12.y, e14.x, e14.y);

        // Right arm inner: L 99, 85
        const e15 = p(99, 85);
        context.lineTo(e15.x, e15.y);

        // Right hand: C 100, 90 104, 88 103, 85
        const c13 = p(100, 90);
        const c14 = p(104, 88);
        const e16 = p(103, 85);
        context.bezierCurveTo(c13.x, c13.y, c14.x, c14.y, e16.x, e16.y);

        // Right arm outer: L 99, 54
        const e17 = p(99, 54);
        context.lineTo(e17.x, e17.y);

        // Right shoulder curve: C 92, 52 84, 51 84, 48
        const c15 = p(92, 52);
        const c16 = p(84, 51);
        const e18 = p(84, 48);
        context.bezierCurveTo(c15.x, c15.y, c16.x, c16.y, e18.x, e18.y);
      };

      const drawFullSilhouette = (context, timeOffset = 0) => {
        context.beginPath();
        drawHeadPath(context, timeOffset);
        drawBodyPath(context, timeOffset);
        context.closePath();
      };

      // ── DRAW SILHOUETTE GHOST FILL (Vaporous signal cloud, 60% cloud / 40% human) ──
      ctx.save();
      // Soft blur filter and opacity breathes with the time (toned down by ~10% for premium feel)
      const baseBlur = variant === "future" ? (7 + 1.5 * Math.sin(currTime * 1.5)) : (13 + 4 * Math.sin(currTime * 2.094));
      const opacityVal = variant === "future" ? (0.62 + 0.05 * Math.sin(currTime * 1.5)) : (0.65 + 0.09 * Math.sin(currTime * 2.094));
      ctx.filter = `blur(${baseBlur}px) opacity(${opacityVal})`;
      
      // Draw wiggling silhouette path
      drawFullSilhouette(ctx, 0);

      // Base solid silhouette body (translucent dark shadow overlaying stars)
      // Future is much more transparent/dissipated than current baseline (0.24 vs 0.52)
      const fillAlpha = variant === "future" ? 0.38 : 0.52;
      ctx.fillStyle = `rgba(10, 5, 24, ${fillAlpha * fadeInAlpha})`;
      ctx.fill();
      
      const gradStartY = centerY + (24 - 84.5) * activeScale;
      const gradEndY = centerY + (145 - 84.5) * activeScale;
      const bodyGrad = ctx.createLinearGradient(centerX, gradStartY, centerX, gradEndY);
      if (variant === "future") {
        bodyGrad.addColorStop(0, `rgba(0, 245, 212, ${0.28 * fadeInAlpha})`); // Emerald
        bodyGrad.addColorStop(0.5, `rgba(0, 240, 255, ${0.22 * fadeInAlpha})`); // Cyan
        bodyGrad.addColorStop(1, 'transparent');
      } else {
        bodyGrad.addColorStop(0, `rgba(0, 240, 255, ${0.22 * fadeInAlpha})`); // Cyan
        bodyGrad.addColorStop(0.5, `rgba(157, 78, 221, ${0.16 * fadeInAlpha})`); // Violet
        bodyGrad.addColorStop(1, 'transparent');
      }
      
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.restore();

      // ── DRAW LAYERED ABSTRACT SPECTRAL OUTLINES (Fog/Signal wave echoes) ──
      ctx.save();
      ctx.filter = variant === "future" ? 'blur(2px) opacity(0.60)' : 'blur(3.5px) opacity(0.78)';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      if (variant === "future") {
        // Future outline is a single thin emerald outline
        drawFullSilhouette(ctx, 0);
        ctx.strokeStyle = `rgba(0, 245, 212, ${0.52 * fadeInAlpha})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      } else {
        // Outline Layer 1: Core bounding outline (no offset)
        drawFullSilhouette(ctx, 0);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.24 * fadeInAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Outline Layer 2: Expanded spectral wave wiggling with time offset +0.4s
        drawFullSilhouette(ctx, 0.4);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.10 * fadeInAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Outline Layer 3: Contracted spectral wave wiggling with time offset -0.4s
        drawFullSilhouette(ctx, -0.4);
        ctx.strokeStyle = `rgba(157, 78, 221, ${0.10 * fadeInAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.restore(); // restores canvas filter to 'none'

      // Helper to compute a point on a cubic Bezier curve
      const getBezierPoint = (t, p0, p1, p2, p3) => {
        const oneMinusT = 1 - t;
        const t0 = oneMinusT * oneMinusT * oneMinusT;
        const t1 = 3 * oneMinusT * oneMinusT * t;
        const t2 = 3 * oneMinusT * t * t;
        const t3 = t * t * t;
        return {
          x: t0 * p0.x + t1 * p1.x + t2 * p2.x + t3 * p3.x,
          y: t0 * p0.y + t1 * p1.y + t2 * p2.y + t3 * p3.y
        };
      };

      // ── DRAW FAINT SIGNAL CONNECTION THREADS FROM CARDS TO SHADOW BODY ──
      ctx.save();
      ctx.lineWidth = 0.85;
      ctx.setLineDash([2, 5]); // High-tech dotted style

      const isMd = width > 768;
      const leftColX = width * (isMd ? 0.30 : 0.20);
      const rightColX = width * (isMd ? 0.70 : 0.80);

      // Card 1: AI Activity (Top Left) -> Left Shoulder
      const start1X = leftColX + (isMd ? 165 : 130);
      const start1Y = height * (isMd ? 0.16 : 0.14) + (isMd ? 28 : 24);
      const target1X = centerX - activeScale * 14;
      const target1Y = centerYWithOffset - H * 0.20;
      const cp1_1 = { x: start1X + (target1X - start1X) * 0.5, y: start1Y };
      const cp1_2 = { x: start1X + (target1X - start1X) * 0.5, y: target1Y };

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * fadeInAlpha * (0.7 + 0.3 * Math.sin(currTime * 2.2))})`;
      ctx.beginPath();
      ctx.moveTo(start1X, start1Y);
      ctx.bezierCurveTo(cp1_1.x, cp1_1.y, cp1_2.x, cp1_2.y, target1X, target1Y);
      ctx.stroke();

      // Card 2: Cloud Storage (Top Right) -> Right Shoulder
      const start2X = rightColX - (isMd ? 165 : 130);
      const start2Y = height * (isMd ? 0.22 : 0.20) + (isMd ? 28 : 24);
      const target2X = centerX + activeScale * 14;
      const target2Y = centerYWithOffset - H * 0.20;
      const cp2_1 = { x: start2X + (target2X - start2X) * 0.5, y: start2Y };
      const cp2_2 = { x: start2X + (target2X - start2X) * 0.5, y: target2Y };

      ctx.strokeStyle = `rgba(157, 78, 221, ${0.18 * fadeInAlpha * (0.7 + 0.3 * Math.cos(currTime * 1.8))})`;
      ctx.beginPath();
      ctx.moveTo(start2X, start2Y);
      ctx.bezierCurveTo(cp2_1.x, cp2_1.y, cp2_2.x, cp2_2.y, target2X, target2Y);
      ctx.stroke();

      // Card 3: Dynamic Contributor (Bottom Left) -> Left Hip
      const start3X = leftColX + (isMd ? 165 : 130);
      const start3Y = height * (isMd ? 0.78 : 0.74) - (isMd ? 28 : 24);
      const target3X = centerX - activeScale * 8;
      const target3Y = centerYWithOffset + H * 0.10;
      const cp3_1 = { x: start3X + (target3X - start3X) * 0.5, y: start3Y };
      const cp3_2 = { x: start3X + (target3X - start3X) * 0.5, y: target3Y };

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * fadeInAlpha * (0.7 + 0.3 * Math.cos(currTime * 2.0))})`;
      ctx.beginPath();
      ctx.moveTo(start3X, start3Y);
      ctx.bezierCurveTo(cp3_1.x, cp3_1.y, cp3_2.x, cp3_2.y, target3X, target3Y);
      ctx.stroke();

      // Card 4: Digital Weight (Bottom Right) -> Right Hip
      const start4X = rightColX - (isMd ? 165 : 130);
      const start4Y = height * (isMd ? 0.74 : 0.70) - (isMd ? 28 : 24);
      const target4X = centerX + activeScale * 8;
      const target4Y = centerYWithOffset + H * 0.10;
      const cp4_1 = { x: start4X + (target4X - start4X) * 0.5, y: start4Y };
      const cp4_2 = { x: start4X + (target4X - start4X) * 0.5, y: target4Y };

      ctx.strokeStyle = `rgba(157, 78, 221, ${0.18 * fadeInAlpha * (0.7 + 0.3 * Math.sin(currTime * 1.6))})`;
      ctx.beginPath();
      ctx.moveTo(start4X, start4Y);
      ctx.bezierCurveTo(cp4_1.x, cp4_1.y, cp4_2.x, cp4_2.y, target4X, target4Y);
      ctx.stroke();

      // ── DRAW GLOWING DATA PACKETS RUNNING ALONG BEZIER THREADS ──
      ctx.setLineDash([]); // Draw solid beads
      const drawPacket = (p0, p1, p2, p3, color, speedOffset) => {
        // Compute t parameter based on clock
        const t = ((currTime * 0.35 + speedOffset) % 1.0);
        const pt = getBezierPoint(t, p0, p1, p2, p3);
        
        // Glow effect: outer faint circle, inner bright circle
        ctx.fillStyle = color === "cyan" ? `rgba(0, 240, 255, ${0.25 * fadeInAlpha})` : `rgba(157, 78, 221, ${0.25 * fadeInAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = color === "cyan" ? `rgba(0, 240, 255, ${0.85 * fadeInAlpha})` : `rgba(157, 78, 221, ${0.85 * fadeInAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw 2 packets per line
      drawPacket({ x: start1X, y: start1Y }, cp1_1, cp1_2, { x: target1X, y: target1Y }, "cyan", 0.0);
      drawPacket({ x: start1X, y: start1Y }, cp1_1, cp1_2, { x: target1X, y: target1Y }, "cyan", 0.5);

      drawPacket({ x: start2X, y: start2Y }, cp2_1, cp2_2, { x: target2X, y: target2Y }, "violet", 0.25);
      drawPacket({ x: start2X, y: start2Y }, cp2_1, cp2_2, { x: target2X, y: target2Y }, "violet", 0.75);

      drawPacket({ x: start3X, y: start3Y }, cp3_1, cp3_2, { x: target3X, y: target3Y }, "cyan", 0.1);
      drawPacket({ x: start3X, y: start3Y }, cp3_1, cp3_2, { x: target3X, y: target3Y }, "cyan", 0.6);

      drawPacket({ x: start4X, y: start4Y }, cp4_1, cp4_2, { x: target4X, y: target4Y }, "violet", 0.4);
      drawPacket({ x: start4X, y: start4Y }, cp4_1, cp4_2, { x: target4X, y: target4Y }, "violet", 0.9);

      ctx.restore();

      // ── SWEEPING HORIZONTAL SCAN LINE ──
      const scanY = yBase + (H * 1.02 * ((currTime * 0.18) % 1.0));
      ctx.save();
      // Clip to our dynamic wiggling silhouette path
      drawFullSilhouette(ctx, 0);
      ctx.clip();

      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.6, scanY);
      ctx.lineTo(centerX + size * 0.6, scanY);
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.28 * fadeInAlpha * Math.max(0, Math.sin(currTime * 6.0))})`;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      const scanGrad = ctx.createLinearGradient(centerX, scanY - 20, centerX, scanY + 20);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, `rgba(157, 78, 221, ${0.16 * fadeInAlpha})`);
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(centerX - size * 0.6, scanY - 20, size * 1.2, 40);
      ctx.restore();

      // ── DRAW SILHOUETTE BOUNDARY PARTICLES ──
      ctx.save();
      particlesRef.current.forEach((p) => {
        // Slow vertical drift internally
        p.relY -= 0.015 * p.speedFactor;
        // Wrap drifted coordinates back to keep the body shape populated
        if (p.segment === "head" && p.relY < 24) p.relY = 35 + Math.random() * 2;
        if (p.segment === "torso" && p.relY < 53) p.relY = 103 + Math.random() * 2;
        if (p.segment === "arms" && p.relY < 55) p.relY = 87 + Math.random() * 2;
        if (p.segment === "legs" && p.relY < 105) p.relY = 141 + Math.random() * 2;

        const wiggleX = Math.sin(currTime * speedMultiplier * 2.2 * p.speedFactor + p.wiggleSeed) * (size * 0.012) * wiggleMultiplier;
        const wiggleY = Math.cos(currTime * speedMultiplier * 1.8 * p.speedFactor + p.wiggleSeed) * (size * 0.012) * wiggleMultiplier;
        
        // Scale particle centers dynamically along with breathing body
        const px = centerX + (p.relX - 80) * activeScale + wiggleX;
        const py = centerYWithOffset + (p.relY - 84.5) * activeScale + wiggleY;

        const pulse = 1.0 + 0.18 * Math.sin(currTime * 2.094 + p.wiggleSeed);
        const pSize = p.baseSize * pulse;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * fadeInAlpha;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // ── DRAW SHEDDING PARTICLES DRIFTING UPWARD ──
      ctx.save();
      shedParticlesRef.current.forEach((sp) => {
        sp.y += sp.vy * speedMultiplier;
        sp.x += sp.vx * speedMultiplier + Math.sin(currTime * 0.8 + sp.size) * 0.25 * wiggleMultiplier;
        sp.alpha -= sp.decay * speedMultiplier;

        if (sp.alpha <= 0 || sp.y < 0) {
          const segRand = Math.random();
          if (segRand < 0.15) { // head
            sp.x = centerX + (Math.random() - 0.5) * H * 0.09;
            sp.y = yBase + H * 0.075;
          } else if (segRand < 0.60) { // torso
            sp.x = centerX + (Math.random() - 0.5) * H * 0.22;
            sp.y = yBase + H * 0.34;
          } else if (segRand < 0.75) { // arms
            sp.x = centerX + (Math.random() < 0.5 ? -1 : 1) * H * 0.15;
            sp.y = yBase + H * 0.32;
          } else { // legs
            sp.x = centerX + (Math.random() - 0.5) * H * 0.12;
            sp.y = yBase + H * 0.70;
          }
          sp.alpha = 0.5 + Math.random() * 0.5;
          sp.vy = -0.3 - Math.random() * 0.6;
          sp.vx = (Math.random() - 0.5) * 0.3;
        }

        ctx.fillStyle = sp.color === coreColor ? `rgba(0, 240, 255, ${sp.alpha * 0.28 * fadeInAlpha})` : `rgba(157, 78, 221, ${sp.alpha * 0.28 * fadeInAlpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, footprint, archetype, traces, variant]);
}
