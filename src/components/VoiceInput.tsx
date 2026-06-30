import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  placeholder?: string;
  className?: string;
}

export default function VoiceInput({ onTranscriptChange, placeholder = 'Type or speak your goal...', className = '' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [supportError, setSupportError] = useState<string | null>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        if (currentTranscript) {
          onTranscriptChange(currentTranscript);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSupportError('Microphone permission blocked. Please enable it in browser settings.');
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    } else {
      setSupportError('Web Speech API is not supported in this browser. Try Chrome/Safari.');
    }
  }, []);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setSupportError(null);
      try {
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        onClick={toggleListening}
        disabled={!!supportError && !recognition}
        className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
          isListening
            ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse'
            : 'bg-[#15152a] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
        }`}
        title={isListening ? 'Stop Listening' : 'Dictate Goal'}
        aria-label={isListening ? 'Stop Listening' : 'Dictate Goal'}
      >
        {isListening ? (
          <div className="flex items-center gap-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Mic className="w-4 h-4" />
          </div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Mic permission/unsupported errors block */}
      {supportError && (
        <div className="absolute top-12 left-0 right-0 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 flex items-center gap-2 text-[10px] text-red-400 z-50">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{supportError}</span>
        </div>
      )}
    </div>
  );
}
