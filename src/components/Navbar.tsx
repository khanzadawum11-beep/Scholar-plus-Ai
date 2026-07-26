import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Database, 
  FileText, 
  Activity, 
  Plus, 
  Search 
} from 'lucide-react';
import { ResearchTask } from '../types';

interface NavbarProps {
  activeTab: 'task' | 'summarizer' | 'database' | 'notes';
  setActiveTab: (tab: 'task' | 'summarizer' | 'database' | 'notes') => void;
  activeTask: ResearchTask | null;
  onNewTaskClick: () => void;
  onSearchOpen: () => void;
  stats: {
    articlesCount: number;
    notesCount: number;
    citationsCount: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeTask,
  onNewTaskClick,
  onSearchOpen,
  stats
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-amber-900/20">
              <BookOpen className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg font-bold tracking-tight text-stone-100">ScholarPulse</span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  AI Academic
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">Research Article Summarizer & Citation Engine</p>
            </div>
          </div>

          {/* Active Task Live Status Pill */}
          {activeTask && (
            <button
              onClick={() => setActiveTab('task')}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-750 border border-stone-700/80 transition-all cursor-pointer group"
              title="Click to view live active task runner"
            >
              <span className="relative flex h-2.5 w-2.5">
                {activeTask.status === 'running' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeTask.status === 'running' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-400 transition-colors">
                    Active Task: {activeTask.status === 'running' ? 'Running Synthesis' : 'Task Complete'}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">({activeTask.progress}%)</span>
                </div>
              </div>
            </button>
          )}

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSearchOpen}
              className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-700 transition-colors border border-stone-700"
              title="Global Database Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onNewTaskClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-medium text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Give Task to Run</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-stone-800/80 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('task')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'task'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Active Task Hub</span>
            {activeTask && activeTask.status === 'running' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('summarizer')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'summarizer'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Article Summarizer</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Citations Database</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-700 text-stone-300">
              {stats.articlesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'notes'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Saved Notes</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-700 text-stone-300">
              {stats.notesCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
