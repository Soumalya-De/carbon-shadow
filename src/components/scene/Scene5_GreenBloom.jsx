import React, { useState, useEffect, useMemo } from 'react';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';

// ─── Complete Action Pool (all 10 options across 5 categories) ────────────────
const ALL_ACTIONS = [
  // Streaming
  {
    id: 'streaming_sd',
    category: 'Streaming',
    categoryKey: 'streaming',
    label: 'WATCH IN STANDARD DEFINITION',
    desc: 'Standard definition uses up to 50% less streaming energy.',
    recText: 'Watch videos in Standard Definition',
    calculateSaved: (t) => t.streaming * 13.14 * 0.5,
    scale: { streaming: 0.5 },
  },
  {
    id: 'streaming_autoplay',
    category: 'Streaming',
    categoryKey: 'streaming',
    label: 'DISABLE VIDEO AUTOPLAY',
    desc: 'Autoplay loads full streams silently — turning it off stops the waste.',
    recText: 'Disable streaming video autoplay',
    calculateSaved: (t) => t.streaming * 13.14 * 0.25,
    scale: { streaming: 0.75 },
  },
  // AI Usage
  {
    id: 'ai_batch',
    category: 'AI Usage',
    categoryKey: 'aiPrompts',
    label: 'BATCH MY AI REQUESTS',
    desc: 'Batching prompts reduces repeated GPU spin-ups throughout the day.',
    recText: 'Batch AI requests into one session',
    calculateSaved: (t) => t.aiPrompts * 1.6425 * 0.40,
    scale: { aiPrompts: 0.60 },
  },
  {
    id: 'ai_loops',
    category: 'AI Usage',
    categoryKey: 'aiPrompts',
    label: 'LIMIT MODEL TRIAL LOOPS',
    desc: 'Fewer experimental re-runs means less idle compute on AI servers.',
    recText: 'Limit experimental AI prompt trial loops',
    calculateSaved: (t) => t.aiPrompts * 1.6425 * 0.30,
    scale: { aiPrompts: 0.70 },
  },
  // Storage
  {
    id: 'storage_backups',
    category: 'Storage',
    categoryKey: 'storage',
    label: 'DISABLE AUTO PHOTO BACKUPS',
    desc: 'Continuous cloud sync runs 24/7 — disabling it cuts background load.',
    recText: 'Disable automatic photo cloud backups',
    calculateSaved: (t) => t.storage * 0.00584 * 0.30,
    scale: { storage: 0.70 },
  },
  {
    id: 'storage_sync',
    category: 'Storage',
    categoryKey: 'storage',
    label: 'REDUCE DATABASE SYNCING',
    desc: 'On-demand syncing replaces always-on replication of dev logs.',
    recText: 'Reduce real-time database cloud syncing',
    calculateSaved: (t) => t.storage * 0.00584 * 0.20,
    scale: { storage: 0.80 },
  },
  // Communication
  {
    id: 'comm_audio',
    category: 'Meetings',
    categoryKey: 'meetings',
    label: 'GO AUDIO-ONLY IN LARGE MEETINGS',
    desc: 'Audio-only meetings reduce bandwidth use by up to 85%.',
    recText: 'Audio-only during large meetings',
    calculateSaved: (t) => t.meetings * 8.187 * 0.85,
    scale: { meetings: 0.15 },
  },
  {
    id: 'comm_camera',
    category: 'Meetings',
    categoryKey: 'meetings',
    label: 'CAMERA OFF WHEN NOT PRESENTING',
    desc: 'Turning off camera when listening cuts video stream energy in half.',
    recText: 'Turn off camera when not presenting',
    calculateSaved: (t) => t.meetings * 8.187 * 0.50,
    scale: { meetings: 0.50 },
  },
  // Attention / Social
  {
    id: 'att_scroll',
    category: 'Social',
    categoryKey: 'social',
    label: 'LIMIT INFINITE SCROLLING',
    desc: 'Shorter feed sessions lower the energy drawn by continuous CDN queries.',
    recText: 'Limit infinite scrolling sessions',
    calculateSaved: (t) => t.social * 26.28 * 0.40,
    scale: { social: 0.60 },
  },
  {
    id: 'att_video_feeds',
    category: 'Social',
    categoryKey: 'social',
    label: 'AVOID VIDEO SOCIAL FEEDS',
    desc: 'Video feeds autoplay at high resolution — switching to text reduces load.',
    recText: 'Spend less time on video-heavy social feeds',
    calculateSaved: (t) => t.social * 26.28 * 0.35,
    scale: { social: 0.65 },
  },
];

// Minimum annual saving to show an action card (kg CO₂e)
const MIN_SAVING_KG = 5;

/**
 * Builds the active actions list dynamically based on user traces.
 * Rules:
 * 1. Calculate each action's real saving against the user's traces.
 * 2. Discard actions below MIN_SAVING_KG threshold.
 * 3. Sort descending by saving (highest impact first).
 * 4. De-duplicate: only keep 1 action per category unless both clear the threshold
 *    and there are fewer than 6 total.
 * 5. Cap at 6.
 */
function buildActiveActions(traces) {
  // Score every action with its actual saving
  const scored = ALL_ACTIONS.map((a) => ({
    ...a,
    saving: a.calculateSaved(traces),
  }));

  // Filter: must clear the minimum threshold
  const eligible = scored.filter((a) => a.saving >= MIN_SAVING_KG);

  // Sort highest impact first
  eligible.sort((a, b) => b.saving - a.saving);

  // De-duplicate by category: prefer highest-saving action per category first,
  // then allow second actions if we still have room up to 6.
  const seenCategory = {};
  const primary = [];
  const secondary = [];

  eligible.forEach((a) => {
    if (!seenCategory[a.category]) {
      seenCategory[a.category] = true;
      primary.push(a);
    } else {
      secondary.push(a);
    }
  });

  // Combine: primaries first (already sorted), then add secondaries until we hit 6
  const combined = [...primary];
  for (const s of secondary) {
    if (combined.length >= 6) break;
    combined.push(s);
  }

  // Re-sort the final list by saving (descending) so they always appear highest→lowest
  combined.sort((a, b) => b.saving - a.saving);

  return combined.slice(0, 6);
}

/**
 * Categories that the user has with meaningful usage.
 * Used to show "already minimal" rows for the rest.
 */
function getMinimalCategories(traces, activeActions) {
  const categoryMeta = [
    { key: 'streaming', label: 'Streaming' },
    { key: 'aiPrompts', label: 'AI Usage' },
    { key: 'storage', label: 'Storage' },
    { key: 'meetings', label: 'Meetings' },
    { key: 'social', label: 'Social' },
  ];

  const activeCategoryKeys = new Set(activeActions.map((a) => a.categoryKey));

  return categoryMeta.filter((c) => {
    const traceVal = traces[c.key] || 0;
    // Show "minimal" badge if this category has usage but all its actions were filtered out
    const hasActions = ALL_ACTIONS.some((a) => a.categoryKey === c.key);
    return hasActions && !activeCategoryKeys.has(c.key) && traceVal > 0;
  });
}

/**
 * Category accent colors for card left border
 */
const CATEGORY_COLORS = {
  Streaming: '#a78bfa', // violet
  'AI Usage': '#38bdf8', // sky blue
  Storage: '#fb923c', // orange
  Meetings: '#34d399', // emerald
  Social: '#f472b6', // pink
};

/**
 * Scene 5: GreenBloom — Smart Mindful Action Commitment Screen
 */
export function Scene5_GreenBloom() {
  const {
    traces,
    futureTraces,
    updateFutureTraces,
    footprint,
    setScene,
    pledges,
    updatePledges,
  } = useCarbonShadow();

  // Build smart action list from actual user traces — stable on mount
  const [activeActions] = useState(() => buildActiveActions(traces));

  // Categories that are non-zero but had no actions pass the threshold
  const minimalCategories = useMemo(
    () => getMinimalCategories(traces, activeActions),
    [traces, activeActions]
  );

  // Local checkbox state, initialized from existing pledges or unchecked
  const [selectedActions, setSelectedActions] = useState(() => {
    const init = {};
    activeActions.forEach((a) => {
      init[a.id] = pledges[a.id] !== undefined ? pledges[a.id] : false;
    });
    return init;
  });

  // Sync when global pledges reset
  useEffect(() => {
    setSelectedActions((prev) => {
      const next = { ...prev };
      let changed = false;
      activeActions.forEach((a) => {
        const pledgeVal = pledges[a.id];
        const newVal = pledgeVal !== undefined ? pledgeVal : false;
        if (next[a.id] !== newVal) {
          next[a.id] = newVal;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [pledges, activeActions]);

  // Toggle handler — updates local state, syncs pledges, recalculates future traces
  const handleToggle = (id) => {
    const nextState = { ...selectedActions, [id]: !selectedActions[id] };
    setSelectedActions(nextState);
    updatePledges({ [id]: nextState[id] });

    const multipliers = {};
    activeActions.forEach((action) => {
      if (nextState[action.id]) {
        Object.keys(action.scale).forEach((key) => {
          multipliers[key] = (multipliers[key] || 1.0) * action.scale[key];
        });
      }
    });

    const updatedFuture = { ...traces };
    Object.keys(multipliers).forEach((key) => {
      updatedFuture[key] = Math.round(traces[key] * multipliers[key] * 100) / 100;
    });
    updateFutureTraces(updatedFuture);
  };

  // Derived numbers
  const totalSavedKg = activeActions.reduce(
    (acc, a) => acc + (selectedActions[a.id] ? a.calculateSaved(traces) : 0),
    0
  );

  const currentFootprint = footprint ? footprint.totalAnnualKg : 150.0;
  const futureFootprint = Math.max(0, currentFootprint - totalSavedKg);
  const reductionPercent =
    currentFootprint > 0 ? (totalSavedKg / currentFootprint) * 100 : 0;

  // Best UNSELECTED action = next biggest opportunity the user hasn't taken yet.
  // Falls back to activeActions[0] (highest overall) if everything is selected.
  const topAction =
    activeActions.find((a) => !selectedActions[a.id]) || activeActions[0];

  const maxSavingsPossible = activeActions.reduce(
    (s, a) => s + a.calculateSaved(traces),
    0
  );
  const topContributionPct =
    topAction && maxSavingsPossible > 0
      ? (topAction.calculateSaved(traces) / maxSavingsPossible) * 100
      : 0;

  const hasSelections = Object.values(selectedActions).some((v) => v === true);

  // No meaningful actions at all (ultra-minimal footprint user)
  const noActions = activeActions.length === 0;

  return (
    <div
      className="scene-snap-item relative flex flex-col justify-center items-center px-6 py-6 select-none overflow-y-auto w-full h-screen"
      style={{ backgroundColor: '#02010f', transition: 'none' }}
    >
      <CosmicStarField />
      <CosmicNebula />

      {/* Main content column — vertically centered, equal breathing room top and bottom */}
      <div className="max-w-[900px] w-full flex flex-col items-center gap-4 z-10 md:pl-28">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-1">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-accentEmerald">
            GREENBLOOM ECOSYSTEM
          </span>
          <h3 className="text-2xl md:text-[28px] font-light text-white tracking-widest uppercase">
            MINDFUL ACTION
          </h3>
          <p className="text-[14px] text-white/75 leading-relaxed font-light mt-0.5 max-w-xl">
            Small digital habits create a measurable difference. Choose the actions that feel realistic for your daily life.
          </p>
        </div>

        {noActions ? (
          /* Edge case: no actions clear the threshold — footprint is already minimal */
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-[#00f5d4]/20 max-w-md w-full mx-auto text-center gap-3">
            <span className="text-4xl">🌿</span>
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              Your Footprint Is Already Minimal
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Based on your usage, no single action would meaningfully reduce your digital shadow.
              You're already among the most sustainable digital citizens.
            </p>
            <button
              onClick={() => setScene(6)}
              className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#05010d] bg-[#00f5d4] hover:bg-[#00f5d4]/90 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.3)]"
            >
              See Your Shadow
            </button>
          </div>
        ) : (
          <>
            {/* ── Action Cards Grid (max 6 cards, always clean 2-col) ─────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
              {activeActions.map((action) => {
                const accentColor = CATEGORY_COLORS[action.category] || '#00f0ff';
                const isChecked = selectedActions[action.id];
                const savingKg = Math.round(action.calculateSaved(traces));
                return (
                  <div
                    key={action.id}
                    onClick={() => handleToggle(action.id)}
                    className={`glass-panel rounded-xl border transition-all duration-300 cursor-pointer flex gap-3 items-start select-none px-3.5 py-3 ${
                      isChecked
                        ? 'border-[#00f0ff]/50 bg-[#00f0ff]/10 shadow-[0_0_24px_rgba(0,240,255,0.22)]'
                        : 'border-white/5 opacity-65 hover:opacity-90 hover:border-white/12 hover:bg-white/[0.015]'
                    }`}
                    style={{
                      borderLeftWidth: '3px',
                      borderLeftStyle: 'solid',
                      borderLeftColor: isChecked ? accentColor : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Checkbox — aligned to top */}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-1 transition-all duration-200 ${
                        isChecked ? 'border-[#00f0ff] shadow-[0_0_8px_#00f0ff]' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: isChecked ? accentColor : 'transparent' }}
                    >
                      {isChecked && (
                        <svg className="w-2.5 h-2.5 text-[#05010d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Text content — no overflow clipping, full wrap */}
                    <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                      <span
                        className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase w-fit"
                        style={{
                          color: accentColor,
                          backgroundColor: `${accentColor}14`,
                          border: `1px solid ${accentColor}28`,
                        }}
                      >
                        {action.category}
                      </span>
                      <span className="text-[12px] font-bold text-white tracking-wide leading-snug mt-0.5">
                        {action.label}
                      </span>
                      {/* Full description — wraps freely, never truncated */}
                      <span className="text-[12px] text-white/80 leading-snug font-light">
                        {action.desc}
                      </span>
                    </div>

                    {/* Saving badge — pinned to top-right */}
                    <div className="shrink-0 text-right flex flex-col items-end gap-0.5 mt-1">
                      <span
                        className="text-[11px] font-mono font-bold tabular-nums"
                        style={{ color: isChecked ? accentColor : 'rgba(255,255,255,0.55)' }}
                      >
                        ≈{savingKg}
                      </span>
                      <span className="text-[8.5px] text-white/40 uppercase tracking-wide">
                        kg/yr
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* P6: Minimal-category chips removed — they break visual flow */}

            {/* ── Your Future Shadow Card ───────────────────────────────── */}
            <div className="w-full rounded-2xl bg-white/[0.02] border border-[#00f5d4]/10 shadow-[0_0_20px_rgba(0,245,212,0.03)] backdrop-blur-md overflow-hidden">
              <div className="px-4 pt-3 pb-1">
                <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-[#00f5d4]">
                  YOUR FUTURE SHADOW
                </span>
              </div>

              {hasSelections ? (
                <div className="px-4 pb-3 flex flex-col gap-2">
                  {/* Fix 5: Numbers row — larger, higher-contrast labels */}
                  <div className="grid grid-cols-3 items-center px-3 py-2 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-widest text-white/75 font-bold">Current</span>
                      <span className="text-[13px] font-mono text-white/80 mt-0.5 tabular-nums">
                        {currentFootprint.toFixed(1)} <span className="text-[9px] text-white/45">kg/yr</span>
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[9px] text-[#00f5d4] font-black tracking-wider bg-[#00f5d4]/10 border border-[#00f5d4]/25 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(0,245,212,0.2)] animate-pulse tabular-nums">
                        -{reductionPercent.toFixed(1)}%
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold mt-0.5">Lighter</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[11px] uppercase tracking-widest text-[#00f5d4] font-bold">Future</span>
                      <span className="text-[14px] font-extrabold text-white font-mono mt-0.5 tabular-nums drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
                        {futureFootprint.toFixed(1)} <span className="text-[9px] text-white/50">kg/yr</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-0.5 px-1">
                    <div className="flex justify-between text-[7px] uppercase tracking-wider text-white/35 mb-0.5">
                      <span>Current Shadow</span>
                      <span className="text-[#00f5d4] font-bold">Future Shadow →</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-[#00f5d4] to-[#00c9ff] shadow-[0_0_10px_#00f5d4] transition-all duration-500 shrink-0"
                        style={{ width: `${Math.max(8, (futureFootprint / currentFootprint) * 100)}%` }}
                      />
                      <div
                        className="h-full bg-[#00f5d4]/10 border-y border-dashed border-[#00f5d4]/30 transition-all duration-500 animate-pulse"
                        style={{ width: `${(totalSavedKg / currentFootprint) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* P3: clean, bright, centered empty state — no footnote */
                <div className="py-5 text-center">
                  <p className="text-[12px] text-white/75 leading-relaxed tracking-wide">
                    Choose one or more actions above to preview your future digital shadow.
                  </p>
                </div>
              )}
            </div>

            {/* ── Biggest Opportunity — HERO CARD ───────────────────────── */}
            {topAction && (
              <div
                className="flex flex-col gap-2 py-4 px-5 rounded-xl border w-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.07) 0%, rgba(157,78,221,0.04) 100%)',
                  borderColor: 'rgba(0,240,255,0.22)',
                  boxShadow: '0 0 30px rgba(0,240,255,0.06)'
                }}
              >
                {/* Row 1: eyebrow label */}
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#00ffff] drop-shadow-[0_0_5px_rgba(0,255,255,0.9)]">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-[9px] text-[#00ffff] font-extrabold tracking-[0.25em] uppercase">
                    Biggest Opportunity
                  </span>
                </div>

                {/* Row 2: action name — 24px hero */}
                <h4 className="text-[22px] font-bold text-white leading-tight tracking-wide">
                  {topAction.recText}
                </h4>

                {/* Row 3: saving value — 28px cyan hero number */}
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[28px] font-black font-mono tabular-nums leading-none"
                    style={{
                      color: '#00ffff',
                      textShadow: '0 0 16px rgba(0,255,255,0.55), 0 0 40px rgba(0,255,255,0.2)'
                    }}
                  >
                    ≈{Math.round(topAction.calculateSaved(traces))}
                  </span>
                  <span className="text-[14px] font-semibold text-[#00ffff]/70 font-mono">
                    kg CO₂e/year
                  </span>
                </div>

                {/* Row 4: supporting context */}
                <p className="text-[13px] font-medium text-white/70 leading-relaxed">
                  Largest single reduction available — contributes {Math.round(topContributionPct)}% of your total potential.
                </p>
              </div>
            )}

            {/* Fix 7: CTA flush with Biggest Opportunity — no extra margin */}
            <div className="flex justify-center w-full">
              <button
                onClick={() => setScene(6)}
                className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.25em] text-[#05010d] bg-[#00f5d4] hover:bg-[#00f5d4]/90 shadow-[0_0_20px_rgba(0,245,212,0.35)] hover:shadow-[0_0_30px_rgba(0,245,212,0.55)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Alternative Tomorrow
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Scene5_GreenBloom;
