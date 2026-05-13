import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface GuitarStringsBackgroundProps {
  allStrings: { label: string; freq: number; note: string }[];
  tunedStrings: string[];
  opacity?: number;
  className?: string;
  showLabels?: boolean;
}

export function GuitarStringsBackground({ 
  allStrings, 
  tunedStrings, 
  opacity = 0.3,
  className,
  showLabels = true
}: GuitarStringsBackgroundProps) {
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
        const thickness = 1 + (idx * 0.7); 
        const isHighString = idx < 2;
        const color = isHighString ? '#E5E7EB' : '#D97706'; 

        return (
          <div key={`string-${idx}`} className="relative h-full">
            <AnimatePresence>
              {isTuned && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 0.6, width: `${thickness + 12}px` }}
                  exit={{ opacity: 0, width: 0 }}
                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 bg-emerald-500/20 blur-md rounded-full"
                />
              )}
            </AnimatePresence>

            <motion.div 
              initial={false}
              animate={{ 
                backgroundColor: isTuned ? '#10b981' : color,
                boxShadow: isTuned ? `0 0 10px #10b98188` : 'none',
              }}
              className="h-full rounded-full transition-all duration-700"
              style={{ 
                 width: `${thickness}px`,
                 borderRight: !isTuned ? `1px solid rgba(0,0,0,0.2)` : 'none'
              }}
            />
            
            {showLabels && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <span className={cn(
                  "text-[8px] font-black font-mono transition-colors",
                  isTuned ? "text-emerald-500" : "opacity-20"
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
