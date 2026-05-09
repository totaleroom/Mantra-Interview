import { useState, useEffect, useCallback, useRef } from 'react';

// Web Speech API type declarations (not all browsers ship these)
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechToText(lang: string = 'id-ID'): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldContinueRef = useRef(false);
  const langRef = useRef(lang);
  // restartRef holds the latest startNewSession fn — avoids stale closure in onend/onerror
  const restartRef = useRef<() => void>(() => {});

  const isSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Keep langRef in sync
  useEffect(() => { langRef.current = lang; }, [lang]);

  useEffect(() => {
    return () => {
      shouldContinueRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
      setTranscript('');
      setInterimTranscript('');
      setIsListening(false);
    };
  }, []);

  const startNewSession = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognitionConstructor = (window as unknown as Record<string, new () => SpeechRecognitionInstance>).webkitSpeechRecognition 
      || (window as unknown as Record<string, new () => SpeechRecognitionInstance>).SpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = langRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) setTranscript(prev => (prev ? prev + ' ' : '') + final);
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setInterimTranscript('');
      recognitionRef.current = null;
      // Use restartRef so we always call the latest version — no stale closure
      if (shouldContinueRef.current) {
        restartRef.current();
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setInterimTranscript('');
      if (shouldContinueRef.current && event.error !== 'not-allowed' && event.error !== 'service-not-allowed') {
        setTimeout(() => {
          if (shouldContinueRef.current) restartRef.current();
        }, 300);
      } else {
        shouldContinueRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch {}
  }, [isSupported]);

  // Keep restartRef pointing to the latest startNewSession
  useEffect(() => { restartRef.current = startNewSession; }, [startNewSession]);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    shouldContinueRef.current = true;
    setIsListening(true);
    startNewSession();
  }, [isSupported, startNewSession]);

  const stopListening = useCallback(() => {
    shouldContinueRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return { isListening, transcript, interimTranscript, isSupported, startListening, stopListening, resetTranscript };
}
