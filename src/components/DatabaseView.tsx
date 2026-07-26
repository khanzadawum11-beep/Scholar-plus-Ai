import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Star, 
  Tag, 
  BookOpen, 
  FileText, 
  SlidersHorizontal,
  ChevronRight,
  Trash2,
  Share2
} from 'lucide-react';
import { Article, DomainType, CitationStyle } from '../types';

interface DatabaseViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleFavorite: (articleId: string) => void;
  onDeleteArticle: (articleId: string) => void;
  onCreateNoteForArticle: (article: Article) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  articles,
  onSelectArticle,
  onToggleFavorite,
  onDeleteArticle,
  onCreateNoteForArticle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeCitationStyle, setActiveCitationStyle] = useState<CitationStyle>('APA');
  const [sortBy, setSortBy] = useState<'newest' | 'citations' | 'year' | 'title'>('newest');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collect all unique tags across database
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach(a => a.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [articles]);

  // Filter & Sort Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        article.title.toLowerCase().includes(query) ||
        article.authors.some(a => a.toLowerCase().includes(query)) ||
        article.abstract.toLowerCase().includes(query) ||
        article.journal.toLowerCase().includes(query) ||
        article.doi.toLowerCase().includes(query) ||
        article.tags?.some(t => t.toLowerCase().includes(query));

      const matchesDomain = selectedDomain === 'All' || article.domain === selectedDomain;
      const matchesTag = selectedTag === 'All' || article.tags?.includes(selectedTag);

      return matchesSearch && matchesDomain && matchesTag;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      if (sortBy === 'citations') return b.citationCount - a.citationCount;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [articles, searchQuery, selectedDomain, selectedTag, sortBy]);

  // Helper to format citation text dynamically
  const getArticleCitation = (article: Article, style: CitationStyle) => {
    switch (style) {
      case 'APA': return article.apaCitation || `${article.authors.join(', ')} (${article.year}). ${article.title}. ${article.journal}.`;
      case 'MLA': return article.mlaCitation || `${article.authors[0]}, et al. "${article.title}." ${article.journal} (${article.year}).`;
      case 'IEEE': return article.ieeeCitation || `${article.authors.join(', ')}, "${article.title}," ${article.journal}, ${article.year}.`;
      case 'BibTeX': return article.bibtex;
      default: return article.apaCitation;
    }
  };

  const handleCopyCitation = (article: Article) => {
    const text = getArticleCitation(article, activeCitationStyle);
    navigator.clipboard.writeText(text);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export Entire Filtered Library to .bib File
  const handleExportBibTeX = () => {
    const bibContent = filteredArticles.map(a => a.bibtex).join('\n\n');
    const blob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scholarpulse_library_${selectedDomain.toLowerCase().replace(/\s+/g, '_')}.bib`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">Academic Citation Database</h1>
            <p className="text-xs text-stone-400">Searchable repository of peer-reviewed literature, metadata, DOIs, and BibTeX citations</p>
          </div>
        </div>

        {/* BibTeX Export Button */}
        <button
          onClick={handleExportBibTeX}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
          title="Download .bib file containing filtered citations"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export BibTeX Library (.bib)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input (6 cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paper title, author, DOI, abstract keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Style Selector (3 cols) */}
          <div className="md:col-span-3 flex items-center space-x-1.5 bg-stone-800 p-1 rounded-xl border border-stone-700">
            <span className="text-[10px] font-mono text-stone-400 uppercase px-2 font-semibold">Copy Style:</span>
            <div className="flex-1 flex justify-between space-x-1">
              {(['APA', 'MLA', 'IEEE', 'BibTeX'] as CitationStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setActiveCitationStyle(style)}
                  className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition-colors ${
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

          {/* Sort Selector (3 cols) */}
          <div className="md:col-span-3 flex items-center space-x-2">
            <span className="text-xs text-stone-400 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs outline-none cursor-pointer"
            >
              <option value="newest">Recently Added</option>
              <option value="citations">Most Cited</option>
              <option value="year">Publication Year</option>
              <option value="title">Alphabetical (Title)</option>
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-stone-400 shrink-0 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Domain:</span>
          </span>
          {['All', 'Artificial Intelligence', 'Biomedical & Healthcare', 'Quantum Computing', 'Climate & Energy', 'Cognitive Neuroscience', 'Physics & Materials'].map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${
                selectedDomain === domain
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-750'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pt-1 border-t border-stone-800 scrollbar-none">
            <span className="text-[11px] font-mono text-stone-500 uppercase shrink-0 flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>Tags:</span>
            </span>
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                selectedTag === 'All' ? 'bg-stone-700 text-stone-100 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer whitespace-nowrap ${
                  selectedTag === tag ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Database Articles Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-stone-400 px-1">
          <span>Showing <strong className="text-amber-400">{filteredArticles.length}</strong> articles</span>
          <span>Click any card to inspect full summary & AI chat</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 space-y-3 transition-all hover:shadow-lg group relative overflow-hidden"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {article.domain}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {article.year} • {article.journal}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-stone-400 font-mono">
                  <span className="flex items-center space-x-1" title="Citations recorded">
                    <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-bold text-stone-300">{article.citationCount.toLocaleString()}</span> citations
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(article.id);
                    }}
                    className={`p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer ${
                      article.isFavorite ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
                    }`}
                    title={article.isFavorite ? 'Favorited' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${article.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Authors */}
              <div 
                className="cursor-pointer space-y-1"
                onClick={() => onSelectArticle(article)}
              >
                <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-400 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-stone-400">
                  {article.authors.join(', ')}
                </p>
              </div>

              {/* Abstract Excerpt */}
              <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed font-sans">
                {article.abstract}
              </p>

              {/* Tags & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-mono text-stone-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  {article.doi && (
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-[11px] font-mono text-stone-400 hover:text-amber-400 transition-colors mr-2"
                    >
                      <span>DOI</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => handleCopyCitation(article)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-mono transition-colors border border-stone-700 cursor-pointer"
                    title={`Copy ${activeCitationStyle} citation`}
                  >
                    {copiedId === article.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy {activeCitationStyle}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onCreateNoteForArticle(article)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-stone-100 border border-stone-700 transition-colors cursor-pointer"
                    title="Add Study Note"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectArticle(article)}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Summary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-3 text-stone-500">
              <Database className="w-10 h-10 text-stone-700 mx-auto" />
              <h3 className="text-base font-serif font-bold text-stone-300">No Articles Match Your Search</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try clearing your search filters or domain selection to view the full literature database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
