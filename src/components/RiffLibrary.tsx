import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, ArrowRight, Heart, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { RIFFS, InstrumentCategory } from '../constants';

export function RiffLibrary({ theme = 'dark', category = 'guitar' }: { theme?: 'dark' | 'light', category?: InstrumentCategory }) {
  const isDark = theme === 'dark';
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('perotuner-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredRiffs = category === 'all' 
    ? RIFFS 
    : RIFFS.filter(r => r.category === category);
    
  const pagedRiffs = filteredRiffs.slice(0, visibleCount);
  const favoriteRiffs = RIFFS.filter(r => favorites.includes(r.id));

  useEffect(() => {
    localStorage.setItem('perotuner-favorites', JSON.stringify(favorites));
  }, [favorites]);

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
              )}>Quick Access Favorites</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favoriteRiffs.map((riff) => (
                <motion.div 
                  layoutId={`riff-${riff.id}`}
                  key={`fav-${riff.id}`}
                  className={cn(
                    "group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden",
                    isDark 
                      ? "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" 
                      : "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                  )}
                >
                  <div className="absolute top-0 right-0 p-2">
                    <button 
                      onClick={(e) => toggleFavorite(e, riff.id)}
                      className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
                    >
                      <Heart size={14} className="fill-emerald-500 text-emerald-500" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-emerald-500/50 block mb-1">
                      #{String(filteredRiffs.findIndex(r => r.id === riff.id) + 1).padStart(3, '0')}
                    </span>
                    <h4 className={cn(
                      "text-sm font-bold mb-1 transition-colors",
                      isDark ? "text-white" : "text-black"
                    )}>{riff.title}</h4>
                    <p className={cn(
                      "text-[10px] leading-relaxed line-clamp-1 opacity-60 mb-1",
                      isDark ? "text-white" : "text-black"
                    )}>
                      {riff.description}
                    </p>
                    {riff.chords && (
                      <div className="text-[8px] font-bold text-emerald-500/70 uppercase tracking-wider mb-3">
                        {riff.chords}
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "inline-flex px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 self-start"
                  )}>
                    <span className="text-[9px] font-mono text-emerald-400 tracking-widest uppercase font-bold">
                      {riff.pattern}
                    </span>
                  </div>
                </motion.div>
              ))}
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
          )}>Pro Riff Library</h3>
        </div>
        
        <div 
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory px-0.5"
        >
          {pagedRiffs.map((riff) => (
            <motion.div 
              layoutId={favorites.includes(riff.id) ? undefined : `riff-${riff.id}`}
              key={riff.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "group min-w-[280px] p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between snap-center relative",
                isDark 
                  ? "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10" 
                  : "bg-black/[0.03] border-black/5 hover:bg-black/[0.06] hover:border-black/10 shadow-sm"
              )}
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => toggleFavorite(e, riff.id)}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    favorites.includes(riff.id) 
                      ? "bg-emerald-500/20 text-emerald-500" 
                      : isDark ? "bg-white/5 text-white/20 hover:text-white/60" : "bg-black/5 text-black/20 hover:text-black/60"
                  )}
                >
                  <Heart size={16} className={cn(favorites.includes(riff.id) && "fill-current")} />
                </button>
              </div>

              <div className="mb-8">
                <div className="flex flex-col mb-2 pr-10">
                  <span className="text-[9px] font-mono text-emerald-400/50 mb-1">
                    #{String(filteredRiffs.indexOf(riff) + 1).padStart(3, '0')}
                  </span>
                  <h4 className={cn(
                    "text-base font-bold transition-colors",
                    isDark ? "text-white/90" : "text-black/90"
                  )}>{riff.title}</h4>
                </div>
                <p className={cn(
                   "text-xs leading-relaxed line-clamp-2 transition-colors mb-2",
                  isDark ? "text-white/40" : "text-black/50"
                )}>
                  {riff.description}
                </p>
                {riff.chords && (
                  <div className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-widest">
                    {riff.chords}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className={cn(
                  "inline-flex px-4 py-1.5 rounded-xl border transition-colors",
                  isDark ? "bg-black/40 border-white/5" : "bg-white/80 border-black/5 shadow-sm"
                )}>
                  <span className="text-[10px] font-mono text-emerald-400 tracking-[0.2em] uppercase font-black">
                    {riff.pattern}
                  </span>
                </div>
                <div className={cn(
                  "p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100",
                  isDark ? "bg-white/5" : "bg-black/5"
                )}>
                  <ArrowRight size={14} className="text-emerald-400" />
                </div>
              </div>
            </motion.div>
          ))}
          
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
    </div>
  );
}
