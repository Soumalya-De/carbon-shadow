import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';

import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';

// Curated live signals
const liveSignals = [
  { category: 'AI INFERENCING', text: 'Executing a complex generative AI prompt consumes significantly more operational energy than a standard web search.' },
  { category: 'CLOUD STORAGE', text: 'Deleting unnecessary cloud files reduces storage demand across distributed server infrastructure.' },
  { category: 'VIDEO STREAMING', text: 'Streaming one hour of HD video emits approximately 36 grams of CO₂ — enough to charge a smartphone 3 times on India’s grid.' },
  { category: 'EMAIL FOOTPRINT', text: 'A single email with large attachments can emit up to 50 grams of carbon equivalents per recipient.' },
  { category: 'DEVICE LIFECYCLE', text: 'Manufacturing a smartphone produces 85–95% of its total lifetime carbon before it is ever switched on.' },
];

export function Scene1_Void() {
  const { setScene } = useCarbonShadow();
  const [signalIdx, setSignalIdx] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    // 13.5s total cycle: 1.5s exit + 0.5s pause + 1.5s entry + 10s display
    const id = setInterval(() => {
      setSignalIdx((prev) => (prev + 1) % liveSignals.length);
    }, 13500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="scene-snap-item relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020008 0%, #060012 30%, #0a0018 60%, #050010 100%)',
      }}
    >
      {/* Deep space star field */}
      <CosmicStarField />

      {/* Cosmic nebula glow */}
      <CosmicNebula />



      {/* ═══ MAIN CONTENT STACK ═══ */}
      <div
        className="relative flex flex-col items-center"
        style={{ zIndex: 10, maxWidth: '960px', width: '90%', gap: '40px' }}
      >
        {/* ── MASSIVE HEADLINE ── */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 3rem)',
            fontWeight: 200,
            letterSpacing: '0.20em',
            lineHeight: 1.3,
            textTransform: 'uppercase',
            textAlign: 'center',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            margin: 0,
            padding: '0 1rem',
            width: '100%',
          }}
        >
          <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Your Digital Life</span>
          <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Casts A Shadow</span>
        </motion.h1>

        {/* ── LIVE SIGNAL SECTION ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          style={{ minHeight: '80px' }}
          className="flex flex-col items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={signalIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 1.5, delay: 0.5, ease: 'easeInOut' }
              }}
              exit={{
                opacity: 0,
                y: -4,
                transition: { duration: 1.5, ease: 'easeInOut' }
              }}
              className="flex flex-col items-center gap-4"
            >
              {/* Category tag with live dots */}
              <div className="flex items-center gap-3">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    color: '#00f0ff',
                    fontFamily: "'Inter', monospace",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#00f0ff',
                      boxShadow: '0 0 6px #00f0ff',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  Live Signal&nbsp;•&nbsp;{liveSignals[signalIdx].category}
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: '#00f0ff',
                      boxShadow: '0 0 6px #00f0ff',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                </span>
              </div>

              {/* Fact text — italic serif */}
              <p
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.55)',
                  maxWidth: '40rem',
                  textAlign: 'center',
                  margin: 0,
                  fontFamily: "'Outfit', serif",
                }}
              >
                {liveSignals[signalIdx].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── CTA BUTTON — "REVEAL MY SHADOW" ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <button
            onClick={() => setScene(2)}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '56px',
              paddingLeft: '52px',
              paddingRight: '52px',
              borderRadius: '30px',
              border: isButtonHovered ? '1px solid rgba(0,240,255,0.85)' : '1px solid rgba(0,240,255,0.35)',
              background: isButtonHovered ? 'rgba(0,240,255,0.12)' : 'rgba(5, 2, 12, 0.6)',
              backdropFilter: 'blur(12px)',
              color: isButtonHovered ? '#00f0ff' : '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isButtonHovered
                ? '0 0 12px rgba(0,240,255,0.2), inset 0 0 12px rgba(0,240,255,0.55), inset 0 1px 1.5px rgba(255,255,255,0.3)'
                : '0 0 6px rgba(0,240,255,0.06), inset 0 0 6px rgba(0,240,255,0.25), inset 0 1px 0.5px rgba(255,255,255,0.15)',
            }}
          >
            Reveal My Shadow
          </button>

          {/* Hook tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.5 }}
            style={{
              fontSize: '12px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.65)',
              fontFamily: "'Inter', monospace",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Every click leaves a trace.&nbsp;Meet yours.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Scroll hint at bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.25, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, delay: 5 }}
        className="absolute bottom-6 flex flex-col items-center gap-2"
        style={{
          zIndex: 10,
          fontSize: '7px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: "'Inter', monospace",
        }}
      >
        <span>Scroll to discovery</span>
        <svg
          className="animate-bounce"
          style={{ width: 12, height: 12 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7-7-7m14-6l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default Scene1_Void;
