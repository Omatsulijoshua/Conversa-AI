"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Trash2, 
  Upload, 
  Waves,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function VoiceLab() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Voice Lab</h1>
        <p className="text-gray-400">Record your voice to create a custom AI clone for your agents.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className={`w-24 h-24 rounded-full mb-8 flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse scale-110' : 'bg-indigo-600'}`}>
            <Mic className="text-white w-10 h-10" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{isRecording ? 'Recording...' : 'Ready to Record'}</h2>
            <p className="text-5xl font-mono font-bold text-indigo-400 mb-4">{formatTime(recordingTime)}</p>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Read the script below clearly. For best results, record in a quiet environment.
            </p>
          </div>

          <div className="flex gap-4">
            {!isRecording ? (
              <button 
                onClick={startRecording}
                className="btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            ) : (
              <button 
                onClick={stopRecording}
                className="btn-primary flex items-center gap-2 bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </button>
            )}
            
            {audioUrl && !isRecording && (
              <button 
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                }}
                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
              >
                <Trash2 className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Waves className="w-5 h-5 text-indigo-400" />
              Recording Script
            </h3>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 leading-relaxed text-gray-300 italic">
              "Welcome to Conversa AI. I am excited to show you how our intelligent voice agents can transform your customer support. Our platform provides real-time, human-like conversations that scale with your business needs."
            </div>
          </div>

          {audioUrl && (
            <div className="glass-card p-6 animate-fade-in border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-lg font-bold mb-4">Review Recording</h3>
              <audio src={audioUrl} controls className="w-full mb-6 accent-indigo-500" />
              
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Train Voice Model
              </button>
            </div>
          )}

          <div className="glass-card p-6 bg-amber-500/5 border-amber-500/20">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              Pro Tip
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Recording at least 60 seconds of high-quality audio significantly improves the fidelity of your AI voice clone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
