/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GUITAR_STRINGS = [
  { note: 'E', octave: 4, freq: 329.63, label: 'e' },
  { note: 'B', octave: 3, freq: 246.94, label: 'B' },
  { note: 'G', octave: 3, freq: 196.00, label: 'G' },
  { note: 'D', octave: 3, freq: 146.83, label: 'D' },
  { note: 'A', octave: 2, freq: 110.00, label: 'A' },
  { note: 'E', octave: 2, freq: 82.41, label: 'E' },
];

export const UKULELE_STRINGS = [
  { note: 'A', octave: 4, freq: 440.00, label: 'A' },
  { note: 'E', octave: 4, freq: 329.63, label: 'E' },
  { note: 'C', octave: 4, freq: 261.63, label: 'C' },
  { note: 'G', octave: 4, freq: 392.00, label: 'G' },
];

export const TWELVE_STRING_STRINGS = [
  { note: 'E', octave: 4, freq: 329.63, label: 'e1' },
  { note: 'E', octave: 4, freq: 329.63, label: 'e2' },
  { note: 'B', octave: 3, freq: 246.94, label: 'B1' },
  { note: 'B', octave: 3, freq: 246.94, label: 'B2' },
  { note: 'G', octave: 3, freq: 196.00, label: 'G1' },
  { note: 'G', octave: 4, freq: 392.00, label: 'G2' },
  { note: 'D', octave: 3, freq: 146.83, label: 'D1' },
  { note: 'D', octave: 4, freq: 293.66, label: 'D2' },
  { note: 'A', octave: 2, freq: 110.00, label: 'A1' },
  { note: 'A', octave: 3, freq: 220.00, label: 'A2' },
  { note: 'E', octave: 2, freq: 82.41, label: 'E1' },
  { note: 'E', octave: 3, freq: 164.81, label: 'E2' },
];

export type InstrumentCategory = 'guitar' | 'ukulele' | '12string';

export interface Riff {
  id: string;
  title: string;
  description: string;
  pattern: string;
  chords?: string;
  refrain?: string;
  lyrics?: string;
  nashvilleNumbers?: string;
  category: InstrumentCategory;
}

export interface BackingTrack {
  id: string;
  title: string;
  style: string;
  bpm: number;
  key: string;
  progression: string[];
  description: string;
}

export const BACKING_TRACKS: BackingTrack[] = [
  { id: 'bt1', title: 'Midnight Blues', style: 'Blues', bpm: 80, key: 'A', progression: ['A7', 'D7', 'A7', 'E7'], description: 'Slow 12-bar blues in A with a shuffle feel.' },
  { id: 'bt2', title: 'Desert Rock', style: 'Rock', bpm: 120, key: 'Em', progression: ['Em', 'G', 'D', 'A'], description: 'Driving alternative rock rhythm in E minor.' },
  { id: 'bt3', title: 'Chill Lo-Fi', style: 'Lo-Fi', bpm: 70, key: 'Cmaj7', progression: ['Cmaj7', 'Am7', 'Dm7', 'G7'], description: 'Relaxed lo-fi jazzy progression for melodic exploration.' },
  { id: 'bt4', title: 'Funk Soul', style: 'Funk', bpm: 105, key: 'D7', progression: ['D7', 'G7', 'D7', 'G7'], description: 'Sharp syncopated funk rhythm with a groovy bassline.' }
];

export const TRAINING_NOTES = [
  { note: 'C4', freq: 261.63 },
  { note: 'D4', freq: 293.66 },
  { note: 'E4', freq: 329.63 },
  { note: 'F4', freq: 349.23 },
  { note: 'G4', freq: 392.00 },
  { note: 'A4', freq: 440.00 },
  { note: 'B4', freq: 493.88 }
];

export interface Mnemonic {
  lang: string;
  phrase: string;
}

export const EADGBE_MNEMONICS: Mnemonic[] = [
  { lang: "German", phrase: "Ein Anfänger Der Gitarre Braucht Eifer" },
  { lang: "German 2", phrase: "Eine Alte Dame Ging Brote Essen" },
  { lang: "English", phrase: "Eddie Ate Dynamite Good Bye Eddie" },
  { lang: "English 2", phrase: "Eat All Day Get Big Easy" },
  { lang: "English 3", phrase: "Every Amateur Does Get Better Eventually" },
  { lang: "English 4", phrase: "Elvis Always Dug Good Banana Elvis" },
  { lang: "Spanish", phrase: "En El Desierto Galopa Un Burro Enfermo" },
  { lang: "Spanish 2", phrase: "El Abuelo Solo Desea Guiso Barato E..." },
  { lang: "French", phrase: "Elle A Des Gars Bien Elevés" },
  { lang: "Italian", phrase: "Enrico A Dato Grosse Botte E..." },
  { lang: "Dutch", phrase: "Een Aap Die Geen Bananen Eet" },
  { lang: "Swedish", phrase: "En Arg Duva Går Bakom Ekarna" },
  { lang: "Finnish", phrase: "Esa Antoi Danielille Grilli-Bileet E..." },
  { lang: "Danish", phrase: "En Alternativ Dame Går Bare Ensom" },
  { lang: "Norwegian", phrase: "En Annen Dag Går Bare Etterpå" },
  { lang: "Portuguese", phrase: "Ela Acha Doce Gostar Basta Entender" },
  { lang: "Russian", phrase: "Если Анна Дает Гитарный Бой Е..." },
  { lang: "Polish", phrase: "Ewa Atakuje Dom Gdy Brat E..." },
  { lang: "Czech", phrase: "Eda A Dana Goli B... E..." },
  { lang: "Hungarian", phrase: "Egy Apró Darab Gitár Bolondít El" },
  { lang: "Turkish", phrase: "En Az Dün Gibi Başarı E..." }
];

export const RIFFS: Riff[] = [
  // --- 6-STRING GUITAR (101 RIFFS) ---
  { id: 'g1', title: 'Midnight Strum', description: 'A foundational acoustic pattern in G Major.', pattern: 'D D U U D U', chords: 'G - C - D - G', nashvilleNumbers: '1 - 4 - 5 - 1', category: 'guitar' },
  { id: 'g2', title: 'Mountain Echo', description: 'A fingerstyle arpeggio for warm resonance.', pattern: 'P I M A M I', chords: 'Am - C - G - D', nashvilleNumbers: '1m - 3 - 7 - 4', category: 'guitar' },
  { id: 'g3', title: 'Coastal Breeze', description: 'Light palm-muted texture for ambient rhythm.', pattern: 'M M S M M S', chords: 'Em7 - Cadd9 - G - D/F#', nashvilleNumbers: '6m - 4 - 1 - 5/7', category: 'guitar' },
  { id: 'g4', title: 'Für Elise', description: 'Beethoven\'s classic theme arranged for guitar.', pattern: 'E4 D#4 E4 D#4 E4 B3 D4 C4 A3', chords: 'Am - E7 - Am', lyrics: 'Instrumental classical masterpiece.', category: 'guitar' },
  { id: 'g5', title: 'Hallelujah', description: 'Leonard Cohen\'s iconic arpeggio progression.', pattern: 'C3 E3 G3 A3 G3 E3', chords: 'C - Am - C - Am - F - G - C - G', lyrics: 'I heard there was a secret chord, that David played and it pleased the Lord...', nashvilleNumbers: '1 - 6m - 1 - 6m - 4 - 5 - 1 - 5', category: 'guitar' },
  { id: 'g6', title: 'Smoke on Water', description: 'The most famous power chord riff ever.', pattern: 'G2 Bb2 C3 . G2 Bb2 Db3 C3 . G2 Bb2 C3 Bb2 G2', chords: 'G5 - Bb5 - C5', lyrics: 'Smoke on the water, A fire in the sky...', refrain: 'Smoke on the water, fire in the sky...', nashvilleNumbers: '1 - b3 - 4', category: 'guitar' },
  { id: 'g7', title: 'Seven Nation Army', description: 'The ultimate stadium basement riff.', pattern: 'E3 . E3 G3 E3 D3 C3 B2', chords: 'Em - G - C - B', lyrics: 'I\'m gonna fight \'em off, A seven nation army couldn\'t hold me back...', refrain: 'I\'m gonna fight \'em off, a seven nation army couldn\'t hold me back...', nashvilleNumbers: '1 - 1 - b3 - 1 - b7 - b6 - 5', category: 'guitar' },
  { id: 'g8', title: 'Back in Black', description: 'High-voltage AC/DC power rhythm.', pattern: 'E2 . D3 . A2 . . E2 . D3 . A2 . . G3 E3', chords: 'E - D - A', lyrics: 'Back in black, I hit the sack, I\'ve been too long, I\'m glad to be back...', refrain: 'Back in black, I hit the sack, I\'ve been too long, I\'m glad to be back...', nashvilleNumbers: '1 - b7 - 4', category: 'guitar' },
  { id: 'g9', title: 'Iron Man', description: 'Tony Iommi\'s heavy metal blueprint.', pattern: 'B2 D3 D3 E3 E3 G3 F#3 G3 F#3 G3 D3 D3 E3 E3', chords: 'B5 - D5 - E5', lyrics: 'I am Iron Man! Has he lost his mind? Can he see or is he blind?', nashvilleNumbers: '1 - b3 - 4', category: 'guitar' },
  { id: 'g10', title: 'Sweet Child O\' Mine', description: 'Slash\'s circular melodic exercise.', pattern: 'D3 D4 A3 G3 G4 A3 F#4 A3', chords: 'D - C - G - D', lyrics: 'She\'s got a smile that it seems to me, Reminds me of childhood memories...', nashvilleNumbers: '1 - b7 - 4 - 1', category: 'guitar' },
  { id: 'g11', title: 'Sunshine of Your Love', description: 'The essential blues-rock lick.', pattern: 'D3 D3 C3 D3 A2 Ab2 G2 D3', chords: 'D5 - C5 - G5', nashvilleNumbers: '1 - b7 - 4', category: 'guitar' },
  { id: 'g12', title: 'Day Tripper', description: 'The Beatles\' driving circular riff.', pattern: 'E2 G2 G#2 B2 E3 D3 B2 G3 A3 F#3', chords: 'E7 - A7 - B7', nashvilleNumbers: '1 - 4 - 5', category: 'guitar' },
  { id: 'g13', title: 'Satisfaction', description: 'Keith Richards\' fuzzed-out foundation.', pattern: 'B2 B2 B2 C#3 D3 D3 D3 C#3 B2', chords: 'E - A - D', nashvilleNumbers: '1 - 4 - b7', category: 'guitar' },
  { id: 'g14', title: 'Paranoid', description: 'Fast chugging metal rhythm.', pattern: 'E3 E3 D3 G3 E3 E3 D3 G3', chords: 'E5 - D5 - G5', nashvilleNumbers: '1 - b7 - b3', category: 'guitar' },
  { id: 'g15', title: 'Enter Sandman', description: 'Metallica\'s descending nightmare hook.', pattern: 'E2 G2 Bb2 E2 G2 Bb2 G3 G#2 G2', chords: 'E5 - G5 - Bb5', nashvilleNumbers: '1 - b3 - b5', category: 'guitar' },
  { id: 'g16', title: 'Smells Like Teen Spirit', description: 'The anthem of a generation.', pattern: 'F2 F2 . Bb2 Bb2 . Ab2 Ab2 . Db3 Db3', chords: 'F5 - Bb5 - Ab5 - Db5', refrain: 'With the lights out, it\'s less dangerous, here we are now, entertain us...', nashvilleNumbers: '1 - 4 - b3 - b6', category: 'guitar' },
  { id: 'g17', title: 'Wild Thing', description: 'The garage rock essential.', pattern: 'A2 A2 . D3 D3 . E3 E3 . D3 D3', chords: 'A - D - E - D', refrain: 'Wild thing, you make my heart sing, you make everything groovy...', nashvilleNumbers: '1 - 4 - 5 - 4', category: 'guitar' },
  { id: 'g18', title: 'La Grange', description: 'ZZ Top\'s boogie-blues shuffle.', pattern: 'A2 C3 D3 A2 C3 D3', chords: 'A5 - C5 - D5', nashvilleNumbers: '1 - b3 - 4', category: 'guitar' },
  { id: 'g19', title: 'Come As You Are', description: 'Nirvana\'s watery chromatic walk.', pattern: 'E2 E2 F2 F#2 A2 F#2 E2 F#2 E2 D2 E2', chords: 'F#m - E', nashvilleNumbers: '1m - b7', category: 'guitar' },
  { id: 'g20', title: 'Purple Haze', description: 'Hendrix\'s tritone-infused psych rock.', pattern: 'E3 G3 A3 E2 Bb2 A2 G2', chords: 'E7#9 - G - A', nashvilleNumbers: 'I7 - bIII - IV', category: 'guitar' },
  { id: 'g21', title: 'Wonderwall', description: 'The campfire legend.', pattern: 'Em7 G Dsus4 A7sus4', chords: 'Em7 - G - D - A7sus4', refrain: 'And all the roads we have to walk are winding, and all the lights that lead us there are blinding...', nashvilleNumbers: '6m - 1 - 5 - 2/4', category: 'guitar' },
  { id: 'g22', title: 'Knockin\' Heaven\'s Door', description: 'Dylan\'s essential four-chord flow.', pattern: 'G D Am / G D C', chords: 'G - D - Am / G - D - C', refrain: 'Knock, knock, knockin\' on heaven\'s door...', nashvilleNumbers: '1 - 5 - 2m / 1 - 5 - 4', category: 'guitar' },
  { id: 'g23', title: 'Black Dog', description: 'Led Zeppelin\'s complex math-rock riff.', pattern: 'A E G# A C# D E', chords: 'A7 - E7 - D7', nashvilleNumbers: '1 - 5 - 4', category: 'guitar' },
  { id: 'g24', title: 'Heartbreaker', description: 'Unforgettable Page blues turnaround.', pattern: 'A G# G F# F E', chords: 'Am - D - E', nashvilleNumbers: '1m - 4 - 5', category: 'guitar' },
  { id: 'g25', title: 'Crazy Train', description: 'Ozzy\'s high-speed minor scale run.', pattern: 'F# F# C# F# D F# C# F# B A G# A B G#', chords: 'F#m - D - E - A', nashvilleNumbers: '1m - 6 - 7 - 3', category: 'guitar' },
  { id: 'g26', title: 'Sweet Home Alabama', description: 'The southern rock anthem picking.', pattern: 'D C G D C G', chords: 'D - Cadd9 - G', nashvilleNumbers: '5 - 4 - 1 (in G)', category: 'guitar' },
  { id: 'g27', title: 'More Than Words', description: 'Extreme\'s percussive acoustic classic.', pattern: 'G G/B Cadd9 Am7 C D G', chords: 'G - Cadd9 - Am7 - C - D', nashvilleNumbers: '1 - 4 - 2m - 4 - 5', category: 'guitar' },
  { id: 'g28', title: 'Stairway to Heaven', description: 'The legendary arpeggiated intro.', pattern: 'Am AmMaj7 C D F G Am', chords: 'Am - G#aug - C/G - D/F# - Fmaj7 - G/B - Am', nashvilleNumbers: '1m - 1m(maj7) - 1m7 - 4/6 - 6 - 7 - 1m', category: 'guitar' },
  { id: 'g29', title: 'Pipeline', description: 'The surf-rock reverb masterpiece.', pattern: 'E G A Bb A G E', chords: 'Em - Am - B7', nashvilleNumbers: '1m - 4m - 57', category: 'guitar' },
  { id: 'g30', title: 'Misirlou', description: 'Fast tremolo picking surf madness.', pattern: 'E F G G# A B C B A G# F E', chords: 'E - F - G - Am', nashvilleNumbers: '1 - b2 - 1 (Phrygian)', category: 'guitar' },
  { id: 'g31', title: 'Sultans of Swing', description: 'Knopfler\'s fingerstyle clean snap.', pattern: 'Dm Bb C Dm', chords: 'Dm - Bb - C', nashvilleNumbers: '1m - b6 - b7', category: 'guitar' },
  { id: 'g32', title: 'The Wind Cries Mary', description: 'Hendrix\'s chordal embellishments.', pattern: 'Eb E F G Ab A Bb', chords: 'F - Eb - Bb - Ab', nashvilleNumbers: '1 - b7 - 4 - b3', category: 'guitar' },
  { id: 'g33', title: 'Little Wing', description: 'The blueprint for soulful rhythm guitar.', pattern: 'Em G Am Em Bm Am C G F C D', chords: 'Em - G - Am7 - Em7 - Bm7 - Am7 - C - G - F - C - D', nashvilleNumbers: '1m - b3 - 4m - 1m - b5m - 4m - b6 - b3 - b2 - b6 - b7', category: 'guitar' },
  { id: 'g34', title: 'Hey Joe', description: 'Blues-rock cycle of fifths.', pattern: 'C G D A E', chords: 'C - G - D - A - E', nashvilleNumbers: 'b6 - b3 - b7 - 4 - 1', category: 'guitar' },
  { id: 'g35', title: 'Crossroads', description: 'Clapton\'s high-octave blues shuffle.', pattern: 'A D A E D A', chords: 'A7 - D7 - E7', nashvilleNumbers: '17 - 47 - 57', category: 'guitar' },
  { id: 'g36', title: 'Beat It', description: 'Eddie Van Halen\'s pop-rock perfection.', pattern: 'E G B D C B G', chords: 'Eb5 - Db5 - B5', nashvilleNumbers: '1 - b7 - b6', category: 'guitar' },
  { id: 'g37', title: 'Money', description: 'The 7/4 time baseline adapted.', pattern: 'B D F# B E D B', chords: 'Bm - E - F#', nashvilleNumbers: '1m - 4 - 5', category: 'guitar' },
  { id: 'g38', title: 'Whole Lotta Love', description: 'Simple, dangerous, and heavy.', pattern: 'E D E D E D E', chords: 'E5 - D5 - A5', nashvilleNumbers: '1 - b7 - 4', category: 'guitar' },
  { id: 'g39', title: 'Plush', description: 'Stone Temple Pilots\' big open chords.', pattern: 'G D F C G', chords: 'G - D/F# - F - C - G', nashvilleNumbers: '1 - 5/7 - b7 - 4 - 1', category: 'guitar' },
  { id: 'g40', title: 'Under the Bridge', description: 'Fruiscante\'s Hendrix-style soul.', pattern: 'D F# Bm G D F# Bm A G', chords: 'D - F# - Bm - G', nashvilleNumbers: '1 - 3 - 6m - 4', category: 'guitar' },
  { id: 'g41', title: 'Californication', description: 'The sparse, dry, hypnotic lead.', pattern: 'Am F C G Am F', chords: 'Am - F - C - G', nashvilleNumbers: '6m - 4 - 1 - 5', category: 'guitar' },
  { id: 'g42', title: 'Otherside', description: 'Distorted power and clean sadness.', pattern: 'Am F C G', chords: 'Am - F - C - G', nashvilleNumbers: '6m - 4 - 1 - 5', category: 'guitar' },
  { id: 'g43', title: 'Snow (Hey Oh)', description: 'Fast, repetitive alternate picking.', pattern: 'G#m E B F#', chords: 'G#m - E - B - F#', nashvilleNumbers: '6m - 4 - 1 - 5', category: 'guitar' },
  { id: 'g44', title: 'Creep', description: 'The tension-building arpeggio.', pattern: 'G B C Cm', chords: 'G - B - C - Cm', nashvilleNumbers: '1 - 3 - 4 - 4m', category: 'guitar' },
  { id: 'g45', title: 'Karma Police', description: 'Radiohead\'s layered acoustic textures.', pattern: 'Am D G C C/B Am F E', chords: 'Am - D - G - C - F - E', nashvilleNumbers: '6m - 2 - 5 - 1 - 4 - 3', category: 'guitar' },
  { id: 'g46', title: 'House of Rising Sun', description: 'The definitive apprentice arpeggio.', pattern: 'Am C D F Am E Am', chords: 'Am - C - D - F - Am - E', nashvilleNumbers: '1m - b3 - 4 - 6 - 1m - 5', category: 'guitar' },
  { id: 'g47', title: 'Fortunate Son', description: 'The CCR rhythmic drive.', pattern: 'G F C G', chords: 'G - F - C - G', nashvilleNumbers: '1 - b7 - 4 - 1', category: 'guitar' },
  { id: 'g48', title: 'Proud Mary', description: 'Southern swamp-rock rhythm.', pattern: 'C A C A C A G F D', chords: 'D - F - G - A', nashvilleNumbers: '1 - b3 - 4 - 5', category: 'guitar' },
  { id: 'g49', title: 'Bad Moon Rising', description: 'Strum along to the doom.', pattern: 'D A G D', chords: 'D - A - G - D', nashvilleNumbers: '1 - 5 - 4 - 1', category: 'guitar' },
  { id: 'g50', title: 'American Girl', description: 'Petty\'s bright 12-string style strum.', pattern: 'D E G A', chords: 'D - E - G - A', nashvilleNumbers: '1 - 2 - 4 - 5', category: 'guitar' },
  { id: 'g51', title: 'Should I Stay or Should I Go', description: 'Punk-rock double stops.', pattern: 'D G D D G D', chords: 'D - G - D', nashvilleNumbers: '1 - 4 - 1', category: 'guitar' },
  { id: 'g52', title: 'London Calling', description: 'The Clash\'s dark, minor drive.', pattern: 'Em C G', chords: 'Em - G - C - F', nashvilleNumbers: '6m - 1 - 4 - b7', category: 'guitar' },
  { id: 'g53', title: 'Pretty Woman', description: 'The ultimate rockabilly hook.', pattern: 'E E G# B D F# E', chords: 'E - A - D - G', nashvilleNumbers: '1 - 4 - b7 - b3', category: 'guitar' },
  { id: 'g54', title: 'Twist and Shout', description: 'Build-up of energy in three chords.', pattern: 'D G A', chords: 'D - G - A7', nashvilleNumbers: '1 - 4 - 57', category: 'guitar' },
  { id: 'g55', title: 'Johnny B. Goode', description: 'The intro that changed the world.', pattern: 'Bb Bb Eb Bb F Bb', chords: 'Bb - Eb - F', nashvilleNumbers: '1 - 4 - 5', category: 'guitar' },
  { id: 'g56', title: 'Blue Suede Shoes', description: 'Rock and roll origins.', pattern: 'A D A E D A', chords: 'A - D7 - E7', nashvilleNumbers: '1 - 47 - 57', category: 'guitar' },
  { id: 'g57', title: 'Heartbreak Hotel', description: 'Elvis\'s minor-key blues tension.', pattern: 'E A B7', chords: 'E - A - B7', nashvilleNumbers: '1 - 4 - 57', category: 'guitar' },
  { id: 'g58', title: 'All Along the Watchtower', description: 'The Dylanesque minor cycle.', pattern: 'Am G F G', chords: 'Am - G - F - G', nashvilleNumbers: '1m - b7 - b6 - b7', category: 'guitar' },
  { id: 'g59', title: 'Space Oddity', description: 'Astronaut acoustic arpeggios.', pattern: 'Fmaj7 Em C D', chords: 'Fmaj7 - Em - C - D', nashvilleNumbers: '4maj7 - 3m - 1 - 2', category: 'guitar' },
  { id: 'g60', title: 'Ziggy Stardust', description: 'Glam-rock power riffing.', pattern: 'G Bm C D G', chords: 'G - D - Cadd9 - G', nashvilleNumbers: '1 - 5 - 4 - 1', category: 'guitar' },
  { id: 'g61', title: 'Starman', description: 'Bowie\'s sophisticated folk-pop.', pattern: 'Bb F C F', chords: 'Bb - F - C - F', nashvilleNumbers: '4 - 1 - 5 - 1', category: 'guitar' },
  { id: 'g62', title: 'Killer Queen', description: 'May\'s precise, vocal-like leads.', pattern: 'Eb Bb Cm G7 Cm Bb', chords: 'Cm - Bb - Ab - Eb', nashvilleNumbers: '6m - 5 - 4 - 1', category: 'guitar' },
  { id: 'g63', title: 'Bohemian Rhapsody', description: 'The operatic acoustic foundation.', pattern: 'Bb Gm Cm F7', chords: 'Bb - Gm - Cm - F', nashvilleNumbers: '1 - 6m - 2m - 5', category: 'guitar' },
  { id: 'g64', title: 'Another One Bites the Dust', description: 'The ultimate bass-line on guitar.', pattern: 'E E E E E G G A', chords: 'Em - Am', nashvilleNumbers: '1m - 4m', category: 'guitar' },
  { id: 'g65', title: 'We Will Rock You', description: 'Stomp-stomp-clap translated.', pattern: 'E A D A E', chords: 'E - A - D', nashvilleNumbers: '1 - 4 - b7', category: 'guitar' },
  { id: 'g66', title: 'Sweet Dreams', description: 'Synth-pop riffs for dark vibes.', pattern: 'Cm Ab G', chords: 'Cm - Ab - G', nashvilleNumbers: '1m - b6 - 5', category: 'guitar' },
  { id: 'g67', title: 'Should I Stay', description: 'The simple, effective punk anthem.', pattern: 'D G D D G D', chords: 'D - G - D', nashvilleNumbers: '1 - 4 - 1', category: 'guitar' },
  { id: 'g68', title: 'Roxanne', description: 'Police-style reggae-rock chords.', pattern: 'Gm Dm/F Ebmaj7 Dm7 Cm F7sus4 G', chords: 'Gm - Dm - Eb - Cm - F', nashvilleNumbers: '1m - 5m - 4maj7 - 1 - 2 - b7', category: 'guitar' },
  { id: 'g69', title: 'Message in a Bottle', description: 'Summers\' stretchy finger arpeggios.', pattern: 'C#m A B F#m', chords: 'C#m - A - B - F#m', nashvilleNumbers: '1m - b6 - b7 - 4m', category: 'guitar' },
  { id: 'g70', title: 'Every Breath You Take', description: 'The meticulous palm-muted clean lines.', pattern: 'Ab Fm Db Eb', chords: 'Ab - Fm - Db - Eb', nashvilleNumbers: '1 - 6m - 4 - 5', category: 'guitar' },
  { id: 'g71', title: 'De Do Do Do', description: 'Sparkling clean syncopated chords.', pattern: 'A C#m Bm E', chords: 'A - C#m - Bm - E', nashvilleNumbers: '1 - 3m - 2m - 5', category: 'guitar' },
  { id: 'g72', title: 'Walk This Way', description: 'Aerosmith\'s funk-metal fusion.', pattern: 'E E Bb B E E Bb B', chords: 'E7 - A7', nashvilleNumbers: '17 - 47', category: 'guitar' },
  { id: 'g73', title: 'Dream On', description: 'Aerosmith\'s haunting minor arpeggio.', pattern: 'Fm Fm/Eb Bb/D Db', chords: 'Fm - C7 - Db - Eb', nashvilleNumbers: '1m - 57 - b6 - b7', category: 'guitar' },
  { id: 'g74', title: 'Back in Black', description: 'The gold standard of rock rhythm.', pattern: 'E D A E', chords: 'E - D - A', nashvilleNumbers: '1 - b7 - 4', category: 'guitar' },
  { id: 'g75', title: 'Highway to Hell', description: 'AC/DC\'s simple, massive drive.', pattern: 'A D/F# G D/F# G D/F# G D/F# A', chords: 'A - D - G', nashvilleNumbers: '1 - 4 - b7', category: 'guitar' },
  { id: 'g76', title: 'Thunderstruck', description: 'One-handed lightning leads.', pattern: '0 4 0 7 0 4 0 7', chords: 'B5 - A5 - E5', nashvilleNumbers: '1 - b7 - 4', category: 'guitar' },
  { id: 'g77', title: 'T.N.T.', description: 'The explosive rhythmic chant.', pattern: 'E G A G A G E', chords: 'E - G - A', nashvilleNumbers: '1 - b3 - 4', category: 'guitar' },
  { id: 'g78', title: 'Crazy Train', description: 'The pedal tone minor exercise.', pattern: 'F# F# C# F# D F# C# F# B A G# A B G#', chords: 'F#m - D - E', nashvilleNumbers: '1m - b6 - b7', category: 'guitar' },
  { id: 'g79', title: 'Flying High Again', description: 'Ozzy\'s soaring melodic anthems.', pattern: 'A G D A', chords: 'A - G - D - A', nashvilleNumbers: '1 - b7 - 4 - 1', category: 'guitar' },
  { id: 'g80', title: 'Mr. Crowley', description: 'Gothic metal minor arpeggio genius.', pattern: 'Dm Bb C F', chords: 'Dm - Bb - C - F', nashvilleNumbers: '1m - b6 - b7 - b3', category: 'guitar' },
  { id: 'g81', title: 'Sabbath Bloody Sabbath', description: 'Heavy doom meeting jazzy transitions.', pattern: 'B G F B', chords: 'Bm - G - F', nashvilleNumbers: '1m - b6 - b5', category: 'guitar' },
  { id: 'g82', title: 'War Pigs', description: 'The air-raid siren of heavy metal.', pattern: 'E E D E E D E', chords: 'E - D - E', nashvilleNumbers: '1 - b7 - 1', category: 'guitar' },
  { id: 'g83', title: 'Children of Grave', description: 'The galloping metal rhythm.', pattern: 'C# C# C# C#', chords: 'C#m - E - D', nashvilleNumbers: '1m - b3 - b2', category: 'guitar' },
  { id: 'g84', title: 'N.I.B.', description: 'Iommi\'s heavy blues foundation.', pattern: 'E G A E Bb A G', chords: 'Em - G - A', nashvilleNumbers: '1m - b3 - 4', category: 'guitar' },
  { id: 'g85', title: 'Fairies Wear Boots', description: 'Heavy blues-rock shuffle.', pattern: 'A G F E D', chords: 'A - G - F', nashvilleNumbers: '1 - b7 - b6', category: 'guitar' },
  { id: 'g86', title: 'Iron Man', description: 'The robotic metal anthem.', pattern: 'B D D E E G F# G F# G D D E E', chords: 'B5 - D5 - E5', nashvilleNumbers: '1 - b3 - 4', category: 'guitar' },
  { id: 'g87', title: 'Eye of the Tiger', description: 'The boxing-glove rhythmic pulse.', pattern: 'Cm Cm Bb Cm Bb Cm Bb G#', chords: 'Cm - Ab - Bb', nashvilleNumbers: '1m - b6 - b7', category: 'guitar' },
  { id: 'g88', title: 'Livin\' on a Prayer', description: 'Talk-box rock rhythm.', pattern: 'Em C D Em', chords: 'Em - C - D', nashvilleNumbers: '6m - 4 - 5', category: 'guitar' },
  { id: 'g89', title: 'You Give Love a Bad Name', description: 'Eighties stadium rock power.', pattern: 'Cm Ab Bb Cm', chords: 'Cm - Ab - Bb - Cm', nashvilleNumbers: '1m - b6 - b7 - 1m', category: 'guitar' },
  { id: 'g90', title: 'The Final Countdown', description: 'Europop-metal synth riff.', pattern: 'F#m D Bm E', chords: 'F#m - D - Bm - E', nashvilleNumbers: '1m - b6 - 4m - b7', category: 'guitar' },
  { id: 'g91', title: 'Jump (Guitar Part)', description: 'Van Halen pop-rock energy.', pattern: 'C G F G', chords: 'C - F - G', nashvilleNumbers: '1 - 4 - 5', category: 'guitar' },
  { id: 'g92', title: 'Panama', description: 'Eddie\'s high-speed luxury rhythm.', pattern: 'E B A B', chords: 'E - B - A', nashvilleNumbers: '1 - 5 - 4', category: 'guitar' },
  { id: 'g93', title: 'Ain\'t Talkin\' Bout Love', description: 'The dark minor pop-metal riff.', pattern: 'Am F G Am', chords: 'Am - F - G', nashvilleNumbers: '1m - b6 - b7', category: 'guitar' },
  { id: 'g94', title: 'Eruption', description: 'The tapping technique revolution.', pattern: 'Tap Tap Tap', chords: 'Ab - Bb - C', nashvilleNumbers: 'b6 - b7 - 1', category: 'guitar' },
  { id: 'g95', title: 'Runnin\' With Devil', description: 'Simple, raw, and full of attitude.', pattern: 'E F# G G#', chords: 'E - G - A', nashvilleNumbers: '1 - b3 - 4', category: 'guitar' },
  { id: 'g96', title: 'Ice Cream Man', description: 'Acoustic blues to electric shred.', pattern: 'E A E B A E', chords: 'E - A - B7', nashvilleNumbers: '1 - 4 - 57', category: 'guitar' },
  { id: 'g97', title: 'Unchained', description: 'Deep, brown-sound drop-D magic.', pattern: 'D G A G D', chords: 'D5 - G5 - A5', nashvilleNumbers: '1 - 4 - 5', category: 'guitar' },
  { id: 'g98', title: 'Voodoo Child', description: 'The wah-wah intro of the gods.', pattern: 'E E G A G E', chords: 'E7 - G - A', nashvilleNumbers: '17 - b3 - 4', category: 'guitar' },
  { id: 'g99', title: 'Foxy Lady', description: 'Fuzzed-out blues brilliance.', pattern: 'F# F# F# F# (Slide)', chords: 'F#7#9 - B - E', nashvilleNumbers: '17 - 4 - b7', category: 'guitar' },
  { id: 'g100', title: 'Crosstown Traffic', description: 'The funky, octave-laden rock.', pattern: 'C# F# G#', chords: 'C#7 - F# - B', nashvilleNumbers: '17 - 4 - b7', category: 'guitar' },
  { id: 'g101', title: 'Machine Gun', description: 'Epic, screaming fuzzed-out odyssey.', pattern: 'E G# A Bb B', chords: 'E7 - G - A', nashvilleNumbers: '17 - b3 - 4', category: 'guitar' },
  
  // --- UKULELE (21 RIFFS) ---
  { id: 'u1', title: 'Over the Rainbow', description: 'Israel Kamakawiwoʻole\'s legendary island strum.', pattern: 'D - DU - UDU', chords: 'C - G - Am - F', refrain: 'Somewhere over the rainbow, way up high...', nashvilleNumbers: '1 - 5 - 6m - 4', category: 'ukulele' },
  { id: 'u2', title: 'Riptide', description: 'Fast, percussive folk strum for high energy.', pattern: 'D D U U D U', chords: 'Am - G - C', refrain: 'I was scared of dentists and the dark, I was scared of pretty girls and starting conversations...', nashvilleNumbers: '6m - 5 - 1', category: 'ukulele' },
  { id: 'u3', title: 'I\'m Yours', description: 'Jason Mraz\'s relaxed reggae-influenced island rhythm.', pattern: 'D U - U - U - U', chords: 'C - G - Am - F', nashvilleNumbers: '1 - 5 - 6m - 4', category: 'ukulele' },
  { id: 'u4', title: 'Count On Me', description: 'Bruno Mars\' cheerful rhythmic foundation.', pattern: '4 3 2 1 2 3', chords: 'C - Em - Am - G - F', nashvilleNumbers: '1 - 3m - 6m - 5 - 4', category: 'ukulele' },
  { id: 'u5', title: 'Hey Soul Sister', description: 'Rapid, bright Train-inspired pop strum.', pattern: 'D DU UDU', chords: 'E - B - C#m - A', nashvilleNumbers: '1 - 5 - 6m - 4', category: 'ukulele' },
  { id: 'u6', title: 'Pineapple Mango', description: 'Traditional Hawaiian tropical picking.', pattern: 'G C E A E C', chords: 'C - F - G7 - C', nashvilleNumbers: '1 - 4 - 57 - 1', category: 'ukulele' },
  { id: 'u7', title: 'Lazy Day Blues', description: 'A slow swing rhythm for lazy afternoons.', pattern: 'D - D U - D', chords: 'A7 - D7 - G7 - C', nashvilleNumbers: '67 - 27 - 57 - 1', category: 'ukulele' },
  { id: 'u8', title: 'Hava Nagila (Uke)', description: 'Upbeat traditional celebratory melody.', pattern: 'A A G# A B A G# F#', chords: 'Am - E7 - Am', nashvilleNumbers: '1m - 57 - 1m', category: 'ukulele' },
  { id: 'u9', title: 'Somewhere Down', description: 'Jack Johnson style percussive muted strum.', pattern: 'D X U U X U', chords: 'C - G - Am - F', nashvilleNumbers: '1 - 5 - 6m - 4', category: 'ukulele' },
  { id: 'u10', title: 'Moonlight Ukulele', description: 'Gentle arpeggiated minor progression.', pattern: '4 3 (2 1)', chords: 'Am - Dm - E7', nashvilleNumbers: '1m - 4m - 57', category: 'ukulele' },
  { id: 'u11', title: 'Brave (Sara B.)', description: 'Driving anthem rhythm for soprano uke.', pattern: 'D D U D D U', chords: 'Bb - Gm - Eb - F', nashvilleNumbers: '1 - 6m - 4 - 5', category: 'ukulele' },
  { id: 'u12', title: 'You Are My Sunshine', description: 'The absolute beginner first picking melody.', pattern: 'C C D E E E D E C', chords: 'C - F - C', nashvilleNumbers: '1 - 4 - 1', category: 'ukulele' },
  { id: 'u13', title: 'Lava', description: 'Pixar-inspired volcano love song rhythm.', pattern: 'D - DU - UDU', chords: 'C - G7 - F - C - G7', nashvilleNumbers: '1 - 57 - 4 - 1 - 57', category: 'ukulele' },
  { id: 'u14', title: 'Twinkle Twinkle', description: 'Classic lullaby teaching melody.', pattern: 'G G A A B B A', chords: 'C - F - C - G7 - C', nashvilleNumbers: '1 - 4 - 1 - 57 - 1', category: 'ukulele' },
  { id: 'u15', title: 'Uke Metal', description: 'A surpisingly aggressive percussive pattern.', pattern: 'D U D U D X', chords: 'Am - F - E7', nashvilleNumbers: '1m - b6 - 57', category: 'ukulele' },
  { id: 'u16', title: 'Bossa Nova Uke', description: 'Complex Latin jazz syncopation.', pattern: 'D - U X - U -', chords: 'Cmaj7 - Am7 - Dm7 - G7', nashvilleNumbers: '1maj7 - 6m7 - 2m7 - 57', category: 'ukulele' },
  { id: 'u17', title: 'Can\'t Help Falling', description: 'Elvis Presley\'s romantic 6/8 arpeggio.', pattern: '4 3 2 1 2 3', chords: 'C - Em - Am - F - C - G', nashvilleNumbers: '1 - 3m - 6m - 4 - 1 - 5', category: 'ukulele' },
  { id: 'u18', title: 'Stand By Me (Uke)', description: 'Ben E. King classic pop foundation.', pattern: 'D D U U D U', chords: 'C - Am - F - G7 - C', nashvilleNumbers: '1 - 6m - 4 - 57 - 1', category: 'ukulele' },
  { id: 'u19', title: 'Tiptoe Through Tulips', description: 'Tiny Tim\'s historic vaudeville strum.', pattern: 'D U D U (X)', chords: 'C - A7 - F - G7', nashvilleNumbers: '1 - 67 - 4 - 57', category: 'ukulele' },
  { id: 'u20', title: 'La Cucaracha', description: 'Fast traditional Mexican folk dance.', pattern: 'C C C F A', chords: 'F - C7 - F', nashvilleNumbers: '1 - 57 - 1', category: 'ukulele' },
  { id: 'u21', title: 'Hokey Pokey', description: 'Fundamental rhythmic coordination exercise.', pattern: 'D U D U D U D U', chords: 'C - G7 - C', nashvilleNumbers: '1 - 57 - 1', category: 'ukulele' },

  // --- 12-STRING GUITAR (21 RIFFS) ---
  { id: 't1', title: 'Wish You Were Here', description: 'Pink Floyd\'s iconic rich harmonic intro.', pattern: 'G G A B D E', chords: 'G - C - D - Am', nashvilleNumbers: '1 - 4 - 5 - 2m', category: '12string' },
  { id: 't2', title: 'Hotel California', description: 'Intricate 12-string acoustic arpeggio hook.', pattern: 'Bm F#7 A E G D Em F#', chords: 'Bm - F#7 - A - E - G - D - Em - F#', nashvilleNumbers: '1m - 57 - b7 - 4 - b6 - b3 - 4m - 57', category: '12string' },
  { id: 't3', title: 'Over The Hills', description: 'Zeppelin\'s sparkling pull-off melody.', pattern: 'G D C G D', chords: 'G - D - Cadd9 - G', nashvilleNumbers: '1 - 5 - 4 - 1', category: '12string' },
  { id: 't4', title: 'Space Oddity', description: 'Bowie\'s choral-like 12-string chord work.', pattern: 'Fmaj7 Em', chords: 'Fmaj7 - Em - C - Am', nashvilleNumbers: '4maj7 - 3m - 1 - 6m', category: '12string' },
  { id: 't5', title: 'Hard Day\'s Night', description: 'The famous opening chord heard \'round the world.', pattern: 'G7sus4 resonate', chords: 'G7sus4 - C - D7 - G', nashvilleNumbers: '17sus4 - 4 - 57 - 1', category: '12string' },
  { id: 't6', title: 'Mr. Tambourine Man', description: 'The Byrds\' jingle-jangle folk rock sound.', pattern: 'D G A D', chords: 'G - A - D - G', nashvilleNumbers: '4 - 5 - 1 - 4', category: '12string' },
  { id: 't7', title: 'Ticket to Ride', description: 'Lennon\'s syncopated high-octave melody.', pattern: 'A A A Baby', chords: 'A7 - D7 - E7', nashvilleNumbers: '17 - 47 - 57', category: '12string' },
  { id: 't8', title: 'Tangerine', description: 'Zeppelin\'s melancholic open chord strum.', pattern: 'Am G D F', chords: 'Am - G - D - F', nashvilleNumbers: '1m - b7 - 4 - b6', category: '12string' },
  { id: 't9', title: 'Turn! Turn! Turn!', description: 'The definitive 12-string electric Rick sound.', pattern: 'D G D A', chords: 'D - G - A - D', nashvilleNumbers: '1 - 4 - 5 - 1', category: '12string' },
  { id: 't10', title: 'Wanted Dead or Alive', description: 'Bon Jovi\'s descending minor-octave riff.', pattern: 'D C G F D', chords: 'Dm - C - G - F - Dm', nashvilleNumbers: '1m - b7 - b4 - b3 - 1m', category: '12string' },
  { id: 't11', title: 'More Than a Feeling', description: 'Boston\'s clean choral acoustic layers.', pattern: 'G C Em D', chords: 'G - C - Em - D', nashvilleNumbers: '1 - 4 - 6m - 5', category: '12string' },
  { id: 't12', title: 'Life in the Fast Lane', description: 'High-octave layered rock drive.', pattern: 'E G A G E', chords: 'E5 - A5 - G5', nashvilleNumbers: '1 - 4 - b3', category: '12string' },
  { id: 't13', title: 'The Joker', description: 'Steve Miller\'s laid back octave groove.', pattern: 'G C D C G', chords: 'G - C - D - C', nashvilleNumbers: '1 - 4 - 5 - 4', category: '12string' },
  { id: 't14', title: 'Closer to the Heart', description: 'Rush\'s melodic 12-string complexity.', pattern: 'A D G D A', chords: 'A - G - D - A', nashvilleNumbers: '1 - b7 - 4 - 1', category: '12string' },
  { id: 't15', title: 'A Horse With No Name', description: 'America\'s hypnotic two-chord shimmer.', pattern: 'Em D6/9', chords: 'Em - D6/9', nashvilleNumbers: '1m - 4(add9)', category: '12string' },
  { id: 't16', title: 'Handle With Care', description: 'Traveling Wilburys\' collaborative jangle.', pattern: 'D G A Bm', chords: 'D - G - A - Bm', nashvilleNumbers: '1 - 4 - 5 - 6m', category: '12string' },
  { id: 't17', title: 'Suicide Blonde', description: 'INXS funk-rock with high-octave sparkle.', pattern: 'Am G F G', chords: 'Am - G - F - G', nashvilleNumbers: '1m - b7 - b6 - b7', category: '12string' },
  { id: 't18', title: 'Hurricane', description: 'Dylan\'s driving minor progression.', pattern: 'Am F Am G', chords: 'Am - F - G - C', nashvilleNumbers: '6m - 4 - 5 - 1', category: '12string' },
  { id: 't19', title: 'Eight Miles High', description: 'Psychedelic Rickenbacker dissonance.', pattern: 'Em G D A', chords: 'Em - G - D - A', nashvilleNumbers: '1m - b3 - b7 - 4', category: '12string' },
  { id: 't20', title: 'Maggie May', description: 'Rod Stewart\'s bright acoustic textures.', pattern: 'D G D G D A', chords: 'A - D - G - D', nashvilleNumbers: '5 - 1 - 4 - 1', category: '12string' },
  { id: 't21', title: 'Substitute', description: 'The Who\'s heavy acoustic power strum.', pattern: 'A D G D A', chords: 'D - G - A - D', nashvilleNumbers: '1 - 4 - 5 - 1', category: '12string' },
];
