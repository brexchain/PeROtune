import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { CircleOfFifths } from './CircleOfFifths';
import { cn } from '../lib/utils';

interface FeedbackSectionProps {
  theme: 'dark' | 'light';
  accentColor: string;
}

export function FeedbackSection({ theme, accentColor }: FeedbackSectionProps) {
  const [feedback, setFeedback] = useState('');
  const [isSent, setIsSent] = useState(false);
  const isDark = theme === 'dark';

  const quickFeedback = [
    { label: "Love the UI!", text: "This UI is slicker than a fresh set of Elixirs! Love the Harmonic Engine. 🎸" },
    { label: "Needle Sensitivity", text: "The needle is super sensitive! Maybe add a 'Smoothing' mode for easier tuning? 🎯" },
    { label: "More Tunings", text: "Great app! Would love to see more obscure alternate tunings in the Luthier config. 🛠️" },
    { label: "Funny", text: "My guitar is finally in tune, but my playing still sounds like a bag of cats. Can you fix that in the next update? 🐱" },
    { label: "The Neighbor", text: "This app tuned my guitar so well my neighbor finally stopped complaining. 5 stars! ⭐" }
  ];

  const handleWhatsAppSend = () => {
    if (!feedback.trim()) return;
    
    setIsSent(true);
    const phoneNumber = '436508278461';
    const message = encodeURIComponent(`PeROtuner Feedback:\n\n${feedback}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Smooth transition before opening
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFeedback('');
      setTimeout(() => setIsSent(false), 3000); // Reset after 3 seconds
    }, 400);
  };

  return (
    <section className="w-full mt-32 mb-16 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Decorative Guitar End / Circle of Fifths */}
        <div className="relative w-full flex flex-col items-center mb-12">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-32 bg-gradient-to-b from-transparent via-current opacity-[0.03] pointer-events-none rounded-full" />
           
           <div className="relative group w-64 h-64 sm:w-80 sm:h-80">
              {/* Bridge impression */}
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-12 rounded-full blur-3xl opacity-10 transition-all group-hover:opacity-20",
                isDark ? "bg-white" : "bg-black"
              )} />
              
              {/* Bridge Plate */}
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-4 rounded-full border border-current opacity-5",
                isDark ? "opacity-10" : "opacity-5"
              )} />

              {/* Decorative Pins */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-around px-4 opacity-20 pointer-events-none">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
                ))}
              </div>
              
              <CircleOfFifths 
                activeNote={null} 
                accentColor={accentColor} 
                theme={theme} 
                isLarge={true} 
              />
           </div>
           
           <div className="mt-8 flex flex-col items-center gap-2">
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Sonic Feedback</h3>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Help shape the harmonic engine</p>
           </div>
        </div>

        {/* Feedback Input Card */}
        <div className={cn(
          "w-full max-w-lg rounded-[2.5rem] p-8 border backdrop-blur-xl transition-all duration-500",
          isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5",
          isSent ? "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]" : ""
        )}>
          {/* Quick Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {quickFeedback.map((chip, i) => (
              <button
                key={i}
                onClick={() => setFeedback(chip.text)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all hover:scale-105 active:scale-95",
                  feedback === chip.text 
                    ? "bg-emerald-500 border-emerald-500 text-white" 
                    : isDark ? "border-white/10 text-white/40 hover:border-white/30 hover:text-white/60" : "border-black/10 text-black/40 hover:border-black/30 hover:text-black/60"
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What works? What could be better? Share your thoughts..."
                className={cn(
                  "w-full bg-transparent border-none focus:ring-0 text-sm min-h-[120px] resize-none pb-8 transition-colors",
                  isDark ? "text-white placeholder:text-white/20" : "text-black placeholder:text-black/20"
                )}
              />
              <div className="absolute bottom-2 right-2 opacity-20 text-[10px] font-mono">
                {feedback.length} chars
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-current/5">
              <div className="flex items-center gap-2 opacity-40">
                <MessageCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Connect via WhatsApp</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppSend}
                disabled={!feedback.trim() || isSent}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500",
                  isSent 
                    ? "bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.4)]" 
                    : feedback.trim() 
                      ? "bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/20" 
                      : isDark ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-black/5 text-black/20 cursor-not-allowed"
                )}
              >
                {isSent ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Transmitted</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className={cn("transition-transform", feedback.trim() ? "group-hover:translate-x-1 group-hover:-translate-y-1" : "")} />
                    <span>Transmit Feedback</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-12 opacity-20 flex items-center gap-4">
           <div className="h-px w-8 bg-current" />
           <span className="text-[8px] font-black uppercase tracking-[0.5em]">+43 650 8278461</span>
           <div className="h-px w-8 bg-current" />
        </div>
      </div>
    </section>
  );
}
