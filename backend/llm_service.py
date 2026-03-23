import os
from typing import Literal

from openai import OpenAI

Sentiment = Literal["positive", "negative", "neutral"]


def _get_client() -> OpenAI | None:
  api_key = os.getenv("OPENAI_API_KEY")
  if not api_key:
    return None
  return OpenAI(api_key=api_key)


def classify_sentiment(text: str) -> Sentiment:
  """
  Classify sentiment using an LLM when OPENAI_API_KEY is set.
  Falls back to a tiny keyword-based heuristic otherwise.
  """
  client = _get_client()
  if client:
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    prompt = (
      "You are a sentiment classifier for text about Apple products.\n"
      "Return only one word: positive, negative, or neutral.\n\n"
      f"Text:\n{text}"
    )
    try:
      resp = client.responses.create(
        model=model,
        input=prompt,
      )
      label = resp.output[0].content[0].text.strip().lower()
      if label in ("positive", "negative", "neutral"):
        return label  # type: ignore[return-value]
    except Exception:
      # Fall through to heuristic on any error
      pass

  lowered = text.lower()
  positive_words = ["love", "great", "amazing", "fantastic", "best", "incredible"]
  negative_words = ["hate", "terrible", "bad", "awful", "worst", "disappointed"]

  pos_hits = sum(w in lowered for w in positive_words)
  neg_hits = sum(w in lowered for w in negative_words)

  if pos_hits > neg_hits:
    return "positive"
  if neg_hits > pos_hits:
    return "negative"
  return "neutral"

