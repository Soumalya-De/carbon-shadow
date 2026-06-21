import React, { useEffect, useRef } from 'react';

/**
 * Cosmic Star Field — shared deep-space star background.
 */
export function CosmicStarField() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let H = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    let logicalW = canvas.offsetWidth;
    let logicalH = canvas.offsetHeight;

    const onResize = () => {
      if (!canvas) return;
      logicalW = canvas.offsetWidth;
      logicalH = canvas.offsetHeight;
      W = canvas.width = logicalW * window.devicePixelRatio;
      H = canvas.height = logicalH * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', onResize);

    const STAR_COUNT = 280;
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const depth = Math.random();
      const speed = 0.08 + depth * 0.25;
      return {
        x: Math.random() * logicalW,
        y: Math.random() * logicalH,
        originX: 0,
        originY: 0,
        r: 0.3 + depth * 1.5,
        baseOpacity: 0.15 + Math.random() * 0.6,
        twinkleSpeed: 0.008 + Math.random() * 0.025,
        twinklePhase: Math.random() * Math.PI * 2,
        driftXSpeed: (Math.random() - 0.5) * speed * 0.4,
        driftYSpeed: (Math.random() - 0.5) * speed * 0.3,
        wobbleAmpX: 3 + Math.random() * 12,
        wobbleAmpY: 2 + Math.random() * 8,
        wobbleFreqX: 0.002 + Math.random() * 0.006,
        wobbleFreqY: 0.001 + Math.random() * 0.005,
        wobblePhaseX: Math.random() * Math.PI * 2,
        wobblePhaseY: Math.random() * Math.PI * 2,
      };
    });
    stars.forEach(s => { s.originX = s.x; s.originY = s.y; });

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, logicalW, logicalH);
      t += 1;

      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const opacity = s.baseOpacity * twinkle;

        s.x += s.driftXSpeed;
        s.y += s.driftYSpeed;
        const drawX = s.x + Math.sin(t * s.wobbleFreqX + s.wobblePhaseX) * s.wobbleAmpX;
        const drawY = s.y + Math.cos(t * s.wobbleFreqY + s.wobblePhaseY) * s.wobbleAmpY;

        if (s.x < -10) s.x = logicalW + 10;
        if (s.x > logicalW + 10) s.x = -10;
        if (s.y < -10) s.y = logicalH + 10;
        if (s.y > logicalH + 10) s.y = -10;

        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.2 && opacity > 0.35) {
          ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.15})`;
          ctx.lineWidth = 0.3;
          const len = s.r * 3;
          ctx.beginPath();
          ctx.moveTo(drawX - len, drawY);
          ctx.lineTo(drawX + len, drawY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(drawX, drawY - len);
          ctx.lineTo(drawX, drawY + len);
          ctx.stroke();
        }
      });

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

/**
 * Cosmic Nebula Glow — shared radial gradient nebula glow.
 */
export function CosmicNebula() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '50vh',
          background: 'radial-gradient(ellipse at center, rgba(60,25,120,0.35) 0%, rgba(20,8,60,0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '45%',
          transform: 'translate(-50%, -50%)',
          width: '40vw',
          height: '30vh',
          background: 'radial-gradient(ellipse at center, rgba(30,60,140,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50vw',
          height: '25vh',
          background: 'radial-gradient(ellipse at center, rgba(100,30,160,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
    </div>
  );
}
