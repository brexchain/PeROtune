import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export interface StringConfig {
  note: string;
  octave: number;
  freq: number;
  label: string;
}

interface GuitarHubProps {
  currentNote: string | null;
  frequency: number;
  cents: number;
  referenceA?: number;
  theme?: 'dark' | 'light';
  strings: StringConfig[];
  customColors?: {
    accent?: string;
    ring?: string;
    glow?: string;
  };
}

export function GuitarHub({ currentNote, frequency, cents, referenceA = 440, theme = 'dark', strings, customColors }: GuitarHubProps) {
  const isDark = theme === 'dark';
  const accentColor = customColors?.accent || '#10b981'; // Default emerald
  const ringColor = customColors?.ring || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
  const glowColor = customColors?.glow || 'rgba(16,185,129,0.3)';
  const targetFreq = currentNote ? (
    referenceA * Math.pow(2, (["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(currentNote) - 9) / 12) * 
    Math.pow(2, Math.floor((frequency ? Math.log2(frequency/referenceA)*12 + 69 : 0) / 12) - 5)
  ) : 0;
  
  // Adjusted spacing for different string counts
  const stringGap = strings.length > 6 ? 1.5 : (strings.length < 6 ? 6 : 3.5);

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Outer Soundhole Ring */}
      <div className="absolute inset-0 rounded-full border-8 border-[#3d2b1f] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_40px_rgba(0,0,0,0.5)] bg-[#1a110a]" />
      
      {/* Wood Texture Simulation */}
      <div className="absolute -inset-8 rounded-[40px] -z-10 bg-[radial-gradient(ellipse_at_center,_#5d4037_0%,_#3e2723_100%)] opacity-90 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.2) 41px)' }} />
      </div>

      {/* Note Ring - Discrete Boxes */}
      <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none">
        {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note, i) => {
          const angle = (i * 30) - 90;
          const isActive = currentNote === note;
          return (
            <div 
              key={note}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div 
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 -rotate-90 min-w-[28px] h-8 flex items-center justify-center rounded-md border transition-all duration-300",
                  isActive 
                    ? "shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-125" 
                    : isDark ? "bg-transparent border-transparent text-white/10" : "bg-transparent border-transparent text-black/10"
                )}
                style={{ 
                  transform: `rotate(${-angle}deg) translateY(-50%)`,
                  backgroundColor: isActive ? `${accentColor}33` : undefined,
                  borderColor: isActive ? `${accentColor}80` : undefined,
                  color: isActive ? accentColor : undefined
                }}
              >
                <span className="text-[10px] font-mono font-bold">{note}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Soundhole Depth */}
      <div className="absolute w-56 h-56 rounded-full bg-black shadow-[inset_0_0_50px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
        {/* Freq Display - Top center of inner hole */}
        <div className="absolute top-6 flex flex-col items-center z-20">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-mono mb-1">Frequency Monitor</span>
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-2xl font-mono tracking-tighter transition-colors",
                frequency > 0 ? "text-white" : "text-white/20"
              )}>
                {frequency > 0 ? frequency.toFixed(2) : "000.00"}
              </span>
              <span className="text-[10px] text-white/30 font-mono">Hz</span>
            </div>
            {currentNote && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded border mt-1"
                style={{ backgroundColor: `${accentColor}1A`, borderColor: `${accentColor}33` }}
              >
                <span className="text-[9px] uppercase font-mono tracking-widest opacity-60" style={{ color: accentColor }}>Target:</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: accentColor }}>
                  {targetFreq.toFixed(2)} Hz
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Strings */}
        <div 
          className="absolute inset-0 flex flex-col justify-center px-6 transition-all duration-500"
          style={{ gap: `${stringGap}px` }}
        >
          {strings.map((string, idx) => {
            const isMatched = currentNote === string.note;
            const isTuned = isMatched && Math.abs(cents) <= 2;
            
            return (
              <div key={idx} className="relative h-1 w-full flex items-center">
                {/* String Aura */}
                <AnimatePresence mode="wait">
                  {isMatched && (
                    <motion.div 
                      className={cn(
                        "absolute inset-0 h-4 -top-1.5 rounded-full blur-md",
                        isTuned ? "bg-emerald-400/20" : "bg-white/10"
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* The String */}
                <motion.div 
                  className="w-full h-[1.5px] z-10 transition-colors duration-500"
                  style={{ 
                    backgroundColor: isMatched ? accentColor : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'),
                    boxShadow: isMatched ? `0 0 10px ${accentColor}` : 'none'
                  }}
                  animate={isMatched ? {
                    y: [0, -0.5, 0.5, -0.5, 0.2, -0.2, 0],
                    opacity: [0.6, 1, 0.6]
                  } : {}}
                  transition={{ 
                    duration: 0.15, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                
                {/* String Label Box */}
                <div className={cn(
                  "absolute -right-10 w-6 h-6 rounded flex items-center justify-center border font-mono text-[10px] transition-all duration-300",
                  isMatched 
                    ? "shadow-lg" 
                    : isDark ? "bg-transparent border-transparent text-white/20" : "bg-transparent border-transparent text-black/20"
                )}
                style={{
                  backgroundColor: isMatched ? `${accentColor}1A` : undefined,
                  borderColor: isMatched ? `${accentColor}33` : undefined,
                  color: isMatched ? accentColor : undefined
                }}>
                  {string.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Note Center Circle */}
        <AnimatePresence>
          {currentNote && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute w-24 h-24 rounded-full border bg-white/[0.05] flex flex-col items-center justify-center z-10 pointer-events-none"
                style={{ borderColor: `${accentColor}33` }}
              >
                <span className="text-[10px] uppercase tracking-widest font-mono mb-1 opacity-60" style={{ color: accentColor }}>LOCK</span>
                <span className="text-4xl font-serif font-black italic text-white leading-none">{currentNote}</span>
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sonic Aura pulse */}
      <AnimatePresence>
        {currentNote && (
          <motion.div 
            key="aura"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 0.05 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
