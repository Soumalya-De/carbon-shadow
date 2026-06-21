import React from 'react';
import { motion } from 'framer-motion';

/**
 * DigitalShadowTransformation renders the live footprint rebalancing flow
 * showing Current Nodes ➔ Flow ➔ Future Nodes.
 */
export function DigitalShadowTransformation({ traces, futureTraces }) {
  const categories = [
    { key: 'emails', label: 'Emails per day', unit: 'emails/day' },
    { key: 'aiPrompts', label: 'AI Prompts', unit: 'prompts/day' },
    { key: 'streaming', label: 'Streaming', unit: 'hours/week' },
    { key: 'meetings', label: 'Meetings', unit: 'hours/week' },
    { key: 'storage', label: 'Storage size', unit: 'GB' },
    { key: 'social', label: 'Social scroll', unit: 'hours/day' }
  ];

  return (
    <div className="w-full h-full bg-[#030009]/80 border-t border-white/5 p-6 flex flex-col justify-between select-none font-sans relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 z-10 w-full text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#00f5d4] font-bold">Digital Footprint Rebalancing</span>
        <span className="hidden md:inline text-white/20 text-xs font-light">•</span>
        <span className="text-[11px] uppercase tracking-widest text-[#BFC8D8] font-semibold">Real-Time Transformation Flow</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 my-auto z-10 w-full">
        {categories.map((cat) => {
          const baseVal = traces[cat.key] || 0;
          const futVal = futureTraces[cat.key] || 0;
          const pct = Math.max(0, Math.min(100, (futVal / (baseVal || 1)) * 100));

          return (
            <div 
              key={cat.key} 
              className="flex flex-col gap-1 bg-white/[0.02] border border-white/10 rounded-xl p-3 hover:border-white/20 transition-all duration-300"
            >
              <span className="text-xs uppercase tracking-wider text-[#BFC8D8] font-bold">{cat.label}</span>
              
              <div className="flex items-center justify-between gap-4 mt-1">
                {/* Current node */}
                <div className="flex flex-col items-start shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-[#e9d5ff] font-black">Current</span>
                  <span className="text-[15px] font-mono text-white font-bold">
                    {baseVal.toFixed(cat.key === 'meetings' || cat.key === 'social' || cat.key === 'streaming' ? 1 : 0)} 
                    <span className="text-[11px] opacity-75 font-sans ml-1 text-white">{cat.unit}</span>
                  </span>
                </div>
 
                {/* Flow line */}
                <div className="flex-1 h-[3px] bg-white/10 relative rounded-full overflow-hidden flex items-center">
                  <motion.div 
                    className="absolute h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #9d4edd 0%, #00f5d4 100%)'
                    }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                  {/* Glowing moving dot */}
                  <motion.div 
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#00f5d4] shadow-[0_0_8px_#00f5d4]"
                    animate={{ left: ['-5%', `${pct}%`] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + (pct / 100) * 1.6,
                      ease: "linear"
                    }}
                  />
                </div>
 
                {/* Future node */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-[#00f5d4] font-black">Future</span>
                  <span className="text-[17px] font-mono text-[#00f5d4] font-extrabold drop-shadow-[0_0_8px_rgba(0,245,212,0.45)]">
                    {futVal.toFixed(cat.key === 'meetings' || cat.key === 'social' || cat.key === 'streaming' ? 1 : 0)} 
                    <span className="text-[11px] opacity-75 font-sans ml-1 text-[#00f5d4]">{cat.unit}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DigitalShadowTransformation;
