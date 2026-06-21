import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';
import { triviaLibrary } from '../../data/triviaLibrary';

/**
 * TriviaTicker displays rotating digital carbon footprint facts,
 * styled as a premium climate-art installation telemetry box.
 */
export function TriviaTicker() {
  const { scene } = useCarbonShadow();
  
  // Pick a random starting index
  const [index, setIndex] = useState(() => Math.floor(Math.random() * triviaLibrary.length));

  // Rotate facts every 18 seconds (longer duration for better absorption)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % triviaLibrary.length);
    }, 18000);

    return () => clearInterval(timer);
  }, []);

  // Hide in Scene 5 and Scene 7 to prevent canvas/sidebar overlaps
  const isHidden = scene === 5 || scene === 7;

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed bottom-8 left-8 z-30 max-w-sm w-[80vw] md:w-96 p-4 rounded-lg bg-[#070311]/50 border border-white/5 shadow-2xl backdrop-blur-md flex gap-4 select-none pointer-events-auto overflow-hidden font-mono"
        >
          {/* 1. Left Telemetry Indicator Line (Minimal Installation Feel) */}
          <div className="w-[1.5px] shrink-0 bg-gradient-to-b from-accentCyan via-accentViolet to-transparent h-10 mt-1" />

          {/* 2. Text layout */}
          <div className="flex-1 overflow-hidden min-h-[44px] flex flex-col justify-center">
            <span className="text-[8px] uppercase tracking-[0.3em] text-accentCyan/80 font-bold block mb-1">
              Climate Intelligence • Deep Signal
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="text-[10px] md:text-[11px] text-white/60 font-light leading-relaxed tracking-wide"
              >
                {triviaLibrary[index]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default TriviaTicker;
