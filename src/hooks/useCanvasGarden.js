import { useEffect, useRef } from 'react';

/**
 * Custom hook to render the GreenBloom procedural ecosystem on Canvas.
 * @param {HTMLCanvasElement} canvasRef The target canvas
 * @param {number} reductionScore Current footprint reduction score (0 - 100)
 * @param {number} waterTrigger Secondary trigger to prompt watering animation splashes
 * @param {string} variant "current" | "future"
 */
export function useCanvasGarden(canvasRef, reductionScore, waterTrigger, variant = "current") {
  const animationFrameId = useRef(null);
  const currentGrowthRef = useRef(0);
  const waterSplashRef = useRef([]);

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

    // If future variant, force 80% growth to show alternative tomorrow possibilities
    const targetScore = variant === "future" ? Math.max(75, reductionScore) : reductionScore;

    // Set up butterflies
    const butterflies = [
      { x: width * 0.25, y: height * 0.7, vx: 0.5, vy: -0.2, wingPhase: Math.random() * 10, color: "#00f0ff" },
      { x: width * 0.5, y: height * 0.6, vx: -0.4, vy: 0.3, wingPhase: Math.random() * 10, color: "#00f5d4" },
      { x: width * 0.75, y: height * 0.75, vx: 0.3, vy: -0.5, wingPhase: Math.random() * 10, color: "#ff007f" },
    ];

    // Motes (light dust) floating up
    const moteCount = 40;
    const motes = [];
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: height - Math.random() * height * 0.5,
        speed: 0.3 + Math.random() * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        amplitude: 10 + Math.random() * 20,
        frequency: 0.005 + Math.random() * 0.01,
        seed: Math.random() * 100
      });
    }

    // Static plant placements to avoid random shifting in render loops
    const plantSlots = [
      { xPct: 0.15, scale: 0.85, type: 'vine', angleOffset: -0.05 },
      { xPct: 0.32, scale: 1.10, type: 'tree', angleOffset: 0.02 },
      { xPct: 0.50, scale: 0.90, type: 'vine', angleOffset: -0.01 },
      { xPct: 0.68, scale: 1.20, type: 'tree', angleOffset: -0.04 },
      { xPct: 0.85, scale: 0.80, type: 'vine', angleOffset: 0.06 },
    ];

    let time = 0;

    // Setup water animation splash and firefly launch from trigger changes
    if (waterTrigger > 0) {
      // Spawn new water ripples/particles descending from mid-screen
      for (let i = 0; i < 12; i++) {
        waterSplashRef.current.push({
          x: Math.random() * width,
          y: height * 0.4 + Math.random() * height * 0.1,
          vx: (Math.random() - 0.5) * 3,
          vy: -(Math.random() * 2 + 1),
          size: Math.random() * 2 + 1,
          alpha: 0.8,
          decay: Math.random() * 0.015 + 0.01,
          isFirefly: false
        });
      }
      // Spawn glowing green fireflies rising from the seed bed
      for (let i = 0; i < 20; i++) {
        waterSplashRef.current.push({
          x: Math.random() * width,
          y: height - 40 - Math.random() * 30,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 1.5 + 0.5),
          size: Math.random() * 2.5 + 1.5,
          alpha: 1.0,
          decay: Math.random() * 0.008 + 0.006,
          seed: Math.random() * 100,
          isFirefly: true
        });
      }
    }

    // Procedural root renderer growing downwards into soil
    const drawRoots = (rx, ry, depth, length, angle, growthState) => {
      if (depth <= 0) return;
      
      // Roots are visible at 0 growth, but extend further as growth increases
      const currentLength = 12 + length * Math.min(1.0, growthState * 1.5);
      const rxEnd = rx + Math.cos(angle) * currentLength;
      const ryEnd = ry + Math.sin(angle) * currentLength;

      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rxEnd, ryEnd);
      ctx.lineWidth = Math.max(0.75, depth * 0.6);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)"; // brightened glowing cyan
      ctx.stroke();

      // Branch recursively
      if (currentLength > 4) {
        const branchAngle = 0.32 + Math.sin(time * 2 + depth) * 0.03;
        drawRoots(rxEnd, ryEnd, depth - 1, length * 0.72, angle - branchAngle, growthState);
        drawRoots(rxEnd, ryEnd, depth - 1, length * 0.72, angle + branchAngle, growthState);
      }
    };
 
    // Procedural branch renderer growing upwards
    const drawBranch = (x, y, length, angle, depth, growthState, isTree) => {
      if (depth <= 0 || length < 4) {
        // Draw a glowing flower or bud
        if (growthState > 0.4) {
          ctx.beginPath();
          ctx.arc(x, y, 4 * Math.min(1.0, (growthState - 0.4) * 2), 0, Math.PI * 2);
          
          // Flower color selection
          if (isTree) {
            ctx.fillStyle = "rgba(0, 245, 212, 0.8)"; // Cyan/Emerald
          } else {
            ctx.fillStyle = "rgba(255, 0, 127, 0.8)"; // Neon Pink
          }
          ctx.shadowBlur = 8;
          ctx.shadowColor = ctx.fillStyle;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        return { flowerX: x, flowerY: y };
      }
 
      // Shrink branches based on depth and growth stage
      const currentLength = length * Math.min(1.0, growthState * 1.3);
      const xEnd = x + Math.cos(angle) * currentLength;
      const yEnd = y + Math.sin(angle) * currentLength;
 
      // Draw leaf/vine branch line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(xEnd, yEnd);
      ctx.lineWidth = Math.max(1, depth * 0.8);
      
      // Color shifts: brown/woody trunk to vibrant green leaves
      if (isTree) {
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.6 + depth * 0.15})`; // glowing cyan branches
      } else {
        ctx.strokeStyle = `rgba(0, 245, 212, ${0.5 + depth * 0.15})`; // emerald vines
      }
      
      ctx.stroke();
 
      // Recurse branching if grown enough
      let flowerPos = null;
      if (growthState > 0.25) {
        const angleDiff = 0.35 + Math.sin(time + depth) * 0.04;
        
        // Tree has symmetrical branches, vines grow single-sided/zig-zag
        if (isTree) {
          drawBranch(xEnd, yEnd, length * 0.73, angle - angleDiff, depth - 1, growthState * 1.1, isTree);
          flowerPos = drawBranch(xEnd, yEnd, length * 0.73, angle + angleDiff, depth - 1, growthState * 1.1, isTree);
        } else {
          const alternateSide = depth % 2 === 0 ? 1 : -1;
          flowerPos = drawBranch(xEnd, yEnd, length * 0.82, angle + angleDiff * alternateSide, depth - 1, growthState * 1.05, isTree);
        }
      }
 
      return flowerPos || { flowerX: xEnd, flowerY: yEnd };
    };
 
    const render = () => {
      ctx.fillStyle = "rgba(5, 1, 13, 0.2)";
      ctx.fillRect(0, 0, width, height);
 
      time += 0.005;
 
      // Smoothly lerp growth score - increased rate for faster visual gratification
      currentGrowthRef.current += (targetScore - currentGrowthRef.current) * 0.07;
      const growthFactor = currentGrowthRef.current / 100.0; // 0.0 to 1.0
 
      // Render drifting motes (always ambient)
      motes.forEach(m => {
        m.y -= m.speed;
        m.x += Math.sin(time + m.seed) * 0.2;
        
        // Reset if drifted off top
        if (m.y < height * 0.2) {
          m.y = height;
          m.x = Math.random() * width;
        }
 
        ctx.fillStyle = `rgba(0, 245, 212, ${m.alpha * (0.3 + growthFactor * 0.7)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      });
 
      // Growth stage label helper mapping
      // Seed (0) -> Sprout (<=25) -> Garden (<=60) -> Forest (>60)
      let maxDepth = 1;
      let maxBranchLength = 20;
 
      if (currentGrowthRef.current <= 5) {
        maxDepth = 1;
        maxBranchLength = 12;
      } else if (currentGrowthRef.current <= 25) {
        maxDepth = 2;
        maxBranchLength = 25;
      } else if (currentGrowthRef.current <= 60) {
        maxDepth = 4;
        maxBranchLength = 40;
      } else {
        maxDepth = 5;
        maxBranchLength = 55;
      }
 
      const flowerPositions = [];
 
      // Render procedural plant elements sitting 40px above bottom
      plantSlots.forEach(slot => {
        const x = width * slot.xPct;
        const y = height - 40; // shifted base to allow roots room below
        const length = maxBranchLength * slot.scale;
        const isTree = slot.type === 'tree';
        const startAngle = -Math.PI / 2 + slot.angleOffset;
 
        // 1. Draw root system downward
        drawRoots(x, y, 3, 10 * slot.scale, Math.PI / 2, growthFactor);

        // 2. Draw branch system upward
        const flower = drawBranch(x, y, length, startAngle, maxDepth, growthFactor, isTree);
        
        // 3. Draw glowing seed at the base
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 245, 212, 0.95)";
        ctx.shadowBlur = 24 + Math.sin(time * 6) * 8; // pulsing seed glow
        ctx.shadowColor = "#00f5d4";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Faint seed halo/glow
        ctx.beginPath();
        ctx.arc(x, y, 48, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 245, 212, 0.22)";
        ctx.fill();

        if (flower && growthFactor > 0.4) {
          flowerPositions.push(flower);
        }
      });
 
      // Update and draw Butterflies
      butterflies.forEach((b, idx) => {
        b.wingPhase += 0.25;
 
        // Fly towards bloomed flowers, or do figure-eights if no flowers exist
        let targetX = width * (0.2 + idx * 0.3);
        let targetY = height * 0.6;
 
        if (flowerPositions.length > 0) {
          const nearestFlower = flowerPositions[idx % flowerPositions.length];
          targetX = nearestFlower.flowerX;
          targetY = nearestFlower.flowerY - 10;
        } else {
          // Ambient float patterns
          targetX += Math.sin(time + idx * 20) * 40;
          targetY += Math.cos(time + idx * 10) * 30;
        }
 
        // Steer towards target
        const dx = targetX - b.x;
        const dy = targetY - b.y;
        b.vx += dx * 0.005;
        b.vy += dy * 0.005;
 
        // Speed limit
        const speed = Math.hypot(b.vx, b.vy);
        const maxSpeed = 2.0;
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        }
 
        b.x += b.vx;
        b.y += b.vy;
 
        // Render butterfly shape (two pulsing wings)
        const wingScale = Math.abs(Math.sin(b.wingPhase)) * 6 + 1;
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = b.color;
        
        ctx.beginPath();
        // Left wing
        ctx.ellipse(b.x - 3, b.y, wingScale, 4, -0.4, 0, Math.PI * 2);
        // Right wing
        ctx.ellipse(b.x + 3, b.y, wingScale, 4, 0.4, 0, Math.PI * 2);
        ctx.fill();
 
        // Core dot
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
 
        ctx.shadowBlur = 0;
      });
 
      // Update and draw Water Splash & Firefly Particles
      if (waterSplashRef.current.length > 0) {
        for (let i = waterSplashRef.current.length - 1; i >= 0; i--) {
          const w = waterSplashRef.current[i];
          w.x += w.vx;
          w.y += w.vy;
          if (w.isFirefly) {
            w.vy -= 0.03; // rise acceleration
            w.vx += Math.sin(time * 5 + w.seed) * 0.2; // wobble
            // speed limit for rising
            if (w.vy < -2.0) w.vy = -2.0;
          } else {
            w.vy += 0.12; // gravity for water drops
          }
          w.alpha -= w.decay;

          ctx.beginPath();
          ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
          if (w.isFirefly) {
            ctx.fillStyle = `rgba(0, 245, 212, ${w.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(0, 245, 212, 0.85)";
          } else {
            ctx.fillStyle = `rgba(0, 240, 255, ${w.alpha})`;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          if (w.alpha <= 0 || w.y > height || w.y < 0) {
            waterSplashRef.current.splice(i, 1);
          }
        }
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
  }, [canvasRef, reductionScore, waterTrigger, variant]);
}
