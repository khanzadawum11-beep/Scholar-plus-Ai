import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Tag, 
  Check, 
  Download, 
  BookOpen, 
  Sparkles,
  Link as LinkIcon,
  Eye,
  Edit3
} from 'lucide-react';
import { Note, Article } from '../types';

interface NotesViewProps {
  notes: Note[];
  articles: Article[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  articles,
  onSaveNote,
  onDeleteNote
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedArticleForInsert, setSelectedArticleForInsert] = useState<string>('');

  const activeNote = notes.find(n => n.id === selectedNoteId) || null;

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(t => t.toLowerCase().includes(query));

    const matchesTag = selectedTag === 'All' || note.tags.includes(selectedTag);

    return matchesQuery && matchesTag;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Literature Review Note',
      content: '## Research Objectives\n\n- Key thesis statement:\n- Methodology analysis:\n\n### Formatted Citation\n> Paste or insert citation here.',
      tags: ['Literature Review'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      color: 'amber'
    };

    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
    setPreviewMode(false);
  };

  const handleUpdateActiveNote = (updates: Partial<Note>) => {
    if (!activeNote) return;
    const updatedNote: Note = {
      ...activeNote,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    onSaveNote(updatedNote);
  };

  const handleInsertCitation = (articleId: string) => {
    if (!activeNote || !articleId) return;
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const citationSnippet = `\n\n### Reference: ${article.title}\n> **APA**: ${article.apaCitation}\n> **DOI**: https://doi.org/${article.doi}\n`;

    handleUpdateActiveNote({
      content: activeNote.content + citationSnippet,
      articleId: article.id,
      articleTitle: article.title
    });
  };

  const handleExportNoteMarkdown = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">Saved Research Notes</h1>
            <p className="text-xs text-stone-400">Interactive study notebook with citations, markdown support, and literature backlinks</p>
          </div>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-stone-950" />
          <span>New Research Note</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left List (4 cols) */}
        <div className="lg:col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col h-[650px]">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved notes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Notes list scrollable */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-stone-800">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedNoteId === note.id
                    ? 'bg-stone-800 border-amber-500/80 shadow-md'
                    : 'bg-stone-850/60 hover:bg-stone-800 border-stone-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-stone-100 line-clamp-1">{note.title}</h3>
                  {note.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />}
                </div>

                <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`>]/g, '')}
                </p>

                <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono pt-1 border-t border-stone-800/60">
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  <div className="flex space-x-1">
                    {note.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.2 rounded bg-stone-750 text-stone-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                <FileText className="w-8 h-8 text-stone-700 mx-auto" />
                <p>No notes found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Editor / Preview (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col h-[650px]">
          {activeNote ? (
            <div className="flex flex-col h-full space-y-4">
              
              {/* Note Header Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                  placeholder="Note Title..."
                  className="bg-transparent font-serif font-bold text-lg text-stone-100 outline-none flex-1 min-w-[200px]"
                />

                <div className="flex items-center space-x-2">
                  {/* Insert Citation Dropdown */}
                  <div className="flex items-center space-x-1 bg-stone-800 px-2 py-1 rounded-lg border border-stone-700">
                    <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                    <select
                      value={selectedArticleForInsert}
                      onChange={(e) => {
                        setSelectedArticleForInsert(e.target.value);
                        if (e.target.value) handleInsertCitation(e.target.value);
                      }}
                      className="bg-transparent text-xs text-stone-200 outline-none cursor-pointer max-w-[140px]"
                    >
                      <option value="">Insert Citation...</option>
                      {articles.map(a => (
                        <option key={a.id} value={a.id} className="bg-stone-900 text-stone-200">
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle Preview Mode */}
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      previewMode 
                        ? 'bg-amber-500 text-stone-950 border-amber-500' 
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
                    }`}
                  >
                    {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{previewMode ? 'Edit' : 'Preview'}</span>
                  </button>

                  {/* Pin Toggle */}
                  <button
                    onClick={() => handleUpdateActiveNote({ isPinned: !activeNote.isPinned })}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      activeNote.isPinned 
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                    }`}
                    title="Pin Note"
                  >
                    <Pin className={`w-4 h-4 ${activeNote.isPinned ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Export Markdown */}
                  <button
                    onClick={handleExportNoteMarkdown}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
                    title="Export as Markdown (.md)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Delete Note */}
                  <button
                    onClick={() => onDeleteNote(activeNote.id)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950/40 text-stone-400 hover:text-red-400 border border-stone-700 hover:border-red-800/40 transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags & Metadata */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-stone-400 font-mono">Tags:</span>
                <input
                  type="text"
                  value={activeNote.tags.join(', ')}
                  onChange={(e) => handleUpdateActiveNote({
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="Literature Review, Oncology..."
                  className="bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1 text-stone-200 text-xs outline-none flex-1 font-mono"
                />
              </div>

              {/* Editor vs Preview Container */}
              <div className="flex-1 overflow-y-auto pt-2">
                {previewMode ? (
                  <div className="prose prose-invert prose-stone max-w-none text-xs sm:text-sm leading-relaxed p-4 bg-stone-950/80 rounded-xl border border-stone-800 font-sans whitespace-pre-wrap">
                    {activeNote.content}
                  </div>
                ) : (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => handleUpdateActiveNote({ content: e.target.value })}
                    placeholder="Type markdown literature notes, findings, equations ($E=mc^2$), and citation analysis..."
                    className="w-full h-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono text-xs leading-relaxed focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                  />
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-stone-500">
              <FileText className="w-12 h-12 text-stone-700 stroke-[1.5]" />
              <h3 className="text-base font-serif font-bold text-stone-300">No Note Selected</h3>
              <p className="text-xs text-stone-400 max-w-sm">
                Select a note from the left panel or click "New Research Note" to start synthesizing literature reviews.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
