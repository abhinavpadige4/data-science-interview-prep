# 7-Day Data Science Interview Study Plan

A focused, high-yield sprint. Each day has a **theme**, **core topics**, **practice problems** (with links to solutions in this repo), and a **deliverable**.

> **Rule of thumb:** 4h study + 1h review + 1h mock. Sleep 7h. No exceptions.

---

## Day 1 — Python Foundations & Data Structures

**Goal:** Write clean, idiomatic Python under time pressure.

### Core Topics
- List/dict/set/tuple internals and complexity
- List/dict/set comprehensions
- Iterators, generators, `yield`
- Decorators, `*args`, `**kwargs`
- `collections` module: `Counter`, `defaultdict`, `deque`
- Big-O analysis of common operations
- `itertools`, `functools`

### Practice Problems (in `solutions/python/`)
1. `01_two_sum.py` — hash-map lookup
2. `02_group_by.py` — `defaultdict` mastery
3. `03_top_k_frequent.py` — heap + Counter
4. `04_merge_intervals.py` — sorting + greedy
5. `05_longest_substring.py` — sliding window
6. `06_sliding_window_max.py` — monotonic deque
7. `07_flatten_nested_list.py` — generator recursion

### Deliverable
- Solve all 7 problems **without looking** at the solution first.
- Time yourself: target < 15 min per problem.

---

## Day 2 — Statistics & Probability

**Goal:** Reason quantitatively about uncertainty and experiments.

### Core Topics
- Descriptive stats: mean, median, variance, std, skew, kurtosis
- Distributions: normal, binomial, Poisson, exponential, uniform
- Central Limit Theorem (CLT) — when and why
- Hypothesis testing: null/alternative, p-value, α, β, power
- t-test, chi-square, ANOVA — when to use which
- Bayesian basics: prior, likelihood, posterior, MAP
- A/B testing: sample size, MDE, sequential testing pitfalls
- Bootstrap confidence intervals

### Practice Problems (in `solutions/statistics/`)
1. `01_ab_test_frequentist.py` — two-proportion z-test
2. `02_ab_test_bayesian.py` — Beta-Binomial posterior
3. `03_bootstrap_ci.py` — percentile & BCa bootstrap
4. `04_power_analysis.py` — sample size for a given MDE

### Deliverable
- Explain the difference between p-value and posterior probability in 3 sentences.
- Compute a sample size for a 5% MDE at 80% power.

---

## Day 3 — Machine Learning Fundamentals

**Goal:** Implement core algorithms from scratch and explain trade-offs.

### Core Topics
- Linear regression: OLS, gradient descent, regularization (L1/L2)
- Logistic regression: sigmoid, cross-entropy, decision boundary
- Model evaluation: MSE, RMSE, MAE, R², accuracy, precision, recall, F1, AUC-ROC, PR-AUC
- Bias-variance tradeoff, overfitting, underfitting
- Cross-validation: k-fold, stratified, LOOCV
- Feature scaling, encoding (one-hot, target, frequency)
- Trees: CART, Gini, entropy, pruning
- Ensembles: bagging (RF), boosting (GBDT, XGBoost, LightGBM)

### Practice Problems (in `solutions/ml/`)
1. `01_linear_regression.py` — closed-form + GD
2. `02_logistic_regression.py` — Newton-Raphson + GD
3. `03_kmeans.py` — Lloyd's algorithm
4. `04_decision_tree.py` — CART with Gini
5. `05_gradient_boosting.py` — functional gradient boosting
6. `06_collaborative_filtering.py` — matrix factorization (SGD)

### Deliverable
- Hand-derive the gradient of MSE for linear regression.
- Explain why XGBoost uses second-order Taylor expansion.

---

## Day 4 — SQL Mastery

**Goal:** Write production-quality analytical SQL.

### Core Topics
- `SELECT`, `WHERE`, `GROUP BY`, `HAVING`
- Joins: INNER, LEFT, RIGHT, FULL, CROSS, ANTI, SEMI
- Subqueries vs CTEs (`WITH`)
- Window functions: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, `SUM() OVER`
- Date/time functions
- Cohort analysis, retention, funnels
- Sessionization (gap-and-island)
- Performance: indexes, partition pruning, query plans

### Practice Problems (in `solutions/sql/`)
1. `01_top_n_per_group.sql` — top 3 products per category
2. `02_retention_cohort.sql` — weekly retention matrix
3. `03_funnel_analysis.sql` — multi-step conversion
4. `04_sessionization.sql` — 30-min inactivity sessions
5. `05_running_totals.sql` — cumulative metrics

### Deliverable
- Write each query twice: once with CTEs, once with subqueries.
- Explain the difference between `RANK` and `DENSE_RANK` with an example.

---

## Day 5 — ML System Design

**Goal:** Design end-to-end ML systems with clear trade-offs.

### Core Topics
- Problem framing: offline vs online, batch vs streaming
- Data pipeline: ingestion, storage, transformation
- Feature engineering & feature stores
- Model training: offline, online, incremental
- Model serving: batch, real-time, latency budgets
- A/B testing & experimentation platforms
- Monitoring: data drift, concept drift, model drift
- MLOps: CI/CD for ML, model registry, rollback

### Practice Write-ups (in `solutions/system_design/`)
1. `01_search_ranking.md` — design a search ranking system
2. `02_recommender_system.md` — design a recommender (Netflix-style)
3. `03_ab_testing_platform.md` — design an A/B testing platform
4. `04_feature_store.md` — design a feature store

### Deliverable
- Whiteboard one system end-to-end in 45 minutes.
- List 3 failure modes and mitigations for each.

---

## Day 6 — Advanced ML & Deep Learning

**Goal:** Cover the "stretch" topics that differentiate senior candidates.

### Core Topics
- Neural networks: backprop, activation functions, optimizers (SGD, Adam)
- CNNs, RNNs, LSTMs, Transformers (attention, self-attention)
- NLP: tokenization, embeddings, BERT, fine-tuning
- Time series: ARIMA, Prophet, exponential smoothing
- Unsupervised: PCA, t-SNE, UMAP, autoencoders
- Reinforcement learning basics (Q-learning, policy gradient)
- LLMs: prompting, RAG, fine-tuning, evaluation

### Practice
- Re-implement backprop for a 2-layer MLP (paper + code).
- Explain attention in 5 sentences.
- Sketch a RAG pipeline.

### Deliverable
- Write a 1-page design doc for a RAG-based customer support bot.

---

## Day 7 — Mock Interview & Review

**Goal:** Simulate the real thing and close gaps.

### Schedule
- **Morning (2h):** Rapid-fire questions from `mock_interview/questions.md`
- **Midday (2h):** One full system design mock (45 min) + one SQL mock (30 min)
- **Afternoon (2h):** Review weak areas, redo 2 hardest problems
- **Evening (1h):** Light review, sleep early

### Deliverable
- Score yourself with `03_quality_scoring.md`. Target ≥ 80 overall.
- Write a 1-page "cheat sheet" of formulas and gotchas.

---

## 📅 At-a-Glance Calendar

| Day | Theme | Hours | Key Deliverable |
|-----|-------|-------|-----------------|
| 1 | Python | 6 | 7 problems solved |
| 2 | Statistics | 6 | A/B test + power calc |
| 3 | ML Fundamentals | 6 | 6 algorithms from scratch |
| 4 | SQL | 6 | 5 analytical queries |
| 5 | ML System Design | 6 | 4 system write-ups |
| 6 | Advanced ML / DL | 6 | RAG design doc |
| 7 | Mock + Review | 6 | Score ≥ 80 |

**Total: ~42 hours over 7 days.**
