import { useState, useEffect, useRef, useCallback } from 'react';

// YIN Pitch Detection Algorithm Constants
const THRESHOLD = 0.15;
const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 2048;

export interface PitchData {
  frequency: number;
  note: string;
  cents: number;
  clarity: number;
  amplitude: number;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getNoteFromFrequency(frequency: number, referenceA: number = 440): { note: string, cents: number } {
  const n = 12 * Math.log2(frequency / referenceA);
  const roundedN = Math.round(n);
  const cents = Math.floor((n - roundedN) * 100);
  
  const noteIndex = (roundedN + 69) % 12;
  const wrappedIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
  
  return {
    note: NOTES[wrappedIndex],
    cents
  };
}

export function usePitchDetection(referenceA: number = 440) {
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Smoothing buffers
  const samplesBuffer = useRef<number[]>([]);
  const EMA_ALPHA = 0.25; 
  const lastFrequency = useRef<number>(0);
  
  // Note Stability Logic
  const consecutiveNoteRef = useRef<string | null>(null);
  const consecutiveCountRef = useRef<number>(0);
  const STABILITY_THRESHOLD = 5;

  // Persistence logic (internalized)
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: SAMPLE_RATE
      });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = BUFFER_SIZE;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setIsActive(true);
      updatePitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }, [referenceA]);

  const stop = useCallback(() => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setPitchData(null);
    consecutiveCountRef.current = 0;
    consecutiveNoteRef.current = null;
  }, []);

  const updatePitch = () => {
    if (!analyserRef.current) return;
    
    const buffer = new Float32Array(BUFFER_SIZE);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    let rms = 0;
    for(let i=0; i<buffer.length; i++) rms += buffer[i]*buffer[i];
    rms = Math.sqrt(rms/buffer.length);
    
    if (rms < 0.01) {
      if (!clearTimerRef.current) {
        clearTimerRef.current = setTimeout(() => {
          setPitchData(null);
          clearTimerRef.current = null;
        }, 800);
      }
      animationFrameRef.current = requestAnimationFrame(updatePitch);
      return;
    } else {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
    }

    const freq = detectPitchYin(buffer, SAMPLE_RATE);
    
    if (freq > 50 && freq < 1200) {
      samplesBuffer.current.push(freq);
      if (samplesBuffer.current.length > 12) samplesBuffer.current.shift();
      
      const sorted = [...samplesBuffer.current].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      
      const smoothedFreq = (lastFrequency.current === 0) 
        ? median 
        : EMA_ALPHA * median + (1 - EMA_ALPHA) * lastFrequency.current;
        
      lastFrequency.current = smoothedFreq;
      
      const { note, cents } = getNoteFromFrequency(smoothedFreq, referenceA);

      if (note === consecutiveNoteRef.current) {
        consecutiveCountRef.current++;
      } else {
        consecutiveNoteRef.current = note;
        consecutiveCountRef.current = 1;
      }

      if (consecutiveCountRef.current >= STABILITY_THRESHOLD) {
        setPitchData({
          frequency: smoothedFreq,
          note,
          cents,
          clarity: 1.0,
          amplitude: rms
        });
      }
    } else {
      consecutiveCountRef.current = Math.max(0, consecutiveCountRef.current - 1);
    }
    
    animationFrameRef.current = requestAnimationFrame(updatePitch);
  };

  const detectPitchYin = (buffer: Float32Array, sampleRate: number): number => {
    const yinBuffer = new Float32Array(buffer.length / 2);
    for (let tau = 0; tau < yinBuffer.length; tau++) {
      for (let i = 0; i < yinBuffer.length; i++) {
        const delta = buffer[i] - buffer[i + tau];
        yinBuffer[tau] += delta * delta;
      }
    }
    yinBuffer[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau < yinBuffer.length; tau++) {
      runningSum += yinBuffer[tau];
      yinBuffer[tau] *= tau / runningSum;
    }
    let tau = -1;
    for (let t = 1; t < yinBuffer.length; t++) {
      if (yinBuffer[t] < THRESHOLD) {
        tau = t;
        break;
      }
    }
    if (tau === -1) {
      let minVal = 1;
      for (let t = 1; t < yinBuffer.length; t++) {
        if (yinBuffer[t] < minVal) {
          minVal = yinBuffer[t];
          tau = t;
        }
      }
      if (minVal > 0.25) return -1;
    }
    let refinedTau = tau;
    if (tau > 0 && tau < yinBuffer.length - 1) {
      const s0 = yinBuffer[tau - 1];
      const s1 = yinBuffer[tau];
      const s2 = yinBuffer[tau + 1];
      refinedTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    }
    return sampleRate / refinedTau;
  };

  useEffect(() => {
    return () => {
      stop();
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, [stop]);

  return { pitchData, isActive, start, stop };
}
