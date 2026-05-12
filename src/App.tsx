import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Mic, 
  MicOff, 
  Music, 
  Volume2, 
  Sparkles, 
  Clock,
  Compass,
  Zap,
  LayoutGrid,
  Sun,
  Moon
} from 'lucide-react';
import { usePitchDetection } from './hooks/usePitchDetection';
import { GuitarHub } from './components/GuitarHub';
import { NeedleBar } from './components/NeedleBar';
import { ToneReference } from './components/ToneReference';
import { RiffLibrary } from './components/RiffLibrary';
import { Metronome } from './components/Metronome';
import { LuthierConfig, StudioSettings } from './components/LuthierConfig';
import { cn } from './lib/utils';
import { GUITAR_STRINGS, UKULELE_STRINGS, TWELVE_STRING_STRINGS, InstrumentCategory } from './constants';

type ViewMode = 'tuner' | 'metronome' | 'riffs';

const DEFAULT_SETTINGS: StudioSettings = {
  bgColor: '#0a0a0a',
  accentColor: '#10b981',
  layoutMode: 'vertical',
  guitarRingColor: 'rgba(255,255,255,0.05)'
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('tuner');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [instrument, setInstrument] = useState<InstrumentCategory>('guitar');
  const [referenceFreq, setReferenceFreq] = useState(440);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const [settings, setSettings] = useState<StudioSettings>(() => {
    const saved = localStorage.getItem('perotuner-settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  const { pitchData, isActive, start, stop } = usePitchDetection(referenceFreq);

  useEffect(() => {
    localStorage.setItem('perotuner-settings', JSON.stringify(settings));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.bgColor);
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
        theme={theme}
      />

      <div className="relative flex flex-col items-center">
        {/* iOS Style Top Header */}
        <header className="w-full max-w-4xl flex justify-between items-center p-6 bg-transparent">
          <div className="flex flex-col">
            <h1 className={cn(
              "text-lg font-bold tracking-tighter leading-none italic",
              theme === 'dark' ? "text-white" : "text-[#1a1a1a]"
            )}>
              PeRO<span style={{ color: settings.accentColor }}>tuner</span>
            </h1>
            <span className={cn(
              "text-[9px] uppercase tracking-[0.4em] font-medium transition-opacity",
              theme === 'dark' ? "text-white/40" : "text-black/40"
            )}>Prof. Amateur Park Player PWA</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                theme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}
            >
              {theme === 'dark' ? <Sun size={14} className="opacity-60" /> : <Moon size={14} className="opacity-60" />}
            </button>
            <button 
              onClick={() => setIsConfigOpen(true)}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                theme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}
            >
              <Settings size={14} className="opacity-60" />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="w-full max-w-4xl px-4 pt-4">
          <AnimatePresence mode="wait">
            {activeView === 'tuner' && (
              <motion.div
                key="tuner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                {/* Instrument Selector */}
                <div className={cn(
                  "flex p-1 rounded-2xl border mb-12 backdrop-blur-xl",
                  theme === 'dark' ? "bg-white/5 border-white/5 shadow-2xl" : "bg-black/5 border-black/5 shadow-lg"
                )}>
                  {instruments.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setInstrument(item.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-300",
                        instrument === item.id 
                          ? "text-white" 
                          : theme === 'dark' ? "text-white/40 hover:text-white/60" : "text-black/40 hover:text-black/60"
                      )}
                      style={instrument === item.id ? { 
                        backgroundColor: settings.accentColor,
                        boxShadow: `0 4px 12px ${settings.accentColor}4D`
                      } : {}}
                    >
                      <item.icon size={12} />
                      <span className="lowercase first-letter:uppercase">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className={cn(
                   "w-full flex flex-col items-center",
                   settings.layoutMode === 'horizontal' ? "lg:flex-row lg:items-start lg:justify-center lg:gap-20" : ""
                )}>
                  {/* Control Hub */}
                  <div className={cn(
                    "flex flex-col items-center gap-8",
                    settings.layoutMode === 'horizontal' ? "lg:pt-20" : ""
                  )}>
                    <div className="flex items-center gap-6 sm:gap-12">
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
                          Healing
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
                          {isActive ? (
                            <Mic size={32} className="text-white" />
                          ) : (
                            <MicOff size={32} className={cn(
                              "transition-all duration-300",
                              theme === 'dark' ? "text-white/20" : "text-black/20", 
                              "group-hover:text-emerald-500/80"
                            )} />
                          )}
                          
                          {isActive && (
                            <motion.div 
                              className="absolute -inset-2 rounded-full border border-white/20 border-t-white"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </motion.button>
                        <span className={cn(
                          "text-[9px] uppercase tracking-[0.2em] font-black transition-opacity",
                          isActive ? "opacity-100" : "opacity-30"
                        )} style={isActive ? { color: '#10b981' } : {}}>
                          {isActive ? "Engine Active" : "Ready"}
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
                          Standard
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visualization Station */}
                  <section className={cn(
                    "flex flex-col items-center gap-8 w-full max-w-xl",
                    settings.layoutMode === 'horizontal' ? "lg:max-w-md" : "mt-12"
                  )}>
                    <div className="w-full flex flex-col items-center gap-2">
                      <NeedleBar cents={pitchData?.cents ?? 0} active={!!pitchData} theme={theme} />
                    </div>
                    
                    <div className="relative group">
                      <GuitarHub 
                        currentNote={pitchData?.note ?? null} 
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

                <div className="mt-16 w-full flex flex-col items-center gap-6 border-t border-white/5 pt-12">
                  <div className="flex items-center gap-3">
                    <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: `${settings.accentColor}4D` }} />
                    <h3 className={cn(
                      "text-[10px] uppercase tracking-[0.3em] transition-opacity font-bold",
                      theme === 'dark' ? "opacity-40" : "opacity-60"
                    )}>
                      {instrument === '12string' ? '12-String' : instrument.charAt(0).toUpperCase() + instrument.slice(1)} Tuning Reference
                    </h3>
                    <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: `${settings.accentColor}4D` }} />
                  </div>
                  <ToneReference 
                    referenceA={referenceFreq} 
                    theme={theme} 
                    notes={getStrings()} 
                    accentColor={settings.accentColor}
                  />
                </div>
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
                  <h2 className="text-2xl font-bold tracking-tight">Studio Tempo</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Precision Timing Engine</p>
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
                <RiffLibrary theme={theme} category={instrument} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Professional Bottom Navigation (iOS Style) */}
        <nav className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-3xl border backdrop-blur-2xl z-50 transition-all shadow-2xl",
          theme === 'dark' ? "bg-black/60 border-white/10" : "bg-white/80 border-black/10"
        )}>
          {[
            { id: 'tuner', label: 'Tune Guitar', icon: Volume2 },
            { id: 'metronome', label: 'Tempo', icon: Clock },
            { id: 'riffs', label: 'Riffs', icon: LayoutGrid }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300",
                activeView === tab.id 
                  ? "text-white" 
                  : theme === 'dark' ? "text-white/30 hover:text-white/60" : "text-black/30 hover:text-black/60"
              )}
            >
              <tab.icon size={20} className={cn(
                "transition-transform",
                activeView === tab.id ? "scale-110" : ""
              )} />
              <span className="text-[9px] uppercase tracking-widest font-black">{tab.label}</span>
              
              {activeView === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-2xl z-[-1]"
                  style={{ backgroundColor: settings.accentColor }}
                />
              )}
            </button>
          ))}
        </nav>
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
  );
}
