import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Volume2, MicOff } from 'lucide-react';
import { CircleOfFifths } from './CircleOfFifths';
import { cn } from '../lib/utils';
import { InstrumentCategory } from '../constants';

import { GuitarStringsBackground } from './GuitarStringsBackground';

interface TheoryViewProps {
  currentNote: string | null;
  theme: 'dark' | 'light';
  accentColor: string;
  isActive: boolean;
  onStartMic: () => void;
  onStopMic: () => void;
  tunedStrings: string[];
  allStrings: { label: string; freq: number; note: string }[];
}

const PENTATONIC_SHAPES = [
  { 
    id: 1, 
    name: "Pattern 1 (The Box)", 
    description: "The classic 'Home' shape. 2 notes per string, starting with root on E.",
    dots: [
      { s: 0, f: 0, type: 'root' }, { s: 0, f: 3 },
      { s: 1, f: 0 }, { s: 1, f: 2 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0 }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 3 },
      { s: 5, f: 0, type: 'root' }, { s: 5, f: 3 }
    ]
  },
  { 
    id: 2, 
    name: "Pattern 2", 
    description: "Focus on the middle region of the neck. Pivot from Pattern 1.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 2 },
      { s: 1, f: 0 }, { s: 1, f: 2 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: -1 }, { s: 3, f: 1 },
      { s: 4, f: 0 }, { s: 4, f: 2 },
      { s: 5, f: 0 }, { s: 5, f: 2 }
    ]
  },
  { 
    id: 3, 
    name: "Pattern 3", 
    description: "Sliding into the high register. Great for diagonal movement.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 3 },
      { s: 1, f: 0 }, { s: 1, f: 2 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0 }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 3 },
      { s: 5, f: 0 }, { s: 5, f: 3 }
    ]
  },
  { 
    id: 4, 
    name: "Pattern 4", 
    description: "The centered shape with the root on the A string.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 2 },
      { s: 1, f: 0, type: 'root' }, { s: 1, f: 3 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0 }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 3 },
      { s: 5, f: 0 }, { s: 5, f: 2 }
    ]
  },
  { 
    id: 5, 
    name: "Pattern 5", 
    description: "The 'D-Shape' connection. Wide intervals and high energy.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 3 },
      { s: 1, f: 0 }, { s: 1, f: 3 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0 }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 2 },
      { s: 5, f: 0 }, { s: 5, f: 3 }
    ]
  }
];

export function TheoryView({ 
  currentNote, 
  theme, 
  accentColor, 
  isActive, 
  onStartMic, 
  onStopMic,
  tunedStrings,
  allStrings
}: TheoryViewProps) {
  const isDark = theme === 'dark';
  const [activeShape, setActiveShape] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-12 py-8 relative min-h-[600px] pb-32">
      <GuitarStringsBackground 
        allStrings={allStrings} 
        tunedStrings={tunedStrings} 
        className="bottom-32"
      />


      <div className="flex flex-col items-center gap-2 relative z-10">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Harmonic Engine</h2>
        <div className="flex items-center gap-4">
           <div className="h-px w-8 bg-current opacity-10" />
           <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Circle of Fifths & Chord Analysis</p>
           <div className="h-px w-8 bg-current opacity-10" />
        </div>
      </div>

      {/* Sonic Monitor Section */}
      <div className="w-full max-w-xl px-4">
          <div className={cn(
             "p-4 rounded-3xl border flex items-center justify-between backdrop-blur-md transition-all duration-500",
             isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
          )}>
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (isActive) onStopMic();
                    else onStartMic();
                  }}
                  className="relative group outline-none"
                >
                   <motion.div 
                     animate={{ 
                        scale: (isActive && currentNote) ? [1, 1.1, 1] : 1,
                        backgroundColor: isActive ? `${accentColor}22` : 'rgba(255,255,255,0.05)',
                        borderColor: isActive ? accentColor : 'rgba(255,255,255,0.1)'
                     }}
                     className="w-14 h-14 rounded-full flex items-center justify-center border transition-colors relative overflow-hidden"
                   >
                      {isActive ? (
                          <Mic size={20} className={cn("transition-colors", currentNote ? "text-emerald-500" : "")} style={{ color: currentNote ? undefined : accentColor }} />
                      ) : (
                          <MicOff size={20} className="opacity-30" />
                      )}
                      
                      {isActive && (
                         <motion.div 
                           className="absolute inset-0 opacity-10"
                           animate={{ opacity: [0.05, 0.2, 0.05] }}
                           transition={{ duration: 2, repeat: Infinity }}
                           style={{ backgroundColor: accentColor }}
                         />
                      )}
                   </motion.div>
                </button>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Harmonic Sensor</h4>
                   <p className="text-sm font-bold tracking-tight">
                      {isActive ? (currentNote ? `Target: ${currentNote}` : "Listening for strings...") : "Sensor Offline"}
                   </p>
                   {!isActive && (
                      <button 
                        onClick={onStartMic}
                        className="text-[9px] uppercase font-bold text-emerald-500 hover:underline mt-1"
                      >
                        Click to activate mic
                      </button>
                   )}
                </div>
             </div>

             {/* Chord Recognition Suggestion */}
             {currentNote && (
                <div className="flex flex-col items-end">
                   <span className="text-[8px] uppercase tracking-widest opacity-40 font-black mb-1">Detected Root</span>
                   <div className="flex gap-1.5">
                      <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500">
                         {currentNote} MAJ
                      </div>
                      <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black opacity-40">
                         {currentNote} MIN
                      </div>
                   </div>
                </div>
             )}

             <div className="flex items-end gap-1.5 h-8">
                {[1,2,3,4,5,6,3,5,2].map((h, i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: currentNote ? `${h * 15}%` : '10%' }}
                     transition={{ duration: 0.2, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
                     className="w-1 rounded-full bg-emerald-500/20"
                     style={{ backgroundColor: currentNote ? accentColor : undefined }}
                   />
                ))}
             </div>
          </div>
      </div>

      <div className="w-full max-w-2xl aspect-square relative flex items-center justify-center">
        {/* Large Circle of Fifths */}
        <div className="w-full h-full p-4">
          <CircleOfFifths 
            activeNote={currentNote} 
            accentColor={accentColor} 
            theme={theme}
            isLarge={true}
          />
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Chord Family Explanation */}
        <div className={cn(
          "p-8 rounded-[3rem] border backdrop-blur-xl relative overflow-hidden flex flex-col",
          isDark ? "bg-white/5 border-white/5 shadow-2xl" : "bg-black/5 border-black/5 shadow-lg"
        )}>
          {currentNote && (
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-8xl font-black italic">{currentNote}</span>
             </div>
          )}

          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
             Family Chords
          </h3>
          <p className="text-[11px] opacity-60 leading-relaxed mb-8">
            These neighbor chords share mathematical resonance. In Nashville notation, these are your prime numbers.
          </p>
          
          <div className="space-y-3 mt-auto">
             {currentNote ? (
                 <div className="grid grid-cols-3 gap-2">
                    <FamilyMember label="1 (Root)" note={getRelativeNote(currentNote, 0)} accentColor={accentColor} />
                    <FamilyMember label="4 (IV)" note={getRelativeNote(currentNote, -1)} accentColor={accentColor} />
                    <FamilyMember label="5 (V)" note={getRelativeNote(currentNote, 1)} accentColor={accentColor} />
                    <FamilyMember label="6m (vi)" note={getRelativeNote(currentNote, 0, true)} accentColor={accentColor} />
                    <FamilyMember label="2m (ii)" note={getRelativeNote(currentNote, -1, true)} accentColor={accentColor} />
                    <FamilyMember label="3m (iii)" note={getRelativeNote(currentNote, 1, true)} accentColor={accentColor} />
                 </div>
             ) : (
                 <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] gap-3">
                    <Volume2 size={24} className="opacity-10" />
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-20 font-bold text-center px-4">Detected note will trigger numeric mapping</span>
                 </div>
             )}
          </div>
        </div>

        {/* Nashville System Explained */}
        <div className={cn(
          "p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col",
          isDark ? "bg-white/5 border-white/5 shadow-2xl" : "bg-black/5 border-black/5 shadow-lg"
        )}>
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
             Nashville System
          </h3>
          <p className="text-[11px] opacity-60 leading-relaxed mb-6">
            The Number System replaces note names with numerals (1-7). This allows musicians to change keys instantly without re-learning patterns.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-auto">
             <TheoryChip title="Major" desc="1, 4, 5" />
             <TheoryChip title="Minor" desc="2, 3, 6" />
             <TheoryChip title="Dim" desc="7" />
             <TheoryChip title="Pivot" desc="Dominant 5" />
          </div>
        </div>

        {/* CAGED Movability */}
        <div className={cn(
          "p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col",
          isDark ? "bg-white/5 border-white/5 shadow-2xl" : "bg-black/5 border-black/5 shadow-lg"
        )}>
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
             CAGED Blueprint
          </h3>
          <p className="text-[11px] opacity-60 leading-relaxed mb-6">
            Everything on guitar is a movable shape. The C-A-G-E-D shapes connect across the neck to form a continuous grid.
          </p>
          
          <div className="space-y-2 mt-auto">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black uppercase italic">Universal Map</span>
              <div className="flex gap-1">
                {['C','A','G','E','D'].map(l => (
                  <span key={l} className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/10 text-[10px] font-bold text-emerald-500">{l}</span>
                ))}
              </div>
            </div>
            <p className="text-[9px] opacity-40 leading-tight">Identify the root of any open chord and move that 'shape' up the neck relative to the nut.</p>
          </div>
        </div>
      </div>

      {/* Pentatonic Section */}
      <div className="w-full max-w-5xl px-4 mt-12 mb-24">
        <div className={cn(
          "p-12 rounded-[4rem] border backdrop-blur-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12",
          isDark ? "bg-white/5 border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]" : "bg-white border-black/5 shadow-2xl"
        )}>
          <div className="flex flex-col gap-6">
             <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2">The Pentatonic Scale</h3>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest">5 Notes. 5 Positions. Zero Wrong Notes.</p>
             </div>
             
             <p className="text-sm leading-relaxed opacity-70">
               The Minor Pentatonic (1, b3, 4, 5, b7) is the DNA of modern guitar. By masterizing these five interlocking patterns, you unlock the ability to improvise in any genre.
             </p>

             <div className="flex flex-wrap gap-2 mt-4">
                {PENTATONIC_SHAPES.map((shape, i) => (
                  <button
                    key={shape.id}
                    onClick={() => setActiveShape(i)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activeShape === i 
                        ? "bg-emerald-500 text-white shadow-xl scale-110" 
                        : isDark ? "bg-white/10 text-white/40 hover:bg-white/20" : "bg-black/5 text-black/40 hover:bg-black/10"
                    )}
                  >
                    Shape {shape.id}
                  </button>
                ))}
             </div>

             <div className="mt-8">
                <h4 className="text-sm font-black italic mb-2" style={{ color: accentColor }}>{PENTATONIC_SHAPES[activeShape].name}</h4>
                <p className="text-xs opacity-60 leading-relaxed italic">"{PENTATONIC_SHAPES[activeShape].description}"</p>
             </div>
          </div>

          <div className="relative flex justify-center py-8">
             <div className="flex gap-8 px-8 py-12 bg-black/40 rounded-[3rem] border border-white/5 shadow-inner">
                {/* Visual String Diagram */}
                {[0,1,2,3,4,5].map((sIndex) => (
                  <div key={sIndex} className="relative h-64 w-12 flex flex-col items-center">
                    {/* String Line */}
                    <div className={cn(
                      "absolute top-0 bottom-0 w-px origin-center",
                      isDark ? "bg-white/20" : "bg-black/20"
                    )} 
                    style={{ 
                      width: `${1 + sIndex * 0.5}px`,
                      boxShadow: isDark ? '0 0 10px rgba(255,255,255,0.1)' : 'none'
                    }} 
                    />
                    
                    {/* Fret Markers */}
                    {[0, 1, 2, 3].map(fIndex => {
                       const activeDot = PENTATONIC_SHAPES[activeShape].dots.find(d => d.s === sIndex && d.f === fIndex);
                       // Offset Pattern 2 special layout
                       const fOffset = PENTATONIC_SHAPES[activeShape].id === 2 && sIndex === 3 ? -1 : 0;
                       
                       return (
                         <div key={fIndex} className="absolute w-full h-1/4 flex items-center justify-center" style={{ top: `${fIndex * 25}%` }}>
                           {activeDot && (
                             <motion.div 
                               initial={{ scale: 0, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               key={`${activeShape}-${sIndex}-${fIndex}`}
                               className={cn(
                                 "w-4 h-4 rounded-full relative z-10 shadow-2xl",
                                 activeDot.type === 'root' ? "bg-emerald-500" : isDark ? "bg-white/80" : "bg-black/80"
                               )}
                             >
                               {activeDot.type === 'root' && (
                                 <motion.div 
                                   animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                                   transition={{ repeat: Infinity, duration: 2 }}
                                   className="absolute inset-0 bg-emerald-500 rounded-full blur-md"
                                 />
                               )}
                             </motion.div>
                           )}
                         </div>
                       )
                    })}
                  </div>
                ))}
             </div>
             
             {/* Labels */}
             <div className="absolute -bottom-6 flex gap-10 opacity-30 text-[9px] font-black font-mono">
                {['E','A','D','G','B','e'].map(s => <span key={s}>{s}</span>)}
             </div>

             <div className="absolute top-1/2 -left-12 -translate-y-1/2 flex flex-col gap-12 opacity-30 text-[8px] font-black uppercase rotate-90 origin-center pointer-events-none">
                <span>Fret N</span>
                <span>Fret N+1</span>
                <span>Fret N+2</span>
                <span>Fret N+3</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FamilyMember({ label, note, accentColor }: { label: string; note: string; accentColor: string }) {
    return (
        <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all">
            <span className="text-[8px] uppercase tracking-tighter opacity-40 mb-1">{label}</span>
            <span className="text-lg font-black italic tracking-tighter" style={{ color: accentColor }}>{note}</span>
        </div>
    );
}

function TheoryChip({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
      <span className="text-[8px] uppercase tracking-widest font-black opacity-30">{title}</span>
      <span className="text-xs font-black italic tracking-tight">{desc}</span>
    </div>
  )
}

const FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

function getRelativeNote(note: string, offset: number, isMinor: boolean = false): string {
    const map: Record<string, string> = { 'F#': 'Gb', 'C#': 'Db', 'G#': 'Ab', 'D#': 'Eb', 'A#': 'Bb' };
    const normalized = map[note] || note;
    const idx = FIFTHS.indexOf(normalized);
    if (idx === -1) return note;
    const targetIdx = (idx + offset + 12) % 12;
    return isMinor ? MINORS[targetIdx] : FIFTHS[targetIdx];
}
