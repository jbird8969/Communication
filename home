
import React, { useState } from 'react';
import { Play, BookOpen, Clock, AlignLeft, ShieldCheck, Share2, HelpCircle, X } from 'lucide-react';
import { TurnConfig } from '../types';

interface HomeProps {
  onStart: () => void;
  onViewScripture: () => void;
  config: TurnConfig;
  onUpdateConfig: (config: TurnConfig) => void;
}

const Home: React.FC<HomeProps> = ({ onStart, onViewScripture, config, onUpdateConfig }) => {
  const [showHelp, setShowHelp] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bridge Communication App',
          text: 'Check out this app to help us communicate better!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      alert("Copy this link to your partner: " + window.location.href);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-2">
              <h3 className="serif text-2xl font-bold text-slate-800">How Bridge Works</h3>
              <p className="text-sm text-slate-500 italic">"Be quick to listen, slow to speak."</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-emerald-100 text-emerald-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                <p className="text-sm text-slate-600 font-medium">Place the phone on the table between both of you.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-100 text-emerald-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                <p className="text-sm text-slate-600 font-medium">Person A speaks first. The app tracks time and words to ensure one person doesn't "consume" the talk.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-100 text-emerald-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                <p className="text-sm text-slate-600 font-medium">When prompted or finished, tap "Switch Turns." Now Person B has the floor.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-emerald-100 text-emerald-600 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                <p className="text-sm text-slate-600 font-medium">Watch the "Pattern Watcher" to see if you are using "I" statements or too many "You" accusations.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="serif text-3xl font-bold text-slate-800 leading-tight">
            Communicate with <span className="text-emerald-600 italic">Grace</span>
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowHelp(true)}
              className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={handleShare}
              className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Bridge helps you navigate difficult topics without one person consuming the conversation.
        </p>
      </section>

      <section className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Gentle Nudge Settings
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Time Limit per Turn
              </label>
              <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {Math.floor(config.maxSeconds / 60)}:{(config.maxSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="600" 
              step="30"
              value={config.maxSeconds}
              onChange={(e) => onUpdateConfig({ ...config, maxSeconds: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-emerald-500" />
                Word Limit per Turn
              </label>
              <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {config.maxWords} words
              </span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="1000" 
              step="20"
              value={config.maxWords}
              onChange={(e) => onUpdateConfig({ ...config, maxWords: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={onStart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Heart-to-Heart
        </button>
        
        <button 
          onClick={onViewScripture}
          className="w-full bg-white border-2 border-slate-100 hover:border-emerald-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Communication Wisdom
        </button>
      </div>

      <div className="text-center space-y-4">
        <p className="text-xs text-slate-400 italic px-8">
          "She opens her mouth with wisdom, and the teaching of kindness is on her tongue."
        </p>
        <div className="pt-4">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Add to Home Screen</p>
          <p className="text-[9px] text-slate-400 mt-1">Tap Share > Add to Home Screen to use as an app</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
