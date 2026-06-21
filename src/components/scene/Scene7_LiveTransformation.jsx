import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { ShadowEntity } from '../canvas/ShadowEntity';
import { DigitalShadowTransformation } from '../canvas/DigitalShadowTransformation';
import { ElegantSlider } from '../ui/ElegantSlider';
import { ShareableCard } from '../ui/ShareableCard';
import { getEvolvedIdentity } from '../../data/moodLibrary';
import { CosmicStarField, CosmicNebula } from '../ui/CosmicBackground';
import { exportComponentAsPNG } from '../../utils/imageExport';

/**
 * Scene 7: Live Transformation
 * The ultimate interactive terminal combining all sliders, the Shadow, and the Rebalancing visual.
 */
export function Scene7_LiveTransformation() {
  const { 
    traces,
    futureTraces, 
    updateFutureTraces, 
    reductionScore, 
    toggleShareModal,
    futureArchetype,
    baselineArchetype,
    footprint
  } = useCarbonShadow();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize futureTraces to a recommended 40-60% rebalanced target on load to fix Emails/Storage bug
  useEffect(() => {
    updateFutureTraces({
      emails: Math.max(0, Math.round(traces.emails * 0.5)),
      aiPrompts: Math.max(0, Math.round(traces.aiPrompts * 0.6)),
      streaming: Math.max(0, Math.round(traces.streaming * 0.5 * 10) / 10),
      meetings: Math.max(0, Math.round(traces.meetings * 0.4 * 10) / 10),
      storage: Math.max(0, Math.round(traces.storage * 0.6)),
      social: Math.max(0, Math.round(traces.social * 0.5 * 10) / 10),
    });
  }, []);

  const handleDownload = async () => {
    const el = document.getElementById('hidden-passport-card');
    if (!el) return;
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      await exportComponentAsPNG(el, 'carbon-shadow-passport.png');
    } catch (err) {
      console.error(err);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    toggleShareModal(true);
  };

  return (
    <div className="scene-snap-item flex bg-[#05010d] select-none overflow-hidden h-screen w-full relative">
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
      
      {/* Collapsible Sidebar of Sliders */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '280px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full border-r border-white/5 bg-[#090314]/90 backdrop-blur-xl shrink-0 z-20 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center mt-12">
              <div className="flex flex-col">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-accentCyan font-bold">Parameters Console</span>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-[0.08em]">Mindful Scaling</h4>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-300 border border-white/5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Sliders Container */}
            <div className="flex-1 overflow-y-auto p-4 pb-8 flex flex-col justify-between no-scrollbar">
              <p className="text-[13px] text-white/85 leading-[1.5] font-light mb-1">
                Drag the parameters down to sustainable ranges. Watch the shadow dissipate in real-time.
              </p>
              
              <ElegantSlider
                label="Emails per day"
                value={futureTraces.emails}
                baselineValue={traces.emails}
                min={0}
                max={200}
                unit="emails/day"
                onChange={(val) => updateFutureTraces({ emails: val })}
                accentColor="emerald"
              />
              <ElegantSlider
                label="AI Prompts per day"
                value={futureTraces.aiPrompts}
                baselineValue={traces.aiPrompts}
                min={0}
                max={100}
                unit="prompts/day"
                onChange={(val) => updateFutureTraces({ aiPrompts: val })}
                accentColor="emerald"
              />
              <ElegantSlider
                label="Streaming hours"
                value={futureTraces.streaming}
                baselineValue={traces.streaming}
                min={0}
                max={12}
                unit="hours/week"
                onChange={(val) => updateFutureTraces({ streaming: val })}
                accentColor="emerald"
              />
              <ElegantSlider
                label="Video meetings"
                value={futureTraces.meetings}
                baselineValue={traces.meetings}
                min={0}
                max={40}
                unit="hours/week"
                onChange={(val) => updateFutureTraces({ meetings: val })}
                accentColor="emerald"
              />
              <ElegantSlider
                label="Cloud storage size"
                value={futureTraces.storage}
                baselineValue={traces.storage}
                min={0}
                max={200}
                unit="GB"
                onChange={(val) => updateFutureTraces({ storage: val })}
                accentColor="emerald"
              />
              <ElegantSlider
                label="Social media scroll"
                value={futureTraces.social}
                baselineValue={traces.social}
                min={0}
                max={8}
                unit="hours/day"
                onChange={(val) => updateFutureTraces({ social: val })}
                accentColor="emerald"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle button to reopen sidebar */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSidebarOpen(true)}
          className="absolute left-6 top-20 z-30 p-3 rounded-full bg-[#090314]/90 border border-white/10 hover:border-accentCyan/30 text-white shadow-xl flex items-center justify-center gap-2 group transition-all duration-300"
        >
          <svg className="w-4 h-4 text-accentCyan group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[9px] uppercase tracking-wider font-bold pr-2 text-white/80">Open Console</span>
        </motion.button>
      )}

      {/* Main split display: Top Shadow, Bottom Rebalancing */}
      <div className="flex-1 h-full flex flex-col relative z-0">
        
        {/* Subtle Ambient Cyan Glow behind Central Figure and Headline */}
        <div
          className="absolute w-[500px] h-[350px] rounded-full filter blur-[120px] opacity-15 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.45) 0%, rgba(0, 245, 212, 0.2) 65%, transparent 100%)',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Top HUD: Separate Buttons */}
        <div className="absolute top-6 left-12 right-6 z-20 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto mt-14">
            {/* DOWNLOAD PASSPORT */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#05010d] bg-accentCyan hover:bg-accentCyan/90 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center gap-2 border border-accentCyan/30 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#05010d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isDownloading ? 'EXPORTING...' : 'DOWNLOAD PASSPORT'}
            </button>

            {/* SHARE RESULT */}
            <button
              onClick={handleShare}
              className="px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white/95 hover:text-white border border-white/30 hover:border-white/50 bg-white/8 hover:bg-white/15 transition-all duration-300 flex items-center gap-2 cursor-pointer pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8.684 10.742l4.828-2.414m0 0a3 3 0 10-3.62-3.62l-4.829 2.414m11.663 8.358a3 3 0 103-3H15" />
              </svg>
              SHARE RESULT
            </button>
          </div>
        </div>

        {/* Final Payoff Header overlay (Standardized Hierarchy) */}
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4 mt-6 flex flex-col gap-1.5">
          <span className="text-xs text-white/95 tracking-[0.3em] uppercase font-bold">
            Your Digital Shadow
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#00f5d4] tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,245,212,0.4)] animate-pulse-slow">
            {reductionScore}% Lighter
          </h2>
          <div className="flex flex-col gap-0.5 mt-2">
            <span className="text-[11px] text-white/95 tracking-[0.3em] uppercase font-bold">
              Future Identity
            </span>
            <span className="text-base font-mono font-black text-[#00ffff] tracking-widest uppercase drop-shadow-[0_0_16px_rgba(0,255,255,0.95)]">
              {getEvolvedIdentity(futureArchetype?.type || baselineArchetype?.type || "Always Connected")}
            </span>
          </div>
        </div>

        {/* Future Shadow Visualizer (Top 58%) */}
        <div className="w-full h-[58%] relative bg-gradient-to-b from-[#05010d] to-[#030008] border-b border-white/5">
          <ShadowEntity variant="future" scaleMultiplier={1.40} />
        </div>

        {/* Footprint Rebalancing Visualizer (Bottom 42%) */}
        <div className="w-full h-[42%] relative bg-[#020005]">
          <DigitalShadowTransformation traces={traces} futureTraces={futureTraces} />
        </div>
      </div>

      {/* Hidden passport card DOM structure for on-demand PNG render */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          id="hidden-passport-card"
          className="w-[400px] relative overflow-hidden rounded-3xl p-8 bg-[#090314] border border-white/10 flex flex-col gap-6"
          style={{
            boxShadow: `0 0 40px rgba(0, 240, 255, 0.1)`,
          }}
        >
          {/* Ambient Background Grid and Orb */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>

          {/* Glowing Shadow Orb */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full filter blur-[40px] opacity-40"
            style={{
              background: `radial-gradient(circle, #00f0ff 0%, transparent 70%)`
            }}
          />

          {/* Top Badge */}
          <div className="flex justify-between items-center z-10 font-sans">
            <span className="text-[10px] tracking-[0.25em] text-white/50 font-bold uppercase">Carbon Shadow Passport</span>
            <div className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase border border-accentEmerald text-[#00f5d4] bg-accentEmerald/10">
              {reductionScore}% LIGHTER
            </div>
          </div>

          {/* Main Title and Type */}
          <div className="flex flex-col gap-1 mt-2 z-10 font-sans text-left">
            <span className="text-xs text-white/40 font-light">Future Identity</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">
              {getEvolvedIdentity(futureArchetype?.type || baselineArchetype?.type || "Always Connected")}
            </h2>
          </div>

          <hr className="border-white/10 my-1 z-10" />

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 gap-4 z-10 text-left font-sans">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Daily Footprint</span>
              <span className="text-base font-bold text-white font-mono">{(footprint?.totalDailyGrams || 0).toFixed(0)} <span className="text-xs font-normal text-white/50 font-sans">g CO2e</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Annual Equivalent</span>
              <span className="text-base font-bold text-white font-mono">{(footprint?.totalAnnualKg || 0).toFixed(0)} <span className="text-xs font-normal text-white/50 font-sans">kg CO2e</span></span>
            </div>
          </div>

          {/* Top Commitments */}
          <div className="flex flex-col gap-2 z-10 text-left font-sans">
            <span className="text-[10px] uppercase tracking-widest text-[#00f5d4] font-bold">Top Commitments</span>
            <ul className="text-xs text-white/80 space-y-1">
              <li>• Audio-only meetings</li>
              <li>• Camera off by default</li>
              <li>• Standard definition streaming</li>
            </ul>
          </div>

          {/* Brand footer */}
          <div className="flex justify-between items-center text-[8px] text-white/30 uppercase mt-4 z-10 font-mono tracking-widest">
            <span>Generated by Carbon Shadow</span>
            <span>System.Ver.1.0</span>
          </div>
        </div>
      </div>

      {/* Share card Modal container */}
      <ShareableCard />

    </div>
  );
}

export default Scene7_LiveTransformation;
