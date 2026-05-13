import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { Language } from '../lib/i18n';

interface CircleOfFifthsProps {
  activeNote: string | null;
  accentColor: string;
  theme: 'dark' | 'light';
  isLarge?: boolean;
  language?: Language;
}

const FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

export function CircleOfFifths({ activeNote, accentColor, theme, isLarge = false, language = 'en' }: CircleOfFifthsProps) {
  const isDark = theme === 'dark';
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const getLocalizedNote = (note: string) => {
    if (language !== 'de') return note;
    // German: B -> H, Bb -> B
    const map: Record<string, string> = {
      'B': 'H',
      'Bb': 'B',
      'Gb': 'F#',
      'Db': 'C#',
      'Ab': 'G#',
      'Eb': 'D#',
      'Bm': 'Hm',
      'Bbm': 'Bm',
      'G#m': 'Abm',
      'C#m': 'Dbm',
      'F#m': 'Gbm',
      'Ebm': 'D#m'
    };
    return map[note] || note;
  };
  
  const [showTheory, setShowTheory] = React.useState(false);
  
  // Normalize note for comparison (e.g., F# -> Gb)
  const normalizeNote = (n: string | null) => {
    if (!n) return null;
    const clean = n.replace('m', '');
    const map: Record<string, string> = { 'F#': 'Gb', 'C#': 'Db', 'G#': 'Ab', 'D#': 'Eb', 'A#': 'Bb' };
    return map[clean] || clean;
  };

  const normalizedActive = normalizeNote(activeNote);
  const detectedIdx = normalizedActive ? FIFTHS.indexOf(normalizedActive) : -1;
  const currentIdx = selectedIdx !== null ? selectedIdx : detectedIdx;

  // Family Chords Logic:
  // Center (i) = Tonic (I) / Rel. Minor (vi)
  // Right (i+1) = Dominant (V) / Rel. Minor (iii)
  // Left (i-1) = Subdominant (IV) / Rel. Minor (ii)
  const getFamilyType = (idx: number) => {
    if (currentIdx === -1) return null;
    const diff = (idx - currentIdx + 12) % 12;
    if (diff === 0) return 'tonic';     // I or vi
    if (diff === 1) return 'dominant';  // V or iii
    if (diff === 11) return 'subdominant'; // IV or ii
    return null;
  };

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center transition-all duration-500",
      isLarge ? "w-full h-full p-0" : "w-full h-full p-4"
    )}>
      {/* Interaction Hint */}
      {!isLarge && (
         <div className="absolute top-0 flex flex-col items-center gap-2">
           <div className="opacity-40 text-[8px] uppercase font-black tracking-widest pointer-events-none">
             Tap a note to analyze key
           </div>
           
           <button 
            onClick={() => setShowTheory(!showTheory)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border transition-all hover:scale-105 active:scale-95",
              isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
            )}
           >
              <Info size={10} className={showTheory ? "text-emerald-500" : "opacity-40"} />
              <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Family Chords?</span>
           </button>
         </div>
      )}

      <AnimatePresence>
        {showTheory && !isLarge && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "absolute z-50 top-16 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl border backdrop-blur-3xl shadow-2xl pointer-events-auto",
              isDark ? "bg-black/90 border-white/10" : "bg-white/90 border-black/10"
            )}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Harmonic Insight</span>
              </div>
              <p className={cn(
                "text-[11px] leading-relaxed font-medium italic",
                isDark ? "text-white/70" : "text-black/70"
              )}>
                "These chords share overlapping scales and are mathematically resonant. When playing a key, concentrate on these neighbors."
              </p>
              <div className="flex flex-col gap-1 border-t border-current/5 pt-2">
                <div className="flex justify-between text-[8px] font-bold opacity-40 uppercase">
                  <span>Left (i-1)</span>
                  <span>Subdominant</span>
                </div>
                <div className="flex justify-between text-[8px] font-bold opacity-40 uppercase">
                  <span>Right (i+1)</span>
                  <span>Dominant</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Rings */}
      <div className={cn(
        "absolute inset-0 rounded-full border-4",
        isDark ? "border-white/10" : "border-black/10",
        isLarge ? "opacity-20" : ""
      )} />
      
      <svg viewBox="0 0 100 100" className={cn(
        "overflow-visible drop-shadow-2xl transition-all duration-500",
        isLarge ? "w-full h-full" : "w-full h-full"
      )}>
        {/* Slices for Major Chords (Outer) */}
        {FIFTHS.map((note, i) => {
          const angle = (i * 30) - 90;
          const familyType = getFamilyType(i);
          const isDetected = detectedIdx === i;
          
          return (
            <g 
              key={`major-${note}`} 
              className="cursor-pointer group" 
              onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
            >
              <motion.path
                d={describeArc(50, 50, 45, angle + 1, angle + 29, 31)}
                animate={{
                   fill: familyType === 'tonic' 
                    ? `${accentColor}4D` 
                    : familyType 
                      ? `${accentColor}1A` 
                      : isDetected ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                   stroke: familyType === 'tonic'
                    ? accentColor
                    : familyType
                      ? `${accentColor}66`
                      : isDetected ? '#10b981' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                   strokeWidth: familyType === 'tonic' ? 2 : (familyType || isDetected ? 1 : 0.4)
                }}
              />
              <text
                x={50 + 38 * Math.cos((angle + 15) * (Math.PI / 180))}
                y={50 + 38 * Math.sin((angle + 15) * (Math.PI / 180))}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "font-black tracking-tighter transition-all duration-300 pointer-events-none",
                  isLarge ? "text-[5px]" : "text-[6px]",
                  familyType || isDetected ? "" : (isDark ? "fill-white/30" : "fill-black/30")
                )}
                style={{ fill: familyType ? accentColor : (isDetected ? '#10b981' : undefined) }}
              >
                {getLocalizedNote(note)}
              </text>
            </g>
          );
        })}

        {/* Slices for Minor Chords (Inner) */}
        {MINORS.map((note, i) => {
          const angle = (i * 30) - 90;
          const familyType = getFamilyType(i);
          const isDetected = detectedIdx === i && normalizedActive === normalizeNote(note);

          return (
            <g 
              key={`minor-${note}`} 
              className="cursor-pointer"
              onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
            >
              <motion.path
                d={describeArc(50, 50, 31, angle + 1, angle + 29, 17)}
                animate={{
                    fill: familyType === 'tonic' 
                      ? `${accentColor}33` 
                      : familyType 
                        ? `${accentColor}12` 
                        : isDetected ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    stroke: familyType === 'tonic'
                      ? accentColor
                      : familyType
                        ? `${accentColor}33`
                        : isDetected ? '#10b981' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                    opacity: (familyType || isDetected) ? 1 : 0.5
                }}
              />
              <text
                x={50 + 24 * Math.cos((angle + 15) * (Math.PI / 180))}
                y={50 + 24 * Math.sin((angle + 15) * (Math.PI / 180))}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "font-bold tracking-tighter transition-all duration-300 uppercase pointer-events-none",
                  isLarge ? "text-[3px]" : "text-[3.5px]",
                  familyType || isDetected ? "" : (isDark ? "fill-white/20" : "fill-black/20")
                )}
                style={{ fill: familyType ? accentColor : (isDetected ? '#10b981' : undefined) }}
              >
                {getLocalizedNote(note)}
              </text>
            </g>
          );
        })}
        
        {/* Center Indicator */}
        <circle 
          cx="50" cy="50" r="16" 
          fill={isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"} 
          className="cursor-pointer"
          onClick={() => setSelectedIdx(null)}
        />
        {(selectedIdx !== null || normalizedActive) && (
              <g pointerEvents="none">
                <text
                    x="50"
                    y="48"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] font-serif font-black italic"
                    style={{ fill: selectedIdx !== null ? accentColor : '#10b981' }}
                >
                    {getLocalizedNote(selectedIdx !== null ? FIFTHS[selectedIdx] : normalizedActive!)}
                </text>
                <text
                    x="50"
                    y="54"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[3px] uppercase tracking-widest font-black opacity-40 italic"
                    style={{ fill: selectedIdx !== null ? accentColor : '#10b981' }}
                >
                    {selectedIdx !== null ? "Selected Key" : "Detected"}
                </text>
              </g>
        )}
      </svg>
    </div>
  );
}

// SVG Helper for ring sectors
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, innerRadius: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
