import {
  MetricsResponse,
  SentimentData,
  TrendDataPoint,
  TopicData,
  Mention,
  PaginatedResponse,
  ApiError,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchMetrics(): Promise<MetricsResponse> {
  return fetchAPI<MetricsResponse>('/api/metrics');
}

export async function fetchSentimentDistribution(): Promise<SentimentData[]> {
  return fetchAPI<SentimentData[]>('/api/sentiment');
}

export async function fetchTrends(
  startDate?: string,
  endDate?: string
): Promise<TrendDataPoint[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const query = params.toString() ? `?${params.toString()}` : '';
  return fetchAPI<TrendDataPoint[]>(`/api/trends${query}`);
}

export async function fetchTopics(limit: number = 10): Promise<TopicData[]> {
  return fetchAPI<TopicData[]>(`/api/topics?limit=${limit}`);
}

export async function fetchMentions(
  page: number = 1,
  limit: number = 10,
  sentiment?: string
): Promise<PaginatedResponse<Mention>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sentiment) {
    params.append('sentiment', sentiment);
  }

  return fetchAPI<PaginatedResponse<Mention>>(`/api/mentions?${params.toString()}`);
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: string;
  score: number;
  confidence: number;
}> {
  return fetchAPI('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function exportData(
  format: 'csv' | 'json' | 'pdf',
  dateRange?: { start: string; end: string }
): Promise<Blob> {
  const params = new URLSearchParams({ format });
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }

  const response = await fetch(`${API_BASE_URL}/api/export?${params.toString()}`);
  return response.blob();
}

export function createWebSocketConnection(
  onMessage: (data: any) => void,
  onError?: (error: Event) => void
): WebSocket {
  const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    if (onError) onError(error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return ws;
}
