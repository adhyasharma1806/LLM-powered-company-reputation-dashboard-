import os
from datetime import datetime
from typing import List, Dict, Any

import feedparser
import httpx

from llm_service import classify_sentiment


APPLE_FEED_URL = os.getenv(
  "APPLE_FEED_URL",
  # Google News RSS for Apple products (simple public feed)
  "https://news.google.com/rss/search?q=apple%20iphone%20OR%20macbook%20OR%20ipad&hl=en-US&gl=US&ceid=US:en",
)


async def fetch_twitter_mentions(limit: int = 50) -> List[Dict[str, Any]]:
  """
  Fetch recent Apple-related tweets using the Twitter/X API v2.
  Requires TWITTER_BEARER_TOKEN to be set.
  """
  bearer = os.getenv("TWITTER_BEARER_TOKEN")
  if not bearer:
    return []

  query = os.getenv(
    "TWITTER_QUERY",
    '("apple" OR "iphone" OR "macbook" OR "ipad" OR "apple watch" OR "airpods") lang:en',
  )

  params = {
    "query": query,
    "max_results": str(min(limit, 100)),
    "tweet.fields": "created_at,lang",
  }
  headers = {"Authorization": f"Bearer {bearer}"}

  async with httpx.AsyncClient(timeout=10) as client:
    resp = await client.get(
      "https://api.twitter.com/2/tweets/search/recent",
      params=params,
      headers=headers,
    )
    resp.raise_for_status()
    data = resp.json()

  tweets = data.get("data", []) or []
  mentions: List[Dict[str, Any]] = []

  for t in tweets:
    text = t.get("text", "")
    created_at = t.get("created_at", "")
    date_str = created_at[:10] if created_at else ""
    sentiment = classify_sentiment(text)

    mentions.append(
      {
        "id": t.get("id", ""),
        "date": date_str,
        "source": "Twitter",
        "title": "",
        "text": text,
        "url": f"https://twitter.com/i/web/status/{t.get('id', '')}",
        "sentiment": sentiment,
      }
    )

  return mentions[:limit]


async def fetch_news_mentions(limit: int = 50) -> List[Dict[str, Any]]:
  """
  Fetch recent Apple-related news/articles via RSS and normalize them
  into a simple 'mentions' list.
  """
  async with httpx.AsyncClient(timeout=10) as client:
    resp = await client.get(APPLE_FEED_URL, follow_redirects=True)
    resp.raise_for_status()

  parsed = feedparser.parse(resp.text)
  mentions: List[Dict[str, Any]] = []

  for entry in parsed.entries[:limit]:
    title = getattr(entry, "title", "")
    summary = getattr(entry, "summary", "")
    link = getattr(entry, "link", "")
    published = getattr(entry, "published", "") or getattr(
      entry, "updated", ""
    )

    # Normalize date
    date_str = ""
    if published:
      try:
        dt = datetime(*entry.published_parsed[:6])  # type: ignore[attr-defined]
        date_str = dt.date().isoformat()
      except Exception:
        date_str = published

    text = f"{title}. {summary}"
    sentiment = classify_sentiment(text)

    mentions.append(
      {
        "id": link or title,
        "date": date_str,
        "source": "News",
        "title": title,
        "text": summary,
        "url": link,
        "sentiment": sentiment,
      }
    )

  return mentions


async def fetch_raw_mentions(limit: int = 50) -> List[Dict[str, Any]]:
  """
  Fetch recent Apple-related mentions from Twitter when configured,
  otherwise fall back to news RSS.
  """
  twitter_mentions = await fetch_twitter_mentions(limit=limit)
  if twitter_mentions:
    return twitter_mentions

  return await fetch_news_mentions(limit=limit)


async def build_metrics(mentions: List[Dict[str, Any]]) -> Dict[str, Any]:
  total = len(mentions)
  positive = sum(1 for m in mentions if m["sentiment"] == "positive")
  negative = sum(1 for m in mentions if m["sentiment"] == "negative")
  neutral = sum(1 for m in mentions if m["sentiment"] == "neutral")

  return {
    "total": total,
    "positive": positive,
    "negative": negative,
    "neutral": neutral,
  }


async def build_sentiment_distribution(
  mentions: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
  metrics = await build_metrics(mentions)
  return [
    {"name": "Positive", "value": metrics["positive"]},
    {"name": "Negative", "value": metrics["negative"]},
    {"name": "Neutral", "value": metrics["neutral"]},
  ]


async def build_trends(mentions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
  """
  Very simple daily trend aggregation: count mentions per day by sentiment.
  """
  by_day: Dict[str, Dict[str, int]] = {}
  for m in mentions:
    day = m.get("date") or "unknown"
    sent = m.get("sentiment", "neutral")
    if day not in by_day:
      by_day[day] = {"positive": 0, "negative": 0, "neutral": 0}
    by_day[day][sent] += 1

  points: List[Dict[str, Any]] = []
  for day, counts in sorted(by_day.items()):
    points.append(
      {
        "date": day,
        "positive": counts["positive"],
        "negative": counts["negative"],
        "neutral": counts["neutral"],
      }
    )
  return points


async def build_topics(mentions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
  """
  Simple keyword-based 'topics' extraction from titles.
  This can be upgraded later to use an LLM.
  """
  topics: Dict[str, int] = {}
  keywords = ["iphone", "macbook", "ipad", "watch", "airpods", "vision pro"]

  for m in mentions:
    title = (m.get("title") or "").lower()
    for kw in keywords:
      if kw in title:
        topics[kw.title()] = topics.get(kw.title(), 0) + 1

  result = [
    {"name": name, "value": count}
    for name, count in sorted(topics.items(), key=lambda x: x[1], reverse=True)
  ]
  return result

