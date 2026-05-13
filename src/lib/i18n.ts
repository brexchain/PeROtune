import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'de' | 'en';

export const translations = {
  de: {
    // Header
    profAmateur: "Prof. Amateur Park Spieler PWA",
    settings: "Einstellungen",
    themeToggle: "Themen-Wechsel",

    // Navigation
    tuner: "Stimmgerät",
    theory: "Theorie",
    clock: "Takt",
    riffs: "Riffs",
    contact: "Kontakt",

    // Tuner View
    acoustic: "Akustik",
    twelveString: "12-Saiter",
    ukulele: "Ukulele",
    signal: "Signal",
    healing: "Heilung",
    standard: "Standard",
    listening: "Hört zu...",
    startMic: "Mikro an",
    tuningReference: "Stimm-Referenz",
    latency: "Latenz",
    build: "Version",

    // Theory View
    harmonicEngine: "Harmonische Engine",
    interactiveTheory: "Interaktive Theorie",
    circleOfFifths: "Quintenzirkel & Solo-Muster",
    nashvilleSensor: "Nashville Sensor",
    listeningForStrings: "Warte auf Saiten...",
    sensorOffline: "Sensor Offline",
    activateMic: "Klick zum Aktivieren des Mikros",
    scaleAnchor: "Tonleiter-Anker",
    soloBlueprint: "Solo-Entwurf",
    visualArchitecture: "Lerne die visuelle Architektur des Griffbretts",
    pentatonicBoxDesc: "Die Pentatonik-Box ist deine 'Basis'. Meistere diese 5 ineinandergreifenden Formen, um überall auf der Gitarre zu soloieren.",
    proCheatCodes: "Professionelle 'Cheat Codes' der Großen. Diese Zonen sind sichere Häfen für gefühlvolles melodisches Spiel.",
    pentatonicBox: "Pentatonik Box",
    proBlueprints: "Pro Blueprints",
    claphonHouse: "Das Clapton Haus",
    magicBox: "BB Kings Magic Box",
    hendrixThumb: "Hendrix Daumen-Grundton",
    srvSlide: "SRV Texas Slide",
    albertKing: "Albert King Bend Zone",
    nashvilleFamily: "Nashville Familie",
    nashvilleNumbersDesc: "Nashville-Zahlen ermöglichen sofortiges Transponieren. 1-4-5 ist das Rückgrat der westlichen Musik.",
    nashvilleLogic: "Nashville Logik",
    nashvilleLogicDesc: "Profi-Gitarristen denken in Zahlen, um den 'Groove' über verschiedene Tonarten hinweg konsistent zu halten.",
    cagedBlueprint: "CAGED Entwurf",
    cagedDesc: "Alles auf der Gitarre ist eine verschiebbare Form. C-A-G-E-D verbindet den Hals zu einem riesigen Spielplatz.",
    rockBase: "Rock Basis",
    popCycle: "Pop Zyklus",
    turnaround: "Turnaround",
    soul: "Soul",
    movableGrid: "Verschiebbares Gitter",
    cagedHint: "Finde den Grundton eines offenen Akkords und verschiebe ihn relativ zum Sattel.",
    rootLabel: "1 (Grundton)",
    detectedNoteMapping: "Erkannte Note löst numerisches Mapping aus",

    // Metronome
    studioTempo: "Studio Tempo",
    precisionTiming: "Präzisions-Timing-Engine",
    tapTempo: "Tap Tempo",
    bars: "Takte",

    // Riff Library
    library: "Bibliothek",
    searchRiffs: "Riffs suchen...",
    favorites: "Favoriten",
    all: "Alle",
    guitar: "Gitarre",
    findFullChords: "Akkorde & Lyrics finden",
    searchChords: "Akkorde suchen",
    removeLibrary: "Aus Bibliothek entfernen",
    
    // Contact / Feedback
    getInTouch: "Kontakt aufnehmen",
    feedback: "Feedback",
    send: "Senden",
    
    // Guitarist Tips
    guitaristTip: "Gitarristen-Tipp",
    referenceReady: "Referenz bereit",

    // Luthier / Settings
    appearance: "Erscheinungsbild",
    accentColor: "Akzentfarbe",
    layout: "Layout",
    vertical: "Vertikal",
    horizontal: "Horizontal",
    backgroundColor: "Hintergrundfarbe",
    tuningSensitivity: "Stimm-Empfindlichkeit",
    low: "Niedrig",
    high: "Hoch",
    close: "Schließen",

    // Shapes & Hints
    p1Name: "Muster 1 (Die Basis)",
    p1Desc: "Der 'Alte Bekannte'. Jeder fängt hier an. Grundton auf der tiefen E-Saite.",
    p2Name: "Muster 2 (Die Erweiterung)",
    p2Desc: "Der 'Süße Fleck'. Schiebe von Muster 1 hoch, um diese melodischen hohen Noten zu erreichen.",
    p3Name: "Muster 3 (B-Saiten Slide)",
    p3Desc: "Die 'Lustige Form'. Achte auf den Wechsel auf der B-Saite. Super für diagonale Läufe.",
    p4Name: "Muster 4 (Hohe Box)",
    p4Desc: "Die 'Grundton auf A' Form. Sehr stabil und toll für Bends auf der G-Saite.",
    p5Name: "Muster 5 (D-Form Verbinder)",
    p5Desc: "Die 'Treppe'. Verbindet das hohe Register zurück nach unten zu Muster 1.",

    h1Title: "Das Clapton Haus",
    h1Desc: "Die 'Melodic Highs'. Auf den drei dünnsten Saiten. Sieht aus wie ein Haus mit Dach, ideal für Vibrato.",
    h2Title: "BB King's Magic Box",
    h2Desc: "Verwurzelt auf der B-Saite. Immer hineingleiten. Signature Vibrato Spot.",
    h3Title: "Hendrix Daumen-Grundton",
    h3Desc: "Der 'Coolste Rock-Handgriff'. Daumen über den Hals für den Grundton, Finger frei für Licks.",
    h4Title: "SRV Texas Slide",
    h4Desc: "Aggressive diagonale Bewegung zwischen Box 1 und 2 mit viel Energie.",
    h5Title: "Albert King Bend Zone",
    h5Desc: "Maximale Spannung. Hier ziehst du die massiven Blues-Bends, die schreien.",

    // Riff Translations (Comprehensive)
    g1: "Mitternachts-Strumming",
    g1Desc: "Ein grundlegendes akustisches Muster in G-Dur.",
    g2: "Bergecho",
    g2Desc: "Ein Fingerstyle-Arpeggio für warme Resonanz.",
    g3: "Küstenbrise",
    g3Desc: "Leicht palm-muted Textur für ambiente Rhythmen.",
    g4: "Für Elise",
    g4Desc: "Beethovens Klassiker für Gitarre.",
    g5: "Hallelujah",
    g5Desc: "Das ikonische Arpeggio von Leonard Cohen.",
    g6: "Smoke on Water",
    g6Desc: "Das berühmteste Powerchord-Riff aller Zeiten.",
    g7: "Seven Nation Army",
    g7Desc: "Das ultimative Stadion-Riff.",
    g8: "Back in Black",
    g8Desc: "AC/DC Power-Rhythmus.",
    g9: "Iron Man",
    g9Desc: "Black Sabbaths Metal-Grundstein.",
    g10: "Sweet Child O' Mine",
    g10Desc: "Slashs Melodie-Klassiker.",
    g11: "Sunshine of Your Love",
    g11Desc: "Der essenzielle Blues-Rock Lick.",
    g12: "Day Tripper",
    g12Desc: "Der treibende Beat-Klassiker der Beatles.",
    g13: "Satisfaction",
    g13Desc: "Keith Richards' Fuzz-Klassiker.",
    g14: "Paranoid",
    g14Desc: "Schneller Metal-Rhythmus.",
    g15: "Enter Sandman",
    g15Desc: "Metallicas absteigender Albtraum-Hook.",
    g16: "Smells Like Teen Spirit",
    g16Desc: "Die Hymne einer Generation.",
    g17: "Wild Thing",
    g17Desc: "Der Garage-Rock Standard.",
    g18: "La Grange",
    g18Desc: "ZZ Tops Boogie-Blues Shuffle.",
    g19: "Come As You Are",
    g19Desc: "Nirvanas chromatischer Walk.",
    g20: "Purple Haze",
    g20Desc: "Hendrix' psychrock Klassiker.",
    g21: "Wonderwall",
    g21Desc: "Die Lagerfeuer-Legende.",
    g28: "Stairway to Heaven",
    g28Desc: "Das legendäre Arpeggio-Intro.",
    u1: "Over the Rainbow",
    u1Desc: "Israel Kamakawiwoʻoles legendäres Insel-Strumming.",
    u2: "Riptide",
    u2Desc: "Schnelles Folk-Strumming für hohe Energie.",
    t1: "Wish You Were Here",
    t1Desc: "Pink Floyds ikonisches, harmonisches Intro.",
    t2: "Hotel California",
    t2Desc: "Komplexes 12-Saiter-Akustik-Arpeggio.",
    progression: "Akkordfolge",
    lyricRefrain: "Refrain",
    focusTip: "Tipp",
    tapToReturn: "Tippen zum Zurückkehren",
    exploreAll: "Alle Riffs erkunden",
    fullStudio: "Vollständige Studio-Sammlung",
    items: "Objekte",
    nashville: "Nashville",
    refrainHook: "Refrain-Hook",
    contactTitle: "Harmonisches Feedback",
    contactDesc: "Direkte Verbindung zum Entwickler",
    placeholderFeedback: "Teile deine Gedanken oder wähle oben einen Grund...",
    chars: "Zeichen",
    transmitting: "Übertragung...",
    openWhatsapp: "WhatsApp öffnen",
    fb1Lab: "Design & UI",
    fb1Txt: "Das Design ist absolut top! Die Harmonic Engine hilft mir sehr. 🎸",
    fb2Lab: "Nadel-Verhalten",
    fb2Txt: "Vielleicht könnte man einen 'Glättungs-Modus' für laute Umgebungen hinzufügen? 🎯",
    fb3Lab: "Feature-Idee",
    fb3Txt: "Ich würde gerne alternative Stimmungen wie Open G oder DADGAD sehen! 🛠️",
    fb4Lab: "Humor",
    fb4Txt: "Mein Spiel klingt immer noch wie ein Sack Katzen, aber jetzt sind die Katzen wenigstens gestimmt. 🐱",
    fb5Lab: "Fehler melden",
    fb5Txt: "Ich habe einen kleinen Fehler beim Stimmen meiner 7-Saiter gefunden. 🐛",
  },
  en: {
    // Header
    profAmateur: "Prof. Amateur Park Player PWA",
    settings: "Settings",
    themeToggle: "Theme Toggle",

    // Navigation
    tuner: "Tuner",
    theory: "Theory",
    clock: "Clock",
    riffs: "Riffs",
    contact: "Contact",

    // Tuner View
    acoustic: "Acoustic",
    twelveString: "12-String",
    ukulele: "Ukulele",
    signal: "Signal",
    healing: "Healing",
    standard: "Standard",
    listening: "Listening...",
    startMic: "Start Mic",
    tuningReference: "Tuning Reference",
    latency: "Latency",
    build: "Build",

    // Theory View
    interactiveTheory: "Interactive Theory",
    soloingHints: "Soloing Hints",
    pentatonicPatterns: "Patterns",
    nashvilleNumbers: "Nashville Numbers",
    chordsInKey: "Chords in Key",
    majorScale: "Major Scale",
    minorScale: "Minor Scale",
    root: "Root",
    findChords: "Find Chords",

    // Metronome
    studioTempo: "Studio Tempo",
    precisionTiming: "Precision Timing Engine",
    tapTempo: "Tap Tempo",
    bars: "Bars",

    // Riff Library
    library: "Library",
    searchRiffs: "Search riffs...",
    favorites: "Favorites",
    all: "All",
    guitar: "Guitar",
    findFullChords: "Find Full Chords & Lyrics",
    searchChords: "Search Chords",
    removeLibrary: "Remove from library",

    // Contact / Feedback
    getInTouch: "Get in Touch",
    feedback: "Feedback",
    send: "Send",

    // Guitarist Tips
    guitaristTip: "Guitarist Tip",
    referenceReady: "Reference Ready",

    // Luthier / Settings
    appearance: "Appearance",
    accentColor: "Accent Color",
    layout: "Layout",
    vertical: "Vertical",
    horizontal: "Horizontal",
    backgroundColor: "Background Color",
    tuningSensitivity: "Tuning Sensitivity",
    low: "Low",
    high: "High",
    close: "Close",

    midnightStrum: "Midnight Strum",
    midnightStrumDesc: "A foundational acoustic pattern in G Major.",
    mountainEcho: "Mountain Echo",
    mountainEchoDesc: "A fingerstyle arpeggio for warm resonance.",
    coastalBreeze: "Coastal Breeze",
    coastalBreezeDesc: "Light palm-muted texture for ambient rhythm.",
    smokeTitle: "Smoke on Water",
    smokeDesc: "The most famous power chord riff ever.",
    progression: "Progression",
    lyricRefrain: "Lyric Refrain",
    focusTip: "Focus Tip",
    tapToReturn: "tap to return",
    exploreAll: "Explore All Riffs",
    fullStudio: "Full Studio Collection",
    items: "Items",
    nashville: "Nashville",
    refrainHook: "Refrain Hook",
    contactTitle: "Harmonic Feedback",
    contactDesc: "Connect directly with the developer",
    placeholderFeedback: "Share your thoughts or tap a reason above...",
    chars: "chars",
    transmitting: "Transmitting...",
    openWhatsapp: "Open WhatsApp",
    fb1Lab: "Design & UI",
    fb1Txt: "The UI is slicker than a fresh set of strings! Love the Harmonic Engine. 🎸",
    fb2Lab: "Needle Smoothing",
    fb2Txt: "Maybe add a 'Smoothing' mode for high-gain environments? 🎯",
    fb3Lab: "Feature Idea",
    fb3Txt: "Would love to see some classic alternate tunings (Open G, DADGAD) added! 🛠️",
    fb4Lab: "Funny",
    fb4Txt: "My playing still sounds like a bag of cats, but at least the cats are in tune now. 🐱",
    fb5Lab: "Reporting Bug",
    fb5Txt: "Found a small glitch while tuning my 7-string. 🐛",
  }
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: any, fallback?: string) => string;
}>({
  language: 'de',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export const LanguageProvider = LanguageContext.Provider;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const getTranslation = (lang: Language, key: any, fallback?: string): string => {
  const dict = translations[lang] as any;
  const enDict = translations['en'] as any;
  
  if (dict && dict[key]) return dict[key];
  if (enDict && enDict[key]) return enDict[key];
  
  return fallback || key;
};
