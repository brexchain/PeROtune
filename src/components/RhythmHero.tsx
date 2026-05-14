import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'motion/react';
import { Music, CheckCircle2, XCircle, RotateCcw, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface RhythmPattern {
  name: string;
  beats: number[]; // 0 for rest, 1 for down, 2 for up
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const PATTERNS: RhythmPattern[] = [
  { name: "The Rocker", beats: [1, 0, 1, 0, 1, 1, 1, 2], difficulty: 'Easy' },
  { name: "Syncopation Basic", beats: [1, 0, 0, 1, 0, 1, 0, 0], difficulty: 'Medium' },
  { name: "Funky ghost", beats: [1, 2, 0, 2, 1, 0, 1, 2], difficulty: 'Hard' }
];

export const RhythmHero: React.FC<{ theme: 'dark' | 'light', accentColor: string }> = ({ theme, accentColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePattern, setActivePattern] = useState<RhythmPattern | null>(null);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  
  const synthRef = useRef<Tone.MembraneSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: 'sine' }
    }).toDestination();
    
    return () => {
      stopGame();
      synthRef.current?.dispose();
    };
  }, []);

  const startGame = async (pattern: RhythmPattern) => {
    await Tone.start();
    stopGame();
    
    setActivePattern(pattern);
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    
    Tone.Transport.bpm.value = 100;
    
    const loop = new Tone.Loop((time) => {
      const beatIdx = Math.floor(Tone.Transport.ticks / (Tone.Transport.PPQ / 2)) % pattern.beats.length;
      setCurrentBeat(beatIdx);
      
      // Play a click for reference
      if (beatIdx % 2 === 0) {
        synthRef.current?.triggerAttackRelease("C2", "32n", time, 0.2);
      }
    }, "8n").start(0);

    loopRef.current = loop;
    Tone.Transport.start();
  };

  const stopGame = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    if (loopRef.current) {
        loopRef.current.dispose();
        loopRef.current = null;
    }
    setIsPlaying(false);
    setActivePattern(null);
    setCurrentBeat(-1);
  };

  const handleTap = () => {
    if (!isPlaying || !activePattern) return;
    
    const targetBeatIdx = currentBeat;
    const isTargetHit = activePattern.beats[targetBeatIdx] !== 0;
    
    if (isTargetHit) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setFeedback("PERFECT");
      synthRef.current?.triggerAttackRelease("G2", "8n", undefined, 0.5);
    } else {
      setStreak(0);
      setFeedback("MISS");
      synthRef.current?.triggerAttackRelease("C1", "16n", undefined, 0.3);
    }
    
    setTimeout(() => setFeedback(null), 500);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {!activePattern ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PATTERNS.map((p) => (
            <button
              key={p.name}
              onClick={() => startGame(p)}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all text-left space-y-2 group"
            >
              <div className="flex justify-between items-start">
                <Music className="text-emerald-500" size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{p.difficulty}</span>
              </div>
              <h4 className="text-white font-black italic">{p.name}</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Tap the beats</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Game UI */}
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Playing</span>
              <h3 className="text-3xl font-black italic text-white">{activePattern.name}</h3>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Streak</span>
              <div className="text-2xl font-black text-white flex items-center gap-2">
                {streak} <Zap className={cn("text-yellow-500", streak > 5 && "animate-pulse")} size={20} />
              </div>
            </div>
          </div>

          {/* Visual Track */}
          <div className="relative h-24 bg-white/5 rounded-3xl border border-white/10 flex items-center px-4 gap-4 overflow-hidden">
            {activePattern.beats.map((beat, i) => (
              <motion.div
                key={i}
                animate={currentBeat === i ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0.3 }}
                className={cn(
                  "flex-1 h-12 rounded-xl flex items-center justify-center transition-all",
                  beat === 0 ? "border border-white/5" : "bg-emerald-500/20 border-2 border-emerald-500"
                )}
              >
                {beat !== 0 && <div className={cn("w-2 h-2 rounded-full", currentBeat === i ? "bg-white" : "bg-emerald-500")} />}
              </motion.div>
            ))}
            
            {/* Playhead */}
            <motion.div 
               className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white] z-10"
               style={{ left: `${(currentBeat / activePattern.beats.length) * 100}%` }}
               transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            />
          </div>

          {/* Hit Zone / Interaction */}
          <div className="flex flex-col items-center gap-8">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 1.2 }}
                  className={cn(
                    "text-4xl font-black italic tracking-tighter",
                    feedback === "PERFECT" ? "text-emerald-500" : "text-rose-500"
                  )}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleTap}
              className="w-48 h-48 rounded-full bg-white/5 border-4 border-emerald-500/20 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 group transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center group-active:bg-emerald-500 group-active:scale-110 transition-all">
                 <Music className="text-emerald-500 group-active:text-white" size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Strum!</span>
            </motion.button>

            <button 
              onClick={stopGame}
              className="flex items-center gap-2 text-white/30 hover:text-white/60 font-black uppercase text-[10px] tracking-widest transition-all"
            >
              <RotateCcw size={14} /> Quit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
