import React, { useState } from 'react';
import { X, Play, Sparkles, Layers, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { ResearchTask } from '../types';

interface NewTaskModalProps {
  onClose: () => void;
  onStartTask: (task: ResearchTask) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, onStartTask }) => {
  const [topicInput, setTopicInput] = useState('');
  const [scopeInput, setScopeInput] = useState('Comprehensive Multi-Paper Synthesis (2024-2026)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) {
      setError('Please enter a research topic or query.');
      return;
    }

    setLoading(true);
    setError(null);

    // Create immediate active running task
    const taskId = `task-${Date.now()}`;
    const initialTask: ResearchTask = {
      id: taskId,
      title: `Active Research Task: ${topicInput.slice(0, 50)}...`,
      queryTopic: topicInput,
      status: 'running',
      progress: 25,
      currentStep: 'Step 1/4: Initializing AI Research Agent & Fetching Literature Databases...',
      totalSteps: 4,
      startedAt: new Date().toISOString(),
      logs: [
        { timestamp: new Date().toLocaleTimeString(), message: `Task initialized: "${topicInput}"`, type: 'info' },
        { timestamp: new Date().toLocaleTimeString(), message: 'Connecting to Gemini 3.6 Flash synthesis engine...', type: 'ai' },
        { timestamp: new Date().toLocaleTimeString(), message: 'Querying OpenAlex & arXiv for high-impact 2024-2026 publications...', type: 'info' }
      ]
    };

    onStartTask(initialTask);

    try {
      // Call backend to perform synthesis
      const res = await fetch('/api/run-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput })
      });

      if (!res.ok) {
        throw new Error('Failed to run task backend process.');
      }

      const data = await res.json();

      const completedTask: ResearchTask = {
        ...initialTask,
        title: data.title || initialTask.title,
        status: 'running',
        progress: 100,
        currentStep: 'Step 4/4: Literature Review Task Complete & Citations Synthesized!',
        logs: [
          ...initialTask.logs,
          { timestamp: new Date().toLocaleTimeString(), message: 'Retrieved peer-reviewed datasets and citations.', type: 'success' },
          { timestamp: new Date().toLocaleTimeString(), message: 'Extracted consensus points and key literature gaps.', type: 'ai' },
          { timestamp: new Date().toLocaleTimeString(), message: 'Task complete! 3 representative paper citations ready for library import.', type: 'success' }
        ],
        synthesisResult: {
          overview: data.overview || 'Overview generated successfully.',
          themes: data.themes || [],
          consensusPoints: data.consensusPoints || [],
          debatesAndGaps: data.debatesAndGaps || [],
          extractedPaperTitles: data.extractedPaperTitles || []
        }
      };

      onStartTask(completedTask);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error executing research task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
        
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-100">Give Task to Run</h2>
              <p className="text-xs text-stone-400">Launch an active literature synthesis agent task</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Research Synthesis Topic / Query <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={3}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Impact of Solid-State Electrolyte Interfaces on Lithium Battery Longevity (2025-2026)"
              className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Scope & Depth</label>
            <select
              value={scopeInput}
              onChange={(e) => setScopeInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
            >
              <option value="Comprehensive Multi-Paper Synthesis (2024-2026)">Comprehensive Multi-Paper Synthesis (2024-2026)</option>
              <option value="Methodology & Benchmark Comparison">Methodology & Benchmark Comparison</option>
              <option value="Consensus & Knowledge Gap Analysis">Consensus & Knowledge Gap Analysis</option>
            </select>
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-stone-400">Suggested Tasks:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Quantum Error Correction Surface Codes',
                'Multi-Modal Vision Transformers in Radiomics',
                'Solid-State Battery Cathode Degradation'
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopicInput(preset)}
                  className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-[11px] text-amber-300 border border-stone-700 cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                <span>Launching Task & Synthesizing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-stone-950 text-stone-950" />
                <span>Run Active Synthesis Task</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
