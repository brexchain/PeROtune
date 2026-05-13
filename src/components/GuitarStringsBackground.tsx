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
        "absolute inset-x-0 top-0 bottom-0 flex justify-center gap-4 sm:gap-8 pointer-events-none transition-opacity duration-700",
        className
      )}
      style={{ opacity }}
    >
      {[...allStrings].reverse().map((string, revIdx) => {
        const idx = allStrings.length - 1 - revIdx;
        const isTuned = tunedStrings.includes(string.label);
        const isActive = activeNote === string.note;
        const isPerfectActive = isActive && isPerfect;
        
        const thickness = 1 + (idx * 0.7); 
        const isHighString = idx < 2;
        const defaultColor = isHighString ? '#E5E7EB' : '#D97706'; 

        return (
          <div key={`string-${idx}`} className="relative h-full">
            <AnimatePresence>
              {(isTuned || isPerfectActive) && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ 
                    opacity: isPerfectActive ? 0.8 : 0.4, 
                    width: `${thickness + (isPerfectActive ? 24 : 12)}px`,
                    backgroundColor: isPerfectActive ? '#10b98144' : '#10b98122'
                  }}
                  exit={{ opacity: 0, width: 0 }}
                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 blur-md rounded-full"
                />
              )}
            </AnimatePresence>

            <motion.div 
              initial={false}
              animate={{ 
                backgroundColor: isPerfectActive ? '#10b981' : (isTuned ? '#10b98199' : defaultColor),
                boxShadow: isPerfectActive ? `0 0 20px #10b981` : (isTuned ? `0 0 10px #10b98144` : 'none'),
                x: isPerfectActive ? [0, -1, 1, -1, 1, 0] : 0
              }}
              transition={isPerfectActive ? {
                x: { repeat: Infinity, duration: 0.05 },
                duration: 0.2
              } : { duration: 0.7 }}
              className="h-full rounded-full transition-all"
              style={{ 
                 width: `${thickness}px`,
                 borderRight: (!isTuned && !isPerfectActive) ? `1px solid rgba(0,0,0,0.2)` : 'none'
              }}
            />
            
            {showLabels && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <span className={cn(
                  "text-[8px] font-black font-mono transition-all duration-300",
                  isPerfectActive ? "text-emerald-400 scale-150" : (isTuned ? "text-emerald-500/60" : "opacity-20")
                )}>
                  {string.label}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
