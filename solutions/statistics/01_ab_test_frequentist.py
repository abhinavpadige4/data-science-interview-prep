"""
Problem 01: A/B Test — Frequentist Two-Proportion Z-Test
=========================================================

You ran an A/B test on a checkout page. Control (A) had 10,000 visitors with
a 12.0% conversion rate. Treatment (B) had 10,000 visitors with a 13.5%
conversion rate.

Question: Is the difference statistically significant at α = 0.05?

Approach: Two-proportion z-test (pooled variance).
- H0: p_A = p_B (no difference)
- H1: p_A ≠ p_B (two-sided)
- Test statistic: z = (p_B - p_A) / sqrt(p_pool * (1 - p_pool) * (1/n_A + 1/n_B))
- p-value: 2 * (1 - Φ(|z|))

Time:  O(1)
Space: O(1)
"""

from __future__ import annotations
import math
from dataclasses import dataclass


def normal_cdf(x: float) -> float:
    """Standard normal CDF using the error function.

    Φ(x) = 0.5 * (1 + erf(x / sqrt(2)))
    """
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def normal_ppf(p: float) -> float:
    """Inverse normal CDF (percent point function) via bisection.

    Accurate to ~1e-6 for p in (0, 1).
    """
    if not 0 < p < 1:
        raise ValueError("p must be in (0, 1)")
    lo, hi = -10.0, 10.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if normal_cdf(mid) < p:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


@dataclass
class ZTestResult:
    """Result of a two-proportion z-test."""
    z_statistic: float
    p_value: float
    alpha: float
    significant: bool
    ci_lower: float
    ci_upper: float
    effect_size: float  # absolute difference in proportions

    def __str__(self) -> str:
        sig = "SIGNIFICANT" if self.significant else "NOT significant"
        return (
            f"z = {self.z_statistic:.4f}, p = {self.p_value:.4f} "
            f"(α = {self.alpha}), {sig}\n"
            f"95% CI for difference: [{self.ci_lower:.4f}, {self.ci_upper:.4f}]\n"
            f"Effect size: {self.effect_size:.4f} "
            f"({self.effect_size * 100:.2f} percentage points)"
        )


def two_proportion_z_test(
    successes_a: int,
    n_a: int,
    successes_b: int,
    n_b: int,
    alpha: float = 0.05,
    two_sided: bool = True,
) -> ZTestResult:
    """Run a two-proportion z-test.

    Args:
        successes_a: Number of conversions in control.
        n_a: Total visitors in control.
        successes_b: Number of conversions in treatment.
        n_b: Total visitors in treatment.
        alpha: Significance level (default 0.05).
        two_sided: If True, test H1: p_A ≠ p_B. If False, test H1: p_B > p_A.

    Returns:
        ZTestResult with z-statistic, p-value, CI, and significance.

    Time:  O(1)
    Space: O(1)
    """
    if n_a <= 0 or n_b <= 0:
        raise ValueError("Sample sizes must be positive")
    if not (0 <= successes_a <= n_a and 0 <= successes_b <= n_b):
        raise ValueError("Successes must be between 0 and n")

    p_a = successes_a / n_a
    p_b = successes_b / n_b

    # Pooled proportion (under H0)
    p_pool = (successes_a + successes_b) / (n_a + n_b)

    # Standard error under H0
    se_pooled = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))

    # Test statistic
    if se_pooled == 0:
        z = 0.0
    else:
        z = (p_b - p_a) / se_pooled

    # p-value
    if two_sided:
        p_value = 2 * (1 - normal_cdf(abs(z)))
    else:
        p_value = 1 - normal_cdf(z)  # one-sided: p_B > p_A

    # Confidence interval for the difference (unpooled SE)
    se_unpooled = math.sqrt(
        p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b
    )
    z_crit = normal_ppf(1 - alpha / 2)
    diff = p_b - p_a
    ci_lower = diff - z_crit * se_unpooled
    ci_upper = diff + z_crit * se_unpooled

    return ZTestResult(
        z_statistic=z,
        p_value=p_value,
        alpha=alpha,
        significant=p_value < alpha,
        ci_lower=ci_lower,
        ci_upper=ci_upper,
        effect_size=diff,
    )


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # The classic example from the problem statement
    # 12.0% vs 13.5% with 10,000 per group IS significant
    result = two_proportion_z_test(
        successes_a=1200, n_a=10000,
        successes_b=1350, n_b=10000,
        alpha=0.05,
    )
    print(result)
    # Expected: z ≈ 3.18, p ≈ 0.0015, SIGNIFICANT at α=0.05
    assert abs(result.z_statistic - 3.18) < 0.1
    assert result.p_value < 0.01
    assert result.significant

    # A clearly significant result (larger effect)
    result2 = two_proportion_z_test(
        successes_a=1000, n_a=10000,
        successes_b=1500, n_b=10000,
        alpha=0.05,
    )
    print(result2)
    assert result2.significant
    assert result2.p_value < 0.001

    # A NOT significant result (smaller effect)
    result3 = two_proportion_z_test(
        successes_a=1200, n_a=10000,
        successes_b=1250, n_b=10000,
        alpha=0.05,
    )
    print(result3)
    # Expected: z ≈ 0.54, p ≈ 0.58, NOT significant
    assert abs(result3.z_statistic - 0.54) < 0.1
    assert result3.p_value > 0.5
    assert not result3.significant

    # No difference
    result4 = two_proportion_z_test(
        successes_a=1000, n_a=10000,
        successes_b=1000, n_b=10000,
    )
    assert abs(result4.z_statistic) < 1e-9
    assert result4.p_value > 0.99

    # One-sided test
    result5 = two_proportion_z_test(
        successes_a=1200, n_a=10000,
        successes_b=1350, n_b=10000,
        alpha=0.05,
        two_sided=False,
    )
    # One-sided p should be half of two-sided
    assert abs(result5.p_value - result.p_value / 2) < 1e-6

    # Edge case: zero successes
    result6 = two_proportion_z_test(0, 100, 0, 100)
    assert abs(result6.z_statistic) < 1e-9

    # Verify normal_cdf and normal_ppf are inverses
    for x in [-2, -1, 0, 1, 2]:
        p = normal_cdf(x)
        x_back = normal_ppf(p)
        assert abs(x - x_back) < 1e-4, (x, p, x_back)

    print("\nAll tests passed.")
