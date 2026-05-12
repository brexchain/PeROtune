import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface NeedleBarProps {
  cents: number;
  active: boolean;
  theme?: 'dark' | 'light';
}

export function NeedleBar({ cents, active, theme = 'dark' }: NeedleBarProps) {
  // cents ranges from -50 to 50
  const percentage = ((cents + 50) / 100) * 100;
  const isPerfect = Math.abs(cents) <= 2;
  const isDark = theme === 'dark';

  return (
    <div className="w-full max-w-md px-8 py-4">
      <div className={cn(
        "flex justify-between text-[10px] uppercase tracking-widest mb-2 font-mono transition-colors",
        isDark ? "text-white/40" : "text-black/40"
      )}>
        <span>-50</span>
        <span className={cn(
          isPerfect && active 
            ? "text-emerald-400 font-bold" 
            : isDark ? "text-white/60" : "text-black/60"
        )}>0</span>
        <span>+50</span>
      </div>
      
      <div className={cn(
        "relative h-12 w-full rounded-full border overflow-hidden backdrop-blur-sm transition-colors",
        isDark ? "bg-black/40 border-white/5" : "bg-white/40 border-black/5"
      )}>
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 w-[1px] transition-colors",
                isDark ? "bg-white/10" : "bg-black/10",
                i === 5 && (isDark ? "h-4 bg-white/30" : "h-4 bg-black/30")
              )} 
            />
          ))}
        </div>

        {/* Center line */}
        <div className={cn(
          "absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 transition-colors",
          isDark ? "bg-white/20" : "bg-black/20"
        )} />

        {/* The Needle */}
        {active && (
          <motion.div 
            className="absolute top-0 bottom-0 w-1 flex flex-col items-center"
            initial={{ left: '50%' }}
            animate={{ left: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={cn(
              "flex-1 w-full rounded-full transition-colors duration-300",
              isPerfect 
                ? "bg-emerald-400 shadow-emerald-400/50 shadow-[0_0_10px]" 
                : isDark ? "bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "bg-black/80 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            )} />
            <div className={cn(
               "h-2 w-2 rounded-full mb-1 transition-colors duration-300",
               isPerfect ? "bg-emerald-400" : isDark ? "bg-white/80" : "bg-black/80"
            )} />
          </motion.div>
        )}

        {/* Glow effect when perfect */}
        {active && isPerfect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-emerald-500/10 pointer-events-none"
          />
        )}
      </div>

      <div className="mt-2 text-center">
        <span className={cn(
          "font-mono text-xs tracking-tighter transition-colors duration-300",
          active 
            ? (isPerfect ? "text-emerald-400" : (isDark ? "text-white" : "text-[#1a1a1a]")) 
            : (isDark ? "text-white/20" : "text-black/20")
        )}>
          {active ? `${cents > 0 ? '+' : ''}${cents} CENTS` : "AWAITING SIGNAL"}
        </span>
      </div>
    </div>
  );
}
