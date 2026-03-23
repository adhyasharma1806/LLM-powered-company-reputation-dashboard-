const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log("API_BASE_URL:", API_BASE_URL);
  async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export type MetricsResponse = {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
};

export type SentimentSlice = {
  name: string;
  value: number;
};

export type TrendPoint = {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
};

export type TopicPoint = {
  name: string;
  value: number;
};

export type Mention = {
  id: string;
  date: string;
  source: string;
  title: string;
  text: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

export function fetchMetrics() {
  return getJson<MetricsResponse>('/api/metrics');
}

export function fetchSentiment() {
  return getJson<SentimentSlice[]>('/api/sentiment');
}

export function fetchTrends() {
  return getJson<TrendPoint[]>('/api/trends');
}

export function fetchTopics() {
  return getJson<TopicPoint[]>('/api/topics');
}

export function fetchMentions(limit = 20) {
  return getJson<Mention[]>(`/api/mentions?limit=${limit}`);
}

