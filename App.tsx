
import React, { useState } from 'react';
import { Heart, Settings, History, Info, MessageCircle } from 'lucide-react';
import Home from './components/Home';
import Session from './components/Session';
import ScriptureLibrary from './components/ScriptureLibrary';
import { TurnConfig } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'session' | 'scripture'>('home');
  const [config, setConfig] = useState<TurnConfig>({
    maxWords: 150,
    maxSeconds: 120
  });

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            onStart={() => setCurrentView('session')} 
            onViewScripture={() => setCurrentView('scripture')}
            config={config}
            onUpdateConfig={setConfig}
          />
        );
      case 'session':
        return <Session config={config} onEnd={() => setCurrentView('home')} />;
      case 'scripture':
        return <ScriptureLibrary onBack={() => setCurrentView('home')} />;
      default:
        return <Home onStart={() => setCurrentView('session')} onViewScripture={() => setCurrentView('scripture')} config={config} onUpdateConfig={setConfig} />;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-white shadow-xl relative overflow-hidden safe-top safe-bottom">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 bg-white sticky top-0 z-10 border-b border-slate-100 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Bridge</h1>
          </div>
          <button 
            onClick={() => setCurrentView('home')}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        {renderView()}
      </main>

      {/* Bottom Nav */}
      <nav className="flex justify-around items-center pt-3 pb-8 bg-white border-t border-slate-100 flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 w-20 transition-all ${currentView === 'home' ? 'text-emerald-600 scale-110' : 'text-slate-400 opacity-60'}`}
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Guide</span>
        </button>
        <button 
          onClick={() => setCurrentView('session')}
          className={`relative flex flex-col items-center gap-1 w-20 ${currentView === 'session' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <div className={`p-4 -mt-10 rounded-full shadow-lg transition-all duration-300 ${currentView === 'session' ? 'bg-emerald-600 text-white scale-110 rotate-12' : 'bg-white text-slate-400 border border-slate-100'}`}>
            <Heart className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${currentView === 'session' ? 'opacity-100' : 'opacity-60'}`}>Peace</span>
        </button>
        <button 
          onClick={() => setCurrentView('scripture')}
          className={`flex flex-col items-center gap-1 w-20 transition-all ${currentView === 'scripture' ? 'text-emerald-600 scale-110' : 'text-slate-400 opacity-60'}`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Wisdom</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
