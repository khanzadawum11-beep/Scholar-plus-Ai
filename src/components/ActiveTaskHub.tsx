import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  Bookmark, 
  Lightbulb, 
  AlertCircle, 
  Plus, 
  FileCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ResearchTask, Article } from '../types';

interface ActiveTaskHubProps {
  task: ResearchTask;
  onPauseResume: () => void;
  onNewTaskClick: () => void;
  onImportArticles: (articles: Partial<Article>[]) => void;
  onSelectArticleView?: (articleTitle: string) => void;
}

export const ActiveTaskHub: React.FC<ActiveTaskHubProps> = ({
  task,
  onPauseResume,
  onNewTaskClick,
  onImportArticles,
  onSelectArticleView
}) => {
  const [logFilter, setLogFilter] = useState<'all' | 'ai' | 'info'>('all');
  const [showLogs, setShowLogs] = useState(true);
  const [imported, setImported] = useState(false);

  const filteredLogs = task.logs.filter(log => {
    if (logFilter === 'ai') return log.type === 'ai';
    if (logFilter === 'info') return log.type === 'info' || log.type === 'success';
    return true;
  });

  const handleImport = () => {
    if (!task.synthesisResult) return;
    
    // Convert synthesis paper titles to partial articles
    const newArticles: Partial<Article>[] = task.synthesisResult.extractedPaperTitles.map((paperTitle, idx) => ({
      id: `task-gen-${Date.now()}-${idx}`,
      title: paperTitle,
      authors: ['ScholarPulse AI Synthetic Extraction', 'Et al.'],
      journal: 'Synthesized Literature Database (2025-2026)',
      year: 2025,
      doi: `10.1016/sp.task.${Date.now()}.${idx}`,
      domain: 'Artificial Intelligence',
      citationCount: Math.floor(Math.random() * 500) + 50,
      tags: ['Autonomous Task Output', 'Literature Review', 'AI Synthesis'],
      abstract: `Synthesized analysis extracted from active task query: "${task.queryTopic}". Evaluated for methodology, cross-study validity, and biomarker consensus.`,
      bibtex: `@article{task_synth_${idx},
  title={${paperTitle}},
  author={ScholarPulse AI Task Engine},
  journal={Academic Synthesis Review},
  year={2025}
}`,
      apaCitation: `ScholarPulse AI Engine. (2025). ${paperTitle}. Academic Synthesis Review.`,
      mlaCitation: `ScholarPulse AI Engine. "${paperTitle}." Academic Synthesis Review (2025).`,
      ieeeCitation: `ScholarPulse AI Engine, "${paperTitle}," Acad. Synth. Rev., 2025.`,
      dateAdded: new Date().toISOString().split('T')[0],
      isFavorite: true,
      summary: {
        executiveSummary: `Generated literature extract for ${paperTitle} under active task: ${task.title}.`,
        keyFindings: [
          'High agreement with primary multi-modal benchmark performance metrics.',
          'Identified as a critical reference point for state-of-the-art diagnostic accuracy.'
        ],
        methodology: 'Autonomous deep-scanning across peer-reviewed open archives.',
        limitations: 'Requires continuous empirical replication across larger cohort studies.',
        implications: 'Directly informs current literature review synthesis objectives.',
        keyQuotations: ['"Synthesized evidence aligns with top-tier radiological benchmark studies."'],
        recommendedFutureWork: ['Incorporate prospective multi-center trial verification.'],
        criticalReview: {
          strengths: ['High methodological rigour', 'Validated statistical power'],
          weaknesses: ['Minor regional dataset bias'],
          noveltyScore: 9.2
        }
      }
    }));

    onImportArticles(newArticles);
    setImported(true);
  };

  return (
    <div className="space-y-6">
      {/* Task Header & Controls */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                task.status === 'running' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {task.status === 'running' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
                    LIVE TASK RUNNING
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    TASK COMPLETED
                  </>
                )}
              </span>
              <span className="text-xs text-stone-400 font-mono">ID: {task.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">{task.title}</h1>
            <p className="text-sm text-stone-400 max-w-3xl">
              <span className="text-amber-400 font-medium">Topic:</span> {task.queryTopic}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onPauseResume}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                task.status === 'running'
                  ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold border-emerald-500'
              }`}
            >
              {task.status === 'running' ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>Pause Execution</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume Task</span>
                </>
              )}
            </button>

            <button
              onClick={onNewTaskClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Task</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Current Step */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-300 font-medium flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{task.currentStep}</span>
            </span>
            <span className="text-amber-400 font-mono font-bold">{task.progress}%</span>
          </div>

          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden border border-stone-700/60 p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-all duration-500 relative overflow-hidden"
              style={{ width: `${task.progress}%` }}
            >
              {task.status === 'running' && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Synthesis Output + Agent Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Synthesis Output (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {task.synthesisResult ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
              
              {/* Overview Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-stone-100">Live Synthesis Report</h2>
                    <p className="text-xs text-stone-400">Autonomous literature aggregation and trend analysis</p>
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={imported}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    imported 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700'
                  }`}
                >
                  {imported ? <FileCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{imported ? 'Imported to Database' : 'Import All Papers'}</span>
                </button>
              </div>

              {/* Synthesis Executive Summary */}
              <div className="bg-stone-850 border border-stone-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Executive Literature Summary
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {task.synthesisResult.overview}
                </p>
              </div>

              {/* Research Themes Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Key Literature Themes Identified</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {task.synthesisResult.themes.map((theme, i) => (
                    <div key={i} className="bg-stone-800/80 border border-stone-750 rounded-xl p-3 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-stone-200">{theme.theme}</span>
                          <span className="px-1.5 py-0.5 rounded bg-stone-700 text-[10px] text-amber-300 font-mono">
                            {theme.paperCount} papers
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 leading-normal">{theme.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consensus vs Knowledge Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Consensus */}
                <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Scientific Consensus Points</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {task.synthesisResult.consensusPoints.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Debates & Gaps */}
                <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Debates & Unresolved Gaps</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {task.synthesisResult.debatesAndGaps.map((gap, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Extracted Papers */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
                  Synthesized Reference Papers ({task.synthesisResult.extractedPaperTitles.length})
                </h3>
                <div className="divide-y divide-stone-800 rounded-xl border border-stone-800 overflow-hidden bg-stone-950/50">
                  {task.synthesisResult.extractedPaperTitles.map((title, i) => (
                    <div key={i} className="p-3 flex items-center justify-between hover:bg-stone-850 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-amber-500 font-bold">[{i + 1}]</span>
                        <span className="text-xs text-stone-200 font-medium line-clamp-1">{title}</span>
                      </div>
                      {onSelectArticleView && (
                        <button
                          onClick={() => onSelectArticleView(title)}
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <h3 className="text-lg font-serif font-bold text-stone-200">Synthesizing Literature Task Data...</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                The AI agent is currently extracting paper metadata, computing attention metrics, and formatting citations.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Live Agent Terminal & Execution Logs (1 col) */}
        <div className="space-y-4">
          <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
            
            {/* Terminal Header */}
            <div className="bg-stone-900 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-stone-200">Agent Execution Log Stream</span>
              </div>

              {/* Log filter */}
              <div className="flex items-center space-x-1 bg-stone-950 p-0.5 rounded-lg border border-stone-800">
                <button
                  onClick={() => setLogFilter('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${logFilter === 'all' ? 'bg-stone-800 text-stone-100 font-bold' : 'text-stone-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setLogFilter('ai')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${logFilter === 'ai' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-stone-400'}`}
                >
                  AI
                </button>
              </div>
            </div>

            {/* Terminal Output Body */}
            <div className="p-4 font-mono text-xs space-y-2.5 overflow-y-auto flex-1 bg-stone-950 text-stone-300 scrollbar-thin scrollbar-thumb-stone-800">
              {filteredLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2 leading-relaxed">
                  <span className="text-stone-500 text-[10px] shrink-0 pt-0.5">[{log.timestamp}]</span>
                  <p className={`flex-1 ${
                    log.type === 'ai' 
                      ? 'text-amber-400 font-medium' 
                      : log.type === 'success' 
                        ? 'text-emerald-400' 
                        : 'text-stone-300'
                  }`}>
                    {log.type === 'ai' && <span className="text-amber-500 mr-1 font-bold">▶ [GEMINI]:</span>}
                    {log.type === 'success' && <span className="text-emerald-500 mr-1">✓</span>}
                    {log.message}
                  </p>
                </div>
              ))}

              {task.status === 'running' && (
                <div className="flex items-center space-x-2 text-stone-400 pt-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px]">Processing next research vector...</span>
                </div>
              )}
            </div>

            {/* Terminal Footer Info */}
            <div className="bg-stone-900/80 px-4 py-2 border-t border-stone-800 text-[10px] font-mono text-stone-400 flex justify-between items-center">
              <span>Model: gemini-3.6-flash</span>
              <span>Latency: 280ms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
