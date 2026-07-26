import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Award, 
  FileText, 
  Quote, 
  Star,
  RefreshCw
} from 'lucide-react';
import { Article, CitationStyle, ChatMessage } from '../types';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  onSaveNote: (title: string, content: string, articleId?: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSaveNote
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'citation' | 'chat'>('summary');
  const [activeCitationStyle, setActiveCitationStyle] = useState<CitationStyle>('APA');
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello! I am your AI assistant for "${article.title}". Ask me any questions about the paper's methodology, sample size, limitations, or implications!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const getCitationText = () => {
    switch (activeCitationStyle) {
      case 'APA': return article.apaCitation;
      case 'MLA': return article.mlaCitation;
      case 'IEEE': return article.ieeeCitation;
      case 'BibTeX': return article.bibtex;
      default: return article.apaCitation;
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getCitationText());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const promptText = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperTitle: article.title,
          abstract: article.abstract,
          summary: article.summary,
          userQuestion: promptText,
          chatHistory: chatMessages.slice(-6)
        })
      });

      if (!res.ok) throw new Error('Failed to fetch response');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I could not synthesize an answer from the paper details.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Sorry, I encountered an error answering your question about this paper.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {article.domain}
              </span>
              <span className="text-xs font-mono text-stone-400">
                {article.year} • {article.journal}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-100 leading-snug">{article.title}</h2>
            <p className="text-xs text-stone-400">{article.authors.join(', ')}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-stone-800 bg-stone-900 px-6 pt-2 space-x-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'border-amber-500 text-amber-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Structured Summary
          </button>

          <button
            onClick={() => setActiveTab('citation')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'citation'
                ? 'border-amber-500 text-amber-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Citations & Meta
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'border-amber-500 text-amber-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Gemini Q&A</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Structured Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {article.summary ? (
                <>
                  <div className="bg-stone-850 border border-stone-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase">Executive Summary</h3>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">{article.summary.executiveSummary}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold text-stone-300 uppercase flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Key Research Findings</span>
                    </h3>
                    <ul className="space-y-2">
                      {article.summary.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start space-x-2 bg-stone-800/60 p-2.5 rounded-xl border border-stone-750 text-xs text-stone-300">
                          <span className="font-mono text-amber-400 font-bold">{idx + 1}.</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-stone-800/50 border border-stone-800 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-mono font-bold text-stone-400 uppercase">Methodology</span>
                      <p className="text-xs text-stone-300 leading-relaxed">{article.summary.methodology}</p>
                    </div>
                    <div className="bg-stone-800/50 border border-stone-800 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-mono font-bold text-stone-400 uppercase">Limitations</span>
                      <p className="text-xs text-stone-300 leading-relaxed">{article.summary.limitations}</p>
                    </div>
                  </div>

                  {article.summary.keyQuotations && article.summary.keyQuotations.length > 0 && (
                    <div className="bg-stone-800/40 border-l-2 border-amber-500 p-3 italic text-xs text-amber-200/90 rounded-r-xl">
                      <Quote className="w-4 h-4 text-amber-400 mb-1" />
                      {article.summary.keyQuotations[0]}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 text-center text-xs text-stone-400">
                  <p>No pre-computed summary for this item. Abstract below:</p>
                  <p className="mt-2 text-stone-300 italic">{article.abstract}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Citation & Meta */}
          {activeTab === 'citation' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-xs font-mono font-bold text-stone-300 uppercase">Format Citation</span>
                <div className="flex space-x-1">
                  {(['APA', 'MLA', 'IEEE', 'BibTeX'] as CitationStyle[]).map(style => (
                    <button
                      key={style}
                      onClick={() => setActiveCitationStyle(style)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                        activeCitationStyle === style ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto">
                <pre className="whitespace-pre-wrap">{getCitationText()}</pre>
                <button
                  onClick={handleCopyCitation}
                  className="absolute top-2 right-2 p-1.5 rounded bg-stone-800 hover:bg-stone-750 text-stone-300 transition-colors cursor-pointer"
                >
                  {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {article.doi && (
                <div className="flex items-center space-x-2 text-xs text-stone-400 pt-2">
                  <span>Digital Object Identifier:</span>
                  <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center space-x-1 font-mono"
                  >
                    <span>{article.doi}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Interactive Gemini Q&A Chat */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px] space-y-3">
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-stone-950 rounded-xl border border-stone-800 scrollbar-thin">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-br-none'
                        : 'bg-stone-800 text-stone-200 border border-stone-700 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini is analyzing paper details...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Gemini a question about this paper's findings or methodology..."
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
