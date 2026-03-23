from typing import List, Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data_service import (
  fetch_raw_mentions,
  build_metrics,
  build_sentiment_distribution,
  build_trends,
  build_topics,
)

app = FastAPI(title="RepIntel API", version="0.1.0")

origins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/api/mentions")
async def get_mentions(limit: int = 20) -> List[Dict[str, Any]]:
  mentions = await fetch_raw_mentions(limit=limit)
  return mentions


@app.get("/api/metrics")
async def get_metrics() -> Dict[str, Any]:
  mentions = await fetch_raw_mentions(limit=100)
  return await build_metrics(mentions)


@app.get("/api/sentiment")
async def get_sentiment_distribution() -> List[Dict[str, Any]]:
  mentions = await fetch_raw_mentions(limit=100)
  return await build_sentiment_distribution(mentions)


@app.get("/api/trends")
async def get_trends() -> List[Dict[str, Any]]:
  mentions = await fetch_raw_mentions(limit=200)
  return await build_trends(mentions)


@app.get("/api/topics")
async def get_topics() -> List[Dict[str, Any]]:
  mentions = await fetch_raw_mentions(limit=100)
  return await build_topics(mentions)

