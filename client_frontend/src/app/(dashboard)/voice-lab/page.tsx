"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Mic2, 
  Save, 
  Volume2, 
  Sliders, 
  Sparkles, 
  MessageSquare,
  Mic,
  Square,
  Trash2,
  CheckCircle2,
  Waves,
  Loader2
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function VoiceLabPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCloning, setIsCloning] = useState(false);
  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [cloneMessage, setCloneMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const voices = [
    { id: '1', name: 'Amy', gender: 'Female', personality: 'Professional', previewUrl: '#' },
    { id: '2', name: 'Marcus', gender: 'Male', personality: 'Energetic', previewUrl: '#' },
    { id: '3', name: 'Sophia', gender: 'Female', personality: 'Friendly', previewUrl: '#' },
  ];

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

  const handleCloneVoice = async () => {
    if (chunksRef.current.length === 0) return;
    setIsCloning(true);
    
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('name', 'My Cloned Voice');

    try {
      const token = localStorage.getItem('conversa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/voice/clone`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(result?.message || 'Cloning failed');
      
      setClonedSuccess(true);
      setCloneMessage(result?.message || `Voice ready: ${result?.voiceId || 'saved'}`);
      setTimeout(() => setClonedSuccess(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clone voice.';
      setCloneMessage(message);
      alert(message);
    } finally {
      setIsCloning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Voice <span className="text-indigo-500">Lab</span></h1>
          <p className="text-slate-400 text-lg">Configure and test high-fidelity neural voices</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Cloning Station */}
          <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isRecording ? 'bg-rose-500 animate-pulse scale-110 shadow-rose-500/50' : 'bg-indigo-600 shadow-indigo-500/50'}`}>
                <Mic className="text-white w-10 h-10" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Clone Your Voice</h3>
                <p className="text-indigo-100/70 mb-6 max-w-md">Record at least 60 seconds of clear speech to create a high-fidelity AI clone of your own voice.</p>
                
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  {!isRecording ? (
                    <button onClick={startRecording} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-500 transition-all flex items-center gap-2 animate-pulse">
                      <Square className="w-5 h-5" />
                      Stop ({formatTime(recordingTime)})
                    </button>
                  )}
                  
                  {audioUrl && !isRecording && (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCloneVoice}
                        disabled={isCloning}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isCloning ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        {clonedSuccess ? 'Voice Cloned!' : 'Train My AI Voice'}
                      </button>
                      <button onClick={() => setAudioUrl(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                        <Trash2 className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  )}
                </div>
                {cloneMessage && (
                  <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {cloneMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voices.map((voice) => (
              <div key={voice.id} className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-indigo-600/5 hover:border-indigo-500/30 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-indigo-600 transition-all">
                      <Mic2 className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{voice.name}</h3>
                      <p className="text-xs text-slate-500">{voice.personality} • {voice.gender}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPlaying(playing === voice.id ? null : voice.id)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                  >
                    {playing === voice.id ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-indigo-400" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sliders className="w-6 h-6 text-indigo-400" />
              Advanced Tuning
            </h3>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stability</span>
                  <span className="text-white font-mono">0.75</span>
                </div>
                <input type="range" className="w-full accent-indigo-600 bg-white/10 rounded-lg h-2" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Clarity + Similarity Enhancement</span>
                  <span className="text-white font-mono">0.50</span>
                </div>
                <input type="range" className="w-full accent-indigo-600 bg-white/10 rounded-lg h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Test Bench
            </h3>
            <div className="flex-1 space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Preview Script</p>
              <textarea 
                className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Enter text here to test the voice..."
                defaultValue="Hello! I'm your Conversa AI assistant. I can handle complex inquiries, book appointments, and provide support with natural, human-like voice synthesis. How can I help you today?"
              />
              <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95">
                <Volume2 className="w-6 h-6" />
                Preview Voice
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <Waves className="w-5 h-5 text-amber-400" />
                <p className="text-xs text-amber-300">Tip: For best cloning results, speak naturally in a quiet room for at least 60 seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
