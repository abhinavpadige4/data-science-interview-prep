# Quality Scoring Rubric — Data Science Interview

A 100-point self-assessment. Score yourself **honestly** — the goal is to find gaps, not to feel good.

> **Target:** ≥ 80 overall before the interview. ≥ 85 in your weakest area.

---

## Scoring Method

For each domain, score 0–100 based on the criteria below. Then compute the weighted total.

| Domain | Weight | Your Score (0–100) | Weighted |
|--------|--------|--------------------|----------|
| Python | 20% | ___ | ___ |
| Statistics | 20% | ___ | ___ |
| Machine Learning | 25% | ___ | ___ |
| SQL | 15% | ___ | ___ |
| ML System Design | 20% | ___ | ___ |
| **Total** | **100%** | | **___** |

---

## 🐍 Python (20%)

| Score | Criteria |
|-------|----------|
| 90–100 | Solves medium LeetCode in < 15 min. Writes idiomatic, PEP-8 code. Explains complexity fluently. Comfortable with generators, decorators, `collections`. |
| 70–89 | Solves easy/medium problems. Knows common patterns (two-pointer, sliding window, hash-map). Some syntax gaps. |
| 50–69 | Solves easy problems with hints. Struggles with edge cases. |
| 0–49 | Cannot solve problems independently. |

**Self-check questions:**
- [ ] Can I write a generator that yields Fibonacci numbers?
- [ ] Can I explain `*args` vs `**kwargs`?
- [ ] Can I write a decorator that times a function?
- [ ] Can I solve "Two Sum" in O(n) time?
- [ ] Can I explain the time complexity of `dict` lookups?

---

## 📊 Statistics (20%)

| Score | Criteria |
|-------|----------|
| 90–100 | Derives test statistics by hand. Explains CLT, p-values, Bayesian inference clearly. Designs A/B tests with correct sample size. |
| 70–89 | Knows common tests (t, chi-square, ANOVA). Can compute p-values. Understands A/B testing basics. |
| 50–69 | Knows descriptive stats. Struggles with hypothesis testing. |
| 0–49 | Cannot explain basic concepts. |

**Self-check questions:**
- [ ] Can I explain the difference between p-value and posterior probability?
- [ ] Can I compute a sample size for a given MDE and power?
- [ ] Can I explain the Central Limit Theorem in 3 sentences?
- [ ] Can I describe when to use a t-test vs a z-test?
- [ ] Can I explain Simpson's paradox with an example?

---

## 🤖 Machine Learning (25%)

| Score | Criteria |
|-------|----------|
| 90–100 | Implements core algorithms from scratch. Explains bias-variance, regularization, ensemble methods deeply. Can derive gradients. |
| 70–89 | Knows sklearn API well. Understands model evaluation metrics. Can explain trade-offs between algorithms. |
| 50–69 | Knows basic algorithms. Struggles with theory. |
| 0–49 | Cannot explain basic concepts. |

**Self-check questions:**
- [ ] Can I derive the gradient of MSE for linear regression?
- [ ] Can I explain why L1 regularization produces sparse models?
- [ ] Can I explain the bias-variance tradeoff with a diagram?
- [ ] Can I explain how XGBoost differs from GBDT?
- [ ] Can I explain the difference between bagging and boosting?
- [ ] Can I explain AUC-ROC and when to prefer it over accuracy?

---

## 🗄 SQL (15%)

| Score | Criteria |
|-------|----------|
| 90–100 | Writes complex queries with CTEs, window functions, and subqueries. Optimizes for performance. Handles edge cases. |
| 70–89 | Writes correct queries with joins and aggregations. Knows window functions. |
| 50–69 | Writes basic queries. Struggles with window functions. |
| 0–49 | Cannot write queries independently. |

**Self-check questions:**
- [ ] Can I write a query to find the top 3 products per category?
- [ ] Can I explain the difference between `RANK` and `DENSE_RANK`?
- [ ] Can I write a cohort retention query?
- [ ] Can I explain what an index does and when it helps?
- [ ] Can I write a sessionization query (gap-and-island)?

---

## 🏗 ML System Design (20%)

| Score | Criteria |
|-------|----------|
| 90–100 | Designs end-to-end systems with clear trade-offs. Considers latency, cost, monitoring, failure modes. Communicates clearly. |
| 70–89 | Designs reasonable systems. Covers data pipeline, model training, serving. Misses some edge cases. |
| 50–69 | Designs basic systems. Struggles with trade-offs. |
| 0–49 | Cannot design systems. |

**Self-check questions:**
- [ ] Can I design a search ranking system in 45 minutes?
- [ ] Can I explain the difference between batch and real-time serving?
- [ ] Can I describe a feature store and its benefits?
- [ ] Can I list 3 failure modes for an ML system and mitigations?
- [ ] Can I explain how to monitor model drift?

---

## 📊 Weighted Total Calculation

```
Total = (Python × 0.20) + (Stats × 0.20) + (ML × 0.25) + (SQL × 0.15) + (System Design × 0.20)
```

**Example:**
- Python: 85 × 0.20 = 17.0
- Stats: 75 × 0.20 = 15.0
- ML: 80 × 0.25 = 20.0
- SQL: 90 × 0.15 = 13.5
- System Design: 70 × 0.20 = 14.0
- **Total: 79.5**

---

## 🎯 Score Interpretation

| Score | Interpretation | Action |
|-------|----------------|--------|
| 90–100 | Interview-ready | Polish, do mock interviews |
| 80–89 | Strong | Focus on weak areas, do mocks |
| 70–79 | Adequate | Extend prep by 3–5 days |
| 60–69 | Weak | Extend prep by 1–2 weeks |
| < 60 | Not ready | Start over with fundamentals |

---

## 📝 Final Checklist (Day 7)

- [ ] Solved all 7 Python problems
- [ ] Solved all 4 statistics problems
- [ ] Solved all 6 ML problems
- [ ] Solved all 5 SQL problems
- [ ] Read all 4 system design write-ups
- [ ] Completed mock interview questions
- [ ] Scored ≥ 80 overall
- [ ] Wrote a 1-page cheat sheet
- [ ] Slept 7+ hours the night before

**Good luck! 🍀**
