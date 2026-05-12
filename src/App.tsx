/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Settings, Zap, Moon, Sun, Music, Compass, Layout } from 'lucide-react';
import { usePitchDetection } from './hooks/usePitchDetection';
import { GuitarHub } from './components/GuitarHub';
import { NeedleBar } from './components/NeedleBar';
import { ToneReference } from './components/ToneReference';
import { RiffLibrary } from './components/RiffLibrary';
import { LuthierConfig, StudioSettings } from './components/LuthierConfig';
import { cn } from './lib/utils';
import { GUITAR_STRINGS, UKULELE_STRINGS, TWELVE_STRING_STRINGS, InstrumentCategory } from './constants';

const DEFAULT_SETTINGS: StudioSettings = {
  bgColor: '#0a0a0a',
  accentColor: '#10b981',
  layoutMode: 'vertical',
  guitarRingColor: 'rgba(255,255,255,0.05)'
};

export default function App() {
  const [referenceFreq, setReferenceFreq] = useState(440);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [instrument, setInstrument] = useState<InstrumentCategory>('guitar');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  const [settings, setSettings] = useState<StudioSettings>(() => {
    const saved = localStorage.getItem('perotuner-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('perotuner-settings', JSON.stringify(settings));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.bgColor);
  }, [settings]);

  // Sync background color when theme changes if it matches one of the presets
  useEffect(() => {
    const defaultBg = theme === 'dark' ? '#0a0a0a' : '#f5f2ed';
    setSettings(prev => ({ ...prev, bgColor: defaultBg }));
  }, [theme]);

  const { pitchData, isActive, start, stop } = usePitchDetection(referenceFreq);

  const toggleReference = () => {
    setReferenceFreq(prev => prev === 440 ? 432 : 440);
  };

  const getStrings = () => {
    switch (instrument) {
      case 'ukulele': return UKULELE_STRINGS;
      case '12string': return TWELVE_STRING_STRINGS;
      default: return GUITAR_STRINGS;
    }
  };

  const instruments: { id: InstrumentCategory; label: string; icon: any }[] = [
    { id: 'guitar', label: '6-String', icon: Music },
    { id: '12string', label: '12-String', icon: Zap },
    { id: 'ukulele', label: 'Ukulele', icon: Compass },
  ];

  return (
    <div className={cn(
      "min-h-screen w-full transition-colors duration-700 font-sans selection:bg-emerald-500/30 overflow-x-hidden",
      theme === 'dark' ? "text-white" : "text-[#1a1a1a]"
    )} style={{ backgroundColor: settings.bgColor }}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px] transition-colors duration-1000"
        )} style={{ backgroundColor: settings.accentColor }} />
        <div className={cn(
          "absolute top-[60%] -right-[10%] w-[30%] h-[50%] rounded-full opacity-5 blur-[100px] transition-colors duration-1000",
          theme === 'dark' ? "bg-blue-500" : "bg-emerald-200"
        )} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Header Controls */}
        <header className="w-full max-w-4xl flex justify-between items-center p-6 mb-4">
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
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2 rounded-full transition-colors",
                theme === 'dark' ? "hover:bg-white/5 text-white" : "hover:bg-black/5 text-black"
              )}
            >
              {theme === 'dark' ? <Sun size={18} className="opacity-60" /> : <Moon size={18} className="opacity-60" />}
            </button>
            <button 
              onClick={() => setIsConfigOpen(true)}
              className={cn(
                "p-2 rounded-full transition-colors",
                theme === 'dark' ? "hover:bg-white/5 text-white" : "hover:bg-black/5 text-black"
              )}
            >
              <Settings size={18} className="opacity-60" />
            </button>
          </div>
        </header>

        {/* Instrument Selector Tab */}
        <div className="flex justify-center mb-10 w-full max-w-md px-6">
          <div className={cn(
            "flex w-full p-1 rounded-2xl border transition-all",
            theme === 'dark' ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
          )}>
            {instruments.map((item) => (
              <button
                key={item.id}
                onClick={() => setInstrument(item.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest font-bold transition-all",
                  instrument === item.id 
                    ? "text-white shadow-lg" 
                    : theme === 'dark' ? "text-white/40 hover:text-white/60" : "text-black/40 hover:text-black/60"
                )}
                style={instrument === item.id ? { 
                  backgroundColor: settings.accentColor,
                  boxShadow: `0 4px 12px ${settings.accentColor}4D`
                } : {}}
              >
                <item.icon size={12} />
                <span className="text-[10px] lowercase first-letter:uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Tuning Hub */}
        <main className="flex flex-col items-center w-full gap-4 pb-24">
          <div className={cn(
             "w-full px-6 flex flex-col items-center",
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
                        ? "scale-110 shadow-[0_0_50px_rgba(0,0,0,0.1)]" 
                        : theme === 'dark' 
                          ? "bg-white/5 border border-white/5 hover:border-white/20 shadow-xl"
                          : "bg-black/5 border border-black/5 hover:border-black/10 shadow-lg"
                    )}
                    style={isActive ? { backgroundColor: settings.accentColor, boxShadow: `0 0 50px ${settings.accentColor}4D` } : {}}
                  >
                    {isActive ? (
                      <Mic size={32} className={theme === 'dark' ? "text-black" : "text-white"} />
                    ) : (
                      <MicOff size={32} className={cn(
                        "transition-opacity",
                        theme === 'dark' ? "text-white/20" : "text-black/20", 
                        "group-hover:opacity-60"
                      )} />
                    )}
                    
                    {isActive && (
                      <motion.div 
                        className="absolute -inset-2 rounded-full border border-black/10 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.button>
                  <span className={cn(
                    "text-[9px] uppercase tracking-[0.2em] font-black transition-opacity",
                    isActive ? "opacity-100" : "opacity-30"
                  )} style={isActive ? { color: settings.accentColor } : {}}>
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
              settings.layoutMode === 'horizontal' ? "lg:max-w-md" : ""
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

          {/* Reference Tones Box */}
          <section className={cn(
            "w-full max-w-4xl flex flex-col items-center gap-6 py-12 mt-8 rounded-[40px] px-8",
            theme === 'dark' ? "bg-white/[0.02]" : "bg-black/[0.02]"
          )}>
            <div className="flex flex-col items-center gap-1">
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
          </section>

          <div className="mt-12 w-full max-w-4xl">
            <RiffLibrary theme={theme} category={instrument} />
          </div>
        </main>
      </div>

      <LuthierConfig 
        theme={theme}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        settings={settings}
        onUpdate={setSettings}
      />

      {/* Floating Footer Meta */}
      <footer className="fixed bottom-6 w-full px-8 flex justify-between items-center pointer-events-none z-50">
        <div className="flex flex-col gap-1.5 focus:outline-none">
          <div className={cn(
            "flex items-center gap-2 transition-opacity",
            theme === 'dark' ? "opacity-20" : "opacity-40"
          )}>
            <Zap size={10} />
            <span className="text-[8px] font-mono uppercase tracking-widest">Low Latency YIN Engine</span>
          </div>
          <div className={cn(
            "flex items-center gap-2 transition-opacity",
            theme === 'dark' ? "opacity-20" : "opacity-40"
          )}>
            <Settings size={10} />
            <span className="text-[8px] font-mono uppercase tracking-widest">Calibration: ±0.1c</span>
          </div>
        </div>
        
        <div className={cn(
          "text-[8px] font-mono uppercase tracking-[0.5em] transition-opacity",
          theme === 'dark' ? "opacity-10" : "opacity-30"
        )}>
          v1.1 Stable Build
        </div>
      </footer>
    </div>
  );
}
