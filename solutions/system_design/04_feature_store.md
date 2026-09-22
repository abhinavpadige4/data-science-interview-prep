# ML System Design: Feature Store

## 1. Problem Framing

**Goal:** Design a centralized platform for storing, serving, and managing ML features, ensuring consistency between training and serving.

**Key metrics:**
- **Latency:** < 10ms for online serving, < 1s for batch.
- **Freshness:** Features available within minutes of data arrival.
- **Consistency:** Training-serving skew < 1%.
- **Scale:** 10K+ features, 100M+ entities, 1B+ lookups/day.
- **Reusability:** Features shared across teams and models.

## 2. High-Level Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Data       │────▶│  Feature     │────▶│  Feature     │────▶│  Model      │
│  Sources    │     │  Engineering │     │  Store       │     │  Training   │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
                                                                    │
                                                                    ▼
                                                            ┌─────────────┐
                                                            │  Online     │
                                                            │  Serving    │
                                                            └─────────────┘
```

## 3. Components

### 3.1 Feature Engineering
- **Transformation:** Clean, normalize, encode features.
- **Aggregation:** Windowed aggregations (sum, mean, count).
- **Joining:** Combine features from multiple sources.
- **Versioning:** Track feature definitions over time.
- **Testing:** Validate feature correctness, distribution.

### 3.2 Feature Store
- **Online store:** Low-latency serving (Redis, DynamoDB).
- **Offline store:** Batch training data (S3, BigQuery, Snowflake).
- **Metadata store:** Feature definitions, lineage, ownership.
- **Consistency:** Ensure online and offline features match.

**Key design decisions:**
- **Entity-based:** Features keyed by entity (user, item, transaction).
- **Point-in-time correctness:** Avoid data leakage in training.
- **Feature registry:** Central catalog of all features.

### 3.3 Online Serving
- **Low-latency:** < 10ms for real-time inference.
- **High-throughput:** 100K+ lookups/second.
- **Caching:** Cache frequent lookups.
- **Fallback:** Default values for missing features.

### 3.4 Offline Training
- **Batch export:** Export features for model training.
- **Point-in-time joins:** Ensure no data leakage.
- **Feature consistency:** Same features as online serving.
- **Scalability:** Handle billions of rows.

## 4. Data Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Raw Data   │────▶│  Feature     │────▶│  Feature     │────▶│  Online     │
│  Sources    │     │  Pipeline    │     │  Store       │     │  Serving    │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
```

- **Data ingestion:** Stream and batch data from sources.
- **Feature pipeline:** Transform, aggregate, join features.
- **Feature store:** Store features for online and offline use.
- **Online serving:** Serve features to models in real-time.

## 5. Monitoring & Failure Modes

### 5.1 Monitoring
- **Data quality:** Monitor missing values, distribution shifts.
- **Latency:** Monitor online serving latency.
- **Freshness:** Monitor feature update lag.
- **Consistency:** Monitor training-serving skew.
- **Usage:** Track feature adoption, reuse.

### 5.2 Failure Modes & Mitigations
| Failure Mode | Impact | Mitigation |
|--------------|--------|------------|
| Training-serving skew | Model degradation | Consistent feature definitions, monitoring |
| Data leakage | Overfitting | Point-in-time correctness, careful joins |
| Latency spike | Slow inference | Caching, load shedding, autoscaling |
| Feature drift | Stale features | Monitoring, automated retraining |
| Schema evolution | Breaking changes | Versioning, backward compatibility |

## 6. Trade-offs

| Trade-off | Option A | Option B |
|-----------|----------|----------|
| Latency vs. freshness | Cached features | Real-time features |
| Consistency vs. flexibility | Strict schema | Flexible schema |
| Centralized vs. decentralized | Platform team | Self-service |
| Batch vs. streaming | Batch processing | Stream processing |

## 7. Key Takeaways

- **Consistency** between training and serving is critical.
- **Point-in-time correctness** prevents data leakage.
- **Feature reuse** reduces duplication and improves quality.
- **Monitoring** is essential: feature quality degrades silently.
- **Self-service** enables faster model development.
- **Versioning** ensures reproducibility and rollback.
