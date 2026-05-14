import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, CheckCircle2, XCircle, Brain, Music } from 'lucide-react';
import { TRAINING_NOTES } from '../constants';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

interface EarTrainingProps {
  theme: 'dark' | 'light';
  accentColor: string;
}

export const EarTraining: React.FC<EarTrainingProps> = ({ theme, accentColor }) => {
  const { t } = useLanguage();
  const [currentNote, setCurrentNote] = useState<{note: string, label: string} | null>(null);
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [fallingNotes, setFallingNotes] = useState<{id: number, x: number}[]>([]);
  
  const synthRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 1 }
    }).toDestination();
    
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const getNotesForDifficulty = () => {
    const baseNotes = TRAINING_NOTES.map(n => ({ ...n, label: n.note.replace('4', '') }));
    
    if (difficulty === 1) return [baseNotes[0], baseNotes[2], baseNotes[4]]; // C, E, G
    if (difficulty === 2) return baseNotes.slice(0, 5); // C, D, E, F, G
    if (difficulty === 3) return baseNotes; // All Natural
    
    // Tier 4: Adds Sharps
    const chromatic = [
      ...baseNotes,
      { note: 'C#4', label: 'C#' },
      { note: 'D#4', label: 'D#' },
      { note: 'F#4', label: 'F#' },
      { note: 'G#4', label: 'G#' },
      { note: 'A#4', label: 'A#' }
    ];
    if (difficulty === 4) return chromatic;
    
    // Tier 5: Adds High Octave variants
    return [
      ...chromatic,
      { note: 'C5', label: 'C+' },
      { note: 'E5', label: 'E+' },
      { note: 'G5', label: 'G+' }
    ];
  };

  const playGameNote = async () => {
    await Tone.start();
    const availableNotes = getNotesForDifficulty();
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    const note = availableNotes[randomIndex];
    setCurrentNote(note);
    setIncorrectGuesses([]);
    setIsCorrect(null);
    
    // Add "On Fire" effect for high streaks
    if (streak > 5) {
      setFallingNotes(prev => [...prev, ...[...Array(5)].map(() => ({ id: Math.random(), x: Math.random() * 100 }))]);
    }
    
    synthRef.current?.triggerAttackRelease(note.note, "2n");
  };

  const replayNote = () => {
    if (currentNote) {
      synthRef.current?.triggerAttackRelease(currentNote.note, "2n");
    }
  };

  const handleGuess = (noteLabel: string) => {
    if (!currentNote || isCorrect || incorrectGuesses.includes(noteLabel)) return;
    
    if (noteLabel === currentNote.note) {
      setIsCorrect(true);
      if (incorrectGuesses.length === 0) {
        setScore(prev => prev + 1);
        setStreak(prev => prev + 1);
        // Visual reward: Create falling notes
        setFallingNotes(prev => [
            ...prev, 
            ...[...Array(12)].map((_, i) => ({ id: Math.random(), x: Math.random() * 100 }))
        ]);
        // Cleanup visuals
        setTimeout(() => setFallingNotes([]), 2000);
      }
      setTotalAttempts(prev => prev + 1);
      
      // Auto-advance after success
      setTimeout(() => playGameNote(), 1200);
    } else {
      setIncorrectGuesses(prev => [...prev, noteLabel]);
      setStreak(0);
      // Give auditory feedback for wrong note
      synthRef.current?.triggerAttackRelease(noteLabel, "8n");
    }
  };

  const availableNotes = getNotesForDifficulty();

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Brain className="text-amber-500" size={28} />
          </div>
          <h2 className={cn(
             "text-3xl font-black italic tracking-tighter uppercase",
             theme === 'dark' ? "text-white" : "text-emerald-950"
          )}>
            {t('earTraining')}
          </h2>
        </div>
        
        {/* Difficulty Selector */}
        <div className="flex justify-center flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => { setDifficulty(level); setCurrentNote(null); setTotalAttempts(0); setScore(0); setStreak(0); }}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                difficulty === level 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110" 
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              Tier {level}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Falling Notes Visualizer Background */}
        <div className="absolute inset-0 -top-20 pointer-events-none overflow-hidden h-[500px]">
          <AnimatePresence>
            {fallingNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ y: -50, opacity: 1, scale: 0 }}
                animate={{ y: 500, opacity: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeIn" }}
                className="absolute w-4 h-4 rounded-full"
                style={{ 
                  left: `${note.x}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 20px ${accentColor}`
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Play Button Area */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={currentNote ? replayNote : playGameNote}
            animate={isCorrect ? { scale: [1, 1.1, 1] } : {}}
            className={cn(
              "w-40 h-40 rounded-[40px] flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden",
              currentNote 
                ? "bg-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.3)]" 
                : "bg-white/5 border-2 border-dashed border-white/20"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all",
              currentNote ? "bg-white/20" : "bg-emerald-500/20"
            )}>
              <Play className={cn(
                "fill-current transition-all",
                currentNote ? "text-white" : "text-emerald-500"
              )} size={28} />
            </div>
            <span className={cn(
              "text-[9px] uppercase font-black tracking-widest",
              currentNote ? "text-white" : "text-white/40"
            )}>
              {currentNote ? t('listenNotes') : t('playJam')}
            </span>

            {currentNote && !isCorrect && (
              <motion.div 
                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-white/5 pointer-events-none"
              />
            )}
          </motion.button>
          
          <AnimatePresence>
            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg z-10"
              >
                <CheckCircle2 className="text-white" size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Options Grid */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
           {availableNotes.map((note) => {
             const isIncorrect = incorrectGuesses.includes(note.note);
             const isFound = isCorrect && note.note === currentNote?.note;
             const isChromatic = note.label.includes('#') || note.label.includes('+');

             return (
               <motion.button
                 key={note.note}
                 disabled={!currentNote}
                 whileTap={currentNote ? { scale: 0.95 } : {}}
                 onClick={() => handleGuess(note.note)}
                 className={cn(
                   "p-4 min-w-[60px] rounded-2xl border-2 font-black text-lg transition-all relative overflow-hidden",
                   isFound
                     ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                     : isIncorrect
                       ? "bg-rose-500/20 border-rose-500 text-rose-500 line-through"
                       : isChromatic
                         ? theme === 'dark' ? "bg-white/10 border-white/20 text-white/80" : "bg-black/10 border-black/20 text-emerald-950/80"
                         : theme === 'dark' 
                           ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" 
                           : "bg-black/5 border-black/10 hover:border-black/10 text-emerald-950",
                   (!currentNote) && "opacity-40 cursor-not-allowed"
                 )}
               >
                 {note.label}
                 
                 {isIncorrect && (
                   <motion.div 
                     initial={{ x: -100 }}
                     animate={{ x: 100 }}
                     className="absolute inset-0 bg-rose-500/10 pointer-events-none"
                   />
                 )}
               </motion.button>
             );
           })}
        </div>

        {/* Scoreboard and Streak */}
        <div className="flex gap-4 w-full">
          <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
             <span className="text-[8px] uppercase font-black tracking-widest text-emerald-500/60">Streak</span>
             <div className="flex items-center gap-2">
               <span className="text-xl font-black text-white">{streak}</span>
               {streak > 0 && <Music className="text-emerald-500 animate-bounce" size={12} />}
             </div>
          </div>
          <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
             <span className="text-[8px] uppercase font-black tracking-widest text-emerald-500/60">Perfect Rate</span>
             <span className="text-xl font-black text-white">
               {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0}%
             </span>
          </div>
        </div>

        {currentNote && !isCorrect && (
          <button
            onClick={playGameNote}
            className="flex items-center gap-2 text-white/30 hover:text-white/60 font-black uppercase text-[9px] tracking-widest transition-all"
          >
            <RotateCcw size={12} />
            skip note
          </button>
        )}
      </div>
    </div>
  );
};
