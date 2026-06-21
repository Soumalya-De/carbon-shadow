import React from 'react';

/**
 * Elegant slider element with glowing tracks and values, enclosed in a frosted glass panel.
 */
export function ElegantSlider({ label, value, baselineValue, min = 0, max, unit, onChange, accentColor = 'cyan' }) {
  const percent = ((value - min) / (max - min)) * 100;
  
  // Decide accent styling classes
  const trackGradient = accentColor === 'cyan' 
    ? `linear-gradient(to right, #00f0ff 0%, #9d4edd ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`
    : `linear-gradient(to right, #00f5d4 0%, #00f0ff ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`;

  const borderClass = accentColor === 'cyan' 
    ? 'hover:border-accentCyan/40 focus-within:border-accentCyan/50' 
    : 'hover:border-accentEmerald/40 focus-within:border-accentEmerald/50';

  return (
    <div 
      className={`p-3.5 rounded-xl border transition-all duration-300 ${borderClass} flex flex-col gap-2 shadow-xl`}
      style={{
        background: 'rgba(12, 6, 26, 0.65)',
        borderColor: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Row 1: Label and Unit (separated at top) */}
      <div className="flex justify-between items-center w-full">
        <span 
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.75)',
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.2,
          }}
        >
          {label}
        </span>
        <span 
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.75)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {unit}
        </span>
      </div>

      {/* Row 2: Value Progression (Current ➔ Target) */}
      <div className="flex items-center gap-1.5 mt-0.5">
        {baselineValue !== undefined && (
          <span 
            style={{
              fontSize: '14px',
              opacity: 0.65
            }}
            className="text-[#BFC8D8] font-mono font-medium"
          >
            {baselineValue}
          </span>
        )}
        {baselineValue !== undefined && (
          <span className="text-white/50 text-[11px]">➔</span>
        )}
        <span 
          className="transition-all duration-300 font-mono"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#00F5E1',
            textShadow: '0 0 10px rgba(0, 245, 225, 0.3)'
          }}
        >
          {value}
        </span>
      </div>

      {/* Row 3: Slider input */}
      <div className="relative w-full flex items-center h-2 mt-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ background: trackGradient }}
          className="w-full appearance-none h-[3px] rounded-full outline-none transition-all duration-200 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default ElegantSlider;
