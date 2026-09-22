# ML System Design: Recommender System (Netflix-style)

## 1. Problem Framing

**Goal:** Recommend content (movies, shows, music) to users that they are likely to enjoy, maximizing engagement and retention.

**Key metrics:**
- **Engagement:** Click-through rate, watch time, completion rate.
- **Retention:** Day-7, Day-30 retention.
- **Diversity:** Coverage, novelty, serendipity.
- **Latency:** < 100ms for real-time recommendations.
- **Scale:** 200M+ users, 10K+ titles, 1B+ interactions/day.

## 2. High-Level Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  User       │────▶│  Candidate   │────▶│  Ranking     │────▶│  Re-ranking │
│  Request    │     │  Generation  │     │  Model       │     │  + Business │
└─────────────┘     └──────────────┘     └──────────────┘     │  Rules      │
                                                               └─────────────┘
```

## 3. Components

### 3.1 Candidate Generation (Retrieval)
- **Collaborative filtering:** Matrix factorization, nearest neighbors.
- **Content-based:** Item features, user preferences.
- **Hybrid:** Combine collaborative + content-based.
- **Trending/popular:** Global and local popularity.
- **Diversity:** Ensure variety in recommendations.

**Scale considerations:**
- Pre-compute user embeddings offline.
- Use ANN (FAISS, ScaNN) for fast nearest neighbor search.
- Cache popular recommendations.

### 3.2 Ranking Model
- **Features:**
  - User: demographics, watch history, preferences.
  - Item: genre, cast, director, ratings, freshness.
  - Context: time of day, device, location.
  - Interaction: user-item similarity, co-occurrence.
- **Models:**
  - **Two-tower model:** User tower + item tower, dot product.
  - **DeepFM:** Combine deep and wide models.
  - **Transformer:** Self-attention over user history.
- **Training:**
  - Supervised: Watch/completion labels.
  - Multi-task: Predict multiple objectives (click, watch, complete).
  - Online learning: Update with fresh feedback.

### 3.3 Re-ranking & Business Rules
- **Diversity:** Ensure variety in genres, formats.
- **Freshness:** Promote new content.
- **Business rules:** Promote original content, partner content.
- **Fairness:** Avoid bias against certain genres or demographics.
- **Position bias:** Account for position in the list.

## 4. Data Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  User       │────▶│  Feature     │────▶│  Model       │────▶│  Serving    │
│  Events     │     │  Store       │     │  Training    │     │  Pipeline   │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
```

- **Event collection:** Track views, clicks, watches, ratings.
- **Feature store:** Serve user and item features in real-time.
- **Model training:** Train on interaction data, deploy to serving.
- **Serving:** Real-time inference with caching.

## 5. Monitoring & Failure Modes

### 5.1 Monitoring
- **Data quality:** Monitor event collection, feature freshness.
- **Model performance:** Track CTR, watch time, retention.
- **Latency:** Monitor p50, p95, p99 latency.
- **Drift:** Detect data drift, concept drift, model drift.
- **Diversity:** Monitor recommendation diversity over time.

### 5.2 Failure Modes & Mitigations
| Failure Mode | Impact | Mitigation |
|--------------|--------|------------|
| Filter bubble | Reduced diversity | Diversity constraints, exploration |
| Cold start | Poor recommendations | Content-based fallback, popularity |
| Data leakage | Overfitting | Temporal validation, careful feature engineering |
| Position bias | Skewed training data | Position-aware models, debiasing |
| Latency spike | Slow recommendations | Caching, load shedding, autoscaling |

## 6. Trade-offs

| Trade-off | Option A | Option B |
|-----------|----------|----------|
| Personalization vs. diversity | Highly personalized | Diverse recommendations |
| Accuracy vs. latency | Complex model | Fast model |
| Exploration vs. exploitation | Try new content | Stick with known preferences |
| Short-term vs. long-term | Maximize immediate CTR | Maximize long-term retention |

## 7. Key Takeaways

- **Two-stage architecture** (retrieval + ranking) is standard.
- **Hybrid approaches** outperform pure collaborative or content-based.
- **Diversity** is critical for user satisfaction and retention.
- **Cold start** is a major challenge: use content-based fallbacks.
- **Monitoring** is essential: recommendation quality degrades silently.
- **A/B testing** is the only way to validate recommendation changes.
