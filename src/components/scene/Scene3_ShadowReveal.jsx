import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { ShadowEntity } from '../canvas/ShadowEntity';
import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';

/**
 * Scene 3: Shadow Reveal
 * Visualizes the raw human-like particle shadow with floating metrics and synthetic audio.
 * Plays a cinematic 4.5s materialization sequence before showing textual data.
 */
export function Scene3_ShadowReveal() {
  const { setScene, baselineArchetype, footprint, traces, scene } = useCarbonShadow();
  const [isRevealed, setIsRevealed] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Monitor active scene to trigger reveal moment (4.5 seconds: 2s fade-in + 2.5s observation)
  useEffect(() => {
    if (scene === 3) {
      setIsRevealed(false);
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setIsRevealed(false);
    }
  }, [scene]);

  // Initialize Web Audio Synth for ambient feedback
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Low frequency hum representing energy grid
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const annualKg = footprint ? footprint.totalAnnualKg : 100;
      osc.frequency.setValueAtTime(55 + (annualKg * 0.1), ctx.currentTime);

      gain.gain.setValueAtTime(0.0, ctx.currentTime); // start silent

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (err) {
      console.warn("Web Audio API not supported or blocked by browser policies.");
    }
  };

  const handleMouseEnter = () => {
    initAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.04, audioCtxRef.current.currentTime + 1.5);
    }
  };

  const handleMouseLeave = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.0, audioCtxRef.current.currentTime + 1.0);
    }
  };

  const handleShadowClick = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const frequencies = [220, 330, 440, 660];
    frequencies.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, ctx.currentTime);

      chimeGain.gain.setValueAtTime(0.05, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0 + idx * 0.2);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc.start();
      chimeOsc.stop(ctx.currentTime + 2.5);
    });
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) oscillatorRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Map hot pink/rose to a deep violet to preserve visual color scheme
  const rawColor = baselineArchetype?.moodColor || "#9d4edd";
  const accentColor = (rawColor === '#ff007f' || rawColor === '#ff0055') ? '#9d4edd' : rawColor;

  const slot3Data = React.useMemo(() => {
    const categories = [
      { name: "Streaming Habits", val: `${traces.streaming} hours/day`, key: "streaming", annual: (traces.streaming * 36.0 * 365) / 1000 },
      { name: "Video Meetings", val: `${traces.meetings} hours/week`, key: "meetings", annual: (traces.meetings * 157.0 * 52) / 1000 },
      { name: "Social Media", val: `${traces.social} hours/day`, key: "social", annual: (traces.social * 72.0 * 365) / 1000 },
      { name: "Email Activity", val: `${traces.emails} emails/day`, key: "emails", annual: (traces.emails * 4.0 * 365) / 1000 }
    ];
    
    // Sort by annual impact to find the largest one
    categories.sort((a, b) => b.annual - a.annual);
    return categories[0];
  }, [traces]);

  const primaryCardKey = React.useMemo(() => {
    const aiAnnual = (traces.aiPrompts * 4.5 * 365) / 1000;
    const storageAnnual = (traces.storage * 0.016 * 365) / 1000;
    const slot3Annual = slot3Data.annual;
    
    const cards = [
      { key: "ai", annual: aiAnnual },
      { key: "storage", annual: storageAnnual },
      { key: "slot3", annual: slot3Annual }
    ];
    
    cards.sort((a, b) => b.annual - a.annual);
    return cards[0].key;
  }, [traces, slot3Data]);

  return (
    <div 
      className="scene-snap-item flex flex-col justify-between items-center py-16 px-6 select-none overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020008 0%, #060012 30%, #0a0018 60%, #050010 100%)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleShadowClick}
    >
      {/* Cosmic Background (Stars and Nebula) */}
      <CosmicStarField />
      <CosmicNebula />

      {/* Background glow (strictly violet/cyan) */}
      <div 
        className="absolute w-[50vw] h-[50vw] rounded-full filter blur-[150px] opacity-[0.09] pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Cinematic darkening overlay during reveal (lighter note, letting stars show) */}
      <motion.div
        className="absolute inset-0 z-0 bg-[#020008] pointer-events-none"
        initial={{ opacity: 0.70 }}
        animate={{ opacity: isRevealed ? 0.10 : 0.70 }}
        transition={{ duration: 3.5, ease: 'easeInOut' }}
      />

      {/* Header instructions (fades in after reveal) */}
      <motion.div 
        className="text-center z-10"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: isRevealed ? 1.0 : 0.0, y: isRevealed ? 0 : -15 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs md:text-sm tracking-[0.35em] uppercase font-bold text-white/40">Entity Emergence</span>
        <h3 className="text-3xl md:text-4xl font-light text-white tracking-widest uppercase mt-1">THE REFLECTION</h3>
        <p className="text-xs md:text-sm text-white/75 tracking-wider mt-2.5 font-serif italic">This living shadow reflects the impact of your digital habits.</p>
      </motion.div>

      {/* Main Canvas Shadow Frame (Hero size - max-w-4xl, h-[62vh]) */}
      <div className="relative w-full max-w-4xl h-[62vh] z-10 flex items-center justify-center">
        <ShadowEntity variant="current" />

        {/* Floating Insight Capsules (fade in after reveal) */}
        {/* Capsule 1: AI Activity */}
        <motion.div
          animate={{
            opacity: isRevealed ? 1.0 : 0.0,
            y: isRevealed ? 0 : 20,
            scale: isRevealed ? (primaryCardKey === "ai" ? 1.10 : 1.0) : 0.9
          }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="absolute top-[14%] left-[20%] md:top-[16%] md:left-[30%] animate-float-slow flex flex-col gap-0.5 pointer-events-none"
          style={{
            background: 'rgba(10, 5, 22, 0.72)',
            borderRadius: '20px',
            padding: '10px 18px',
            backdropFilter: 'blur(20px)',
            border: primaryCardKey === "ai" ? '1.5px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.15)',
            boxShadow: primaryCardKey === "ai" ? '0 10px 30px rgba(0, 240, 255, 0.22)' : '0 8px 24px rgba(0, 240, 255, 0.08)',
            zIndex: primaryCardKey === "ai" ? 25 : 20,
          }}
        >
          <span className="text-[9px] tracking-[0.2em] text-accentCyan uppercase font-bold font-sans">AI Activity</span>
          <span className="text-xs md:text-sm font-normal text-white tracking-wide font-mono">{traces.aiPrompts} prompts/day</span>
          {primaryCardKey === "ai" && (
            <span className="text-[8px] text-accentCyan/90 font-bold uppercase tracking-wider mt-0.5 animate-pulse">Your largest contributor</span>
          )}
        </motion.div>

        {/* Capsule 2: Cloud Storage */}
        <motion.div
          animate={{
            opacity: isRevealed ? 1.0 : 0.0,
            y: isRevealed ? 0 : 20,
            scale: isRevealed ? (primaryCardKey === "storage" ? 1.10 : 1.0) : 0.9
          }}
          transition={{ duration: 1.0, delay: 0.15, ease: 'easeOut' }}
          className="absolute top-[20%] right-[20%] md:top-[22%] md:right-[30%] animate-float-slow flex flex-col gap-0.5 pointer-events-none"
          style={{
            background: 'rgba(10, 5, 22, 0.72)',
            borderRadius: '20px',
            padding: '10px 18px',
            backdropFilter: 'blur(20px)',
            border: primaryCardKey === "storage" ? '1.5px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(157, 78, 221, 0.15)',
            boxShadow: primaryCardKey === "storage" ? '0 10px 30px rgba(0, 240, 255, 0.22)' : '0 8px 24px rgba(157, 78, 221, 0.08)',
            zIndex: primaryCardKey === "storage" ? 25 : 20,
            animationDelay: '2s'
          }}
        >
          <span className="text-[9px] tracking-[0.2em] text-accentViolet uppercase font-bold font-sans">Cloud Storage</span>
          <span className="text-xs md:text-sm font-normal text-white tracking-wide font-mono">{traces.storage} GB stored</span>
          {primaryCardKey === "storage" && (
            <span className="text-[8px] text-[#00f0ff] font-bold uppercase tracking-wider mt-0.5 animate-pulse">Your largest contributor</span>
          )}
        </motion.div>

        {/* Capsule 3: Dynamic Contributor */}
        <motion.div
          animate={{
            opacity: isRevealed ? 1.0 : 0.0,
            y: isRevealed ? 0 : 20,
            scale: isRevealed ? (primaryCardKey === "slot3" ? 1.10 : 1.0) : 0.9
          }}
          transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
          className="absolute bottom-[20%] left-[20%] md:bottom-[22%] md:left-[30%] animate-float-slow flex flex-col gap-0.5 pointer-events-none"
          style={{
            background: 'rgba(10, 5, 22, 0.72)',
            borderRadius: '20px',
            padding: '10px 18px',
            backdropFilter: 'blur(20px)',
            border: primaryCardKey === "slot3" ? '1.5px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.15)',
            boxShadow: primaryCardKey === "slot3" ? '0 10px 30px rgba(0, 240, 255, 0.22)' : '0 8px 24px rgba(0, 240, 255, 0.08)',
            zIndex: primaryCardKey === "slot3" ? 25 : 20,
            animationDelay: '1s'
          }}
        >
          <span className="text-[9px] tracking-[0.2em] text-accentCyan uppercase font-bold font-sans">{slot3Data.name}</span>
          <span className="text-xs md:text-sm font-normal text-white tracking-wide font-mono">{slot3Data.val}</span>
          {primaryCardKey === "slot3" && (
            <span className="text-[8px] text-accentCyan/90 font-bold uppercase tracking-wider mt-0.5 animate-pulse">Your largest contributor</span>
          )}
        </motion.div>

        {/* Capsule 4: Digital Weight */}
        <motion.div
          animate={{
            opacity: isRevealed ? 1.0 : 0.0,
            y: isRevealed ? 0 : 20,
          }}
          transition={{ duration: 1.0, delay: 0.45, ease: 'easeOut' }}
          className="absolute bottom-[24%] right-[20%] md:bottom-[26%] md:right-[30%] animate-float-slow flex flex-col gap-0.5 pointer-events-none"
          style={{
            background: 'rgba(10, 5, 22, 0.72)',
            borderRadius: '20px',
            padding: '10px 18px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(157, 78, 221, 0.15)',
            boxShadow: '0 8px 24px rgba(157, 78, 221, 0.08)',
            zIndex: 20,
            animationDelay: '3.5s'
          }}
        >
          <span className="text-[9px] tracking-[0.2em] text-accentViolet uppercase font-bold font-sans">Digital Weight</span>
          <span className="text-xs md:text-sm font-normal text-white tracking-wide font-mono">{footprint ? Math.round(footprint.totalAnnualKg) : 100} kg CO₂e/yr</span>
          <span className="text-[8px] text-accentViolet/90 font-bold uppercase tracking-wider mt-0.5">Total Shadow Weight</span>
        </motion.div>
      </div>

      {/* Soft continue button */}
      <motion.div 
        className="z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: isRevealed ? 1.0 : 0.0, y: isRevealed ? 0 : 15 }}
        transition={{ duration: 1.0, delay: 0.6 }}
      >
        <motion.button
          onClick={() => setScene(4)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group px-7 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors duration-350 flex items-center gap-2"
        >
          Understand My Shadow
          <svg className="w-3 h-3 transform group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Scene3_ShadowReveal;
