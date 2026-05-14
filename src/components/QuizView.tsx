import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Music, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  category: 'Circle of Fifths' | 'Nashville Numbers' | 'History' | 'Fun';
  explanation: string;
}

const QUESTIONS: Record<string, Question[]> = {
  'Circle of Fifths': [
    {
      id: 1,
      category: 'Circle of Fifths',
      text: 'Welche Tonart hat 3 Kreuze (#)?',
      options: ['G-Dur', 'D-Dur', 'A-Dur', 'E-Dur'],
      correctAnswer: 'A-Dur',
      explanation: 'Der Quintenzirkel folgt dem Merksatz: Geh Du Alter Esel... G(1), D(2), A(3).'
    },
    {
      id: 2,
      category: 'Circle of Fifths',
      text: 'Was ist die parallele Moll-Tonart von C-Dur?',
      options: ['D-Moll', 'A-Moll', 'E-Moll', 'G-Moll'],
      correctAnswer: 'A-Moll',
      explanation: 'Die Moll-Parallele liegt immer eine kleine Terz unter dem Grundton der Dur-Tonart.'
    },
    {
      id: 10,
      category: 'Circle of Fifths',
      text: 'Wie viele Kreuze hat E-Dur?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
      explanation: 'Geh(1) Du(2) Alter(3) Esel(4)... also G, D, A, E-Dur.'
    },
    {
      id: 11,
      category: 'Circle of Fifths',
      text: 'Welche Tonart hat 2 B-Vorzeichen (b)?',
      options: ['F-Dur', 'B-Dur', 'Es-Dur', 'As-Dur'],
      correctAnswer: 'B-Dur',
      explanation: 'Frische(1) Brötchen(2)... F-Dur hat eines, B-Dur hat zwei.'
    },
    {
      id: 12,
      category: 'Circle of Fifths',
      text: 'Welches Intervall liegt zwischen benachbarten Tonarten im Quintenzirkel?',
      options: ['Große Terz', 'Reine Quarte', 'Reine Quinte', 'Oktave'],
      correctAnswer: 'Reine Quinte',
      explanation: 'Daher kommt der Name! Jede Stufe im Uhrzeigersinn ist eine Quinte höher.'
    }
  ],
  'Nashville Numbers': [
    {
      id: 3,
      category: 'Nashville Numbers',
      text: 'In G-Dur, was ist der "4" Akkord?',
      options: ['A', 'C', 'D', 'Em'],
      correctAnswer: 'C',
      explanation: 'Zähle die Tonleiter: G(1), Am(2), Bm(3), C(4).'
    },
    {
      id: 13,
      category: 'Nashville Numbers',
      text: 'Welche Zahl wird normalerweise für den Dominant-Akkord verwendet?',
      options: ['1', '4', '5', '6'],
      correctAnswer: '5',
      explanation: 'Die 5. Stufe ist die Dominante und erzeugt Spannung, die zur 1 (Tonika) auflöst.'
    },
    {
      id: 14,
      category: 'Nashville Numbers',
      text: 'In der Tonart C-Dur, welcher Akkord ist die "6-"?',
      options: ['F', 'G', 'Am', 'Dm'],
      correctAnswer: 'Am',
      explanation: 'Die 6. Stufe in einer Dur-Tonleiter ist immer der parallele Moll-Akkord.'
    },
    {
      id: 15,
      category: 'Nashville Numbers',
      text: 'Welcher Akkord ist die "2-" in G-Dur?',
      options: ['Am', 'Bm', 'C', 'D'],
      correctAnswer: 'Am',
      explanation: 'Die Stufen sind G(1), Am(2), Bm(3), C(4), D(5), Em(6), F#dim(7).'
    },
    {
      id: 16,
      category: 'Nashville Numbers',
      text: 'In D-Dur, was ist der "5" Akkord?',
      options: ['G', 'A', 'E', 'Bm'],
      correctAnswer: 'A',
      explanation: 'D(1), E(2), F#(3), G(4), A(5). A ist die Dominante von D.'
    }
  ],
  'History': [
    {
      id: 4,
      category: 'History',
      text: 'Wer erfand die erste kommerziell erfolgreiche Solidbody-E-Gitarre?',
      options: ['Leo Fender', 'Les Paul', 'Gibson', 'Paul Reed Smith'],
      correctAnswer: 'Leo Fender',
      explanation: 'Die Fender Telecaster (ursprünglich Broadcaster) war die erste Massenproduktion.'
    },
    {
      id: 5,
      category: 'History',
      text: 'Welcher legendäre Gitarrist spielte mit den Zähnen in Woodstock?',
      options: ['Eric Clapton', 'Jimi Hendrix', 'Jimmy Page', 'Jeff Beck'],
      correctAnswer: 'Jimi Hendrix',
      explanation: 'Hendrix war bekannt für seine theatralischen Auftritte und seine unglaubliche Technik.'
    },
    {
      id: 17,
      category: 'History',
      text: 'Welche Firma stellt die berühmte "Les Paul" Gitarre her?',
      options: ['Fender', 'Gibson', 'Ibanez', 'Gretsch'],
      correctAnswer: 'Gibson',
      explanation: 'Les Paul arbeitete in den 50ern eng mit Gibson zusammen, um sein Signature-Modell zu entwerfen.'
    },
    {
      id: 18,
      category: 'History',
      text: 'In welchem Jahr wurde die Fender Stratocaster eingeführt?',
      options: ['1950', '1952', '1954', '1960'],
      correctAnswer: '1954',
      explanation: 'Die Stratocaster revolutionierte das Design mit ihrem Double-Cutaway und drei Pickups.'
    },
    {
      id: 19,
      category: 'History',
      text: 'Welcher Gitarrist baute seine Gitarre "Red Special" als Teenager mit seinem Vater?',
      options: ['Slash', 'Brian May', 'Angus Young', 'Eddie Van Halen'],
      correctAnswer: 'Brian May',
      explanation: 'Der Queen-Gitarrist benutzte dafür Holz eines alten Kaminsims.'
    }
  ],
  'Fun': [
    {
      id: 6,
      category: 'Fun',
      text: 'Wie viele Saiten hat eine Standard-Gitarre normalerweise?',
      options: ['4', '5', '6', '12'],
      correctAnswer: '6',
      explanation: 'Einfach, aber fundamental! Die meisten Gitarren haben 6 Saiten (E-A-D-G-B-E).'
    },
    {
      id: 7,
      category: 'Fun',
      text: 'Welches Holz wird traditionell oft für Griffbretter verwendet?',
      options: ['Palisander (Rosewood)', 'Kiefer', 'Eiche', 'Balsa'],
      correctAnswer: 'Palisander (Rosewood)',
      explanation: 'Palisander und Ebenholz sind aufgrund ihrer Härte und Klangqualität beliebt.'
    },
    {
      id: 20,
      category: 'Fun',
      text: 'Wie nennt man das kleine Plättchen, mit dem man die Saiten anschlägt?',
      options: ['Capo', 'Plektrum', 'Slider', 'Tuner'],
      correctAnswer: 'Plektrum',
      explanation: 'Auch "Pick" genannt. Es gibt sie in unzähligen Materialstärken für verschiedene Sounds.'
    },
    {
      id: 21,
      category: 'Fun',
      text: 'Welcher Gitarrist ist für seinen Zylinder und seine Locken bekannt?',
      options: ['Slash', 'The Edge', 'Prince', 'Kirk Hammett'],
      correctAnswer: 'Slash',
      explanation: 'Der Guns N\' Roses Gitarrist ist ohne seinen Hut fast nicht wiederzuerkennen.'
    },
    {
      id: 22,
      category: 'Fun',
      text: 'Was ist ein "Capo" (Kapodaster)?',
      options: ['Ein Verstärker', 'Ein Saiteninstrument', 'Eine Klemme für den Hals', 'Ein Effektpedal'],
      correctAnswer: 'Eine Klemme für den Hals',
      explanation: 'Damit kann man die Tonhöhe verkürzen und Lieder in anderen Tonarten mit den gewohnten Griffen spielen.'
    }
  ]
};

export const QuizView: React.FC<{ theme: 'dark' | 'light', accentColor: string }> = ({ theme, accentColor }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const activeQuestions = selectedCategory ? QUESTIONS[selectedCategory] : [];
  const currentQuestion = activeQuestions[currentQuestionIdx];

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
  };

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleConfirm = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setSelectedCategory(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-2xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Wähle deine Challenge</h2>
          <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Teste dein Wissen in verschiedenen Kategorien</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(QUESTIONS).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left space-y-3 group"
            >
              <Music className="text-emerald-500 group-hover:scale-110 transition-transform" size={32} />
              <div>
                <h3 className="text-xl font-black italic text-white">{cat === 'Circle of Fifths' ? 'Quintenzirkel' : cat === 'Nashville Numbers' ? 'Nashville Zahlen' : cat === 'History' ? 'Geschichte' : 'Fakten'}</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest">{QUESTIONS[cat].length} Fragen</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center gap-8 py-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-full flex items-center justify-center relative"
          style={{ backgroundColor: `${accentColor}1A` }}
        >
          <Trophy className="text-amber-500" size={60} />
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Quiz abgeschlossen!</h2>
          <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Deine Musik-IQ Bewertung</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500/60">Punktzahl</span>
            <span className="text-4xl font-black text-white">{score} / {activeQuestions.length}</span>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500/60">Genauigkeit</span>
            <span className="text-4xl font-black text-white">{Math.round((score / activeQuestions.length) * 100)}%</span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all bg-emerald-500 text-white hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
        >
          <RotateCcw size={20} />
          Zurück zur Auswahl
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 pb-32">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Brain className="text-orange-500" size={24} />
            </div>
            <div>
              <h2 className={cn(
                "text-2xl font-black italic tracking-tighter uppercase",
                theme === 'dark' ? "text-white" : "text-emerald-950"
              )}>
                Theorie Quiz
              </h2>
              <span className="text-[8px] uppercase tracking-widest font-black opacity-30 text-white">
                Frage {currentQuestionIdx + 1} von {activeQuestions.length}
              </span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
             {selectedCategory === 'Circle of Fifths' ? 'Quintenzirkel' : selectedCategory === 'Nashville Numbers' ? 'Nashville Zahlen' : selectedCategory === 'History' ? 'Geschichte' : 'Fakten'}
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className={cn(
          "p-8 rounded-[40px] border-2 flex flex-col items-center text-center gap-6 relative overflow-hidden text-white",
          theme === 'dark' ? "bg-white/5 border-white/5" : "bg-white border-black/5 shadow-xl"
        )}>
          <HelpCircle className="text-emerald-500/20 absolute -top-4 -left-4" size={100} />
          <p className="text-xl sm:text-2xl font-bold leading-tight relative z-10">
            {currentQuestion.text}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = isAnswered && option === currentQuestion.correctAnswer;
            const isWrong = isAnswered && isSelected && option !== currentQuestion.correctAnswer;

            return (
              <motion.button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                className={cn(
                  "p-5 rounded-2xl border-2 font-bold text-left transition-all relative flex items-center justify-between",
                  isCorrect
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isWrong
                      ? "bg-rose-500 border-rose-500 text-white"
                      : isSelected
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                        : theme === 'dark' 
                          ? "bg-white/5 border-white/10 hover:border-white/30 text-white" 
                          : "bg-black/5 border-black/10 hover:border-black/30 text-emerald-950"
                )}
              >
                <span>{option}</span>
                {isCorrect && <CheckCircle2 size={20} />}
                {isWrong && <XCircle size={20} />}
              </motion.button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium"
          >
            <strong className="block uppercase text-[10px] tracking-widest mb-1">Erklärung:</strong>
            {currentQuestion.explanation}
          </motion.div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={!selectedAnswer}
            className={cn(
              "px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all",
              selectedAnswer 
                ? "bg-emerald-500 text-white shadow-lg hover:scale-105 active:scale-95" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            Antwort bestätigen
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {currentQuestionIdx < activeQuestions.length - 1 ? 'Nächste Frage' : 'Ergebnisse zeigen'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
