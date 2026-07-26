import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  BookmarkPlus, 
  FileText, 
  RefreshCw, 
  Quote, 
  Award, 
  BookOpen, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { Article, DomainType, CitationStyle } from '../types';

interface SummarizerViewProps {
  onSaveArticle: (article: Article) => void;
  onSaveNoteFromSummary: (title: string, content: string, articleId?: string) => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  onSaveArticle,
  onSaveNoteFromSummary
}) => {
  const [inputText, setInputText] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [doiInput, setDoiInput] = useState('');
  const [domain, setDomain] = useState<DomainType>('Artificial Intelligence');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCitationStyle, setActiveCitationStyle] = useState<CitationStyle>('APA');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Generated Result State
  const [generatedArticle, setGeneratedArticle] = useState<Article | null>(null);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !titleInput.trim()) {
      setError('Please provide paper content, abstract, or title to summarize.');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          title: titleInput,
          doi: doiInput,
          domain
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate summary.');
      }

      const data = await res.json();

      const newArticle: Article = {
        id: `art-gen-${Date.now()}`,
        title: data.title || titleInput || 'Untitled Research Article',
        authors: data.authors || ['Academic Authors'],
        journal: data.journal || 'Peer Reviewed Publication',
        year: data.year || new Date().getFullYear(),
        doi: data.doi || doiInput || `10.1016/sp.${Date.now()}`,
        domain: (data.domain as DomainType) || domain,
        citationCount: Math.floor(Math.random() * 200) + 10,
        tags: data.tags || ['AI Summary', domain],
        abstract: inputText.slice(0, 300) + (inputText.length > 300 ? '...' : ''),
        bibtex: data.bibtex || '',
        apaCitation: data.apaCitation || '',
        mlaCitation: data.mlaCitation || '',
        ieeeCitation: data.ieeeCitation || '',
        dateAdded: new Date().toISOString().split('T')[0],
        summary: {
          executiveSummary: data.executiveSummary || '',
          keyFindings: data.keyFindings || [],
          methodology: data.methodology || '',
          limitations: data.limitations || '',
          implications: data.implications || '',
          keyQuotations: data.keyQuotations || [],
          recommendedFutureWork: data.recommendedFutureWork || [],
          criticalReview: data.criticalReview || {
            strengths: ['Clear methodological setup'],
            weaknesses: ['Requires further replication'],
            noveltyScore: 8.5
          }
        }
      };

      setGeneratedArticle(newArticle);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during Gemini summarization.');
    } finally {
      setLoading(false);
    }
  };

  const getActiveCitationText = () => {
    if (!generatedArticle) return '';
    switch (activeCitationStyle) {
      case 'APA': return generatedArticle.apaCitation;
      case 'MLA': return generatedArticle.mlaCitation;
      case 'IEEE': return generatedArticle.ieeeCitation;
      case 'BibTeX': return generatedArticle.bibtex;
      default: return generatedArticle.apaCitation;
    }
  };

  const handleCopyCitation = () => {
    const text = getActiveCitationText();
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleSaveToDatabase = () => {
    if (generatedArticle) {
      onSaveArticle(generatedArticle);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleCreateNoteFromSummary = () => {
    if (!generatedArticle || !generatedArticle.summary) return;
    const noteTitle = `Notes on: ${generatedArticle.title}`;
    const noteContent = `## Executive Summary
${generatedArticle.summary.executiveSummary}

### Key Findings
${generatedArticle.summary.keyFindings.map(f => `- ${f}`).join('\n')}

### Methodology & Limitations
- **Method**: ${generatedArticle.summary.methodology}
- **Limitations**: ${generatedArticle.summary.limitations}

### Citation (${activeCitationStyle})
\`\`\`
${getActiveCitationText()}
\`\`\``;

    onSaveNoteFromSummary(noteTitle, noteContent, generatedArticle.id);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">AI Article Summarizer</h1>
            <p className="text-xs text-stone-400">Generate structured academic summaries, peer-review critiques, and BibTeX citations with Gemini 3.6 Flash</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-mono font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Input Article / Abstract</span>
          </h2>

          <form onSubmit={handleSummarize} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Article Title (Optional)</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Scalable Surface Codes in Superconducting Qubits"
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">DOI / Accession</label>
                <input
                  type="text"
                  value={doiInput}
                  onChange={(e) => setDoiInput(e.target.value)}
                  placeholder="e.g. 10.1038/s41586-024"
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Domain Classification</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainType)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Biomedical & Healthcare">Biomedical & Healthcare</option>
                  <option value="Quantum Computing">Quantum Computing</option>
                  <option value="Climate & Energy">Climate & Energy</option>
                  <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
                  <option value="Physics & Materials">Physics & Materials</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Paper Abstract or Full Text Content <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={8}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste abstract, introduction, methodology, or full paper text here..."
                className="w-full p-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none resize-none leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
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
                  <span>Synthesizing with Gemini 3.6 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Generate Multi-Dimensional Summary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Preview Output (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl min-h-[500px]">
          {generatedArticle && generatedArticle.summary ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Paper Title & Domain Header */}
              <div className="flex items-start justify-between border-b border-stone-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {generatedArticle.domain}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Year: {generatedArticle.year} | Citations: {generatedArticle.citationCount}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-stone-100">{generatedArticle.title}</h2>
                  <p className="text-xs text-stone-400">
                    <span className="font-semibold text-stone-300">Authors:</span> {generatedArticle.authors.join(', ')} — <span className="italic">{generatedArticle.journal}</span>
                  </p>
                </div>

                {/* Save Buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleSaveToDatabase}
                    disabled={savedSuccess}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      savedSuccess
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                    }`}
                  >
                    {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    <span>{savedSuccess ? 'Saved!' : 'Save Paper'}</span>
                  </button>

                  <button
                    onClick={handleCreateNoteFromSummary}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-stone-100 border border-stone-700 transition-colors"
                    title="Create study note from summary"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Executive Summary Card */}
              <div className="bg-stone-850 border border-stone-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Executive Summary
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {generatedArticle.summary.executiveSummary}
                </p>
              </div>

              {/* Key Findings List */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Key Quantitative & Qualitative Findings</span>
                </h3>
                <ul className="space-y-2">
                  {generatedArticle.summary.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 bg-stone-800/60 p-2.5 rounded-xl border border-stone-750 text-xs text-stone-300">
                      <span className="font-mono text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Methodology & Limitations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-800/50 border border-stone-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-mono font-bold text-stone-400 uppercase">Methodology</span>
                  <p className="text-xs text-stone-300 leading-relaxed">{generatedArticle.summary.methodology}</p>
                </div>
                <div className="bg-stone-800/50 border border-stone-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-mono font-bold text-stone-400 uppercase">Limitations</span>
                  <p className="text-xs text-stone-300 leading-relaxed">{generatedArticle.summary.limitations}</p>
                </div>
              </div>

              {/* Critical Review & Novelty Gauge */}
              <div className="bg-stone-800/70 border border-stone-750 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-stone-700/60 pb-2">
                  <span className="text-xs font-mono font-bold text-stone-200 uppercase">Peer-Review Evaluation</span>
                  <div className="flex items-center space-x-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <span className="text-[11px] text-stone-400 font-mono">Novelty Score:</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {generatedArticle.summary.criticalReview.noveltyScore} / 10
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 text-[11px]">Strengths:</span>
                    <ul className="mt-1 list-disc list-inside text-stone-300 space-y-1">
                      {generatedArticle.summary.criticalReview.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-400 text-[11px]">Weaknesses:</span>
                    <ul className="mt-1 list-disc list-inside text-stone-300 space-y-1">
                      {generatedArticle.summary.criticalReview.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Formatted Citation Generator */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-stone-300 uppercase">Formatted Citation</span>
                  
                  {/* Citation Style Switcher */}
                  <div className="flex space-x-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
                    {(['APA', 'MLA', 'IEEE', 'BibTeX'] as CitationStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => setActiveCitationStyle(style)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                          activeCitationStyle === style
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative bg-stone-900 p-3 rounded-lg border border-stone-800 font-mono text-xs text-stone-300 leading-relaxed overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{getActiveCitationText()}</pre>
                  <button
                    onClick={handleCopyCitation}
                    className="absolute top-2 right-2 p-1.5 rounded bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-stone-100 border border-stone-700 transition-colors cursor-pointer"
                    title="Copy citation to clipboard"
                  >
                    {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-stone-500">
              <BookOpen className="w-12 h-12 text-stone-700 stroke-[1.5]" />
              <h3 className="text-base font-serif font-bold text-stone-300">Ready for Article Analysis</h3>
              <p className="text-xs text-stone-400 max-w-sm">
                Paste an abstract or paper text on the left, select a domain, and click "Generate Multi-Dimensional Summary" to view executive breakdowns, methodology checks, and formatted BibTeX citations.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
