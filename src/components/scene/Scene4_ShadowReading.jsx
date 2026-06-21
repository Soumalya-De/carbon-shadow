import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { ShadowEntity } from '../canvas/ShadowEntity';
import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';

function cleanContributorName(name) {
  if (!name) return 'Digital Usage';
  const n = name.toLowerCase();
  if (n.includes('ai')) return 'AI Assistance';
  if (n.includes('stream')) return 'Video Streaming';
  if (n.includes('meeting')) return 'Video Meetings';
  if (n.includes('storage')) return 'Cloud Archives';
  if (n.includes('email')) return 'Emails & Chat';
  if (n.includes('social')) return 'Social Feed';
  return name;
}

function getFootprintDescription(weight) {
  if (!weight) return 'Higher than average digital usage';
  const w = weight.toLowerCase();
  if (w.includes('light')) return 'Minimal environmental footprint';
  if (w.includes('moderate')) return 'Average digital footprint';
  if (w.includes('significant')) return 'Higher than average footprint';
  if (w.includes('high') && !w.includes('very')) return 'Substantial environmental impact';
  if (w.includes('very')) return 'Very high digital emissions';
  return 'Higher than average digital footprint';
}

function getPatternDescription(type) {
  if (!type) return 'Mindful digital habits and tool usage';
  const t = type.toLowerCase();
  if (t.includes('mindful') || t.includes('minimalist')) return 'Your digital activity is deliberate, keeping your footprint light';
  if (t.includes('generalist') || t.includes('casual')) return 'Spread across multiple digital habits rather than one driver';
  if (t.includes('collaborator') || t.includes('heavy')) return 'Staying connected through work and remote communication';
  if (t.includes('seeker') || t.includes('explorer')) return 'Frequently uses AI and digital tools to learn and explore';
  if (t.includes('viewer') || t.includes('connected') || t.includes('giant')) return 'Entertainment and video consumption form the largest part';
  return 'Mindful digital habits and tool usage';
}

function getPersonalizedSentence(breakdown) {
  if (!breakdown) return 'Your digital emissions are spread across multiple daily habits.';
  
  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const primaryKey = sorted[0][0];
  const secondaryKey = sorted[1][0];

  const labelMap = {
    emails: 'emails and chat',
    aiPrompts: 'AI interactions',
    streaming: 'video streaming',
    meetings: 'video meetings',
    storage: 'cloud storage files',
    social: 'social media browsing'
  };

  const primaryLabel = labelMap[primaryKey];

  if (primaryKey === 'aiPrompts' && (secondaryKey === 'streaming' || secondaryKey === 'meetings')) {
    return 'Most of your footprint comes from AI usage and video-based activity.';
  }
  if (primaryKey === 'aiPrompts') {
    return 'Your footprint is driven by frequent AI interactions rather than storage or social media.';
  }
  if (primaryKey === 'meetings') {
    return 'Video meetings account for the largest share of your digital emissions.';
  }
  if (primaryKey === 'streaming') {
    return 'Sustained video streaming is the primary driver of your digital emissions.';
  }
  if (primaryKey === 'storage') {
    return 'Storing large backup archives in the cloud is driving most of your digital footprint.';
  }
  return `Most of your footprint is driven by ${primaryLabel} and ${labelMap[secondaryKey]}.`;
}

/**
 * HighlightedText — Cyan for numbers/metrics, Violet for activity categories, Green for actions.
 */
export function HighlightedText({ text }) {
  if (!text) return null;

  let processed = text;
  const compoundNumbers = [
    { word: /ninety-nine/gi, val: '99' },
    { word: /ninety-eight/gi, val: '98' },
    { word: /ninety-seven/gi, val: '97' },
    { word: /ninety-six/gi, val: '96' },
    { word: /ninety-five/gi, val: '95' },
    { word: /eighty-eight/gi, val: '88' },
    { word: /seventy-five/gi, val: '75' },
    { word: /fifty-five/gi, val: '55' },
    { word: /forty-five/gi, val: '45' },
    { word: /thirty-three/gi, val: '33' },
    { word: /twenty-four/gi, val: '24' },
  ];
  compoundNumbers.forEach(({ word, val }) => { processed = processed.replace(word, val); });

  const numberWords = {
    zero:'0',one:'1',two:'2',three:'3',four:'4',five:'5',
    six:'6',seven:'7',eight:'8',nine:'9',ten:'10',
    eleven:'11',twelve:'12',thirteen:'13',fourteen:'14',
    fifteen:'15',sixteen:'16',seventeen:'17',eighteen:'18',
    nineteen:'19',twenty:'20',thirty:'30',forty:'40',
    fifty:'50',sixty:'60',seventy:'70',eighty:'80',
    ninety:'90',hundred:'100'
  };
  Object.entries(numberWords).forEach(([word, val]) => {
    processed = processed.replace(new RegExp(`\\b${word}\\b`, 'gi'), val);
  });

  const combinedRegex = /(\b\d+(?:\.\d+)?(?:%|kg|gb|tb|kb)?\b|\b(?:video meetings|streaming|cloud storage|ai usage|video streaming|cloud services|ai tools|generative ai|social media|streaming habits|email activity|background sync)\b|\b(?:lower resolution|batch tasks|clean storage|reduce meetings|lower stream quality|turn off meeting cameras|clean out old emails|audio only|audio-only|switch off|turn off camera|delete|deleting|unsubscribe|prune|pruning|save files locally|saving common answers|standard definition|standard resolution|automatic backups|autoplay|de-duplicate|group prompt clusters|deactivating|deactivate)\b)/gi;
  const numberTest = /^\d+(?:\.\d+)?(?:%|kg|gb|tb|kb)?$/i;
  const contributorTest = /^(?:video meetings|streaming|cloud storage|ai usage|video streaming|cloud services|ai tools|generative ai|social media|streaming habits|email activity|background sync)$/i;
  const actionTest = /^(?:lower resolution|batch tasks|clean storage|reduce meetings|lower stream quality|turn off meeting cameras|clean out old emails|audio only|audio-only|switch off|turn off camera|delete|deleting|unsubscribe|prune|pruning|save files locally|saving common answers|standard definition|standard resolution|automatic backups|autoplay|de-duplicate|group prompt clusters|deactivating|deactivate)$/i;

  const parts = processed.split(combinedRegex);
  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (numberTest.test(part)) {
          return (
            <span key={idx} className="font-semibold font-mono" style={{ color: '#00f0ff', textShadow: '0 0 8px rgba(0,240,255,0.25)' }}>
              {part}
            </span>
          );
        }
        if (contributorTest.test(part)) {
          return (
            <span key={idx} className="font-medium" style={{ color: '#9d4edd' }}>
              {part}
            </span>
          );
        }
        if (actionTest.test(part)) {
          return (
            <span key={idx} className="font-semibold" style={{ color: '#22c55e', textShadow: '0 0 8px rgba(34,197,94,0.25)' }}>
              {part}
            </span>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

/**
 * Scene 4: Shadow Reading
 * Carbon footprint number is the primary reveal — archetype is supporting info.
 */
export function Scene4_ShadowReading() {
  const {
    baselineArchetype,
    shadowReading,
    geminiLoading,
    setScene,
    footprint
  } = useCarbonShadow();

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const rawColor = baselineArchetype?.moodColor || '#9d4edd';
  const accentColor = (rawColor === '#ff007f' || rawColor === '#ff0055') ? '#9d4edd' : rawColor;
  const annualKgNum = footprint ? footprint.totalAnnualKg : 150.00;
  const annualKg = annualKgNum.toFixed(2);
 
  // Predefined equivalents with controlled randomization - rounded to whole numbers
  const eqItems = useMemo(() => {
    const ceiling_fan_years = annualKgNum / 359.16;
    const laptop_months = annualKgNum / 3.32;
    const router_years = annualKgNum / 57.46;
    const led_bulb_years = annualKgNum / 21.55;
    const desk_months = annualKgNum / 16.73;
 
    const lib = [
      {
        key: 'ceiling_fan',
        text: `powering a ceiling fan for ${ceiling_fan_years >= 1.0 ? Math.round(ceiling_fan_years) : Math.round(ceiling_fan_years * 12)} ${ceiling_fan_years >= 1.0 ? (Math.round(ceiling_fan_years) === 1 ? 'year' : 'years') : 'months'}`,
        color: '#9d4edd',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0 -6 0" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V3M12 15v6M9 12H3M15 12h6" />
          </svg>
        )
      },
      {
        key: 'laptop',
        text: `charging a laptop every day for ${laptop_months >= 12 ? Math.round(laptop_months / 12) : Math.round(laptop_months)} ${laptop_months >= 12 ? (Math.round(laptop_months / 12) === 1 ? 'year' : 'years') : 'months'}`,
        color: '#00f0ff',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/50">
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M2 20h20M5 16l-2 4h18l-2-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        key: 'wifi_router',
        text: `running a home Wi-Fi router for ${router_years >= 1.0 ? Math.round(router_years) : Math.round(router_years * 12)} ${router_years >= 1.0 ? (Math.round(router_years) === 1 ? 'year' : 'years') : 'months'}`,
        color: '#9d4edd',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 14a6 6 0 018 0M5 10a11 11 0 0114 0M2 6a16 16 0 0120 0" />
          </svg>
        )
      },
      {
        key: 'hd_video',
        text: `watching ${Math.round(annualKgNum / 0.06).toLocaleString()} hours of HD video`,
        color: '#00f0ff',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/50">
            <polygon points="23 7 16 12 23 17 23 7" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        key: 'led_bulb',
        text: `powering an LED bulb for ${led_bulb_years >= 1.0 ? Math.round(led_bulb_years) : Math.round(led_bulb_years * 12)} ${led_bulb_years >= 1.0 ? (Math.round(led_bulb_years) === 1 ? 'year' : 'years') : 'months'}`,
        color: '#00f0ff',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 015 5c0 2.5-2.5 3.5-2.5 5h-5C9.5 15.5 7 14.5 7 12a5 5 0 015-5z" />
          </svg>
        )
      },
      {
        key: 'study_desk',
        text: `${desk_months >= 12 ? Math.round(desk_months / 12) + (Math.round(desk_months / 12) === 1 ? ' year' : ' years') : Math.round(desk_months) + ' months'} of electricity use for a study desk setup`,
        color: '#9d4edd',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white/50">
            <rect x="3" y="3" width="18" height="12" rx="2" />
            <path d="M12 15v5M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
    ];
 
    const shuffled = [...lib].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }, [annualKgNum]);

  const [eq1, eq2] = eqItems;

  return (
    <div
      className="scene-snap-item flex flex-col justify-center items-center px-6 py-12 select-none overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #020008 0%, #060012 30%, #0a0018 60%, #050010 100%)' }}
    >
      <CosmicStarField />
      <CosmicNebula />

      {/* Archetype mood glow */}
      <div
        className="absolute w-[60vw] h-[60vw] rounded-full filter blur-[180px] opacity-[0.09] pointer-events-none z-0 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />

      {geminiLoading ? (
        <div className="flex flex-col items-center justify-center gap-6 z-10 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/5 animate-ping absolute" />
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: accentColor, borderTopColor: 'transparent' }}
            />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40 animate-pulse font-mono">Analyzing Traces</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20 font-mono">Decoding digital shadow signature...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl w-full flex flex-col gap-5 z-10">

          {/* Section title */}
          <div className="text-center flex flex-col items-center">
            <span className="text-xs md:text-sm tracking-[0.35em] uppercase font-bold text-white/40">Interpretive Grid</span>
            <h3 className="text-3xl md:text-4xl font-light text-white tracking-widest uppercase mt-1">WHAT YOUR SHADOW REVEALS</h3>
            <p className="text-xs md:text-sm text-white/75 mt-2 font-serif italic">Understanding the weight of your digital shadow.</p>
          </div>

          {/* PRIMARY FOCAL POINT — Carbon number hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-accentCyan font-bold">Annual Digital Footprint</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span
                className="font-extralight text-white tracking-tight font-sans"
                style={{ fontSize: 'clamp(4rem, 10vw, 5.5rem)', lineHeight: 1, textShadow: '0 0 40px rgba(0,240,255,0.12)' }}
              >
                {annualKg}
              </span>
              <span className="text-xl font-light font-serif italic" style={{ color: 'rgba(255,255,255,0.55)' }}>kg CO₂e / yr</span>
            </div>
            
            {/* Dynamic Footprint Sentence — Replace technical labels under the footprint number */}
            <p className="text-[13px] md:text-[14px] text-white/80 font-light mt-3 max-w-md mx-auto text-center leading-relaxed font-serif italic">
              {getPersonalizedSentence(footprint?.breakdown)}
            </p>

            {/* Labeled identity tags — humanized visual editorial layout */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6 sm:gap-8 mt-6 w-full max-w-3xl mx-auto px-4">
              <div className="flex flex-col items-center text-center gap-1.5 flex-1 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">YOUR IMPACT</span>
                <span className="px-3 py-0.5 rounded-full border border-[#9d4edd]/20 bg-[#9d4edd]/5 text-[10px] font-semibold text-accentViolet uppercase tracking-wider">
                  {baselineArchetype?.weight || 'Heavy'}
                </span>
                <span className="text-[10px] text-white/50 tracking-wide mt-1 leading-normal max-w-[180px]">
                  {getFootprintDescription(baselineArchetype?.weight || 'Heavy')}
                </span>
              </div>

              <div className="hidden sm:block w-px self-stretch bg-white/5" />

              <div className="flex flex-col items-center text-center gap-1.5 flex-1 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">YOUR DIGITAL STYLE</span>
                <span className="px-3 py-0.5 rounded-full border border-[#00f0ff]/15 bg-[#00f0ff]/5 text-[10px] font-bold text-accentCyan uppercase tracking-wider">
                  {baselineArchetype?.type || 'Digital Explorer'}
                </span>
                <span className="text-[10px] text-white/50 tracking-wide mt-1 leading-normal max-w-[180px]">
                  {getPatternDescription(baselineArchetype?.type || 'Digital Explorer')}
                </span>
              </div>

              <div className="hidden sm:block w-px self-stretch bg-white/5" />

              <div className="flex flex-col items-center text-center gap-1.5 flex-1 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">BIGGEST DRIVER</span>
                <span className="px-3 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-medium text-white/80 uppercase tracking-wider">
                  {cleanContributorName(baselineArchetype?.primaryContributor || 'AI Activity')}
                </span>
                <span className="text-[10px] text-white/50 tracking-wide mt-1 leading-normal max-w-[180px]">
                  Largest contributor to yearly emissions
                </span>
              </div>
            </div>
          </motion.div>

          {/* EDITORIAL GLASS PANEL */}
          <div className="relative w-full rounded-[32px] overflow-hidden">

            {/* faint shadow watermark at 4% — visual continuity from Page 3 */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.04]">
              <ShadowEntity variant="current" />
            </div>

            <div
              className="relative w-full p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10 items-stretch z-10"
              style={{
                background: 'rgba(10, 5, 22, 0.50)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(28px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55)'
              }}
            >
              {/* Left: Shadow Analysis */}
              <div className="flex-[1.5] flex flex-col gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-8">
                <span className="text-[10px] tracking-[0.25em] text-accentCyan uppercase font-bold">Shadow Analysis</span>
                <p className="text-sm md:text-[15px] font-light italic font-serif leading-relaxed text-white/90">
                  {shadowReading?.narrative
                    ? <HighlightedText text={shadowReading.narrative} />
                    : 'Your footprint is being evaluated by the cognitive mirror...'}
                </p>
              </div>

              {/* Right: Two randomized comparisons with SVG line icons */}
              <div className="flex-1 flex flex-col gap-5 md:pl-2 justify-center">
                <span className="text-[10px] tracking-[0.25em] text-accentViolet uppercase font-bold">Equivalent To</span>

                {/* Comparison 1 */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/60">
                    {eq1.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] text-white/90 font-medium tracking-wide leading-relaxed">
                      Equivalent to <span style={{ color: eq1.color, fontWeight: 600 }}>{eq1.text}</span>
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Comparison 2 */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/60">
                    {eq2.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] text-white/90 font-medium tracking-wide leading-relaxed">
                      Equivalent to <span style={{ color: eq2.color, fontWeight: 600 }}>{eq2.text}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center mt-1"
          >
            <motion.button
              onClick={() => setScene(5)}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '52px',
                paddingLeft: '40px',
                paddingRight: '40px',
                borderRadius: '26px',
                border: isButtonHovered ? '1px solid rgba(0,240,255,0.85)' : '1px solid rgba(0,240,255,0.35)',
                background: isButtonHovered ? 'rgba(0,240,255,0.12)' : 'rgba(5, 2, 12, 0.6)',
                backdropFilter: 'blur(12px)',
                color: isButtonHovered ? '#00f0ff' : '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: "'Inter', sans-serif",
                boxShadow: isButtonHovered
                  ? '0 0 12px rgba(0,240,255,0.2), inset 0 0 12px rgba(0,240,255,0.55), inset 0 1px 1.5px rgba(255,255,255,0.3)'
                  : '0 0 6px rgba(0,240,255,0.06), inset 0 0 6px rgba(0,240,255,0.25), inset 0 1px 0.5px rgba(255,255,255,0.15)',
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Grow Your Greenbloom
                <svg
                  style={{ width: 12, height: 12, transition: 'transform 0.3s' }}
                  className={isButtonHovered ? 'translate-x-1' : ''}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
          </motion.div>

        </div>
      )}
    </div>
  );
}

export default Scene4_ShadowReading;
