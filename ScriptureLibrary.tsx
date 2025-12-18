
import React, { useState } from 'react';
import { ChevronLeft, Search, Filter, Bookmark } from 'lucide-react';
import { SCRIPTURES } from '../constants';

interface ScriptureLibraryProps {
  onBack: () => void;
}

const ScriptureLibrary: React.FC<ScriptureLibraryProps> = ({ onBack }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredScriptures = filter === 'all' 
    ? SCRIPTURES 
    : SCRIPTURES.filter(s => s.category === filter);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Wisdom Library</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {['all', 'listening', 'anger', 'peace', 'praise'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === cat 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Verse List */}
      <div className="space-y-4">
        {filteredScriptures.map((scripture, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {scripture.category}
              </span>
              <Bookmark className="w-4 h-4 text-slate-200 cursor-pointer hover:text-emerald-400" />
            </div>
            <p className="text-slate-700 leading-relaxed font-medium serif italic">
              "{scripture.text}"
            </p>
            <p className="text-sm font-bold text-slate-900">
              — {scripture.reference}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Mindset</p>
        <p className="text-sm text-slate-600 leading-relaxed italic">
          "The heart of the righteous weighs its answers, but the mouth of the wicked gushes evil."
        </p>
        <p className="text-[10px] font-bold text-slate-400">— Proverbs 15:28</p>
      </div>
    </div>
  );
};

export default ScriptureLibrary;
