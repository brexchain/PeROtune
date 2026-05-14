import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Layout, Save, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export interface StudioSettings {
  bgColor: string;
  accentColor: string;
  layoutMode: 'vertical' | 'horizontal';
  guitarRingColor: string;
}

interface LuthierConfigProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onUpdate: (settings: StudioSettings) => void;
  onReset: () => void;
  theme: 'dark' | 'light';
}

const PRESET_ACCENTS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#ffffff', '#000000'];
const PRESET_BGS = {
  dark: ['#0a0a0a', '#0f172a', '#1e1b4b', '#18181b', '#064e3b', '#2c3e50', '#000000', '#1a1c2c', '#330033'],
  light: ['#f5f2ed', '#f1f5f9', '#fafafa', '#fdf2f8', '#ecfdf5', '#fff9db', '#ffffff', '#e0f7fa', '#fce4ec']
};

export function LuthierConfig({ isOpen, onClose, settings, onUpdate, onReset, theme }: LuthierConfigProps) {
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 bottom-0 w-full max-w-sm z-[101] shadow-2xl flex flex-col",
              isDark ? "bg-[#0f0f0f] text-white" : "bg-white text-black"
            )}
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight">System Settings</h2>
                <span className="text-[10px] uppercase tracking-widest opacity-40">Prof. Amateur Park Player PWA</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Layout Mode */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Layout size={14} className="text-emerald-500" />
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Layout Engine</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['vertical', 'horizontal'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdate({ ...settings, layoutMode: mode })}
                      className={cn(
                        "p-3 rounded-xl border text-[10px] uppercase tracking-widest font-bold transition-all",
                        settings.layoutMode === mode 
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" 
                          : isDark ? "bg-white/5 border-white/5 hover:border-white/10" : "bg-black/5 border-black/5 hover:border-black/10"
                      )}
                      style={settings.layoutMode === mode ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </section>

              {/* Accent Color */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={14} className="text-emerald-500" />
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Visual Persona (Accent)</h3>
                </div>
                <div className="grid grid-cols-8 gap-2 mb-4">
                  {PRESET_ACCENTS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onUpdate({ ...settings, accentColor: color })}
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110",
                        settings.accentColor === color ? "border-emerald-500" : "border-transparent text-black"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={settings.accentColor} 
                    onChange={(e) => onUpdate({ ...settings, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={settings.accentColor}
                      onChange={(e) => onUpdate({ ...settings, accentColor: e.target.value })}
                      className={cn(
                        "w-full p-2 rounded-lg border font-mono text-xs",
                        isDark ? "bg-black/40 border-white/10" : "bg-white border-black/10"
                      )}
                    />
                  </div>
                </div>
              </section>

              {/* Background Color */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCcw size={14} className="text-emerald-500" />
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Park Ambience (Background)</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {PRESET_BGS[theme].map((color) => (
                    <button
                      key={color}
                      onClick={() => onUpdate({ ...settings, bgColor: color })}
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110",
                        settings.bgColor === color ? "border-emerald-500" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={settings.bgColor} 
                    onChange={(e) => onUpdate({ ...settings, bgColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={settings.bgColor}
                      onChange={(e) => onUpdate({ ...settings, bgColor: e.target.value })}
                      className={cn(
                        "w-full p-2 rounded-lg border font-mono text-xs",
                        isDark ? "bg-black/40 border-white/10" : "bg-white border-black/10"
                      )}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-white/10 flex flex-col gap-3">
              <button 
                onClick={onReset}
                className={cn(
                  "w-full py-2.5 rounded-lg border text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-all",
                  isDark ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20" : "bg-red-50/10 border-red-200 text-red-600 hover:bg-red-100"
                )}
              >
                <RefreshCcw size={12} />
                Restore Factory Defaults
              </button>
              <button 
                onClick={onClose}
                className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                style={{ backgroundColor: settings.accentColor, boxShadow: `0 4px 12px ${settings.accentColor}4D` }}
              >
                <Save size={14} />
                Confirm Layout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
