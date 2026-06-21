import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useCanvasGarden } from '../../hooks/useCanvasGarden';
import { useCarbonShadow } from '../../context/CarbonShadowContext';

/**
 * GardenEcosystem wraps the Canvas rendering logic for procedural GreenBloom growth.
 * Includes a localized water trigger button to splash the garden.
 * @param {string} variant "current" | "future"
 */
export function GardenEcosystem({ 
  variant = "current", 
  waterTrigger: externalWaterTrigger,
  committedScore,
  showWaterButton = true
}) {
  const canvasRef = useRef(null);
  const { reductionScore } = useCarbonShadow();
  const [localWaterTrigger, setLocalWaterTrigger] = useState(0);

  const waterTrigger = externalWaterTrigger !== undefined 
    ? externalWaterTrigger + localWaterTrigger 
    : localWaterTrigger;

  const activeScore = committedScore !== undefined ? committedScore : reductionScore;

  // Bind ecosystem canvas renderer
  useCanvasGarden(canvasRef, activeScore, waterTrigger, variant);

  // Framer Motion controls for scale pulse animation
  const controls = useAnimation();

  useEffect(() => {
    if (waterTrigger > 0) {
      controls.start({
        scale: [1, 1.04, 1],
        transition: { duration: 1.2, ease: "easeInOut" }
      });
    }
  }, [waterTrigger, controls]);

  const handleWater = (e) => {
    e.stopPropagation();
    setLocalWaterTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full h-full relative select-none overflow-hidden">
      <motion.div 
        animate={controls}
        initial={{ scale: 1 }}
        className="w-full h-full"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
        />
      </motion.div>
      
      {/* Interactive Water Button overlay */}
      {showWaterButton && (
        <button
          onClick={handleWater}
          className="absolute bottom-8 right-8 z-10 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#05010d] bg-accentCyan hover:bg-accentCyan/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all duration-300"
        >
          💧 Water Garden
        </button>
      )}
    </div>
  );
}

export default GardenEcosystem;
