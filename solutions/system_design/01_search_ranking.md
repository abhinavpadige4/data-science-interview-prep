# ML System Design: Search Ranking System

## 1. Problem Framing

**Goal:** Given a user query, return the top-K most relevant documents from a corpus of billions of documents, ranked by relevance.

**Key metrics:**
- **Latency:** < 200ms p99 for the full pipeline
- **Relevance:** NDCG@10, MRR@10
- **Scale:** 10B+ documents, 100M+ queries/day
- **Freshness:** New documents indexed within minutes

## 2. High-Level Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  User Query │────▶│  Query       │────▶│  Candidate   │────▶│  Ranking    │
│             │     │  Processing  │     │  Generation  │     │  Model      │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
                                                                    │
                                                                    ▼
                                                            ┌─────────────┐
                                                            │  Results    │
                                                            │  + Ads      │
                                                            └─────────────┘
```

## 3. Components

### 3.1 Query Processing
- **Tokenization:** Split query into terms.
- **Normalization:** Lowercase, stemming, lemmatization.
- **Query understanding:** Intent detection, entity recognition, query rewriting.
- **Personalization:** Incorporate user history, location, device.

### 3.2 Candidate Generation (Retrieval)
- **Inverted index:** Map terms to document IDs.
- **BM25 scoring:** Classic TF-IDF variant for initial ranking.
- **ANN (Approximate Nearest Neighbor):** For dense vector retrieval (e.g., FAISS, ScaNN).
- **Hybrid retrieval:** Combine sparse (BM25) and dense (embeddings) retrieval.

**Scale considerations:**
- Sharded across hundreds of nodes.
- Each shard holds ~100M documents.
- Replication for fault tolerance.

### 3.3 Ranking Model
- **Two-stage ranking:**
  1. **Coarse ranking:** Fast model (e.g., logistic regression) on top 10K candidates.
  2. **Fine ranking:** Complex model (e.g., BERT, transformer) on top 100 candidates.
- **Features:**
  - Textual: TF-IDF, BM25, embeddings.
  - Document: PageRank, freshness, quality signals.
  - User: Click history, dwell time, location.
  - Query: Query length, intent, entities.
- **Training:**
  - Supervised: Click-through data, relevance labels.
  - Learning to Rank (LTR): Pairwise, listwise, pointwise.
  - Online learning: Update model with fresh feedback.

### 3.4 Serving
- **Batch serving:** Pre-compute rankings for popular queries.
- **Real-time serving:** Compute rankings on-the-fly for long-tail queries.
- **Caching:** Cache results for popular queries (TTL-based).
- **A/B testing:** Run multiple ranking models in parallel.

## 4. Data Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Crawlers   │────▶│  Indexing    │────▶│  Feature     │────▶│  Model      │
│             │     │  Pipeline    │     │  Store       │     │  Training   │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
```

- **Crawlers:** Continuously crawl the web, extract text, metadata.
- **Indexing:** Build inverted index, compute embeddings, store in feature store.
- **Feature store:** Serve features to ranking model in real-time.
- **Model training:** Train on click-through data, deploy to serving.

## 5. Monitoring & Failure Modes

### 5.1 Monitoring
- **Data quality:** Monitor crawl success rate, index freshness.
- **Model performance:** Track NDCG, CTR, user satisfaction.
- **Latency:** Monitor p50, p95, p99 latency.
- **Drift:** Detect data drift, concept drift, model drift.

### 5.2 Failure Modes & Mitigations
| Failure Mode | Impact | Mitigation |
|--------------|--------|------------|
| Index corruption | Wrong results | Replication, checksums, rollback |
| Model degradation | Poor relevance | A/B testing, canary deployments |
| Latency spike | Slow search | Caching, load shedding, autoscaling |
| Data drift | Stale model | Online learning, periodic retraining |
| Query injection | Security risk | Input validation, rate limiting |

## 6. Trade-offs

| Trade-off | Option A | Option B |
|-----------|----------|----------|
| Latency vs. relevance | Fast model (LR) | Complex model (BERT) |
| Freshness vs. cost | Real-time indexing | Batch indexing |
| Accuracy vs. recall | Precision-focused | Recall-focused |
| Personalization vs. privacy | User-specific | Anonymous |

## 7. Key Takeaways

- **Two-stage ranking** is the standard pattern: fast retrieval + slow ranking.
- **Hybrid retrieval** (sparse + dense) outperforms either alone.
- **Learning to Rank** is essential for search quality.
- **Monitoring** is critical: search quality degrades silently.
- **A/B testing** is the only way to validate ranking changes.
