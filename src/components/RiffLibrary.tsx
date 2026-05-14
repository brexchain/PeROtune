import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, ArrowRight, Heart, Star, Play, X, ExternalLink, Zap, Compass } from 'lucide-react';
import { cn } from '../lib/utils';
import { RIFFS, InstrumentCategory, Riff } from '../constants';
import { useLanguage } from '../lib/i18n';

const RhythmTimeline = ({ pattern, activeIndex, isPlaying }: { pattern: string, activeIndex: number, isPlaying: boolean }) => {
  const tokens = pattern.replace(/\(Riff\)|\/|resonate/g, '').split(/\s+/).filter(t => t.trim().length > 0);
  
  const getNoteVal = (note: string) => {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const match = note.match(/^([A-G][#b]?)/i);
    if (!match) return -1;
    let n = match[1].toUpperCase();
    if (n === 'Db') n = 'C#';
    if (n === 'Eb') n = 'D#';
    if (n === 'Gb') n = 'F#';
    if (n === 'Ab') n = 'G#';
    if (n === 'Bb') n = 'A#';
    return names.indexOf(n);
  };

  return (
    <div className="flex gap-1.5 mt-3">
      {tokens.map((token, i) => {
        const isActive = isPlaying && activeIndex === i;
        
        // Calculate interval from previous note
        let intervalLabel = "";
        if (i > 0) {
            const currentVal = getNoteVal(token);
            const prevVal = getNoteVal(tokens[i-1]);
            if (currentVal >= 0 && prevVal >= 0) {
                const diff = Math.abs(currentVal - prevVal);
                if (diff === 1 || diff === 11) intervalLabel = "H"; // Half-tone
                if (diff === 2 || diff === 10) intervalLabel = "W"; // Whole-tone (Tone)
            }
        }

        return (
          <motion.div
            key={i}
            animate={{ 
              scale: isActive ? [1, 1.3, 1] : 1,
              backgroundColor: isActive ? '#10b981' : 'rgba(128, 128, 128, 0.2)',
              opacity: isActive ? 1 : 0.4
            }}
            transition={{ duration: 0.3 }}
            className="flex-1 h-3 rounded shadow-sm relative group flex items-center justify-center"
          >
             {intervalLabel && (
               <span className="text-[6px] font-black text-white/40 absolute -bottom-3">{intervalLabel}</span>
             )}
             {isActive && (
               <motion.div 
                 layoutId="active-indicator"
                 className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 rounded text-[9px] font-black text-white whitespace-nowrap shadow-xl z-50 capitalize"
               >
                 {token}
               </motion.div>
             )}
          </motion.div>
        );
      })}
    </div>
  );
};

export function RiffLibrary({ 
  theme = 'dark', 
  category = 'guitar', 
  onPlayRiff, 
  playingRiff,
  onCategoryChange,
  accentColor = '#10b981'
}: { 
  theme?: 'dark' | 'light', 
  category?: InstrumentCategory | 'all', 
  onPlayRiff?: (riff: Riff) => void, 
  playingRiff?: { id: string, activeIndex: number } | null,
  onCategoryChange?: (category: InstrumentCategory) => void,
  accentColor?: string
}) {
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('perotuner-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('perotuner-hidden-riffs');
    return saved ? JSON.parse(saved) : [];
  });

  const [visibleCount, setVisibleCount] = useState(10);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const baseRiffs = category === 'all' 
    ? RIFFS 
    : RIFFS.filter(r => r.category === category);

  const filteredRiffs = baseRiffs.filter(r => !hiddenIds.includes(r.id));
    
  const pagedRiffs = filteredRiffs.slice(0, visibleCount);
  const favoriteRiffs = RIFFS.filter(r => favorites.includes(r.id) && !hiddenIds.includes(r.id));

  useEffect(() => {
    localStorage.setItem('perotuner-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('perotuner-hidden-riffs', JSON.stringify(hiddenIds));
  }, [hiddenIds]);

  useEffect(() => {
    // Reset count when category changes
    setVisibleCount(10);
  }, [category]);

  useEffect(() => {
    if (!containerRef.current || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, filteredRiffs.length));
        }
      },
      { 
        root: containerRef.current,
        rootMargin: '0px 400px 0px 0px', // Trigger when 400px away from the right edge
        threshold: 0 
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [category, visibleCount, filteredRiffs.length]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleFlip = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFlippedIds(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const hideRiff = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHiddenIds(prev => [...prev, id]);
  };

  return (
    <div className="w-full pb-20">
      {/* Favorites Section */}
      <AnimatePresence>
        {favoriteRiffs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 mb-8 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <h3 className={cn(
                "text-[10px] uppercase tracking-[0.3em] font-bold transition-colors",
                isDark ? "text-white/80" : "text-black/80"
              )}>{t('favorites')}</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {favoriteRiffs.map((riff) => {
                const isFlipped = flippedIds.includes(riff.id);
                return (
                  <div key={`fav-container-${riff.id}`} style={{ perspective: "1000px" }}>
                    <motion.div 
                      layoutId={`riff-${riff.id}`}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className={cn(
                        "group p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative h-[360px]",
                        isDark 
                          ? "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" 
                          : "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 shadow-sm"
                      )}
                      onClick={(e) => toggleFlip(e, riff.id)}
                    >
                      {/* Front Side */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                        <div className="absolute top-0 right-0 p-4 flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onPlayRiff) onPlayRiff(riff);
                            }}
                            className="p-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                            title={t('referenceReady')}
                          >
                            <Play size={18} />
                          </button>
                          <button 
                            onClick={(e) => toggleFavorite(e, riff.id)}
                            className="p-2.5 rounded-full hover:bg-black/10 transition-colors"
                          >
                            <Heart size={18} className={cn(favorites.includes(riff.id) ? "fill-emerald-500 text-emerald-500" : "text-emerald-500/40")} />
                          </button>
                          <button 
                            onClick={(e) => hideRiff(e, riff.id)}
                            className="p-2.5 rounded-full hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-colors"
                            title={t('removeLibrary')}
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-emerald-500/50 block mb-1">
                            #{String(filteredRiffs.findIndex(r => r.id === riff.id) + 1).padStart(3, '0')}
                          </span>
                          <h4 className={cn(
                            "text-xl font-bold mb-3 transition-colors",
                            isDark ? "text-white" : "text-black"
                          )}>{t(riff.id as any, riff.title)}</h4>
                          
                          <div className="space-y-3 mb-6">
                            {riff.nashvilleNumbers && (
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-emerald-500/40 font-black">Nashville Numbers</span>
                                <span className={cn(
                                  "text-2xl font-mono font-black italic tracking-tighter leading-none",
                                  isDark ? "text-emerald-400" : "text-emerald-600"
                                )}>
                                  {riff.nashvilleNumbers}
                                </span>
                              </div>
                            )}
                            {riff.chords && (
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-white/20 font-black">{t('progression' as any, 'Progression')}</span>
                                <span className={cn(
                                  "text-lg font-black tracking-tight leading-tight",
                                  isDark ? "text-white/90" : "text-black/90"
                                )}>
                                  {riff.chords}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={cn(
                          "inline-flex px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 self-start"
                        )}>
                          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase font-black">
                            {riff.pattern}
                          </span>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className={cn(
                        "absolute inset-0 p-8 flex flex-col items-center justify-center text-center rounded-3xl",
                        isDark ? "bg-emerald-950/95" : "bg-emerald-900 shadow-2xl"
                      )} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <div className="absolute top-4 left-4">
                           <Star size={16} className="text-amber-400 fill-amber-400 opacity-30" />
                        </div>
                        
                        <div className="flex flex-col gap-6 w-full">
                          {(riff.lyrics || riff.refrain) && (
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase tracking-[0.4em] text-emerald-500/40 font-black">{t('famousLyrics')}</span>
                              <p className="text-lg font-black italic text-white leading-tight underline decoration-emerald-500/30 underline-offset-4 line-clamp-4">
                                "{riff.lyrics || riff.refrain}"
                              </p>
                            </div>
                          )}
                          
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-[0.4em] text-emerald-500/40 font-black">{t('focusTip')}</span>
                            <p className="text-xs text-white/50 leading-relaxed font-medium px-4 line-clamp-3">
                              {t((riff.id + 'Desc') as any, riff.description)}
                            </p>
                          </div>

                          <div className="mt-2">
                             <a 
                                href={`https://www.google.com/search?q=${encodeURIComponent(riff.title + " chords and lyrics")}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-emerald-900 hover:border-white transition-all shadow-lg"
                             >
                                <Compass size={14} className="group-hover/btn:rotate-45 transition-transform" />
                                {t('googleSearch')}
                             </a>
                          </div>
                        </div>

                        <div className="absolute bottom-6 flex gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Library - Horizontal Scrolling with Lazy Load */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <Music size={14} className="text-emerald-400" />
          <h3 className={cn(
            "text-[10px] uppercase tracking-[0.3em] transition-colors",
            isDark ? "text-white/60" : "text-black/60"
          )}>{t('library')}</h3>
        </div>
        
        <div 
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-10 scrollbar-none snap-x snap-mandatory px-0.5"
        >
          {filteredRiffs.map((riff) => {
             const isFlipped = flippedIds.includes(riff.id);
             return (
              <div key={`container-${riff.id}`} style={{ perspective: "1000px" }}>
                <motion.div 
                  layoutId={favorites.includes(riff.id) ? undefined : `riff-${riff.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={cn(
                    "group min-w-[320px] sm:min-w-[380px] h-[360px] rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between snap-center relative",
                    isDark 
                      ? "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10" 
                      : "bg-black/[0.03] border-black/5 hover:bg-black/[0.06] hover:border-black/10 shadow-lg"
                  )}
                  onClick={(e) => toggleFlip(e, riff.id)}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                    <div className="absolute top-6 right-6 z-10 flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onPlayRiff) onPlayRiff(riff);
                        }}
                        className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-all duration-300"
                        title="Play Preview"
                      >
                        <Play size={20} />
                      </button>
                      <button 
                        onClick={(e) => toggleFavorite(e, riff.id)}
                        className={cn(
                          "p-3 rounded-2xl transition-all duration-300",
                          favorites.includes(riff.id) 
                            ? "bg-emerald-500/20 text-emerald-500" 
                            : isDark ? "bg-white/5 text-white/20 hover:text-white/60" : "bg-black/5 text-black/20 hover:text-black/60"
                        )}
                      >
                        <Heart size={20} className={cn(favorites.includes(riff.id) && "fill-current")} />
                      </button>
                      <button 
                        onClick={(e) => hideRiff(e, riff.id)}
                        className={cn(
                          "p-3 rounded-2xl transition-all duration-300 group/close hover:bg-red-500/10",
                          isDark ? "bg-white/5 text-white/20" : "bg-black/5 text-black/20"
                        )}
                      >
                        <X size={20} className="group-hover/close:text-red-500" />
                      </button>
                    </div>

                    <div className="mb-10">
                          <div className="flex flex-col mb-4 pr-12">
                            <span className="text-[10px] font-mono text-emerald-400/50 mb-2">
                              #{String(filteredRiffs.indexOf(riff) + 1).padStart(3, '0')}
                            </span>
                            <h4 className={cn(
                            "text-2xl font-black transition-colors tracking-tight",
                            isDark ? "text-white" : "text-black"
                          )}>{t(riff.id as any, riff.title)}</h4>
                          </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {riff.chords && (
                          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                            {riff.chords}
                          </div>
                        )}
                        {riff.nashvilleNumbers && (
                          <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
                            {riff.nashvilleNumbers}
                          </div>
                        )}
                      </div>

                      <p className={cn(
                        "text-sm leading-relaxed transition-colors mb-4 line-clamp-2",
                        isDark ? "text-white/40" : "text-black/50"
                      )}>
                        {t((riff.id + 'Desc') as any, riff.description)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col gap-1 flex-1 pr-4">
                        <div className={cn(
                          "inline-flex px-4 py-2 rounded-2xl border transition-colors self-start",
                          isDark ? "bg-black/40 border-white/5" : "bg-white border-black/5 shadow-md"
                        )}>
                          <span className="text-[10px] font-mono text-emerald-400 tracking-[0.2em] uppercase font-black">
                            {riff.pattern}
                          </span>
                        </div>
                        <RhythmTimeline 
                          pattern={riff.pattern} 
                          activeIndex={playingRiff?.activeIndex ?? 0} 
                          isPlaying={playingRiff?.id === riff.id} 
                        />
                      </div>
                      <div className={cn(
                        "p-3 rounded-full transition-colors",
                        isDark ? "bg-white/5" : "bg-black/5"
                      )}>
                        <ArrowRight size={18} className="text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className={cn(
                    "absolute inset-0 p-10 flex flex-col items-center justify-center text-center rounded-[2rem]",
                    isDark ? "bg-emerald-950/95" : "bg-emerald-900 border border-emerald-500/20 shadow-2xl"
                  )} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <div className="absolute top-8 left-8 opacity-20">
                      <Music className="text-emerald-400" size={40} />
                    </div>
                    
                    <div className="flex flex-col gap-8 w-full max-w-[320px]">
                      {(riff.lyrics || riff.refrain) ? (
                        <div className="space-y-3">
                          <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] mb-2">{t('famousLyrics')}</h4>
                          <p className="text-xl sm:text-2xl font-black italic underline decoration-emerald-500/30 underline-offset-8 leading-tight text-white mb-4 line-clamp-5">
                            "{riff.lyrics || riff.refrain}"
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <Music className="text-white/20 mx-auto" size={56} />
                           <p className="text-xl font-black text-white/70 italic leading-snug line-clamp-4">"{riff.description}"</p>
                        </div>
                      )}

                      <div className="mt-4">
                         <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(riff.title + " chords and lyrics")}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group/btn inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-[12px] font-black uppercase tracking-widest hover:bg-white hover:text-emerald-900 hover:border-white transition-all shadow-xl"
                         >
                            <Compass size={16} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                            {t('googleSearch')}
                         </a>
                      </div>
                    </div>

                    <div className="mt-10 flex items-center gap-4">
                       <ArrowRight className="text-emerald-500/50 rotate-180" size={24} />
                       <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30">{t('tapToReturn')}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
          
          {/* Intersection Sentinel */}
          {visibleCount < filteredRiffs.length && (
            <div 
              ref={sentinelRef}
              className="min-w-[100px] flex items-center justify-center opacity-20"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Music size={24} />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Global Library Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-6 mt-12 pb-20"
      >
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className={cn(
                "text-2xl font-black italic uppercase tracking-wider mb-1 transition-colors",
                isDark ? "text-white" : "text-black"
              )}>{t('exploreAll')}</h3>
              <p className={cn("text-[10px] uppercase tracking-[0.3em] font-bold opacity-40", isDark ? "text-white" : "text-black")}>
                {t('fullStudio')} {category === 'all' ? 'Studio' : (category === 'guitar' ? t('guitar') : (category === '12string' ? t('twelveString') : t('ukulele')))}
              </p>
           </div>
           <div className={cn(
             "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
             isDark ? "bg-white/5 border-white/10 text-white/40" : "bg-black/5 border-black/10 text-black/40"
           )}>
             {filteredRiffs.length} {t('items')}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRiffs.map((riff, idx) => {
            const isFlipped = flippedIds.includes(riff.id);
            return (
              <div key={`vertical-${riff.id}`} style={{ perspective: "1000px" }}>
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={cn(
                    "group relative h-[320px] rounded-3xl border transition-all cursor-pointer",
                    isDark 
                      ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]" 
                      : "bg-white border-black/5 hover:shadow-xl"
                  )}
                  onClick={(e) => toggleFlip(e, riff.id)}
                >
                  {/* Front */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onPlayRiff) onPlayRiff(riff);
                        }}
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                       >
                         <Play size={14} />
                       </button>
                       <button 
                        onClick={(e) => toggleFavorite(e, riff.id)}
                        className={cn(
                          "p-2 rounded-xl border transition-all",
                          favorites.includes(riff.id) 
                            ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-500" 
                            : isDark ? "bg-white/5 border-white/5 text-white/20" : "bg-black/5 border-black/5 text-black/20"
                        )}
                       >
                         <Heart size={14} className={cn(favorites.includes(riff.id) && "fill-current")} />
                       </button>
                       <button 
                        onClick={(e) => hideRiff(e, riff.id)}
                        className="p-2 rounded-xl hover:bg-red-500/10 text-red-500/20 hover:text-red-500 transition-all"
                       >
                         <X size={14} />
                       </button>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-500/50 mb-1 block">#{String(idx + 1).padStart(3, '0')}</span>
                      <h4 className={cn("text-xl font-black tracking-tight mb-3", isDark ? "text-white" : "text-black")}>
                        {t(riff.id as any, riff.title)}
                      </h4>
                      
                      <div className="space-y-3 mb-6">
                        {riff.nashvilleNumbers && (
                          <div className="flex flex-col">
                             <span className="text-[9px] uppercase tracking-widest text-emerald-500/40 font-black">{t('nashville')}</span>
                             <span className="text-xl font-mono font-black italic text-emerald-400 tracking-tighter line-clamp-1 leading-none">{riff.nashvilleNumbers}</span>
                          </div>
                        )}
                        {riff.chords && (
                          <div className="flex flex-col">
                             <span className="text-[9px] uppercase tracking-widest text-white/20 font-black">{t('progression' as any, 'Progression')}</span>
                             <span className="text-base font-black text-white/80 line-clamp-1 leading-tight">{riff.chords}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/30 line-clamp-1 leading-relaxed italic">{t((riff.id + 'Desc') as any, riff.description)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex-1 pr-3">
                          <div className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[10px] font-black font-mono text-emerald-400 self-start inline-block">
                            {riff.pattern}
                          </div>
                          <RhythmTimeline 
                            pattern={riff.pattern} 
                            activeIndex={playingRiff?.activeIndex ?? 0} 
                            isPlaying={playingRiff?.id === riff.id} 
                          />
                       </div>
                       <ArrowRight size={14} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>

                  {/* Back */}
                  <div className={cn(
                    "absolute inset-0 p-6 flex flex-col items-center justify-center text-center rounded-3xl",
                    isDark ? "bg-emerald-950/95" : "bg-emerald-900 shadow-2xl"
                  )} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <div className="flex flex-col gap-6 w-full">
                       {(riff.lyrics || riff.refrain) && (
                         <div className="space-y-2">
                           <span className="text-[9px] uppercase tracking-[0.4em] text-emerald-500/40 font-black">{t('famousLyrics')}</span>
                           <p className="text-lg font-black italic text-white leading-tight underline decoration-emerald-500/30 underline-offset-4 line-clamp-3">
                             "{riff.lyrics || riff.refrain}"
                           </p>
                         </div>
                       )}
                       <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-[0.4em] text-emerald-500/40 font-black">{t('guitaristTip')}</span>
                          <p className="text-xs font-bold text-white/30 leading-snug px-2 line-clamp-2 italic">"{t((riff.id + 'Desc') as any, riff.description)}"</p>
                       </div>

                           <div className="mt-2">
                             <a 
                                href={`https://www.google.com/search?q=${encodeURIComponent(riff.title + " chords and lyrics")}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-emerald-900 transition-all mx-auto w-fit shadow-lg"
                             >
                                <Compass size={14} className="group-hover/btn:rotate-45 transition-transform" />
                                {t('googleSearch')}
                             </a>
                           </div>
                    </div>
                    <div className="absolute bottom-6 pt-4 border-t border-white/5 w-[80%]">
                       <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest leading-none">Reference Ready</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Scroll Sentinel */}
      {visibleCount < filteredRiffs.length && (
        <div ref={sentinelRef} className="h-10 w-full" />
      )}
    </div>
  );
}
