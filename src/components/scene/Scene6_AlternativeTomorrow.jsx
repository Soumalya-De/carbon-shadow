import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { ShadowEntity } from '../canvas/ShadowEntity';
import { getEvolvedIdentity } from '../../data/moodLibrary';
import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';

// Curated 10 high-impact actions mapped to IDs for direct pledge lookup
const allPledgeOptions = [
  { id: 'streaming_sd', category: 'Streaming', name: 'Watch in Standard Definition', calculateSaved: (traces) => traces.streaming * 13.14 * 0.5 },
  { id: 'streaming_autoplay', category: 'Streaming', name: 'Disable Video Autoplay', calculateSaved: (traces) => traces.streaming * 13.14 * 0.25 },
  { id: 'ai_batch', category: 'AI Usage', name: 'Batch AI Requests', calculateSaved: (traces) => traces.aiPrompts * 1.6425 * 0.40 },
  { id: 'ai_loops', category: 'AI Usage', name: 'Limit Model Trial Loops', calculateSaved: (traces) => traces.aiPrompts * 1.6425 * 0.30 },
  { id: 'storage_backups', category: 'Storage', name: 'Disable Photo Backups', calculateSaved: (traces) => traces.storage * 0.00584 * 0.30 },
  { id: 'storage_sync', category: 'Storage', name: 'Reduce Database Syncing', calculateSaved: (traces) => traces.storage * 0.00584 * 0.20 },
  { id: 'comm_audio', category: 'Communication', name: 'Audio-Only Meetings', calculateSaved: (traces) => traces.meetings * 8.187 * 0.85 },
  { id: 'comm_camera', category: 'Communication', name: 'Disable Camera by Default', calculateSaved: (traces) => traces.meetings * 8.187 * 0.50 },
  { id: 'att_scroll', category: 'Attention', name: 'Limit Infinite Scrolling', calculateSaved: (traces) => traces.social * 26.28 * 0.40 },
  { id: 'att_video_feeds', category: 'Attention', name: 'Avoid Video Social Feeds', calculateSaved: (traces) => traces.social * 26.28 * 0.35 }
];

// Mappings from action names to grammatical lowercase phrases for copy assembly
const actionPhrases = {
  "Watch in Standard Definition": "watching videos in standard definition",
  "Disable Video Autoplay": "disabling streaming autoplay",
  "Batch AI Requests": "batching your AI queries",
  "Limit Model Trial Loops": "limiting experimental AI loop prompts",
  "Disable Photo Backups": "disabling automatic photo backups",
  "Reduce Database Syncing": "reducing continuous database syncing",
  "Audio-Only Meetings": "shifting routine meetings to audio-only",
  "Disable Camera by Default": "turning off cameras by default",
  "Limit Infinite Scrolling": "limiting infinite scrolling",
  "Avoid Video Social Feeds": "skipping video-heavy social feeds"
};

/**
 * Page 6: Alternative Tomorrow
 * Side-by-side comparison of baseline shadow vs optimized future shadow.
 */
export function Scene6_AlternativeTomorrow() {
  const { 
    setScene, 
    baselineArchetype, 
    futureArchetype, 
    traces, 
    footprint, 
    futureFootprint,
    pledges
  } = useCarbonShadow();

  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.offsetWidth);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Calculate transformation metrics
  const currentFootprint = footprint ? footprint.totalAnnualKg : 150.00;
  const futureFootprintVal = futureFootprint ? futureFootprint.totalAnnualKg : 135.00;
  const reductionSaved = Math.max(0, currentFootprint - futureFootprintVal);
  const reductionPercent = currentFootprint > 0 ? (reductionSaved / currentFootprint) * 100 : 0;

  // 2. Determine top commitments dynamically from global pledges context
  const commitments = [];
  allPledgeOptions.forEach(opt => {
    if (pledges[opt.id]) {
      commitments.push({
        category: opt.category,
        name: opt.name,
        saved: opt.calculateSaved(traces)
      });
    }
  });

  // Sort by carbon weight saved
  commitments.sort((a, b) => b.saved - a.saved);

  // Fill in empty slots if user made fewer than 3 commitments
  const fallbacks = [
    { category: "Streaming", name: "Watch in Standard Definition" },
    { category: "Communication", name: "Audio-Only Meetings" },
    { category: "Storage", name: "Disable Photo Backups" }
  ];

  const activeCommitments = [...commitments];
  fallbacks.forEach(f => {
    if (activeCommitments.length < 3 && !activeCommitments.some(c => c.name === f.name)) {
      activeCommitments.push(f);
    }
  });

  // 3. Assemble factual, specific narrative
  const selectedPledgeIds = Object.keys(pledges).filter(key => pledges[key] === true);
  const isTransformationActive = selectedPledgeIds.length > 0;

  const action1Phrase = actionPhrases[activeCommitments[0]?.name] || "optimizing video resolution";
  const savedKg = Math.round(reductionSaved);

  const formatAction = (phrase) => {
    if (!phrase) return "";
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  };

  const dynamicParagraph1 = `${formatAction(action1Phrase)} reduces roughly ${savedKg} kg CO\u2082e/year.`;
  const dynamicParagraph2 = `Combined with other chosen mindful habits, your digital shadow becomes almost ${reductionPercent.toFixed(0)}% lighter while preserving the same daily workflow.`;

  return (
    <div 
      className="scene-snap-item flex flex-col justify-center items-center px-6 py-4 select-none overflow-hidden w-full h-screen relative"
      style={{ backgroundColor: '#02010f', transition: 'none' }}
    >
      <CosmicStarField />
      <CosmicNebula />

      {/* Atmospheric glow */}
      <div
        className="absolute w-[70vw] h-[50vh] rounded-full filter blur-[150px] opacity-[0.07] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #00f0ff 0%, #9d4edd 50%, transparent 100%)',
          top: '40%', left: '50%', transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Main column */}
      <div className="max-w-[1050px] w-full flex flex-col gap-3 z-10 md:pl-28">

        {/* Header — tightened */}
        <div className="text-center flex flex-col gap-0.5">
          <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-accentCyan">
            Alternative Tomorrow
          </span>
          <h3 className="text-2xl md:text-3xl font-extralight text-white tracking-[0.18em] uppercase mt-0.5">
            Two futures. One choice.
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-accentEmerald font-bold mt-0.5">
            Compare your projections
          </span>
          <p className="text-[13px] text-white/70 leading-relaxed font-light max-w-[620px] mx-auto mt-4 font-serif italic">
            Slide the divider to compare your baseline and alternative future projections.
          </p>
        </div>

        {!isTransformationActive ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 max-w-md w-full mx-auto text-center gap-4 mt-4 z-10">
            <span className="text-4xl">🌱</span>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">No Commitments Selected Yet</h4>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              Choose actions on the previous screen to explore an alternative future.
            </p>
            <button 
              onClick={() => setScene(5)} 
              className="mt-2 px-6 py-2.5 rounded-full border border-[#00f5d4] text-[11px] font-bold uppercase tracking-wider text-[#05010d] bg-[#00f5d4] hover:bg-[#00f5d4]/90 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]"
            >
              Choose Actions
            </button>
          </div>
        ) : (
          <>
            {/* ── TRUE CLIP-MASK COMPARISON SLIDER ─────────────────────
                Both canvases render full-width at all times.
                CSS clip-path hard-masks each to its respective side.
                No squashing. No bleed-through. No double-body effect.
            ─────────────────────────────────────────────────────────── */}
            <div
              ref={containerRef}
              className="relative w-full rounded-2xl border border-white/10 bg-[#030008]/40 backdrop-blur-sm overflow-hidden shadow-2xl z-10"
              style={{ height: '28vh', minHeight: '200px' }}
            >
              {/* FUTURE — visible on the RIGHT of the divider */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 0 0 ${sliderPct}%)` }}
              >
                <ShadowEntity variant="future" scaleMultiplier={1.25} />
              </div>

              {/* CURRENT — visible on the LEFT of the divider */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
              >
                <ShadowEntity variant="current" scaleMultiplier={1.25} />
              </div>

              {/* Labels */}
              <div className="absolute bottom-3 left-4 z-20 pointer-events-none">
                <span className="text-[8px] uppercase tracking-widest text-accentRose font-bold">Current Shadow</span>
                <h4 className="text-sm font-bold text-white font-mono mt-0.5">
                  {baselineArchetype?.type || "Always Connected"}
                </h4>
              </div>
              <div className="absolute bottom-3 right-4 z-20 text-right pointer-events-none">
                <span className="text-[8px] uppercase tracking-widest text-accentEmerald font-bold">Future Shadow</span>
                <h4 className="text-sm font-bold text-white font-mono mt-0.5">
                  {getEvolvedIdentity(futureArchetype?.type || baselineArchetype?.type || "Always Connected")}
                </h4>
              </div>

              {/* Divider line */}
              <div
                className="absolute inset-y-0 w-[1.5px] bg-white/35 pointer-events-none z-30 flex items-center justify-center"
                style={{ left: `${sliderPct}%` }}
              >
                <div className="w-7 h-7 rounded-full border border-white/30 bg-[#090314]/90 backdrop-blur-md flex items-center justify-center shadow-lg text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-4 4m0 0l4 4m-4-4h16m0 0l-4-4m4 4l-4 4" />
                  </svg>
                </div>
              </div>

              {/* Drag input */}
              <input
                type="range" min="0" max="100" value={sliderPct}
                onChange={(e) => setSliderPct(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
              />
            </div>

            {/* ── BASELINE/FUTURE METRICS STRIP ──────────────────────── */}
            <div className="flex items-center justify-between py-2.5 px-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm max-w-md w-full mx-auto z-10">
              <div className="flex flex-col items-start">
                <span className="text-[8px] uppercase tracking-widest text-white/40">Baseline</span>
                <span className="text-xs font-mono font-bold text-white/80">{currentFootprint.toFixed(0)} kg</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[#00f5d4] text-xs font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,245,212,0.3)]">
                <span>↓</span>
                <span>{reductionPercent.toFixed(1)}% Lighter</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[8px] uppercase tracking-widest text-white/40">Future</span>
                <span className="text-xs font-mono font-bold text-[#00f5d4]">{futureFootprintVal.toFixed(0)} kg</span>
              </div>
            </div>

            {/* ── NARRATIVE + COMMITMENTS ────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch z-10 w-full">

              {/* Life In This Future — no internal scroll, no overflow */}
              <div className="glass-panel px-4 py-3 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-1.5 text-left overflow-hidden">
                <span className="text-[9px] tracking-widest uppercase text-accentEmerald font-bold">Life In This Future</span>
                <div 
                  className="flex flex-col gap-1.5" 
                  style={{ 
                    fontSize: '12px', 
                    lineHeight: '1.7', 
                    color: 'rgba(255,255,255,0.80)',
                    maxWidth: '85%'
                  }}
                >
                  <p>{dynamicParagraph1}</p>
                  <p>{dynamicParagraph2}</p>
                </div>
              </div>

              {/* Top 3 Commitments — Chips style */}
              <div className="glass-panel px-4 py-3 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-1.5 text-left overflow-hidden">
                <span className="text-[9px] tracking-widest uppercase text-accentCyan font-bold">Your Top 3 Commitments</span>
                <div className="flex flex-col gap-1.5 mt-0.5">
                  {activeCommitments.slice(0, 3).map((item, idx) => {
                    const rankEmojis = ["🥇", "🥈", "🥉"];
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2.5 py-1.5 px-3 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/10 transition-all text-[11px] font-medium text-white/90"
                      >
                        <span className="text-xs shrink-0">
                          {rankEmojis[idx] || "✨"}
                        </span>
                        <span className="tracking-wide truncate">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* CTA — spacing reduced */}
        <div className="flex justify-center z-10 shrink-0 mt-1">
          <button
            onClick={() => setScene(7)}
            className="group px-8 py-3 rounded-full border border-[#00f5d4] text-xs font-bold uppercase tracking-[0.25em] text-[#05010d] bg-[#00f5d4] hover:bg-[#00f5d4]/90 shadow-[0_0_20px_rgba(0,245,212,0.35)] hover:shadow-[0_0_30px_rgba(0,245,212,0.55)] transition-all duration-300 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              STEP INTO TOMORROW
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Scene6_AlternativeTomorrow;
