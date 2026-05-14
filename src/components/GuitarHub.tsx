import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { CircleOfFifths } from './CircleOfFifths';

export interface StringConfig {
  note: string;
  octave: number;
  freq: number;
  label: string;
}

interface GuitarHubProps {
  currentNote: string | null;
  playedNote?: string | null;
  playingRiff?: { id: string; activeIndex: number } | null;
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

export function GuitarHub({ currentNote, playedNote, playingRiff, frequency, cents, referenceA = 440, theme = 'dark', strings, customColors }: GuitarHubProps) {
  const isDark = theme === 'dark';
  const accentColor = customColors?.accent || '#10b981';
  const ringColor = customColors?.ring || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
  const glowColor = customColors?.glow || 'rgba(16,185,129,0.3)';
  
  // Find current riff data if playing
  const [activeRiffData, setActiveRiffData] = React.useState<any>(null);
  
  React.useEffect(() => {
    if (playingRiff) {
      // We'd ideally import RIFFS but for now we'll just handle the visualization of what we have
      // In a real app we might fetch or pass the whole riff object
    }
  }, [playingRiff]);

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


      {/* Guitar Neck (Hals) - Extending to the left and right background */}
      <div className="absolute left-[-500px] right-[-500px] h-32 md:h-40 bg-[#1a0f0a] border-y border-[#3d251a] shadow-2xl z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, #000 81px)' }} />
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-black/20" />
        
        {/* Laser Fret Markers */}
        <div className="absolute inset-0 flex justify-around items-center opacity-30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          ))}
        </div>
      </div>

      {/* Modern High-End Guitar Body - Wood Texture */}
      <div 
        className="w-full h-full rounded-[100px] border-4 border-[#3d251a] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] relative flex items-center justify-center overflow-hidden"
        style={{ 
          background: 'radial-gradient(circle at center, #4d2b1e 0%, #2a1810 70%, #1a0f0a 100%)',
          boxShadow: `inset 0 0 100px rgba(0,0,0,0.5), 0 40px 100px -20px black`
        }}
      >
        {/* Grain simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 2px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 21px)' }} />
        
        {/* Laser Strings - Dynamic and Interactive */}
        <div className="absolute inset-x-0 h-48 flex flex-col justify-between py-4 z-20 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: 1, 
                opacity: (currentNote || playedNote) ? 0.8 : 0.1,
                boxShadow: (currentNote || playedNote) ? `0 0 15px ${accentColor}` : 'none',
                backgroundColor: (currentNote || playedNote) ? accentColor : 'rgba(255,255,255,0.1)'
              }}
              className="h-[1px] w-full origin-left"
              style={{ 
                boxShadow: `0 0 10px rgba(0,0,0,0.5)`
              }}
            />
          ))}
        </div>

        {/* Inner Hole Core - Just the Circle of Fifths now */}
        <div 
          className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-black shadow-[inset_0_0_80px_rgba(0,0,0,1),0_0_40px_rgba(16,185,129,0.1)] overflow-hidden flex items-center justify-center z-30"
          style={{ border: `12px solid #1a0f0a` }}
        >
          {/* Circle of Fifths as the primary interactive center */}
          <div className="absolute inset-6">
            <CircleOfFifths 
              activeNote={playedNote || currentNote} 
              accentColor={accentColor} 
              theme="dark"
              isLarge={true}
            />
          </div>
        </div>
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
