"""
Problem 02: A/B Test — Bayesian Beta-Binomial
==============================================

Same data as the frequentist test, but analyzed with a Bayesian approach.

Control (A): 1,200 conversions out of 10,000 visitors.
Treatment (B): 1,350 conversions out of 10,000 visitors.

Question: What is the probability that B is better than A?

Approach: Beta-Binomial conjugate model.
- Prior: p ~ Beta(α, β) (use Beta(1, 1) = uniform, or Beta(0.5, 0.5) = Jeffreys)
- Likelihood: conversions ~ Binomial(n, p)
- Posterior: p | data ~ Beta(α + successes, β + failures)
- Monte Carlo: sample from both posteriors, compute P(p_B > p_A)

Time:  O(n_samples)
Space: O(1)
"""

from __future__ import annotations
import math
import random
from dataclasses import dataclass


def beta_sample(alpha: float, beta: float, rng: random.Random) -> float:
    """Sample from a Beta(α, β) distribution using the Gamma trick.

    If X ~ Gamma(α, 1) and Y ~ Gamma(β, 1), then X/(X+Y) ~ Beta(α, β).
    """
    x = _gamma_sample(alpha, rng)
    y = _gamma_sample(beta, rng)
    return x / (x + y)


def _gamma_sample(shape: float, rng: random.Random) -> float:
    """Sample from Gamma(shape, 1) using Marsaglia & Tsang's method."""
    if shape < 1:
        # Boost: Gamma(shape) = Gamma(shape+1) * U^(1/shape)
        u = rng.random()
        return _gamma_sample(shape + 1, rng) * (u ** (1.0 / shape))

    d = shape - 1.0 / 3.0
    c = 1.0 / math.sqrt(9.0 * d)
    while True:
        x = rng.gauss(0, 1)
        v = (1.0 + c * x) ** 3
        if v <= 0:
            continue
        u = rng.random()
        if u < 1.0 - 0.0331 * (x ** 4):
            return d * v
        if math.log(u) < 0.5 * x * x + d * (1.0 - v + math.log(v)):
            return d * v


def beta_mean(alpha: float, beta: float) -> float:
    """Mean of Beta(α, β) = α / (α + β)."""
    return alpha / (alpha + beta)


def beta_variance(alpha: float, beta: float) -> float:
    """Variance of Beta(α, β) = αβ / ((α+β)² (α+β+1))."""
    s = alpha + beta
    return (alpha * beta) / (s * s * (s + 1))


@dataclass
class BayesianABResult:
    """Result of a Bayesian A/B test."""
    posterior_a_mean: float
    posterior_b_mean: float
    prob_b_beats_a: float
    prob_b_beats_a_by_mde: float
    expected_loss_a: float
    expected_loss_b: float
    n_samples: int

    def __str__(self) -> str:
        return (
            f"Posterior mean A: {self.posterior_a_mean:.4f}\n"
            f"Posterior mean B: {self.posterior_b_mean:.4f}\n"
            f"P(B > A): {self.prob_b_beats_a:.4f} "
            f"({self.prob_b_beats_a * 100:.2f}%)\n"
            f"P(B > A by ≥ MDE): {self.prob_b_beats_a_by_mde:.4f}\n"
            f"Expected loss (choose A): {self.expected_loss_a:.4f}\n"
            f"Expected loss (choose B): {self.expected_loss_b:.4f}\n"
            f"Samples: {self.n_samples}"
        )


def bayesian_ab_test(
    successes_a: int,
    n_a: int,
    successes_b: int,
    n_b: int,
    prior_alpha: float = 1.0,
    prior_beta: float = 1.0,
    n_samples: int = 100_000,
    mde: float = 0.0,
    seed: int = 42,
) -> BayesianABResult:
    """Run a Bayesian A/B test using Monte Carlo sampling.

    Args:
        successes_a, n_a: Control conversions and visitors.
        successes_b, n_b: Treatment conversions and visitors.
        prior_alpha, prior_beta: Beta prior parameters (default: uniform).
        n_samples: Number of Monte Carlo samples.
        mde: Minimum detectable effect for the "beats by MDE" probability.
        seed: Random seed for reproducibility.

    Returns:
        BayesianABResult with posterior means, probabilities, and expected losses.

    Time:  O(n_samples)
    Space: O(1)
    """
    rng = random.Random(seed)

    # Posterior parameters
    alpha_a = prior_alpha + successes_a
    beta_a = prior_beta + (n_a - successes_a)
    alpha_b = prior_alpha + successes_b
    beta_b = prior_beta + (n_b - successes_b)

    # Analytical posterior means
    mean_a = beta_mean(alpha_a, beta_a)
    mean_b = beta_mean(alpha_b, beta_b)

    # Monte Carlo sampling
    b_beats_a = 0
    b_beats_a_by_mde = 0
    loss_a_sum = 0.0
    loss_b_sum = 0.0

    for _ in range(n_samples):
        p_a = beta_sample(alpha_a, beta_a, rng)
        p_b = beta_sample(alpha_b, beta_b, rng)

        if p_b > p_a:
            b_beats_a += 1
            if p_b - p_a >= mde:
                b_beats_a_by_mde += 1
            # Expected loss if we choose A: we lose (p_b - p_a)
            loss_a_sum += (p_b - p_a)
        else:
            # Expected loss if we choose B: we lose (p_a - p_b)
            loss_b_sum += (p_a - p_b)

    return BayesianABResult(
        posterior_a_mean=mean_a,
        posterior_b_mean=mean_b,
        prob_b_beats_a=b_beats_a / n_samples,
        prob_b_beats_a_by_mde=b_beats_a_by_mde / n_samples,
        expected_loss_a=loss_a_sum / n_samples,
        expected_loss_b=loss_b_sum / n_samples,
        n_samples=n_samples,
    )


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # The classic example
    result = bayesian_ab_test(
        successes_a=1200, n_a=10000,
        successes_b=1350, n_b=10000,
        n_samples=100_000,
        mde=0.005,  # 0.5 percentage points
    )
    print(result)
    # Expected: P(B > A) ≈ 0.997, posterior means ≈ 0.12 and 0.135
    assert 0.99 < result.prob_b_beats_a < 1.0
    assert abs(result.posterior_a_mean - 0.12) < 0.001
    assert abs(result.posterior_b_mean - 0.135) < 0.001

    # No difference case
    result2 = bayesian_ab_test(
        successes_a=1000, n_a=10000,
        successes_b=1000, n_b=10000,
        n_samples=50_000,
    )
    print(result2)
    # Expected: P(B > A) ≈ 0.5
    assert 0.45 < result2.prob_b_beats_a < 0.55

    # B is worse
    result3 = bayesian_ab_test(
        successes_a=1500, n_a=10000,
        successes_b=1000, n_b=10000,
        n_samples=50_000,
    )
    print(result3)
    # Expected: P(B > A) ≈ 0.003
    assert result3.prob_b_beats_a < 0.01

    # Verify beta_sample produces correct mean
    rng = random.Random(123)
    samples = [beta_sample(2.0, 5.0, rng) for _ in range(100_000)]
    empirical_mean = sum(samples) / len(samples)
    theoretical_mean = 2.0 / 7.0
    assert abs(empirical_mean - theoretical_mean) < 0.01, (
        empirical_mean, theoretical_mean
    )

    # Verify beta_mean and beta_variance
    assert abs(beta_mean(2, 5) - 2/7) < 1e-10
    assert abs(beta_variance(2, 5) - (2*5)/(49*8)) < 1e-10

    print("\nAll tests passed.")
