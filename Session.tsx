
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  X, Mic, MicOff, RotateCcw, 
  ChevronRight, AlertCircle, Quote, 
  Smile, Frown, Users, Activity,
  Clock
} from 'lucide-react';
import { TurnConfig, ConversationStats, SessionState } from '../types';
import { SCRIPTURES, I_PHRASES, YOU_PHRASES, PRAISE_PHRASES, TENSION_PHRASES } from '../constants';

interface SessionProps {
  config: TurnConfig;
  onEnd: () => void;
}

const Session: React.FC<SessionProps> = ({ config, onEnd }) => {
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.IDLE);
  const [currentUser, setCurrentUser] = useState<'A' | 'B'>('A');
  const [transcription, setTranscription] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<'A' | 'B', ConversationStats>>({
    A: { wordCount: 0, timeSpent: 0, iStatements: 0, youStatements: 0, praiseCount: 0, tensionPhrases: 0 },
    B: { wordCount: 0, timeSpent: 0, iStatements: 0, youStatements: 0, praiseCount: 0, tensionPhrases: 0 }
  });
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  // Ref to track currentUser and sessionState for long-lived callbacks to avoid stale closures
  const currentUserRef = useRef<'A' | 'B'>('A');
  const sessionStateRef = useRef<SessionState>(SessionState.IDLE);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    sessionStateRef.current = sessionState;
  }, [sessionState]);

  // Audio helpers
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const analyzeText = useCallback((text: string, user: 'A' | 'B') => {
    const words = text.toLowerCase();
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    let iCount = 0;
    I_PHRASES.forEach(p => { if (words.includes(p.toLowerCase())) iCount++; });
    
    let youCount = 0;
    YOU_PHRASES.forEach(p => { if (words.includes(p.toLowerCase())) youCount++; });

    let pCount = 0;
    PRAISE_PHRASES.forEach(p => { if (words.includes(p.toLowerCase())) pCount++; });

    let tCount = 0;
    TENSION_PHRASES.forEach(p => { if (words.includes(p.toLowerCase())) tCount++; });

    setStats(prev => ({
      ...prev,
      [user]: {
        ...prev[user],
        wordCount: prev[user].wordCount + wordCount,
        iStatements: prev[user].iStatements + iCount,
        youStatements: prev[user].youStatements + youCount,
        praiseCount: prev[user].praiseCount + pCount,
        tensionPhrases: prev[user].tensionPhrases + tCount
      }
    }));
  }, []);

  // Initialize and connect to Gemini Live API
  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setSessionState(SessionState.RECORDING);
            const source = audioCtx.createMediaStreamSource(stream);
            const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              // Only send audio data if the session state is recording, using Ref to avoid stale closure
              if (sessionStateRef.current === SessionState.RECORDING) {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                // CRITICAL: Solely rely on sessionPromise resolves and then call session.sendRealtimeInput
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              if (text) {
                setTranscription(prev => [...prev, text]);
                // Analyze text for keywords using current user from Ref
                analyzeText(text, currentUserRef.current);
              }
            }
          },
          onerror: (e) => {
            console.error(e);
            setError("Connection lost. Please try again.");
          },
          onclose: () => {
            setSessionState(SessionState.IDLE);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: 'You are a silent observer and transcriber for a therapy session. Transcribe exactly what you hear.'
        }
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err: any) {
      setError(err.message || "Failed to start microphone.");
    }
  };

  useEffect(() => {
    if (sessionState === SessionState.RECORDING) {
      timerRef.current = window.setInterval(() => {
        setActiveSeconds(prev => prev + 1);
        setStats(prev => ({
          ...prev,
          [currentUser]: {
            ...prev[currentUser],
            timeSpent: prev[currentUser].timeSpent + 1
          }
        }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sessionState, currentUser]);

  const toggleUser = () => {
    setCurrentUser(prev => prev === 'A' ? 'B' : 'A');
    setActiveSeconds(0);
  };

  const endSession = () => {
    if (audioContextRef.current) audioContextRef.current.close();
    onEnd();
  };

  const currentStat = stats[currentUser];
  const isTimeUp = activeSeconds >= config.maxSeconds;
  const isWordLimitUp = currentStat.wordCount >= config.maxWords;
  const showAlarm = isTimeUp || isWordLimitUp;

  // Find a random relevant scripture for current situation
  const relevantScripture = SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)];

  return (
    <div className="flex flex-col h-full space-y-6 animate-fadeIn">
      {/* Session Header */}
      <div className="flex justify-between items-center">
        <button onClick={endSession} className="text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Speaker</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${sessionState === SessionState.RECORDING ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <h2 className="text-lg font-bold text-slate-800">Person {currentUser}</h2>
          </div>
        </div>
        <button onClick={() => setTranscription([])} className="text-slate-400 hover:text-slate-600">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Stats Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border-2 transition-all ${showAlarm ? 'border-red-400 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex justify-between items-start mb-2">
            {/* Added missing Clock icon import */}
            <Clock className={`w-4 h-4 ${isTimeUp ? 'text-red-500' : 'text-slate-400'}`} />
            <span className={`text-xl font-mono font-bold ${isTimeUp ? 'text-red-600' : 'text-slate-700'}`}>
              {Math.floor(activeSeconds / 60)}:{(activeSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Time Used</p>
        </div>
        <div className={`p-4 rounded-2xl border-2 transition-all ${isWordLimitUp ? 'border-red-400 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex justify-between items-start mb-2">
            <Activity className={`w-4 h-4 ${isWordLimitUp ? 'text-red-500' : 'text-slate-400'}`} />
            <span className={`text-xl font-mono font-bold ${isWordLimitUp ? 'text-red-600' : 'text-slate-700'}`}>
              {currentStat.wordCount}
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Words Said</p>
        </div>
      </div>

      {/* Language Patterns Analysis */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-3 h-3" />
          Pattern Watcher
        </h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              "I" Statements
            </span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
              {currentStat.iStatements}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              "You" Statements
            </span>
            <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs">
              {currentStat.youStatements}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Words of Praise
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
              {currentStat.praiseCount}
            </span>
          </div>
        </div>
      </div>

      {/* Gentle Nudge Alert */}
      {showAlarm && (
        <div className="animate-bounce bg-red-500 text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-red-200">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Turn Limit Reached!</p>
            <p className="text-xs opacity-90">Please finish your thought and let the other person speak.</p>
          </div>
        </div>
      )}

      {/* Wisdom Quote */}
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden group">
        <Quote className="absolute -top-2 -left-2 w-12 h-12 text-emerald-200 opacity-50" />
        <p className="text-emerald-800 text-sm italic font-medium relative z-10 serif">
          "{relevantScripture.text}"
        </p>
        <p className="text-emerald-600 text-[10px] font-bold mt-2 text-right">
          — {relevantScripture.reference}
        </p>
      </div>

      {/* Live Transcription Box */}
      <div className="flex-1 bg-slate-900 rounded-2xl p-4 overflow-y-auto text-slate-300 font-mono text-xs leading-relaxed max-h-[120px]">
        {transcription.length === 0 ? (
          <p className="opacity-40 italic">Waiting for words...</p>
        ) : (
          transcription.join(' ')
        )}
      </div>

      {/* Control Actions */}
      <div className="grid grid-cols-2 gap-4 pb-4">
        {sessionState === SessionState.IDLE ? (
          <button 
            onClick={startSession}
            className="col-span-2 w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3"
          >
            <Mic className="w-5 h-5" />
            Begin Listening
          </button>
        ) : (
          <>
            <button 
              onClick={() => setSessionState(sessionState === SessionState.RECORDING ? SessionState.PAUSED : SessionState.RECORDING)}
              className={`font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${sessionState === SessionState.RECORDING ? 'bg-slate-100 text-slate-700' : 'bg-emerald-600 text-white'}`}
            >
              {sessionState === SessionState.RECORDING ? (
                <><MicOff className="w-5 h-5" /> Pause</>
              ) : (
                <><Mic className="w-5 h-5" /> Resume</>
              )}
            </button>
            <button 
              onClick={toggleUser}
              className="bg-emerald-100 text-emerald-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              Switch Turns <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="fixed bottom-24 left-6 right-6 bg-red-600 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Session;
