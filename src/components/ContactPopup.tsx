import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

import { useLanguage } from '../lib/i18n';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  accentColor: string;
}

export function ContactPopup({ isOpen, onClose, theme, accentColor }: ContactPopupProps) {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState('');
  const [isSent, setIsSent] = useState(false);
  const isDark = theme === 'dark';

  const quickFeedback = [
    { label: t('fb1Lab'), text: t('fb1Txt') },
    { label: t('fb2Lab'), text: t('fb2Txt') },
    { label: t('fb3Lab'), text: t('fb3Txt') },
    { label: t('fb4Lab'), text: t('fb4Txt') },
    { label: t('fb5Lab'), text: t('fb5Txt') }
  ];

  const handleWhatsAppSend = () => {
    if (!feedback.trim()) return;
    
    setIsSent(true);
    const phoneNumber = '436508278461';
    const message = encodeURIComponent(`PeROtuner Pro Feedback:\n\n${feedback}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFeedback('');
      setIsSent(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md p-6 rounded-[2.5rem] border z-[101] shadow-2xl overflow-hidden",
              isDark ? "bg-black/90 border-white/10" : "bg-white/95 border-black/10"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl bg-emerald-500/10 text-emerald-500"
                )}>
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tighter italic">{t('contactTitle')}</h3>
                  <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">{t('contactDesc')}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:opacity-100 opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Reasons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {quickFeedback.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setFeedback(prev => prev ? `${prev}\n${chip.text}` : chip.text)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all hover:scale-105 active:scale-95 flex items-center gap-1",
                    isDark ? "border-white/10 text-white/60 bg-white/5" : "border-black/10 text-black/60 bg-black/5"
                  )}
                >
                  <ChevronRight size={8} />
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <div className={cn(
              "relative rounded-2xl p-4 border transition-all duration-300 mb-6",
              isDark ? "bg-white/5 border-white/10 focus-within:border-white/30" : "bg-black/5 border-black/10 focus-within:border-black/30",
              feedback.trim() ? "border-emerald-500/30" : ""
            )}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t('placeholderFeedback')}
                className={cn(
                  "w-full bg-transparent border-none focus:ring-0 text-sm min-h-[120px] resize-none pb-4",
                  isDark ? "text-white placeholder:text-white/20" : "text-black placeholder:text-black/20"
                )}
              />
              <div className="absolute bottom-2 right-4 opacity-20 text-[9px] font-mono">
                {feedback.length} {t('chars')}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsAppSend}
              disabled={!feedback.trim() || isSent}
              className={cn(
                "w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all duration-500",
                isSent 
                  ? "bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)]" 
                  : feedback.trim() 
                    ? "bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/30" 
                    : isDark ? "bg-white/5 text-white/10 cursor-not-allowed" : "bg-black/5 text-black/10 cursor-not-allowed"
              )}
            >
              {isSent ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t('transmitting')}</span>
                </>
              ) : (
                <>
                  <Send size={16} className={cn("transition-transform", feedback.trim() ? "translate-x-1 -translate-y-1" : "")} />
                  <span>{t('openWhatsapp')}</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
