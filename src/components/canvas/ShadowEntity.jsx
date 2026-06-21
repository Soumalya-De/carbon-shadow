import React, { useRef } from 'react';
import { useCanvasShadow } from '../../hooks/useCanvasShadow';
import { useCarbonShadow } from '../../context/CarbonShadowContext';

/**
 * ShadowEntity wraps the canvas rendering logic for the animated Shadow.
 * @param {string} variant "current" | "future"
 */
export function ShadowEntity({ variant = "current", scaleMultiplier = 1.0 }) {
  const canvasRef = useRef(null);
  const { 
    footprint, 
    futureFootprint, 
    baselineArchetype, 
    futureArchetype, 
    traces, 
    futureTraces 
  } = useCarbonShadow();

  // Bind values based on variant selection
  const activeFootprint = variant === "current" ? footprint : futureFootprint;
  const activeArchetype = variant === "current" ? baselineArchetype : futureArchetype;
  const activeTraces = variant === "current" ? traces : futureTraces;

  useCanvasShadow(canvasRef, activeFootprint, activeArchetype, activeTraces, variant, scaleMultiplier);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-pointer"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
export default ShadowEntity;
