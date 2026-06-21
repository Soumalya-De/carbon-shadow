import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { useGemini } from '../../hooks/useGemini';
import { ElegantSlider } from '../ui/ElegantSlider';
import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';
import { EmbryonicShadow } from './EmbryonicShadow';

/**
 * Scene 2: Digital Traces
 * Form with 6 sliders in glass cards to log user's digital metrics.
 * Incorporates deep-space atmosphere and a breathing canvas shadow that reacts to input.
 */
export function Scene2_DigitalTraces() {
  const { 
    traces, 
    updateTraces, 
    setScene 
  } = useCarbonShadow();

  const { fetchReading } = useGemini();
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleReveal = () => {
    // Initiate Gemini API request
    fetchReading(traces);
    
    // Smooth transition to Scene 3
    setScene(3);
  };

  // Dynamic Materialization percentage calculation
  const totalRatio = (
    (traces.emails / 200) +
    (traces.aiPrompts / 100) +
    (traces.streaming / 12) +
    (traces.meetings / 40) +
    (traces.storage / 200) +
    (traces.social / 8)
  ) / 6;

  const materializationPct = Math.round(totalRatio * 100);

  return (
    <div 
      className="scene-snap-item relative flex flex-col justify-center items-center px-6 py-12 md:py-20 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #020008 0%, #060012 30%, #0a0018 60%, #050010 100%)',
      }}
    >
      {/* Deep space star field & nebula */}
      <CosmicStarField />
      <CosmicNebula />

      {/* Breathing embryonic shadow reacting to input */}
      <EmbryonicShadow traces={traces} />



      {/* ═══ MAIN CONTENT STACK ═══ */}
      <div 
        className="max-w-5xl w-full flex flex-col gap-8 z-10"
        style={{ marginTop: '50px' }}
      >
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
              fontWeight: 200,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              margin: 0,
            }}
          >
            Digital Traces
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 0.2, duration: 1.0 }}
            style={{
              fontSize: '1.05rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: "'Outfit', serif",
              margin: 0,
            }}
          >
            Every digital habit leaves a trace.
          </motion.p>
        </div>

        {/* Sliders Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ElegantSlider
            label="Emails per day"
            value={traces.emails}
            min={0}
            max={200}
            unit="emails"
            onChange={(val) => updateTraces({ emails: val })}
            accentColor="cyan"
          />
          <ElegantSlider
            label="AI Prompts per day"
            value={traces.aiPrompts}
            min={0}
            max={100}
            unit="prompts"
            onChange={(val) => updateTraces({ aiPrompts: val })}
            accentColor="cyan"
          />
          <ElegantSlider
            label="Streaming hours per day"
            value={traces.streaming}
            min={0}
            max={12}
            unit="hours"
            onChange={(val) => updateTraces({ streaming: val })}
            accentColor="cyan"
          />
          <ElegantSlider
            label="Video meetings per week"
            value={traces.meetings}
            min={0}
            max={40}
            unit="hours"
            onChange={(val) => updateTraces({ meetings: val })}
            accentColor="cyan"
          />
          <ElegantSlider
            label="Cloud storage size"
            value={traces.storage}
            min={0}
            max={200}
            unit="GB"
            onChange={(val) => updateTraces({ storage: val })}
            accentColor="cyan"
          />
          <ElegantSlider
            label="Social media scroll per day"
            value={traces.social}
            min={0}
            max={8}
            unit="hours"
            onChange={(val) => updateTraces({ social: val })}
            accentColor="cyan"
          />
        </motion.div>

        {/* Bottom Control & Entity Formation Status Area */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 mt-2"
        >
          {/* Entity Coherence -> Entity Formation Cinematic display */}
          <div className="flex flex-col items-center gap-1">
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: "'Inter', monospace",
                fontWeight: 500,
              }}
            >
              The Shadow is Forming
            </span>
            <span
              className="glow-text-cyan text-accentCyan"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.05em',
              }}
            >
              {materializationPct}% Materialized
            </span>
          </div>

          {/* Reveal My Shadow Button */}
          <motion.button
            onClick={handleReveal}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '54px',
              paddingLeft: '48px',
              paddingRight: '48px',
              borderRadius: '27px',
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
              boxShadow: isButtonHovered
                ? '0 0 12px rgba(0,240,255,0.2), inset 0 0 12px rgba(0,240,255,0.55), inset 0 1px 1.5px rgba(255,255,255,0.3)'
                : '0 0 6px rgba(0,240,255,0.06), inset 0 0 6px rgba(0,240,255,0.25), inset 0 1px 0.5px rgba(255,255,255,0.15)',
            }}
          >
            <span className="flex items-center gap-3">
              Reveal My Shadow
              <svg 
                style={{ width: 12, height: 12, transition: 'transform 0.3s' }}
                className={isButtonHovered ? 'translate-x-1' : ''} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Scene2_DigitalTraces;
