# ML System Design: A/B Testing Platform

## 1. Problem Framing

**Goal:** Design a platform that allows teams to run A/B tests, measure treatment effects, and make data-driven decisions.

**Key metrics:**
- **Experiment velocity:** Time from hypothesis to decision.
- **Statistical power:** Ability to detect true effects.
- **Reliability:** Correct p-values, confidence intervals.
- **Scale:** 1000+ concurrent experiments, 100M+ users/day.
- **Latency:** Results available within minutes of data arrival.

## 2. High-Level Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Experiment │────▶│  Assignment  │────▶│  Data        │────▶│  Analysis   │
│  Config     │     │  Service     │     │  Collection  │     │  Engine     │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
                                                                    │
                                                                    ▼
                                                            ┌─────────────┐
                                                            │  Results    │
                                                            │  Dashboard  │
                                                            └─────────────┘
```

## 3. Components

### 3.1 Experiment Configuration
- **Hypothesis:** What are we testing?
- **Variants:** Control, treatment(s).
- **Traffic allocation:** % of users in each variant.
- **Sample size:** Required for statistical power.
- **Duration:** Minimum and maximum run time.
- **Metrics:** Primary, secondary, guardrail metrics.

### 3.2 Assignment Service
- **Randomization:** Hash-based, consistent across sessions.
- **Stratification:** Ensure balance across user segments.
- **Mutual exclusion:** Prevent users from being in conflicting experiments.
- **Layering:** Allow multiple experiments to run simultaneously.
- **Latency:** < 10ms for assignment.

**Key design decisions:**
- **User-level vs. session-level:** User-level is more powerful but harder to implement.
- **Consistent hashing:** Ensure users always get the same variant.
- **Salted hashing:** Prevent correlation between experiments.

### 3.3 Data Collection
- **Event logging:** Track user actions, variant assignments.
- **Real-time pipeline:** Kafka, Kinesis for streaming.
- **Batch pipeline:** Daily aggregates for long-term analysis.
- **Data quality:** Monitor missing data, logging errors.

### 3.4 Analysis Engine
- **Statistical tests:** Z-test, t-test, chi-square, Bayesian.
- **Multiple testing correction:** Bonferroni, Benjamini-Hochberg.
- **Sequential testing:** Optional early stopping with alpha spending.
- **Heterogeneous treatment effects:** Segment-level analysis.
- **Novelty effects:** Detect and account for time-varying effects.

### 3.5 Results Dashboard
- **Real-time metrics:** Live updates as data arrives.
- **Statistical significance:** P-values, confidence intervals.
- **Power analysis:** Current power, required sample size.
- **Guardrail metrics:** Monitor for negative side effects.
- **Decision support:** Recommend ship/iterate/kill.

## 4. Data Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  User       │────▶│  Event       │────▶│  Stream      │────▶│  Analysis   │
│  Actions    │     │  Logging     │     │  Processing  │     │  Engine     │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
```

- **Event logging:** Client-side and server-side events.
- **Stream processing:** Real-time aggregation, anomaly detection.
- **Batch processing:** Daily aggregates, long-term trends.
- **Analysis engine:** Statistical tests, confidence intervals.

## 5. Monitoring & Failure Modes

### 5.1 Monitoring
- **Data quality:** Monitor logging errors, missing data.
- **Sample ratio mismatch:** Detect randomization issues.
- **Metric anomalies:** Detect unexpected metric movements.
- **Experiment health:** Monitor concurrent experiments, conflicts.

### 5.2 Failure Modes & Mitigations
| Failure Mode | Impact | Mitigation |
|--------------|--------|------------|
| Sample ratio mismatch | Biased results | Monitor SRM, investigate root cause |
| Data leakage | Contaminated results | Strict isolation, careful logging |
| Multiple testing | False positives | Correction methods, pre-registration |
| Peeking | Inflated false positives | Sequential testing, fixed horizon |
| Network effects | Spillover between variants | Cluster randomization, switchback tests |

## 6. Trade-offs

| Trade-off | Option A | Option B |
|-----------|----------|----------|
| Speed vs. rigor | Fast iteration | Rigorous analysis |
| Flexibility vs. consistency | Ad-hoc experiments | Standardized process |
| Centralized vs. decentralized | Platform team | Self-service |
| Frequentist vs. Bayesian | P-values | Posterior probabilities |

## 7. Key Takeaways

- **Randomization** is the foundation of causal inference.
- **Sample ratio mismatch** is a common and critical failure mode.
- **Multiple testing** requires correction to avoid false positives.
- **Sequential testing** allows early stopping without inflating false positives.
- **Guardrail metrics** protect against negative side effects.
- **Self-service** enables faster experimentation velocity.
