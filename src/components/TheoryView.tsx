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
  onPlayNote: (note: string) => void;
  tunedStrings: string[];
  allStrings: { label: string; freq: number; note: string }[];
}

const PENTATONIC_SHAPES = [
  { 
    id: 1, 
    name: "Pattern 1 (The Home Base)", 
    description: "The 'Old Reliable'. Everyone starts here. Root note is on the low E string.",
    dots: [
      { s: 0, f: 0, root: true }, { s: 0, f: 3 },
      { s: 1, f: 0 }, { s: 1, f: 2 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0 }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 3 },
      { s: 5, f: 0, root: true }, { s: 5, f: 3 }
    ]
  },
  { 
    id: 2, 
    name: "Pattern 2 (The Upper Extension)", 
    description: "The 'Sweet Spot'. Slide up from Pattern 1 to reach these melodic high notes.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 2 },
      { s: 1, f: 0 }, { s: 1, f: 2 },
      { s: 2, f: 0, root: true }, { s: 2, f: 2 },
      { s: 3, f: -1 }, { s: 3, f: 1 },
      { s: 4, f: 0, root: true }, { s: 4, f: 2 },
      { s: 5, f: 0 }, { s: 5, f: 2 }
    ]
  },
  { 
    id: 3, 
    name: "Pattern 3 (The B-String Slide)", 
    description: "The 'Funny Shape'. Watch the shift on the B-string. Great for diagonal runs.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 3 },
      { s: 1, f: 0 }, { s: 1, f: 2 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0, root: true }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 3 },
      { s: 5, f: 0 }, { s: 5, f: 3, root: true }
    ]
  },
  { 
    id: 4, 
    name: "Pattern 4 (The High Box)", 
    description: "The 'Root on A' shape. Very stable and great for bending on the G-string.",
    dots: [
      { s: 0, f: 0 }, { s: 0, f: 2 },
      { s: 1, f: 0, root: true }, { s: 1, f: 3 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0 }, { s: 3, f: 2 },
      { s: 4, f: 0, root: true }, { s: 4, f: 3 },
      { s: 5, f: 0 }, { s: 5, f: 2 }
    ]
  },
  { 
    id: 5, 
    name: "Pattern 5 (The D-Shape Connector)", 
    description: "The 'Staircase'. Connects the high register back down to Pattern 1.",
    dots: [
      { s: 0, f: 0, root: true }, { s: 0, f: 3 },
      { s: 1, f: 0 }, { s: 1, f: 3 },
      { s: 2, f: 0 }, { s: 2, f: 2 },
      { s: 3, f: 0, root: true }, { s: 3, f: 2 },
      { s: 4, f: 0 }, { s: 4, f: 2 },
      { s: 5, f: 0, root: true }, { s: 5, f: 3 }
    ]
  }
];

const SOLOING_HINTS = [
  { 
    title: "The Clapton House", 
    desc: "The 'Melodic Highs'. Found on the three thinnest strings. It looks like a house with a roof, ideal for soulful vibrato.",
    dots: [
      { s: 0, f: 0, special: true }, { s: 0, f: 3, special: true },
      { s: 1, f: 1, root: true, special: true }, { s: 1, f: 3, special: true },
      { s: 2, f: 0, special: true }, { s: 2, f: 2, special: true }
    ]
  },
  {
    title: "BB King's Magic Box",
    desc: "Rooted on the B-string. Always slide into it. It's the 'Sweet Spot' for that signature BB sting and vibrato.",
    dots: [
      { s: 0, f: 2, special: true }, { s: 0, f: 4, special: true },
      { s: 1, f: 2, root: true, special: true }, { s: 1, f: 4, special: true },
      { s: 2, f: 3, special: true }
    ]
  },
  {
    title: "Hendrix Thumb Root",
    desc: "The 'Coolest Hand in Rock'. Wrap your thumb over the top for the root, leaving your fingers free for melodic fills.",
    dots: [
      { s: 5, f: 0, root: true, special: true },
      { s: 3, f: 0, special: true }, { s: 3, f: 2, special: true },
      { s: 2, f: 0, special: true }, { s: 2, f: 2, special: true },
      { s: 1, f: 0, special: true }, { s: 1, f: 2, special: true }
    ]
  },
  {
    title: "SRV Texas Slide",
    desc: "Vicious diagonal movement. Use this to travel between boxes 1 and 2 with high energy and speed.",
    dots: [
      { s: 5, f: 0, root: true }, { s: 5, f: 3 },
      { s: 4, f: 0 }, { s: 4, f: 2 },
      { s: 3, f: 0, special: true }, { s: 3, f: 2 }, { s: 3, f: 4, special: true }
    ]
  },
  {
    title: "Albert King Bend Zone",
    desc: "Maximum Tension. This is where you pull off those massive 2-step blues bends that scream.",
    dots: [
      { s: 0, f: 0, root: true }, { s: 0, f: 3, special: true },
      { s: 1, f: 0 }, { s: 1, f: 3, special: true },
      { s: 2, f: 0 }, { s: 2, f: 2, special: true }
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
  onPlayNote,
  tunedStrings,
  allStrings
}: TheoryViewProps) {
  const isDark = theme === 'dark';
  const [activeShape, setActiveShape] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<'patterns' | 'blueprints'>('patterns');
  const [activeBlueprint, setActiveBlueprint] = React.useState(0);

  const activeDots = viewMode === 'patterns' 
    ? (PENTATONIC_SHAPES[activeShape]?.dots || [])
    : (SOLOING_HINTS[activeBlueprint]?.dots || []);

  const handleSetViewMode = (mode: 'patterns' | 'blueprints') => {
    setViewMode(mode);
    if (mode === 'patterns' && activeShape === -1) setActiveShape(0);
    if (mode === 'blueprints' && activeBlueprint === -1) setActiveBlueprint(0);
  };

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
           <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Circle of Fifths & Soloing Blueprints</p>
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
                   <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Nashville Sensor</h4>
                   <p className="text-sm font-bold tracking-tight">
                      {isActive ? (currentNote ? `Current 1: ${currentNote}` : "Listening for strings...") : "Sensor Offline"}
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
                   <span className="text-[8px] uppercase tracking-widest opacity-40 font-black mb-1">Scale Anchor</span>
                   <div className="flex gap-1.5">
                      <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500">
                         {currentNote} MAJOR
                      </div>
                      <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black opacity-40">
                         {getRelativeNote(currentNote, 0, true)} MIN
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
             Nashville Family
          </h3>
          <p className="text-[11px] opacity-60 leading-relaxed mb-8">
            Nashville Numbers allow you to transpose songs instantly. 1-4-5 is the backbone of western music.
          </p>
          
          <div className="space-y-3 mt-auto">
             {currentNote ? (
                 <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                    <FamilyMember label="1 (Root)" note={getRelativeNote(currentNote, 0)} accentColor={accentColor} onClick={() => onPlayNote(`${getRelativeNote(currentNote, 0)}3`)} />
                    <FamilyMember label="4 (IV)" note={getRelativeNote(currentNote, -1)} accentColor={accentColor} onClick={() => onPlayNote(`${getRelativeNote(currentNote, -1)}3`)} />
                    <FamilyMember label="5 (V)" note={getRelativeNote(currentNote, 1)} accentColor={accentColor} onClick={() => onPlayNote(`${getRelativeNote(currentNote, 1)}3`)} />
                    <FamilyMember label="6m (vi)" note={getRelativeNote(currentNote, 0, true)} accentColor={accentColor} onClick={() => onPlayNote(`${getRelativeNote(currentNote, 0, true).replace('m', '')}3`)} />
                    <FamilyMember label="2m (ii)" note={getRelativeNote(currentNote, -1, true)} accentColor={accentColor} onClick={() => onPlayNote(`${getRelativeNote(currentNote, -1, true).replace('m', '')}3`)} />
                    <FamilyMember label="3m (iii)" note={getRelativeNote(currentNote, 1, true)} accentColor={accentColor} onClick={() => onPlayNote(`${getRelativeNote(currentNote, 1, true).replace('m', '')}3`)} />
                 </div>
             ) : (
                 <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] gap-3">
                    <Volume2 size={24} className="opacity-10" />
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-20 font-bold text-center px-4">Detected note will trigger numeric mapping</span>
                 </div>
             )}
          </div>
        </div>

        {/* Pro Beat Theory */}
        <div className={cn(
          "p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col",
          isDark ? "bg-white/5 border-white/5 shadow-2xl" : "bg-black/5 border-black/5 shadow-lg"
        )}>
          <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
             Nashville Logic
          </h3>
          <p className="text-[11px] opacity-60 leading-relaxed mb-6">
            Pro guitarists think in numbers to keep the 'groove' consistent across different keys.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-auto">
             <TheoryChip title="Rock Base" desc="1 - 4 - 5 - 4" />
             <TheoryChip title="Pop Cycle" desc="1 - 5 - 6m - 4" />
             <TheoryChip title="Turnaround" desc="2m - 5 - 1" />
             <TheoryChip title="Soul" desc="1 - 6m - 2 - 5" />
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
            Everything on guitar is a movable shape. C-A-G-E-D connects the neck into one giant playground.
          </p>
          
          <div className="space-y-2 mt-auto">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black uppercase italic">Movable Grid</span>
              <div className="flex gap-1">
                {['C','A','G','E','D'].map(l => (
                  <span key={l} className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/10 text-[10px] font-bold text-emerald-500">{l}</span>
                ))}
              </div>
            </div>
            <p className="text-[9px] opacity-40 leading-tight">Identify the root of any open chord and slide it relative to the nut.</p>
          </div>
        </div>
      </div>

      {/* Advanced Soloing Section */}
      <div className="w-full max-w-5xl px-4 mt-8 mb-24">
        <div className={cn(
          "p-10 rounded-[4rem] border backdrop-blur-2xl relative overflow-hidden flex flex-col gap-10",
          isDark ? "bg-white/5 border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]" : "bg-white border-black/5 shadow-2xl"
        )}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
             <div className="max-w-md">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Soloing Blueprint</h3>
                <p className="text-xs opacity-50 font-bold uppercase tracking-widest mb-4">Learn the visual architecture of the neck</p>
                
                <p className="text-sm leading-relaxed opacity-70 mb-6">
                  {viewMode === 'patterns' 
                    ? "The Pentatonic Box is your 'Home Base'. Master these 5 interlocking shapes to solo anywhere on the guitar."
                    : "Professional 'Cheat Codes' used by the greats. These zones are safe havens for soulful melodic playing."
                  }
                </p>

                <div className="flex gap-2 p-1.5 rounded-2xl bg-black/20 w-fit">
                   <button 
                    onClick={() => handleSetViewMode('patterns')}
                    className={cn(
                      "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      viewMode === 'patterns' ? "bg-white/10 text-white shadow-lg" : "text-white/30"
                    )}
                   >
                     Pentatonic Box
                   </button>
                   <button 
                    onClick={() => handleSetViewMode('blueprints')}
                    className={cn(
                      "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      viewMode === 'blueprints' ? "bg-white/10 text-white shadow-lg" : "text-white/30"
                    )}
                   >
                     Pro Blueprints
                   </button>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 md:max-w-[300px] justify-end">
                {viewMode === 'patterns' ? (
                  PENTATONIC_SHAPES.map((shape, i) => (
                    <button
                      key={shape.id}
                      onClick={() => {
                        setActiveShape(i);
                        setActiveBlueprint(-1);
                      }}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all min-w-[100px] text-center border",
                        activeShape === i && viewMode === 'patterns'
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-xl scale-105" 
                          : isDark ? "bg-white/5 border-white/5 text-white/40 hover:bg-white/10" : "bg-black/5 border-black/5 text-black/40 hover:bg-black/10"
                      )}
                    >
                      Shape {shape.id}
                    </button>
                  ))
                ) : (
                  SOLOING_HINTS.map((hint, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveBlueprint(i);
                        setActiveShape(-1);
                      }}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all min-w-[140px] text-center border",
                        activeBlueprint === i && viewMode === 'blueprints'
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-xl scale-105" 
                          : isDark ? "bg-white/5 border-white/5 text-white/40 hover:bg-white/10" : "bg-black/5 border-black/5 text-black/40 hover:bg-black/10"
                      )}
                    >
                      {hint.title}
                    </button>
                  ))
                )}
             </div>
          </div>

          <div className="w-full flex flex-col gap-6">
             <div className="flex flex-col gap-1 items-start px-2">
                <h4 className="text-lg font-black italic uppercase tracking-tighter" style={{ color: accentColor }}>
                   {viewMode === 'patterns' ? PENTATONIC_SHAPES[activeShape]?.name : SOLOING_HINTS[activeBlueprint]?.title}
                </h4>
                <p className="text-xs opacity-50 italic">
                   "{viewMode === 'patterns' ? PENTATONIC_SHAPES[activeShape]?.description : SOLOING_HINTS[activeBlueprint]?.desc}"
                </p>
             </div>

             {/* Horizontal 6-String Fretboard */}
             <div className={cn(
               "relative w-full aspect-[4/1] min-h-[220px] rounded-[2.5rem] border overflow-hidden p-8 transition-colors",
               isDark ? "bg-black/40 border-white/5" : "bg-black/5 border-black/5"
             )}>
                {/* Visual Strings (Horizontal - Low E at Bottom) */}
                <div className="absolute inset-x-8 inset-y-12 flex flex-col justify-between">
                   {[0,1,2,3,4,5].map(sIndex => (
                     <div key={sIndex} className="relative w-full flex items-center justify-center">
                        <div className={cn(
                          "absolute w-full origin-center",
                          isDark ? "bg-white/20" : "bg-black/20"
                        )} 
                        style={{ height: `${1 + (5-sIndex) * 0.4}px` }} 
                        />
                     </div>
                   ))}
                </div>

                {/* Vertical Fret Lines */}
                <div className="absolute inset-x-8 inset-y-8 flex justify-between">
                   {[0,1,2,3,4,5].map(fIndex => (
                     <div key={fIndex} className="relative h-full flex items-center justify-center">
                        {fIndex > 0 && (
                          <div className={cn(
                            "absolute h-full w-px bg-white/5",
                          )} />
                        )}
                        {/* Fret Label */}
                        <span className="absolute -bottom-4 text-[7px] font-black opacity-20 uppercase tracking-widest whitespace-nowrap">
                           {fIndex === 0 ? "NUT / Fret N" : `Fret N+${fIndex}`}
                        </span>
                     </div>
                   ))}
                </div>

                {/* Scale Dots */}
                <div className="absolute inset-x-8 inset-y-12 flex flex-col justify-between z-10">
                   {[0,1,2,3,4,5].map(sIndex => (
                     <div key={sIndex} className="relative w-full h-[1px] flex justify-between">
                        {[0,1,2,3,4,5].map(fIndex => {
                           // Special logic for pattern 2 shift (The "Funny Shape" B-string jump)
                           let effectiveFret = fIndex;
                           if (viewMode === 'patterns' && PENTATONIC_SHAPES[activeShape]?.id === 2 && sIndex === 3) {
                              effectiveFret = fIndex + 1;
                           }

                       const dot = activeDots?.find(d => d.s === sIndex && d.f === effectiveFret);
                           
                           return (
                             <div key={fIndex} className="relative w-1.5 flex items-center justify-center">
                                {dot && (
                                   <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => {
                                      // Calculate note based on currentNote or default to A
                                      const root = currentNote || 'A';
                                      const stringMap = ['E', 'B', 'G', 'D', 'A', 'E']; // high e to low E
                                      const baseOctave = [4, 3, 3, 3, 2, 2];
                                      const baseNote = stringMap[sIndex];
                                      
                                      // Find how many semitones from Open to Root
                                      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                                      const baseIdx = notes.indexOf(baseNote.toUpperCase());
                                      const rootIdx = notes.indexOf(root.toUpperCase());
                                      
                                      // Pattern 1 starts at "N" where string 5 (Low E) fret N = root
                                      // root = OpenE + N => N = root - OpenE
                                      let N = (rootIdx - notes.indexOf('E') + 12) % 12;
                                      
                                      // For pattern 4, root is on A string
                                      if (viewMode === 'patterns' && PENTATONIC_SHAPES[activeShape]?.id === 4) {
                                         N = (rootIdx - notes.indexOf('A') + 12) % 12;
                                      }

                                      // The dot's fret is N + dot.f
                                      const toneFret = N + dot.f;
                                      const finalNoteIdx = (baseIdx + toneFret) % 12;
                                      const finalOctave = baseOctave[sIndex] + Math.floor((baseIdx + toneFret) / 12);
                                      
                                      onPlayNote(`${notes[finalNoteIdx]}${finalOctave}`);
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={`${viewMode}-${activeShape}-${activeBlueprint}-${sIndex}-${fIndex}`}
                                    className={cn(
                                      "w-6 h-6 sm:w-8 sm:h-8 rounded-full relative z-20 flex items-center justify-center shadow-2xl transition-all cursor-pointer ring-offset-4 ring-offset-transparent",
                                      dot.root ? "bg-emerald-500" : isDark ? "bg-white/90" : "bg-black/90",
                                      dot.special ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : ""
                                    )}
                                   >
                                      {dot.root && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                      )}
                                      {!dot.root && dot.special && (
                                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                      )}
                                   </motion.button>
                                )}
                             </div>
                           )
                        })}
                     </div>
                   ))}
                </div>

                {/* String Labels (Right Side) */}
                <div className="absolute right-2 top-12 bottom-12 flex flex-col justify-between items-center opacity-30 text-[8px] font-black font-mono px-2 border-l border-white/5">
                   {['e','B','G','D','A','E'].map(s => <span key={s}>{s}</span>)}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FamilyMember({ label, note, accentColor, onClick }: { label: string; note: string; accentColor: string; onClick: () => void }) {
    return (
        <motion.button 
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="flex flex-col items-center group outline-none"
        >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{ backgroundColor: accentColor }}
              />
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all relative z-10 overflow-hidden">
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent" />
                 <span className="text-base font-black italic tracking-tighter" style={{ color: accentColor }}>{note}</span>
              </div>
            </div>
            <span className="text-[7px] uppercase tracking-[0.2em] opacity-40 font-black group-hover:opacity-100 group-hover:text-emerald-400 transition-all">{label}</span>
        </motion.button>
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
