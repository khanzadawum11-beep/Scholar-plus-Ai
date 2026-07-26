import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  ActiveTaskHub 
} from './components/ActiveTaskHub';
import { 
  SummarizerView 
} from './components/SummarizerView';
import { 
  DatabaseView 
} from './components/DatabaseView';
import { 
  NotesView 
} from './components/NotesView';
import { 
  ArticleModal 
} from './components/ArticleModal';
import { 
  NewTaskModal 
} from './components/NewTaskModal';

import { 
  INITIAL_ARTICLES, 
  INITIAL_NOTES, 
  INITIAL_ACTIVE_TASK 
} from './data/initialData';

import { Article, Note, ResearchTask } from './types';
import { Search, X, BookOpen, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'task' | 'summarizer' | 'database' | 'notes'>('task');
  
  // App State with Persistence or Initial Fallback
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('scholarpulse_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('scholarpulse_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [activeTask, setActiveTask] = useState<ResearchTask | null>(() => {
    const saved = localStorage.getItem('scholarpulse_active_task');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_TASK;
  });

  // Modal states
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // LocalStorage Persistence Effects
  useEffect(() => {
    localStorage.setItem('scholarpulse_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('scholarpulse_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (activeTask) {
      localStorage.setItem('scholarpulse_active_task', JSON.stringify(activeTask));
    }
  }, [activeTask]);

  // Keyboard shortcut for quick search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleSaveArticle = (article: Article) => {
    setArticles(prev => {
      const idx = prev.findIndex(a => a.id === article.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = article;
        return copy;
      }
      return [article, ...prev];
    });
  };

  const handleToggleFavoriteArticle = (articleId: string) => {
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, isFavorite: !a.isFavorite } : a));
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const handleSaveNote = (note: Note) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === note.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = note;
        return copy;
      }
      return [note, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleCreateNoteFromSummary = (title: string, content: string, articleId?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      articleId,
      title,
      content,
      tags: ['Summary Import'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: true,
      color: 'amber'
    };
    handleSaveNote(newNote);
    setActiveTab('notes');
  };

  const handlePauseResumeTask = () => {
    if (!activeTask) return;
    setActiveTask(prev => {
      if (!prev) return null;
      const newStatus = prev.status === 'running' ? 'paused' : 'running';
      return {
        ...prev,
        status: newStatus,
        logs: [
          ...prev.logs,
          {
            timestamp: new Date().toLocaleTimeString(),
            message: `User manually ${newStatus === 'paused' ? 'paused' : 'resumed'} task execution.`,
            type: 'info'
          }
        ]
      };
    });
  };

  const handleImportTaskArticles = (newArticles: Partial<Article>[]) => {
    const fullArticles: Article[] = newArticles.map((p, i) => ({
      id: p.id || `gen-art-${Date.now()}-${i}`,
      title: p.title || 'Synthesized Article',
      authors: p.authors || ['Academic Synthesizer'],
      journal: p.journal || 'Academic Literature Database',
      year: p.year || 2025,
      doi: p.doi || `10.1016/sp.${Date.now()}.${i}`,
      domain: p.domain || 'Artificial Intelligence',
      citationCount: p.citationCount || 100,
      tags: p.tags || ['AI Literature Task'],
      abstract: p.abstract || '',
      bibtex: p.bibtex || '',
      apaCitation: p.apaCitation || '',
      mlaCitation: p.mlaCitation || '',
      ieeeCitation: p.ieeeCitation || '',
      dateAdded: new Date().toISOString().split('T')[0],
      isFavorite: true,
      summary: p.summary
    }));

    setArticles(prev => [...fullArticles, ...prev]);
  };

  const handleSelectArticleByTitle = (title: string) => {
    const found = articles.find(a => a.title.toLowerCase() === title.toLowerCase());
    if (found) {
      setSelectedArticle(found);
    } else {
      // Create temporary view article
      const tempArticle: Article = {
        id: `temp-${Date.now()}`,
        title,
        authors: ['ScholarPulse AI Synthetic Citation'],
        journal: 'Academic Synthesis Review',
        year: 2025,
        doi: '10.1016/sp.temp',
        domain: 'Artificial Intelligence',
        citationCount: 450,
        tags: ['Task Synthesis'],
        abstract: `Extracted synthesis reference for "${title}" from current active task literature vector.`,
        bibtex: `@article{temp_title,\n  title={${title}},\n  journal={Academic Review},\n  year={2025}\n}`,
        apaCitation: `ScholarPulse AI. (2025). ${title}. Academic Review.`,
        mlaCitation: `ScholarPulse AI. "${title}." Academic Review (2025).`,
        ieeeCitation: `ScholarPulse AI, "${title}," Acad. Rev., 2025.`,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setSelectedArticle(tempArticle);
    }
  };

  // Global search filtering
  const searchResultsArticles = articles.filter(a => 
    globalSearch.trim() && (
      a.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      a.authors.some(auth => auth.toLowerCase().includes(globalSearch.toLowerCase())) ||
      a.tags.some(t => t.toLowerCase().includes(globalSearch.toLowerCase()))
    )
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTask={activeTask}
        onNewTaskClick={() => setIsNewTaskModalOpen(true)}
        onSearchOpen={() => setIsSearchModalOpen(true)}
        stats={{
          articlesCount: articles.length,
          notesCount: notes.length,
          citationsCount: articles.reduce((acc, a) => acc + (a.citationCount || 0), 0)
        }}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'task' && activeTask && (
          <ActiveTaskHub
            task={activeTask}
            onPauseResume={handlePauseResumeTask}
            onNewTaskClick={() => setIsNewTaskModalOpen(true)}
            onImportArticles={handleImportTaskArticles}
            onSelectArticleView={handleSelectArticleByTitle}
          />
        )}

        {activeTab === 'summarizer' && (
          <SummarizerView
            onSaveArticle={handleSaveArticle}
            onSaveNoteFromSummary={handleCreateNoteFromSummary}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseView
            articles={articles}
            onSelectArticle={setSelectedArticle}
            onToggleFavorite={handleToggleFavoriteArticle}
            onDeleteArticle={handleDeleteArticle}
            onCreateNoteForArticle={(art) => {
              handleCreateNoteFromSummary(
                `Notes on: ${art.title}`,
                `## Literature Note\n- **Paper**: ${art.title}\n- **APA Citation**: ${art.apaCitation}\n\n### Key Takeaways\n- `,
                art.id
              );
            }}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            articles={articles}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-850 bg-stone-950 py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-stone-300">ScholarPulse AI</span>
            <span>— Research Summarizer & Citation Engine</span>
          </div>
          <p className="text-stone-400">Powered by Gemini 3.6 Flash & Server-Side Synthesis API</p>
        </div>
      </footer>

      {/* Article Summary & Chat Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSaveNote={(title, content, articleId) => {
            handleCreateNoteFromSummary(title, content, articleId);
            setSelectedArticle(null);
          }}
        />
      )}

      {/* Give Task to Run Modal */}
      {isNewTaskModalOpen && (
        <NewTaskModal
          onClose={() => setIsNewTaskModalOpen(false)}
          onStartTask={(newTask) => {
            setActiveTask(newTask);
            setActiveTab('task');
          }}
        />
      )}

      {/* Global Quick Search Modal (Ctrl+K) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl shadow-2xl p-4 space-y-4">
            
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global search papers, authors, tags... (Press Esc to exit)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
              />
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {searchResultsArticles.map(art => (
                <div
                  key={art.id}
                  onClick={() => {
                    setSelectedArticle(art);
                    setIsSearchModalOpen(false);
                  }}
                  className="p-3 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-800 cursor-pointer transition-colors space-y-1"
                >
                  <h4 className="text-xs font-bold text-stone-100 line-clamp-1">{art.title}</h4>
                  <p className="text-[11px] text-stone-400">{art.authors.join(', ')} • {art.year}</p>
                </div>
              ))}

              {globalSearch.trim() && searchResultsArticles.length === 0 && (
                <div className="p-6 text-center text-xs text-stone-400">
                  No matching items found in citation database.
                </div>
              )}

              {!globalSearch.trim() && (
                <div className="p-4 text-center text-xs text-stone-400 font-mono">
                  Type any keyword or author name to instantly search citations.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
