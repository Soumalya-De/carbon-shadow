import React from 'react';
import { motion } from 'framer-motion';

/**
 * Frosted micro-card displaying footprint metrics in Scene 4 with neat neon accents.
 * Redesigned into elegant, borderless, floating installation capsules with generous spacing.
 */
export function InsightCapsule({ label, value, description, icon, accentColor = "#00f0ff", delay = 0 }) {
  // Staggered entry animation settings
  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1], // premium easeOutQuart
        delay: delay 
      }
    }
  };

  // Render SVG icons dynamically (directly with no boxes or backgrounds)
  const renderIcon = () => {
    switch (icon) {
      case 'type':
        return (
          <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'mood':
        return (
          <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case 'contributor':
        return (
          <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'weight':
        return (
          <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: accentColor }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden p-8 md:p-10 rounded-[32px] border border-white/[0.04] shadow-2xl flex flex-col gap-5 group transition-all duration-500 hover:-translate-y-1"
      style={{
        background: 'rgba(12, 6, 26, 0.35)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Background glow matching the archetype accent color on hover */}
      <div 
        className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full filter blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{
          background: accentColor
        }}
      />

      <div className="flex justify-between items-center">
        <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-white/45 font-bold font-sans">{label}</span>
        <div className="flex items-center justify-center">
          {renderIcon()}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <h4 
          className="text-2xl md:text-3xl font-light tracking-wide text-white transition-colors duration-300 font-sans"
        >
          {value}
        </h4>
        {description && (
          <p className="text-[11px] md:text-xs leading-relaxed text-white/55 font-light mt-1 tracking-wide">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
export default InsightCapsule;
