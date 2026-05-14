import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Mic, MicOff, Music, Volume2, Sparkles, Clock, Compass, Zap, LayoutGrid, Sun, Moon, MessageCircle, Languages, Maximize, Activity, Brain } from 'lucide-react';
import { usePitchDetection } from './hooks/usePitchDetection';
import { GuitarHub } from './components/GuitarHub';
import { NeedleBar } from './components/NeedleBar';
import { ToneReference } from './components/ToneReference';
import { RiffLibrary } from './components/RiffLibrary';
import { Metronome } from './components/Metronome';
import { JamStation } from './components/JamStation';
import { EarTraining } from './components/EarTraining';
import { QuizView } from './components/QuizView';
import { TheoryView } from './components/TheoryView';
import { CircleOfFifths } from './components/CircleOfFifths';
import { GuitarStringsBackground } from './components/GuitarStringsBackground';
import { FeedbackSection } from './components/FeedbackSection';
import { ContactPopup } from './components/ContactPopup';
import { LuthierConfig, StudioSettings } from './components/LuthierConfig';
import { cn } from './lib/utils';
import { GUITAR_STRINGS, UKULELE_STRINGS, TWELVE_STRING_STRINGS, InstrumentCategory, Riff, EADGBE_MNEMONICS } from './constants';
import { LanguageProvider, Language, translations, getTranslation } from './lib/i18n';

type ViewMode = 'tuner' | 'metronome' | 'riffs' | 'theory' | 'jam' | 'ear' | 'quiz';

const DEFAULT_SETTINGS: StudioSettings = {
  bgColor: '#0a0a0a',
  accentColor: '#10b981',
  layoutMode: 'vertical',
  guitarRingColor: 'rgba(255,255,255,0.05)'
};

export default function App() {
  const [language, setLanguage] = useState<Language>('de');
  const [mnemonicIdx, setMnemonicIdx] = useState(0);

  useEffect(() => {
    if (language === 'de') setMnemonicIdx(0);
    else setMnemonicIdx(2);
  }, [language]);
  const [activeView, setActiveView] = useState<ViewMode>('tuner');

  const t = (key: keyof typeof translations['en']) => getTranslation(language, key);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [instrument, setInstrument] = useState<InstrumentCategory>('guitar');
  const [referenceFreq, setReferenceFreq] = useState(440);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
  const [playedReferenceNote, setPlayedReferenceNote] = useState<string | null>(null);
  const [playingRiff, setPlayingRiff] = useState<{ id: string; activeIndex: number } | null>(null);
  const [showPerfectFlash, setShowPerfectFlash] = useState(false);
  const [tunedStrings, setTunedStrings] = useState<string[]>([]);
  const playbackTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (noteStr: string, startTime: number, duration: number = 0.5) => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const getFreq = (note: string, octave: number = 4) => {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const semitoneMap: Record<string, number> = {
            'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10
        };
        let step = noteNames.indexOf(note.toUpperCase());
        if (step === -1) step = semitoneMap[note] ?? 0;
        const n = (octave * 12) + step + 12;
        const freq = 440 * Math.pow(2, (n - 69) / 12);
        return freq * (referenceFreq / 440);
    };

    const match = noteStr.match(/^([A-G][#b]?)([0-8])?$/i);
    if (!match && !/^\d$/.test(noteStr)) return;

    let freq = 0;
    if (match) {
        const noteName = match[1];
        const octave = match[2] ? parseInt(match[2]) : 3;
        freq = getFreq(noteName, octave);
    } else {
        const map = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
        const note = map[parseInt(noteStr) % 6];
        const m = note.match(/^([A-G][#b]?)([0-8])?$/i);
        freq = getFreq(m![1], parseInt(m![2]));
    }

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc2.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2.01, startTime); 
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.75, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, startTime);
    filter.frequency.exponentialRampToValueAtTime(500, startTime + duration);
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);
    
    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  };

  const handlePlayRiff = (riff: Riff) => {
    if (!riff.pattern && !riff.chords) return;
    
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Clear all pending timeouts
    playbackTimeoutsRef.current.forEach(t => clearTimeout(t));
    playbackTimeoutsRef.current = [];

    setPlayedReferenceNote(riff.title);

    if (riff.pattern) {
        const cleanPattern = riff.pattern.replace(/\(Riff\)|\/|resonate/g, '');
        const patternTokens = cleanPattern.split(/\s+/).filter(t => t.trim().length > 0);
        
        let tempo = 0.45; // Slightly slower default for better clarity
        if (riff.title.includes('Sandman') || riff.title.includes('Paranoid')) tempo = 0.25;
        if (riff.title.includes('Smoke') || riff.title.includes('Iron Man') || riff.title.includes('Highway')) tempo = 0.55;
        if (riff.title.includes('Stairway') || riff.title.includes('Hallelujah') || riff.title.includes('Wish')) tempo = 0.65;
        if (riff.title.includes('Elite')) tempo = 0.28;

        const loopGap = 1.0;

        [0, 1].forEach(loopIndex => {
            const loopOffset = loopIndex * (patternTokens.length * tempo + loopGap);
            patternTokens.forEach((token, i) => {
                const startTime = loopOffset + (i * tempo);
                
                if (token !== '.' && token !== '_' && token !== '-') {
                  let noteToPlay = token;
                  if (['D', 'U', 'P', 'I', 'M', 'A', 'X', 'S'].includes(token.toUpperCase())) {
                      const rootMatch = riff.chords?.split('-')[0].trim().match(/^[A-G]([#b])?/);
                      noteToPlay = rootMatch ? rootMatch[0] + '3' : 'G3';
                  }
                  playTone(noteToPlay, ctx.currentTime + startTime, 0.5);
                }
                
                const t = setTimeout(() => {
                  setPlayingRiff({ id: riff.id, activeIndex: i });
                  if (loopIndex === 1 && i === patternTokens.length - 1) {
                    setPlayingRiff(null);
                  }
                }, startTime * 1000);
                playbackTimeoutsRef.current.push(t);
            });
        });
    } else if (riff.chords) {
        const chords = riff.chords.split('-').map(c => c.trim());
        const tempo = 0.8;
        const loopGap = 1.2;
        [0, 1].forEach(loopIndex => {
            const loopOffset = loopIndex * (chords.length * tempo + loopGap);
            chords.forEach((chord, i) => {
                const rootMatch = chord.match(/^[A-G]([#b])?/);
                if (rootMatch) {
                    const startTime = loopOffset + (i * tempo);
                    playTone(rootMatch[0] + '3', ctx.currentTime + startTime, 0.8);
                    const t = setTimeout(() => {
                      setPlayingRiff({ id: riff.id, activeIndex: i });
                      if (loopIndex === 1 && i === chords.length - 1) {
                        setPlayingRiff(null);
                      }
                    }, startTime * 1000);
                    playbackTimeoutsRef.current.push(t);
                }
            });
        });
    }
  };
  
  const handleResetDefaults = () => {
    if (window.confirm(translations[language].confirmReset)) {
      setSettings(DEFAULT_SETTINGS);
      setTheme('dark');
      setInstrument('guitar');
      setReferenceFreq(440);
      localStorage.removeItem('perotuner-settings');
      window.location.reload(); // Hard reset to ensure all states are clean
    }
  };

  const [settings, setSettings] = useState<StudioSettings>(() => {
    const saved = localStorage.getItem('perotuner-settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  const { pitchData, isActive, start, stop } = usePitchDetection(referenceFreq);

  useEffect(() => {
    if (pitchData && Math.abs(pitchData.cents) <= 2) {
      setShowPerfectFlash(true);
      
      // Update tuned strings tracking
      const currentInstrumentStrings = getStrings();
      const matchedString = currentInstrumentStrings.find(s => 
        s.note === pitchData.note && 
        Math.abs(s.freq - pitchData.freq) < 10 // Basic safety check
      );
      
      if (matchedString) {
        setTunedStrings(prev => {
          if (prev.includes(matchedString.label)) return prev;
          return [...prev, matchedString.label];
        });
      }

      const timer = setTimeout(() => setShowPerfectFlash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [pitchData?.note, pitchData?.cents, pitchData?.freq]);

  useEffect(() => {
    setTunedStrings([]);
  }, [instrument]);

  useEffect(() => {
    localStorage.setItem('perotuner-settings', JSON.stringify(settings));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.bgColor);
    // Sync body background to prevent white background on mobile zoom/scroll
    document.body.style.backgroundColor = settings.bgColor;
    document.documentElement.style.backgroundColor = settings.bgColor;
  }, [settings]);

  useEffect(() => {
    const isDark = theme === 'dark';
    const currentPresets = isDark 
      ? ['#0a0a0a', '#0f172a', '#1e1b4b', '#18181b', '#064e3b', '#2c3e50', '#000000', '#1a1c2c', '#330033'] 
      : ['#f5f2ed', '#f1f5f9', '#fafafa', '#fdf2f8', '#ecfdf5', '#fff9db', '#ffffff', '#e0f7fa', '#fce4ec'];
    
    if (currentPresets.includes(settings.bgColor)) return;
    setSettings(prev => ({ ...prev, bgColor: isDark ? '#0a0a0a' : '#f5f2ed' }));
  }, [theme]);

  const getStrings = () => {
    switch (instrument) {
      case 'ukulele': return UKULELE_STRINGS;
      case '12string': return TWELVE_STRING_STRINGS;
      default: return GUITAR_STRINGS;
    }
  };

  const instruments: { id: InstrumentCategory; label: string; icon: any }[] = [
    { id: 'guitar', label: 'Acoustic', icon: Music },
    { id: '12string', label: '12-String', icon: Zap },
    { id: 'ukulele', label: 'Ukulele', icon: Compass },
  ];

  return (
    <LanguageProvider value={{ language, setLanguage, t }}>
      {/* Success Flash */}
      <AnimatePresence>
        {showPerfectFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-500 pointer-events-none z-[100] blur-3xl transition-opacity duration-300"
          />
        )}
      </AnimatePresence>

      <div 
        className={cn(
          "min-h-screen transition-all duration-700 font-sans selection:bg-emerald-500/30 pb-32",
          theme === 'dark' ? "text-white" : "text-[#1a1a1a]"
        )}
        style={{ backgroundColor: settings.bgColor }}
      >
      <LuthierConfig 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)}
        settings={settings}
        onUpdate={setSettings}
        onReset={handleResetDefaults}
        theme={theme}
      />

      <div className="relative flex flex-col items-center">
        {/* iOS Style Top Header */}
        <header className="w-full max-w-7xl flex flex-wrap md:flex-nowrap items-center justify-between p-4 md:p-6 gap-6 md:gap-8">
          <div className="flex flex-col items-start min-w-[120px] md:flex-1">
            <h1 className={cn(
              "text-lg font-bold tracking-tighter leading-none italic",
              theme === 'dark' ? "text-white" : "text-[#1a1a1a]"
            )}>
              PeRO<span style={{ color: settings.accentColor }}>tuner</span>
            </h1>
            <span className={cn(
              "text-[9px] uppercase tracking-[0.4em] font-medium transition-opacity",
              theme === 'dark' ? "text-white/40" : "text-black/40"
            )}>{t('profAmateur')}</span>
          </div>

          <div className="flex items-center gap-2 justify-center md:flex-1 order-last md:order-none w-full md:w-auto">
            <button 
              onClick={() => setLanguage(prev => prev === 'de' ? 'en' : 'de')}
              className={cn(
                "w-11 h-9 rounded-full border flex items-center justify-center transition-all group overflow-hidden",
                theme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}
              title={language === 'de' ? "Switch to English" : "Zu Deutsch wechseln"}
            >
              <div className="flex flex-col items-center">
                {language === 'de' ? (
                  <svg width="18" height="10" viewBox="0 0 5 3" className="shadow-sm">
                    <rect width="5" height="3" fill="#000"/>
                    <rect width="5" height="2" y="1" fill="#D00"/>
                    <rect width="5" height="1" y="2" fill="#FFCE00"/>
                  </svg>
                ) : (
                  <svg width="18" height="10" viewBox="0 0 60 30" className="shadow-sm">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                  </svg>
                )}
                <span className="text-[6px] font-black uppercase mt-0.5 opacity-40">{language}</span>
              </div>
            </button>
            <button 
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={cn(
                "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
                theme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}
            >
              {theme === 'dark' ? <Sun size={12} className="opacity-60" /> : <Moon size={12} className="opacity-60" />}
            </button>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Simple trick to help reset visual viewport focus
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                  const content = viewport.getAttribute('content');
                  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
                  setTimeout(() => {
                    viewport.setAttribute('content', content || 'width=device-width, initial-scale=1.0');
                  }, 100);
                }
              }}
              className={cn(
                "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
                theme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}
              title="Reset View"
            >
              <Maximize size={12} className="opacity-60" />
            </button>
            <button 
              onClick={() => setIsConfigOpen(true)}
              className={cn(
                "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
                theme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}
            >
              <Settings size={12} className="opacity-60" />
            </button>
          </div>

          <div className="flex items-center gap-4 md:flex-1 justify-end min-w-0">
            {/* Instrument Selector */}
            <div className={cn(
              "flex p-1 rounded-full border shadow-lg backdrop-blur-3xl shrink-0",
              theme === 'dark' ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
            )}>
              {instruments.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setInstrument(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black transition-all duration-300",
                    instrument === item.id 
                      ? "text-white" 
                      : theme === 'dark' ? "text-white/40 hover:text-white/60" : "text-black/40 hover:text-black/60"
                  )}
                  style={instrument === item.id ? { 
                    backgroundColor: settings.accentColor,
                    boxShadow: `0 4px 12px ${settings.accentColor}4D`
                  } : {}}
                >
                  <item.icon size={11} />
                  <span className="lowercase first-letter:uppercase">{item.id === 'guitar' ? t('acoustic') : item.id === '12string' ? t('twelveString') : t('ukulele')}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="w-full max-w-4xl px-4 pt-0">
          <AnimatePresence mode="wait">
            {activeView === 'tuner' && (
              <motion.div
                key="tuner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center relative"
              >
                <GuitarStringsBackground 
                  allStrings={getStrings()} 
                  tunedStrings={tunedStrings} 
                  activeNote={pitchData?.note}
                  activeCents={pitchData?.cents}
                  className="opacity-60 top-[-100px] bottom-0"
                />
 
                {/* Tuner View Content */}

                <div className={cn(
                   "w-full flex flex-col items-center",
                   settings.layoutMode === 'horizontal' ? "lg:flex-row lg:items-start lg:justify-center lg:gap-20" : ""
                )}>
                  {/* Control Hub */}
                  <div className={cn(
                    "flex flex-col items-center gap-8",
                    settings.layoutMode === 'horizontal' ? "lg:pt-20" : ""
                  )}>
                    <div className="flex flex-col items-center gap-1 mb-2">
                       <h2 className={cn(
                         "text-2xl font-black italic tracking-tighter uppercase",
                         theme === 'dark' ? "text-white" : "text-black"
                       )}>
                         {instruments.find(i => i.id === instrument)?.label}
                       </h2>
                       <div className="h-1 w-12 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                    </div>

                    {/* Metronome Overlay */}
                    <AnimatePresence>
                      {isMetronomeOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="w-full overflow-hidden mb-4"
                        >
                          <div className={cn(
                            "rounded-[2.5rem] border p-2",
                            theme === 'dark' ? "bg-emerald-950/20 border-white/5" : "bg-white border-black/5 shadow-2xl"
                          )}>
                            <Metronome theme={theme} accentColor={settings.accentColor} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-6 sm:gap-12">
                      {/* Signal Strength Improvement */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                          theme === 'dark' ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
                        )}>
                          <div className="flex flex-col-reverse gap-0.5 w-6 h-6 items-center justify-center">
                            {[1, 2, 3, 4].map(idx => (
                              <div 
                                key={idx} 
                                className="w-4 h-0.5 rounded-full transition-colors duration-200"
                                style={{ 
                                  backgroundColor: isActive && idx <= 3 ? settings.accentColor : 'rgba(128,128,128,0.2)' 
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[7px] uppercase tracking-widest font-black opacity-30">{t('signal')}</span>
                      </div>

                      {/* 432Hz Button */}
                      <div className="flex flex-col items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReferenceFreq(432)}
                          className={cn(
                            "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border relative overflow-hidden",
                            referenceFreq === 432 
                              ? "shadow-[0_0_20px_rgba(0,0,0,0.1)]" 
                              : theme === 'dark' ? "bg-white/5 border-white/5 opacity-40 hover:opacity-100" : "bg-black/5 border-black/5 opacity-40 hover:opacity-100"
                          )}
                          style={referenceFreq === 432 ? { 
                            backgroundColor: `${settings.accentColor}1A`, 
                            borderColor: `${settings.accentColor}4D`,
                            boxShadow: `inset 0 0 15px ${settings.accentColor}1A, 0 8px 24px -8px ${settings.accentColor}4D`
                          } : {}}
                        >
                          <span className={cn(
                            "text-[10px] sm:text-xs font-black tracking-tighter transition-colors",
                            referenceFreq === 432 ? "" : theme === 'dark' ? "text-white" : "text-black"
                          )} style={referenceFreq === 432 ? { color: settings.accentColor } : {}}>432</span>
                          {referenceFreq === 432 && (
                            <motion.div 
                              layoutId="freq-glow"
                              className="absolute inset-0 opacity-20 pointer-events-none"
                              style={{ background: `linear-gradient(135deg, ${settings.accentColor}, transparent)` }}
                            />
                          )}
                        </motion.button>
                        <span className={cn(
                          "text-[8px] uppercase tracking-widest font-bold font-mono transition-opacity whitespace-nowrap",
                          referenceFreq === 432 ? "opacity-100" : "opacity-20"
                        )} style={referenceFreq === 432 ? { color: settings.accentColor } : {}}>
                          {t('healing')}
                        </span>
                      </div>

                       {/* Primary Mic Toggle */}
                      <div className="flex flex-col items-center gap-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={isActive ? stop : start}
                          className={cn(
                            "group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500",
                            isActive 
                              ? "scale-110" 
                              : theme === 'dark' 
                                ? "bg-white/5 border border-white/5 hover:border-emerald-500/50 shadow-xl"
                                : "bg-black/5 border border-black/5 hover:border-emerald-500/50 shadow-lg"
                          )}
                          style={isActive ? { backgroundColor: '#10b981', boxShadow: `0 0 50px #10b98166` } : {}}
                        >
                          {isActive && (
                            <motion.div
                              animate={{ 
                                scale: [1, 1.4, 1], 
                                opacity: [0.3, 0, 0.3],
                                boxShadow: [`0 0 10px #10b981`, `0 0 40px #10b981`, `0 0 10px #10b981`]
                              }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 rounded-full bg-emerald-500/20"
                            />
                          )}
                          {isActive ? (
                            <Mic size={32} className="text-white relative z-10" />
                          ) : (
                            <MicOff size={32} className={cn(
                              "transition-all duration-300 relative z-10",
                              theme === 'dark' ? "text-white/20" : "text-black/20", 
                              "group-hover:text-emerald-500/80"
                            )} />
                          )}
                        </motion.button>
                        <span className={cn(
                          "text-[9px] uppercase tracking-[0.2em] font-black transition-all",
                          isActive ? "text-emerald-500 animate-pulse" : "opacity-30"
                        )}>
                          {isActive ? t('listening') : t('startMic')}
                        </span>
                      </div>

                       {/* 440Hz Button */}
                      <div className="flex flex-col items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReferenceFreq(440)}
                          className={cn(
                            "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border relative overflow-hidden",
                            referenceFreq === 440
                              ? "shadow-[0_0_20px_rgba(0,0,0,0.1)]" 
                              : theme === 'dark' ? "bg-white/5 border-white/5 opacity-40 hover:opacity-100" : "bg-black/5 border-black/5 opacity-40 hover:opacity-100"
                          )}
                          style={referenceFreq === 440 ? { 
                            backgroundColor: `${settings.accentColor}1A`, 
                            borderColor: `${settings.accentColor}4D`,
                            boxShadow: `inset 0 0 15px ${settings.accentColor}1A, 0 8px 24px -8px ${settings.accentColor}4D`
                          } : {}}
                        >
                          <span className={cn(
                            "text-[10px] sm:text-xs font-black tracking-tighter transition-colors",
                            referenceFreq === 440 ? "" : theme === 'dark' ? "text-white" : "text-black"
                          )} style={referenceFreq === 440 ? { color: settings.accentColor } : {}}>440</span>
                          {referenceFreq === 440 && (
                            <motion.div 
                              layoutId="freq-glow"
                              className="absolute inset-0 opacity-20 pointer-events-none"
                              style={{ background: `linear-gradient(135deg, ${settings.accentColor}, transparent)` }}
                            />
                          )}
                        </motion.button>
                        <span className={cn(
                          "text-[8px] uppercase tracking-widest font-bold font-mono transition-opacity whitespace-nowrap",
                          referenceFreq === 440 ? "opacity-100" : "opacity-20"
                        )} style={referenceFreq === 440 ? { color: settings.accentColor } : {}}>
                          {t('standard')}
                        </span>
                      </div>

                      {/* Metronome Toggle improvement */}
                      <div className="flex flex-col items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsMetronomeOpen(!isMetronomeOpen)}
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                            isMetronomeOpen 
                              ? "shadow-lg bg-emerald-500/10 border-emerald-500/30" 
                              : theme === 'dark' ? "bg-white/5 border-white/5 opacity-40 hover:opacity-100" : "bg-black/5 border-black/5 opacity-40 hover:opacity-100"
                          )}
                        >
                          <Clock size={16} className={cn(isMetronomeOpen ? "text-emerald-500" : "text-gray-400")} />
                        </motion.button>
                        <span className={cn(
                          "text-[8px] uppercase tracking-widest font-bold font-mono transition-opacity whitespace-nowrap",
                          isMetronomeOpen ? "opacity-100" : "opacity-20"
                        )} style={isMetronomeOpen ? { color: settings.accentColor } : {}}>
                          {t('clock')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visualization Station */}
                  <section className={cn(
                    "flex flex-col items-center gap-8 w-full max-w-xl",
                    settings.layoutMode === 'horizontal' ? "lg:max-w-md" : "mt-6"
                  )}>
                    <div className="w-full flex flex-col items-center gap-2">
                      <NeedleBar 
                        cents={pitchData?.cents ?? 0} 
                        active={!!pitchData} 
                        theme={theme} 
                        currentNote={pitchData?.note}
                        amplitude={pitchData?.amplitude}
                      />
                    </div>
                    
                    <div className="relative group">
                      <GuitarHub 
                        currentNote={pitchData?.note ?? null} 
                        playedNote={playedReferenceNote}
                        playingRiff={playingRiff}
                        frequency={pitchData?.frequency ?? 0}
                        cents={pitchData?.cents ?? 0} 
                        referenceA={referenceFreq}
                        theme={theme}
                        strings={getStrings()}
                        customColors={{
                          accent: settings.accentColor,
                          glow: `${settings.accentColor}4D`
                        }}
                      />
                    </div>
                  </section>
                </div>

                <div className="mt-10 w-full flex flex-col items-center gap-6 border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: `${settings.accentColor}4D` }} />
                    <h3 className={cn(
                      "text-[10px] uppercase tracking-[0.3em] transition-opacity font-bold",
                      theme === 'dark' ? "opacity-40" : "opacity-60"
                    )}>
                      {instrument === '12string' ? t('twelveString') : (instrument === 'ukulele' ? t('ukulele') : t('guitar'))} {t('tuningReference')}
                    </h3>
                    <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: `${settings.accentColor}4D` }} />
                  </div>

                  {/* Tuning Mnemonic Support - Reference Section Version */}
                  <div 
                    onClick={() => setMnemonicIdx((mnemonicIdx + 1) % EADGBE_MNEMONICS.length)}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-95 transition-transform max-w-[300px] mb-2"
                  >
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Languages size={10} className="text-emerald-500" />
                      <span className="text-[9px] uppercase font-bold text-emerald-500/60 tracking-widest">
                        {EADGBE_MNEMONICS[mnemonicIdx].lang}
                      </span>
                    </div>
                    <p className={cn(
                      "text-[11px] uppercase tracking-[0.15em] font-black text-center transition-all duration-500 leading-relaxed",
                      theme === 'dark' ? "text-white/40 group-hover:text-emerald-400" : "text-black/40 group-hover:text-emerald-600"
                    )}>
                      {EADGBE_MNEMONICS[mnemonicIdx].phrase}
                    </p>
                  </div>

                  <ToneReference 
                    referenceA={referenceFreq} 
                    theme={theme} 
                    notes={getStrings()} 
                    accentColor={settings.accentColor}
                    onNoteTrigger={setPlayedReferenceNote}
                  />

                  {/* Circle of Fifths below Reference */}
                  <div className="mt-12 w-full max-w-sm">
                    <div className="flex flex-col items-center gap-2 mb-8">
                      <h3 className={cn(
                        "text-[10px] uppercase tracking-[0.3em] font-bold opacity-40",
                        theme === 'dark' ? "text-white" : "text-black"
                      )}>
                        {t('circleOfFifths')}
                      </h3>
                      <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: `${settings.accentColor}4D` }} />
                    </div>
                    <div className="h-80 w-80 mx-auto">
                      <CircleOfFifths 
                        activeNote={pitchData?.note ?? null}
                        accentColor={settings.accentColor} 
                        theme={theme}
                        language={language}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Discovery Section */}
                <div className="w-full mt-24">
                   <RiffLibrary 
                    theme={theme} 
                    category="all" 
                    onPlayRiff={handlePlayRiff}
                    playingRiff={playingRiff}
                    onCategoryChange={setInstrument}
                    accentColor={settings.accentColor}
                   />
                </div>

                <div className="w-full">
                  <FeedbackSection 
                    theme={theme} 
                    accentColor={settings.accentColor} 
                  />
                </div>
              </motion.div>
            )}

            {activeView === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TheoryView 
                  currentNote={pitchData?.note ?? null} 
                  theme={theme} 
                  accentColor={settings.accentColor} 
                  isActive={isActive}
                  onStartMic={start}
                  onStopMic={stop}
                  onPlayNote={(note) => {
                    const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
                    if (!audioCtxRef.current) audioCtxRef.current = ctx as AudioContext;
                    playTone(note, (audioCtxRef.current as AudioContext).currentTime, 0.4);
                  }}
                  tunedStrings={tunedStrings}
                  allStrings={getStrings()}
                />
              </motion.div>
            )}

            {activeView === 'metronome' && (
              <motion.div
                key="metronome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="flex flex-col items-center gap-2 mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">{t('studioTempo')}</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">{t('precisionTiming')}</p>
                </div>
                <Metronome theme={theme} accentColor={settings.accentColor} />
              </motion.div>
            )}

            {activeView === 'riffs' && (
              <motion.div
                key="riffs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RiffLibrary 
                  theme={theme} 
                  category={instrument} 
                  onPlayRiff={handlePlayRiff}
                  onCategoryChange={setInstrument}
                  accentColor={settings.accentColor}
                />
              </motion.div>
            )}

            {activeView === 'jam' && (
              <motion.div
                key="jam"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <JamStation theme={theme} accentColor={settings.accentColor} />
              </motion.div>
            )}

            {activeView === 'ear' && (
              <motion.div
                key="ear"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <EarTraining theme={theme} accentColor={settings.accentColor} />
              </motion.div>
            )}

            {activeView === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <QuizView theme={theme} accentColor={settings.accentColor} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Professional Bottom Navigation (iOS Style) */}
        <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-8 flex justify-center z-50 pointer-events-none pb-[calc(env(safe-area-inset-bottom)+0.2rem)]">
          <nav className={cn(
            "pointer-events-auto flex items-center gap-0.5 p-1 rounded-[2rem] border backdrop-blur-2xl transition-all shadow-2xl max-w-[98vw] overflow-hidden",
            theme === 'dark' ? "bg-black/60 border-white/10" : "bg-white/80 border-black/10"
          )}>
            {[
              { id: 'tuner', label: t('tuner'), icon: Volume2 },
              { id: 'riffs', label: t('riffs'), icon: LayoutGrid },
              { id: 'jam', label: t('jamStation'), icon: Activity },
              { id: 'ear', label: t('earTraining'), icon: Brain },
              { id: 'quiz', label: t('quizShortcut'), icon: Music },
              { id: 'theory', label: t('theory'), icon: Compass },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-2.5 sm:px-5 py-2 sm:py-3 rounded-[1.5rem] transition-all duration-300 group cursor-pointer hover:scale-105 active:scale-95 flex-1 min-w-[48px] sm:min-w-[80px]",
                  activeView === tab.id 
                    ? "text-white" 
                    : theme === 'dark' ? "text-white/30 hover:text-white/60" : "text-black/30 hover:text-black/60"
                )}
              >
                <tab.icon size={16} className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  activeView === tab.id ? "scale-110" : ""
                )} />
                <span className="text-[7px] sm:text-[9px] uppercase tracking-tighter font-black leading-none">{tab.label}</span>
                
                {activeView === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-[1.5rem] z-[-1]"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                )}
              </button>
            ))}
            
            <div className="w-px h-8 mx-1 opacity-10 bg-current" />
  
            <button
              onClick={() => setIsContactOpen(true)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl transition-all duration-300 group cursor-pointer hover:scale-105 active:scale-95",
                theme === 'dark' ? "text-emerald-500/60 hover:text-emerald-400" : "text-emerald-600/60 hover:text-emerald-500"
              )}
            >
              <MessageCircle size={20} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[9px] uppercase tracking-widest font-black">{t('contact')}</span>
            </button>
          </nav>
        </div>
        <ContactPopup 
          isOpen={isContactOpen} 
          onClose={() => setIsContactOpen(false)} 
          theme={theme} 
          accentColor={settings.accentColor} 
        />
      </div>

      <footer className={cn(
        "w-full text-center py-10 px-4 transition-opacity",
        theme === 'dark' ? "opacity-10" : "opacity-20"
      )}>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium">
            PeROtuner &copy; 2024 &bull; Professional Amateur Park Player Edition
          </p>
          <div className="flex items-center gap-4 text-[8px] font-mono opacity-60">
            <span>Latency: Low</span>
            <span>Build: 1.2 Stable</span>
          </div>
        </div>
      </footer>
    </div>
    </LanguageProvider>
  );
}
