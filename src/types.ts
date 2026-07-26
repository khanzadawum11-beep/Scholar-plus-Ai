export type DomainType = 
  | 'Artificial Intelligence' 
  | 'Biomedical & Healthcare' 
  | 'Quantum Computing' 
  | 'Climate & Energy' 
  | 'Cognitive Neuroscience' 
  | 'Physics & Materials';

export type CitationStyle = 'APA' | 'MLA' | 'BibTeX' | 'Chicago' | 'IEEE';

export interface ArticleSummary {
  executiveSummary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string;
  implications: string;
  keyQuotations: string[];
  recommendedFutureWork: string[];
  criticalReview: {
    strengths: string[];
    weaknesses: string[];
    noveltyScore: number; // 1-10
  };
}

export interface Article {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  url?: string;
  abstract: string;
  domain: DomainType;
  tags: string[];
  citationCount: number;
  bibtex: string;
  apaCitation: string;
  mlaCitation: string;
  ieeeCitation: string;
  summary?: ArticleSummary;
  dateAdded: string;
  isFavorite?: boolean;
}

export interface Note {
  id: string;
  articleId?: string;
  articleTitle?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  color?: string;
}

export interface TaskLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface ResearchTask {
  id: string;
  title: string;
  queryTopic: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  progress: number; // 0 to 100
  currentStep: string;
  totalSteps: number;
  logs: TaskLog[];
  startedAt: string;
  completedAt?: string;
  synthesisResult?: {
    overview: string;
    themes: { theme: string; description: string; paperCount: number }[];
    consensusPoints: string[];
    debatesAndGaps: string[];
    extractedPaperTitles: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
}
