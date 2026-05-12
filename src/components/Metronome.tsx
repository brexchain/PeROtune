import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Plus, Minus, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export function Metronome({ theme = 'dark', accentColor = '#10b981' }: { theme?: 'dark' | 'light', accentColor?: string }) {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [beat, setBeat] = useState(0);
  const timerRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  const playClick = (time: number, isDownbeat: boolean) => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const envelope = audioCtxRef.current.createGain();

    // Use a woodblock-ish frequency
    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, time);
    osc.type = 'triangle'; // Richer than sine

    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(0.4, time + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(envelope);
    envelope.connect(audioCtxRef.current.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  };

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      
      const secondsPerBeat = 60.0 / bpm;
      let nextNoteTime = audioCtxRef.current.currentTime;
      let currentBeat = 0;

      const scheduler = () => {
        while (nextNoteTime < audioCtxRef.current!.currentTime + 0.1) {
          playClick(nextNoteTime, currentBeat % 4 === 0);
          nextNoteTime += secondsPerBeat;
          currentBeat = (currentBeat + 1) % 4;
          setBeat(currentBeat);
        }
        timerRef.current = window.setTimeout(scheduler, 25);
      };

      scheduler();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setBeat(0);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, bpm]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto px-6 py-10">
      <div className="relative flex flex-col items-center">
        {/* Pulse Ring */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key={beat}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: accentColor }}
            />
          )}
        </AnimatePresence>

        <div className="text-7xl font-black tracking-tighter flex flex-col items-center gap-1">
          <span style={{ color: isDark ? 'white' : 'black' }}>{bpm}</span>
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-mono">BPM</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button 
          onClick={() => setBpm(prev => Math.max(40, prev - 5))}
          className={cn(
            "p-4 rounded-2xl border transition-all",
            isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
          )}
        >
          <Minus size={20} />
        </button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
          style={{ backgroundColor: accentColor, boxShadow: `0 12px 30px ${accentColor}4D` }}
        >
          {isPlaying ? <Pause size={32} fill="white" className="text-white" /> : <Play size={32} fill="white" className="text-white ml-1" />}
        </motion.button>

        <button 
          onClick={() => setBpm(prev => Math.min(280, prev + 5))}
          className={cn(
            "p-4 rounded-2xl border transition-all",
            isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
          )}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="w-full flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: isPlaying && (beat - 1 + 4) % 4 === i ? accentColor : (isDark ? '#ffffff10' : '#00000010'),
              boxShadow: isPlaying && (beat - 1 + 4) % 4 === i ? `0 0 10px ${accentColor}` : 'none'
            }}
          />
        ))}
      </div>

      <button className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all",
        isDark ? "bg-white/5 border-white/5 text-white/40" : "bg-black/5 border-black/5 text-black/40"
      )}>
        <Zap size={12} />
        Tap Tempo
      </button>
    </div>
  );
}
