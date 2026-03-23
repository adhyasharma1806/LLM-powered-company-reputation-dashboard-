export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export interface TrendDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface TopicData {
  topic: string;
  mentions: number;
  color: string;
}

export interface Mention {
  id: number;
  date: string;
  source: string;
  text: string;
  sentiment: SentimentType;
  score?: number;
  url?: string;
  author?: string;
}

export interface MetricsResponse {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  changes: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
