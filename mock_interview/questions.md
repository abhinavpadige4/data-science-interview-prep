# Mock Interview Questions — Data Science

30 rapid-fire questions with concise answers. Use these for Day 7 review.

---

## 🐍 Python (5 questions)

### Q1: What's the difference between `list`, `tuple`, and `set`?
- **list:** Mutable, ordered, allows duplicates. O(1) append, O(n) lookup.
- **tuple:** Immutable, ordered, allows duplicates. Hashable, can be dict keys.
- **set:** Mutable, unordered, no duplicates. O(1) lookup, O(1) add/remove.

### Q2: What are generators and when would you use them?
Generators are functions that use `yield` to produce values lazily. Use them for:
- Large datasets that don't fit in memory.
- Infinite sequences (e.g., Fibonacci).
- Pipelines where you want to process items one at a time.

### Q3: Explain `*args` and `**kwargs`.
- `*args`: Collects positional arguments into a tuple.
- `**kwargs`: Collects keyword arguments into a dict.
- Use for flexible function signatures.

### Q4: What's the time complexity of `dict` lookups?
O(1) average case, O(n) worst case (hash collisions). Python uses open addressing with a load factor of 2/3.

### Q5: Write a decorator that times a function.
```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper
```

---

## 📊 Statistics (5 questions)

### Q6: What's the difference between p-value and posterior probability?
- **p-value:** Probability of observing data as extreme as yours, assuming H0 is true.
- **Posterior probability:** Probability that H1 is true, given the data.
- p-value is frequentist; posterior is Bayesian.

### Q7: Explain the Central Limit Theorem.
The sampling distribution of the mean approaches a normal distribution as sample size increases, regardless of the population distribution. This is why we can use z-tests and t-tests.

### Q8: When to use t-test vs z-test?
- **z-test:** Large sample (n > 30), known population variance.
- **t-test:** Small sample (n < 30), unknown population variance.
- In practice, t-test is more robust and commonly used.

### Q9: What's Simpson's paradox?
A situation where a trend appears in different groups of data but disappears or reverses when the groups are combined. Example: a treatment appears effective in each subgroup but harmful overall due to confounding.

### Q10: How do you calculate sample size for an A/B test?
Use the formula: n = (z_{α/2} + z_β)² * (p1*(1-p1) + p2*(1-p2)) / (p2 - p1)²
Where z_{α/2} is the critical value for significance, z_β is for power, p1 and p2 are control and treatment rates.

---

## 🤖 Machine Learning (5 questions)

### Q11: Derive the gradient of MSE for linear regression.
L = (1/2n) * ||Xβ - y||²
∂L/∂β = (1/n) * X^T * (Xβ - y)

### Q12: Why does L1 regularization produce sparse models?
L1 penalty is |β|, which has a sharp corner at zero. The optimization tends to push coefficients exactly to zero, creating sparsity. L2 penalty is β², which shrinks coefficients but rarely to zero.

### Q13: Explain the bias-variance tradeoff.
- **Bias:** Error from overly simple models (underfitting).
- **Variance:** Error from overly complex models (overfitting).
- **Tradeoff:** Total error = bias² + variance + irreducible error.
- Optimal model balances bias and variance.

### Q14: How does XGBoost differ from GBDT?
- **Second-order Taylor expansion:** Uses both first and second derivatives.
- **Regularization:** L1 and L2 penalties on leaf weights.
- **Column subsampling:** Random feature selection per split.
- **Handling missing values:** Automatic direction learning.
- **Parallelization:** Feature-level parallelism.

### Q15: When to prefer AUC-ROC over accuracy?
- **Imbalanced classes:** Accuracy is misleading; AUC-ROC is robust.
- **Threshold-independent:** AUC-ROC evaluates all thresholds.
- **Probabilistic ranking:** AUC-ROC measures ranking quality.
- **Trade-off:** AUC-ROC doesn't account for false positive costs.

---

## 🗄 SQL (5 questions)

### Q16: Difference between `RANK` and `DENSE_RANK`?
- **RANK:** Ties get the same rank, gaps after (1, 2, 2, 4).
- **DENSE_RANK:** Ties get the same rank, no gaps (1, 2, 2, 3).
- **ROW_NUMBER:** No ties, unique ranks (1, 2, 3, 4).

### Q17: What does an index do?
An index is a data structure that speeds up reads at the cost of slower writes and extra storage. B-tree indexes are common for range queries; hash indexes for equality.

### Q18: Write a query to find the top 3 products per category.
```sql
WITH ranked AS (
    SELECT
        category_id,
        product_id,
        sales,
        ROW_NUMBER() OVER (
            PARTITION BY category_id
            ORDER BY sales DESC
        ) AS rn
    FROM products
)
SELECT * FROM ranked WHERE rn <= 3;
```

### Q19: What's a CTE and when to use it?
A Common Table Expression (CTE) is a temporary named result set defined with `WITH`. Use it for:
- Readability: Break complex queries into parts.
- Recursion: Hierarchical data (e.g., org charts).
- Reuse: Reference the same subquery multiple times.

### Q20: How to write a sessionization query?
Use the gap-and-island pattern:
1. Order events by timestamp.
2. Use `LAG()` to get the previous event time.
3. Flag new sessions when the gap exceeds a threshold.
4. Use cumulative sum of flags as session IDs.

---

## 🏗 ML System Design (5 questions)

### Q21: Design a search ranking system.
- **Retrieval:** Inverted index + BM25 for candidate generation.
- **Ranking:** Two-stage (coarse + fine) with learning to rank.
- **Features:** Textual, document, user, query features.
- **Serving:** Real-time with caching for popular queries.
- **Monitoring:** NDCG, CTR, latency, drift.

### Q22: Difference between batch and real-time serving?
- **Batch:** Pre-compute predictions, store in a database. Low latency, stale data.
- **Real-time:** Compute predictions on-the-fly. High latency, fresh data.
- **Hybrid:** Batch for popular items, real-time for long-tail.

### Q23: What's a feature store and why use it?
A centralized platform for storing and serving ML features. Benefits:
- **Consistency:** Same features for training and serving.
- **Reuse:** Share features across teams and models.
- **Governance:** Centralized metadata, lineage, ownership.
- **Latency:** Optimized for online serving.

### Q24: List 3 failure modes for an ML system and mitigations.
1. **Data drift:** Input distribution changes. Mitigation: Monitor distributions, retrain.
2. **Concept drift:** Relationship between features and target changes. Mitigation: Online learning, periodic retraining.
3. **Model drift:** Model performance degrades. Mitigation: A/B testing, canary deployments.

### Q25: How to monitor model drift?
- **Data drift:** Monitor input feature distributions (PSI, KL divergence).
- **Concept drift:** Monitor prediction distribution, residual patterns.
- **Model drift:** Monitor performance metrics (accuracy, AUC, RMSE).
- **Alerting:** Set thresholds, trigger retraining or rollback.

---

## 🎯 Bonus Questions (5 questions)

### Q26: What's the difference between supervised, unsupervised, and reinforcement learning?
- **Supervised:** Labeled data, predict target (classification, regression).
- **Unsupervised:** Unlabeled data, find patterns (clustering, dimensionality reduction).
- **Reinforcement:** Agent learns by interacting with environment (reward-based).

### Q27: Explain attention in 5 sentences.
Attention is a mechanism that allows models to focus on relevant parts of the input. It computes a weighted sum of inputs, where weights are learned. Self-attention computes attention between all positions in a sequence. Multi-head attention runs multiple attention heads in parallel. Transformers use self-attention as their core building block.

### Q28: Sketch a RAG pipeline.
1. **Ingestion:** Chunk documents, embed with a model, store in a vector DB.
2. **Retrieval:** Embed the query, retrieve top-K similar chunks.
3. **Augmentation:** Concatenate retrieved chunks with the query.
4. **Generation:** Pass the augmented prompt to an LLM.
5. **Post-processing:** Format, validate, and return the answer.

### Q29: What's the difference between bagging and boosting?
- **Bagging:** Train models in parallel on bootstrap samples, average predictions. Reduces variance (e.g., Random Forest).
- **Boosting:** Train models sequentially, each correcting the previous. Reduces bias (e.g., XGBoost, GBDT).

### Q30: How to handle imbalanced classes?
- **Resampling:** Oversample minority, undersample majority.
- **Class weights:** Penalize misclassification of minority class more.
- **Threshold tuning:** Adjust decision threshold to optimize F1, AUC-PR.
- **Anomaly detection:** Treat minority class as anomalies.
- **Data augmentation:** Generate synthetic minority samples (SMOTE).

---

## 📝 Final Tips

1. **Clarify the problem:** Ask about scale, latency, constraints.
2. **Think out loud:** Explain your reasoning, not just the answer.
3. **Trade-offs:** Always discuss trade-offs (latency vs. accuracy, etc.).
4. **Failure modes:** Anticipate what could go wrong and how to mitigate.
5. **Metrics:** Define success metrics before designing the system.

**Good luck! 🍀**
