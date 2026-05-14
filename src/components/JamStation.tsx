import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Music, Activity, Volume2, Clock, Lightbulb, Zap, Brain, RotateCcw } from 'lucide-react';
import { BACKING_TRACKS, BackingTrack } from '../constants';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';
import { RhythmHero } from './RhythmHero';

interface JamStationProps {
  theme: 'dark' | 'light';
  accentColor: string;
}

export const JamStation: React.FC<JamStationProps> = ({ theme, accentColor }) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<BackingTrack | null>(null);
  const [volume, setVolume] = useState(-12);
  const [mode, setMode] = useState<'tracks' | 'masterclass'>('tracks');
  
  const drumsRef = useRef<Tone.MembraneSynth | null>(null);
  const hihatRef = useRef<Tone.NoiseSynth | null>(null);
  const bassRef = useRef<Tone.MonoSynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);

  const RHYTHM_TIPS = [
    { title: "The Pocket", desc: "Staying exactly with the pulse. Feel the drum kick as your anchor.", icon: Zap },
    { title: "Ghost Strumming", desc: "Keep your hand moving in 16th notes even when you don't hit strings.", icon: Brain },
    { title: "Syncopation", desc: "Accent the 'and' (the off-beat) to create groove and movement.", icon: Activity },
    { title: "Subdivisions", desc: "Try counting 1-e-and-a for 16th notes to internalize fast passages.", icon: Clock }
  ];

  useEffect(() => {
    reverbRef.current = new Tone.Reverb({
      decay: 1.5,
      preDelay: 0.01,
      wet: 0.3
    }).toDestination();

    drumsRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' }
    }).connect(reverbRef.current);

    hihatRef.current = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
    }).connect(reverbRef.current);

    bassRef.current = new Tone.MonoSynth({
      oscillator: { type: 'fatsawtooth', count: 3, spread: 20 },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 },
      filter: { Q: 1, type: 'lowpass', rolloff: -24 },
      filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.8, baseFrequency: 200, octaves: 2.6 }
    }).connect(reverbRef.current);

    return () => {
      stopJam();
      drumsRef.current?.dispose();
      hihatRef.current?.dispose();
      bassRef.current?.dispose();
      reverbRef.current?.dispose();
    };
  }, []);

  const startJam = async (track: BackingTrack) => {
    await Tone.start();
    
    if (isPlaying && activeTrack?.id === track.id) {
      stopJam();
      return;
    }

    // Comprehensive stop before starting new vibe
    stopJam();
    
    setActiveTrack(track);
    setIsPlaying(true);
    
    Tone.Transport.bpm.value = track.bpm;
    Tone.getDestination().volume.rampTo(volume, 0.1);

    // Create a rhythmic loop
    const loop = new Tone.Loop((time) => {
      const beat = Tone.Transport.getTicksAtTime(time) / Tone.Transport.PPQ;
      const quarterBeat = Math.floor(beat % 4);

      // Kick drum on 1 and 3
      if (quarterBeat === 0 || quarterBeat === 2) {
        drumsRef.current?.triggerAttackRelease("C1", "8n", time);
      }

      // Hi-hat on every 8th note
      hihatRef.current?.triggerAttackRelease("8n", time, quarterBeat % 1 === 0 ? 0.1 : 0.05);

      // Bass progression logic
      const root = track.key.replace(/[0-9]/g, '') + '2';
      const chords = track.progression;
      const currentChord = chords[quarterBeat % chords.length];
      const baseNote = currentChord.replace(/[a-zA-Z]+/, (m) => m) + '2';

      // Bass line: root on 1, fifth on 3, occasional syncopation
      if (quarterBeat === 0) {
        bassRef.current?.triggerAttackRelease(baseNote, "4n", time);
      } else if (quarterBeat === 2) {
        const fifth = Tone.Frequency(baseNote).transpose(7).toNote();
        bassRef.current?.triggerAttackRelease(fifth, "8n", time);
      } else if (quarterBeat === 1.5 || quarterBeat === 3.5) {
        // Syncopated upbeat
         bassRef.current?.triggerAttackRelease(baseNote, "16n", time);
      }
    }, "4n").start(0);

    Tone.Transport.start();
  };

  const stopJam = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    // Explicitly release any ongoing notes
    bassRef.current?.triggerRelease();
    drumsRef.current?.triggerRelease();
    hihatRef.current?.triggerRelease();
    
    setIsPlaying(false);
    setActiveTrack(null);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    Tone.getDestination().volume.value = v;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center space-y-4">
        <h2 className={cn(
          "text-3xl font-black italic tracking-tighter uppercase",
          theme === 'dark' ? "text-white" : "text-emerald-950"
        )}>
          {t('jamStation')}
        </h2>
        
        {/* Mode Toggle */}
        <div className="flex justify-center gap-1 p-1 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10">
          <button
            onClick={() => setMode('tracks')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              mode === 'tracks' ? "bg-emerald-500 text-white shadow-lg" : "text-white/40 hover:text-white/60"
            )}
          >
            Backing Tracks
          </button>
          <button
            onClick={() => setMode('masterclass')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              mode === 'masterclass' ? "bg-emerald-500 text-white shadow-lg" : "text-white/40 hover:text-white/60"
            )}
          >
            Rhythm Masterclass
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'tracks' ? (
          <motion.div
            key="tracks"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BACKING_TRACKS.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "p-6 rounded-3xl border transition-all relative overflow-hidden group cursor-pointer",
                    activeTrack?.id === track.id
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : theme === 'dark' ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-black/5 border-black/10 hover:border-black/20"
                  )}
                  onClick={() => startJam(track)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10">
                          {track.style}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          {track.bpm} {t('bpm')} • {track.key}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white italic">{track.title}</h3>
                      <p className="text-xs text-white/50 leading-relaxed max-w-[240px]">
                        {track.description}
                      </p>
                    </div>

                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                      activeTrack?.id === track.id ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-white/10"
                    )}>
                      {activeTrack?.id === track.id ? (
                        <Square className="text-white fill-white" size={24} />
                      ) : (
                        <Play className="text-white fill-white translate-x-0.5" size={24} />
                      )}
                    </div>
                  </div>

                  {activeTrack?.id === track.id && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-1 bg-emerald-500"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {activeTrack && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-emerald-950 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="text-emerald-500 animate-pulse" size={24} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Now Jamming</span>
                    <h4 className="text-lg font-black text-white italic">{activeTrack.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-8 flex-1 min-w-[200px] justify-center">
                  <div className="flex items-center gap-3 w-full max-w-[200px]">
                    <Volume2 size={16} className="text-white/40" />
                    <input 
                      type="range" 
                      min="-40" 
                      max="0" 
                      value={volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={stopJam}
                  className="px-8 py-3 rounded-2xl bg-white text-emerald-950 font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {t('stopJam')}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="masterclass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 pb-20"
          >
            {/* Tips Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RHYTHM_TIPS.map((tip) => (
                <div key={tip.title} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <tip.icon className="text-emerald-500" size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-black italic uppercase tracking-tighter">{tip.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Game Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-emerald-500/20" />
                <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                  <RotateCcw size={14} className="animate-spin-slow" /> Rhythm Hero Game
                </div>
                <div className="h-[1px] flex-1 bg-emerald-500/20" />
              </div>
              
              <RhythmHero theme={theme} accentColor={accentColor} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
