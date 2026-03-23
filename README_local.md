# LLM-Powered Company Reputation Dashboard

A modern, Apple-inspired analytics dashboard built with Next.js, React, Tailwind CSS, shadcn/ui, and Framer Motion. This dashboard provides real-time sentiment analysis and insights for company reputation monitoring.

## Features

- **Modern Apple-Style Design**: Clean, minimal interface with glass morphism effects
- **Dark Theme**: Eye-friendly dark mode with beautiful gradients
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Interactive Charts**: Real-time data visualization using Recharts
- **Collapsible Sidebar**: Space-efficient navigation
- **Responsive Layout**: Works seamlessly on all screen sizes

## Dashboard Components

### 1. Metric Cards
- **Total Mentions**: Overall mention count with trend indicator
- **Positive Sentiment**: Count of positive mentions
- **Negative Sentiment**: Count of negative mentions
- **Neutral Sentiment**: Count of neutral mentions

### 2. Sentiment Distribution Chart
- Pie chart showing the breakdown of sentiment types
- Interactive tooltips with detailed data
- Color-coded for easy interpretation

### 3. Sentiment Trends Chart
- Line chart tracking sentiment over time
- Multiple data series (positive, negative, neutral)
- Displays temporal patterns and trends

### 4. Top Topics Chart
- Horizontal bar chart showing most mentioned topics
- Color-coded categories for quick identification
- Sortable by mention count

### 5. Recent Mentions Table
- Scrollable list of latest mentions
- Displays date, source, text, and sentiment
- Badge-based sentiment indicators

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
app/
├── dashboard/
│   └── page.tsx          # Main dashboard page
├── globals.css           # Global styles
├── layout.tsx            # Root layout
└── page.tsx             # Home page (redirects to dashboard)

components/
└── dashboard/
    ├── Header.tsx        # Dashboard header with title
    ├── Sidebar.tsx       # Collapsible navigation sidebar
    ├── MetricCards.tsx   # Four metric summary cards
    ├── SentimentChart.tsx    # Pie chart for sentiment distribution
    ├── TrendChart.tsx        # Line chart for sentiment trends
    ├── TopicsChart.tsx       # Bar chart for top topics
    └── MentionsTable.tsx     # Table of recent mentions
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to view the dashboard.

## Integration with Python API

The dashboard is architected to easily integrate with a Python backend API. Here's how to connect it:

### 1. Create API Service Layer

Create a new file `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchMetrics() {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  return response.json();
}

export async function fetchSentimentData() {
  const response = await fetch(`${API_BASE_URL}/api/sentiment`);
  return response.json();
}

export async function fetchTrends() {
  const response = await fetch(`${API_BASE_URL}/api/trends`);
  return response.json();
}

export async function fetchTopics() {
  const response = await fetch(`${API_BASE_URL}/api/topics`);
  return response.json();
}

export async function fetchMentions(page: number = 1, limit: number = 10) {
  const response = await fetch(
    `${API_BASE_URL}/api/mentions?page=${page}&limit=${limit}`
  );
  return response.json();
}
```

### 2. Update Components to Use API

Replace mock data in components with API calls:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { fetchMetrics } from '@/lib/api';

export function MetricCards() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchMetrics();
      setMetrics(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Render with real data
}
```

### 3. Python Backend Structure (FastAPI Example)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/metrics")
async def get_metrics():
    # Your LLM-powered sentiment analysis logic
    return {
        "total": 12483,
        "positive": 8291,
        "negative": 1847,
        "neutral": 2345,
        "changes": {
            "total": 12.5,
            "positive": 8.2,
            "negative": -3.1,
            "neutral": 2.4
        }
    }

@app.get("/api/sentiment")
async def get_sentiment_distribution():
    return [
        {"name": "Positive", "value": 8291},
        {"name": "Negative", "value": 1847},
        {"name": "Neutral", "value": 2345}
    ]

@app.get("/api/trends")
async def get_trends():
    # Return time-series data
    pass

@app.get("/api/topics")
async def get_top_topics():
    # Return topic analysis from LLM
    pass

@app.get("/api/mentions")
async def get_mentions(page: int = 1, limit: int = 10):
    # Return paginated mentions
    pass
```

### 4. Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Real-time Updates

For real-time updates, use WebSockets or Server-Sent Events:

```typescript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000/ws');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDashboard(data);
  };

  return () => ws.close();
}, []);
```

## Customization

### Colors
Update the color scheme in `components/dashboard/MetricCards.tsx` and chart components.

### Branding
Modify the header title in `components/dashboard/Header.tsx` and logo in `components/dashboard/Sidebar.tsx`.

### Data Refresh
Add auto-refresh functionality using `setInterval` or WebSockets.

## Future Enhancements

- [ ] Real-time data streaming
- [ ] Advanced filtering and search
- [ ] Export functionality (PDF/CSV)
- [ ] Custom date range selection
- [ ] User authentication
- [ ] Multi-company comparison
- [ ] Alert notifications
- [ ] Detailed analytics drill-down

## License

MIT
