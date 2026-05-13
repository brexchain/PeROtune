import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ReferenceNote {
  note: string;
  freq: number;
  label?: string;
}

export function ToneReference({ 
  referenceA, 
  theme = 'dark', 
  notes,
  accentColor = '#10b981',
  onNoteTrigger
}: { 
  referenceA: number, 
  theme?: 'dark' | 'light',
  notes: ReferenceNote[],
  accentColor?: string,
  onNoteTrigger?: (note: string | null) => void
}) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [playingNote, setPlayingNote] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const playTone = async (note: string, baseFreq440: number, label?: string) => {
    // Calculate relative frequency based on referenceA (440 vs 432)
    const freq = baseFreq440 * (referenceA / 440);
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const uniqueId = label ? `${note}-${label}` : note;
    setPlayingNote(uniqueId);
    if (onNoteTrigger) onNoteTrigger(note);
    
    // Create oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.5);

    setTimeout(() => {
      setPlayingNote(prev => prev === uniqueId ? null : prev);
      if (onNoteTrigger) onNoteTrigger(null);
    }, 2500);
  };

  return (
    <div className={cn(
      "grid gap-2 w-full max-w-2xl px-4",
      notes.length > 8 ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-4"
    )}>
      {notes.map((item, idx) => {
        const uniqueId = item.label ? `${item.note}-${item.label}` : item.note;
        const isActive = playingNote === uniqueId;

        return (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playTone(item.note, item.freq, item.label)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group relative",
              isActive 
                ? "shadow-[0_0_15px_rgba(0,0,0,0.1)]" 
                : isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
            )}
            style={{ 
              backgroundColor: isActive ? `${accentColor}33` : undefined,
              borderColor: isActive ? `${accentColor}80` : undefined
            }}
          >
            <span className={cn(
              "text-[10px] font-mono mb-1 transition-colors",
              isActive 
                ? "font-bold" 
                : isDark ? "text-white/40 group-hover:text-white/60" : "text-black/40 group-hover:text-black/60"
            )}
            style={{ color: isActive ? accentColor : undefined }}
            >
              {item.label || item.note}
            </span>
            <Volume2 
              size={12} 
              className={cn(
                "transition-colors",
                isActive 
                  ? "" 
                  : isDark ? "text-white/10 group-hover:text-emerald-400/40" : "text-black/10 group-hover:text-emerald-400/40"
              )} 
              style={{ color: isActive ? accentColor : undefined }}
            />
            
            {isActive && (
              <motion.div 
                layoutId="active-glow"
                className="absolute -inset-1 rounded-xl border pointer-events-none"
                style={{ borderColor: `${accentColor}4D` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
