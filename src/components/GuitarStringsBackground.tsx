import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface GuitarStringsBackgroundProps {
  allStrings: { label: string; freq: number; note: string }[];
  tunedStrings: string[];
  activeNote?: string | null;
  activeCents?: number;
  opacity?: number;
  className?: string;
  showLabels?: boolean;
}

export function GuitarStringsBackground({ 
  allStrings, 
  tunedStrings, 
  activeNote = null,
  activeCents = 0,
  opacity = 0.3,
  className,
  showLabels = true
}: GuitarStringsBackgroundProps) {
  const isPerfect = activeNote && Math.abs(activeCents) <= 2;

  return (
    <div 
      className={cn(
        "absolute inset-x-0 top-0 bottom-0 overflow-hidden pointer-events-none transition-opacity duration-700",
        className
      )}
      style={{ opacity }}
    >
      {/* Wood Texture / Fretboard Background */}
      <div className="absolute inset-x-0 top-0 bottom-0 bg-[#1a130f] shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] opacity-95" />

      {/* Frets (Horizontal Lines with perspective approximation) */}
      <div className="absolute inset-x-0 top-0 bottom-48">
        {[...Array(15)].map((_, i) => (
          <div 
            key={`fret-${i}`} 
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#c0c0c088] to-transparent border-b border-black/60 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" 
            style={{ top: `${Math.pow(i / 15, 1.2) * 100}%` }}
          />
        ))}
      </div>

      {/* Position Markers (Dots) */}
      <div className="absolute inset-x-0 top-0 bottom-48">
        {[3, 5, 7, 9, 12, 15].map((fret) => {
          const topPos = Math.pow((fret - 0.5) / 15, 1.2) * 100;
          return (
            <div 
              key={`dot-${fret}`} 
              className="absolute w-full flex justify-center"
              style={{ top: `${topPos}%` }}
            >
              {fret === 12 ? (
                <div className="flex gap-16">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-stone-300/20 blur-[0.5px] shadow-inner" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-stone-300/20 blur-[0.5px] shadow-inner" />
                </div>
              ) : (
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-stone-300/20 blur-[0.5px] shadow-inner" />
              )}
            </div>
          );
        })}
      </div>

      {/* Soundhole at the bottom */}
      <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-black border-[16px] border-[#2a1d15] shadow-[0_0_120px_rgba(0,0,0,1)_inset,0_0_60px_rgba(0,0,0,0.7)]">
        {/* Rosette details */}
        <div className="absolute inset-[-4px] rounded-full border-2 border-[#3d2b1f]/60" />
        <div className="absolute inset-[-12px] rounded-full border border-[#3d2b1f]/40" />
        <div className="absolute inset-[-20px] rounded-full border-4 border-[#3d2b1f]/20" />
      </div>

      <div className="relative h-full flex justify-center gap-4 sm:gap-8 pt-10">
        {[...allStrings].reverse().map((string, revIdx) => {
        const idx = allStrings.length - 1 - revIdx;
        const isTuned = tunedStrings.includes(string.label);
        const isActive = activeNote === string.note;
        const isPerfectActive = isActive && isPerfect;
        
        // Realistic guitar string thickness (idx 0 is Low E)
        // idx typically: 0: E2, 1: A2, 2: D3, 3: G3, 4: B3, 5: E4
        const thickness = 0.8 + (idx * 0.5); 
        const isWoundString = idx <= 3; // E, A, D, G are usually wound
        const defaultColor = isWoundString ? '#d4a373' : '#e2e8f0'; 

        return (
          <div key={`string-${idx}`} className="relative h-full">
            <AnimatePresence>
              {(isTuned || isPerfectActive) && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ 
                    opacity: isPerfectActive ? 0.9 : 0.4, 
                    width: `${thickness + (isPerfectActive ? 30 : 15)}px`,
                    backgroundColor: isPerfectActive ? '#10b98166' : '#10b98122'
                  }}
                  exit={{ opacity: 0, width: 0 }}
                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 blur-xl rounded-full"
                />
              )}
            </AnimatePresence>

            <motion.div 
              initial={false}
              animate={{ 
                backgroundColor: isPerfectActive ? '#34d399' : (isTuned ? '#10b981cc' : defaultColor),
                boxShadow: isPerfectActive 
                  ? `0 0 35px #10b981, 0 0 15px rgba(255,255,255,0.5)` 
                  : (isTuned ? `0 0 12px #10b98166` : '0 1px 3px rgba(0,0,0,0.4)'),
                x: isPerfectActive ? [0, -1.5, 1.5, -1.5, 1.5, 0] : 0,
                scaleX: isPerfectActive ? [1, 1.05, 1] : 1
              }}
              transition={isPerfectActive ? {
                x: { repeat: Infinity, duration: 0.06 },
                scaleX: { repeat: Infinity, duration: 0.12 },
                duration: 0.2
              } : { duration: 0.7 }}
              className="h-full rounded-full transition-all relative overflow-hidden"
              style={{ 
                 width: `${thickness}px`,
                 borderRight: (!isTuned && !isPerfectActive) ? `1px solid rgba(0,0,0,0.3)` : 'none'
              }}
            >
               {/* Wound texture simulation */}
               {isWoundString && !isPerfectActive && (
                 <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)' }} />
               )}
               {isPerfectActive && (
                 <motion.div 
                    animate={{ top: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent"
                 />
               )}
            </motion.div>
            
            {showLabels && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <span className={cn(
                  "text-[8px] font-black font-mono transition-all duration-300",
                  isPerfectActive ? "text-emerald-300 scale-150 drop-shadow-[0_0_8px_#10b981]" : (isTuned ? "text-emerald-500/80" : "opacity-20")
                )}>
                  {string.label}
                </span>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
