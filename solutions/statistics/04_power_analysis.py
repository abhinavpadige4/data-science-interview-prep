"""
Problem 04: Power Analysis & Sample Size Calculation
=====================================================

You want to detect a 5% relative lift in conversion rate (from 10% to 10.5%)
with 80% power at α = 0.05. How many users do you need per group?

Approach: Two-proportion z-test sample size formula.
- n = (z_{α/2} + z_β)² * (p1*(1-p1) + p2*(1-p2)) / (p2 - p1)²
- Where z_{α/2} is the critical value for the significance level,
  z_β is the critical value for the desired power,
  p1 and p2 are the control and treatment proportions.

Time:  O(1)
Space: O(1)
"""

from __future__ import annotations
import math
from dataclasses import dataclass


def normal_cdf(x: float) -> float:
    """Standard normal CDF."""
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def normal_ppf(p: float) -> float:
    """Inverse normal CDF via bisection."""
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
class PowerAnalysisResult:
    """Result of a power analysis."""
    n_per_group: int
    total_n: int
    alpha: float
    power: float
    p_control: float
    p_treatment: float
    absolute_lift: float
    relative_lift: float
    mde: float

    def __str__(self) -> str:
        return (
            f"Sample size per group: {self.n_per_group:,}\n"
            f"Total sample size: {self.total_n:,}\n"
            f"α: {self.alpha}, Power: {self.power}\n"
            f"Control rate: {self.p_control:.4f}\n"
            f"Treatment rate: {self.p_treatment:.4f}\n"
            f"Absolute lift: {self.absolute_lift:.4f} "
            f"({self.absolute_lift * 100:.2f} pp)\n"
            f"Relative lift: {self.relative_lift:.2%}\n"
            f"MDE: {self.mde:.4f}"
        )


def sample_size_two_proportion(
    p_control: float,
    p_treatment: float,
    alpha: float = 0.05,
    power: float = 0.80,
    two_sided: bool = True,
) -> PowerAnalysisResult:
    """Calculate sample size for a two-proportion z-test.

    Args:
        p_control: Expected conversion rate in control.
        p_treatment: Expected conversion rate in treatment.
        alpha: Significance level (default 0.05).
        power: Desired power (default 0.80).
        two_sided: If True, use two-sided test.

    Returns:
        PowerAnalysisResult with the required sample size.

    Time:  O(1)
    Space: O(1)
    """
    if not (0 < p_control < 1 and 0 < p_treatment < 1):
        raise ValueError("Proportions must be in (0, 1)")
    if p_control == p_treatment:
        raise ValueError("Proportions must be different")
    if not (0 < alpha < 1 and 0 < power < 1):
        raise ValueError("alpha and power must be in (0, 1)")

    # Critical values
    if two_sided:
        z_alpha = normal_ppf(1 - alpha / 2)
    else:
        z_alpha = normal_ppf(1 - alpha)
    z_beta = normal_ppf(power)

    # Sample size formula
    p1 = p_control
    p2 = p_treatment
    diff = abs(p2 - p1)

    # Pooled proportion for the variance under H0
    p_pool = (p1 + p2) / 2
    variance_pooled = p_pool * (1 - p_pool)

    # Unpooled variance for the variance under H1
    variance_unpooled = p1 * (1 - p1) + p2 * (1 - p2)

    # Use the unpooled variance (more conservative)
    n = ((z_alpha + z_beta) ** 2 * variance_unpooled) / (diff ** 2)

    # Round up to the nearest integer
    n_per_group = math.ceil(n)

    return PowerAnalysisResult(
        n_per_group=n_per_group,
        total_n=2 * n_per_group,
        alpha=alpha,
        power=power,
        p_control=p_control,
        p_treatment=p_treatment,
        absolute_lift=p2 - p1,
        relative_lift=(p2 - p1) / p1,
        mde=diff,
    )


def power_two_proportion(
    p_control: float,
    p_treatment: float,
    n_per_group: int,
    alpha: float = 0.05,
    two_sided: bool = True,
) -> float:
    """Calculate the power of a two-proportion z-test.

    Args:
        p_control: Expected conversion rate in control.
        p_treatment: Expected conversion rate in treatment.
        n_per_group: Sample size per group.
        alpha: Significance level.
        two_sided: If True, use two-sided test.

    Returns:
        Power (probability of rejecting H0 when H1 is true).

    Time:  O(1)
    Space: O(1)
    """
    if not (0 < p_control < 1 and 0 < p_treatment < 1):
        raise ValueError("Proportions must be in (0, 1)")
    if p_control == p_treatment:
        return alpha  # Power equals alpha when there's no effect

    p1 = p_control
    p2 = p_treatment
    diff = p2 - p1

    # Standard error under H0
    p_pool = (p1 + p2) / 2
    se_h0 = math.sqrt(p_pool * (1 - p_pool) * (2 / n_per_group))

    # Standard error under H1
    se_h1 = math.sqrt((p1 * (1 - p1) + p2 * (1 - p2)) / n_per_group)

    # Critical value
    if two_sided:
        z_alpha = normal_ppf(1 - alpha / 2)
    else:
        z_alpha = normal_ppf(1 - alpha)

    # Power calculation
    if diff > 0:
        z_beta = (diff - z_alpha * se_h0) / se_h1
        power = normal_cdf(z_beta)
    else:
        z_beta = (diff + z_alpha * se_h0) / se_h1
        power = 1 - normal_cdf(z_beta)

    return power


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # The classic example: 10% to 10.5% (5% relative lift)
    result = sample_size_two_proportion(
        p_control=0.10,
        p_treatment=0.105,
        alpha=0.05,
        power=0.80,
    )
    print(result)
    # Expected: ~30,000+ per group
    assert result.n_per_group > 20000
    assert result.n_per_group < 50000

    # Larger effect: 10% to 12% (20% relative lift)
    result2 = sample_size_two_proportion(
        p_control=0.10,
        p_treatment=0.12,
        alpha=0.05,
        power=0.80,
    )
    print(result2)
    # Expected: ~3,000-4,000 per group
    assert 2000 < result2.n_per_group < 5000

    # Higher power requires more samples
    result3 = sample_size_two_proportion(
        p_control=0.10,
        p_treatment=0.12,
        alpha=0.05,
        power=0.95,
    )
    print(result3)
    assert result3.n_per_group > result2.n_per_group

    # Higher alpha requires fewer samples
    result4 = sample_size_two_proportion(
        p_control=0.10,
        p_treatment=0.12,
        alpha=0.10,
        power=0.80,
    )
    print(result4)
    assert result4.n_per_group < result2.n_per_group

    # Verify power calculation
    power = power_two_proportion(
        p_control=0.10,
        p_treatment=0.12,
        n_per_group=result2.n_per_group,
        alpha=0.05,
    )
    print(f"Power with n={result2.n_per_group}: {power:.4f}")
    assert 0.75 < power < 0.85

    # No effect: power should equal alpha
    power_no_effect = power_two_proportion(
        p_control=0.10,
        p_treatment=0.10,
        n_per_group=1000,
        alpha=0.05,
    )
    assert abs(power_no_effect - 0.05) < 1e-6

    # Verify normal_cdf and normal_ppf are inverses
    for x in [-2, -1, 0, 1, 2]:
        p = normal_cdf(x)
        x_back = normal_ppf(p)
        assert abs(x - x_back) < 1e-4, (x, p, x_back)

    print("\nAll tests passed.")
