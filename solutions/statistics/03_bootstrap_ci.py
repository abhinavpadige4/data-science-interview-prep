"""
Problem 03: Bootstrap Confidence Intervals
===========================================

Given a sample of data, compute a confidence interval for the mean (or any
statistic) using the bootstrap method.

The bootstrap is a resampling technique that estimates the sampling
distribution of a statistic by repeatedly resampling with replacement from
the original sample.

Approaches:
1. Percentile method: use the α/2 and 1-α/2 quantiles of the bootstrap
   distribution.
2. BCa (Bias-Corrected and Accelerated): adjusts for bias and skewness.

Time:  O(B * n) where B is the number of bootstrap samples.
Space: O(n)
"""

from __future__ import annotations
import math
import random
from dataclasses import dataclass
from typing import Callable, List, Sequence


@dataclass
class BootstrapResult:
    """Result of a bootstrap confidence interval."""
    statistic: float
    ci_lower: float
    ci_upper: float
    confidence_level: float
    n_bootstrap: int
    method: str
    std_error: float
    bias: float

    def __str__(self) -> str:
        return (
            f"Statistic: {self.statistic:.4f}\n"
            f"{self.confidence_level * 100:.1f}% CI: "
            f"[{self.ci_lower:.4f}, {self.ci_upper:.4f}]\n"
            f"Std error: {self.std_error:.4f}\n"
            f"Bias: {self.bias:.4f}\n"
            f"Method: {self.method}, B = {self.n_bootstrap}"
        )


def bootstrap_ci(
    data: Sequence[float],
    statistic_fn: Callable[[Sequence[float]], float] = None,
    confidence_level: float = 0.95,
    n_bootstrap: int = 10_000,
    method: str = "percentile",
    seed: int = 42,
) -> BootstrapResult:
    """Compute a bootstrap confidence interval for a statistic.

    Args:
        data: The original sample.
        statistic_fn: Function to compute the statistic (default: mean).
        confidence_level: Confidence level (default 0.95).
        n_bootstrap: Number of bootstrap samples (default 10,000).
        method: "percentile" or "bca".
        seed: Random seed for reproducibility.

    Returns:
        BootstrapResult with the CI and diagnostics.

    Time:  O(B * n)
    Space: O(n)
    """
    if statistic_fn is None:
        statistic_fn = lambda x: sum(x) / len(x)

    if len(data) < 2:
        raise ValueError("Need at least 2 data points")

    rng = random.Random(seed)
    n = len(data)
    data_list = list(data)

    # Original statistic
    original_stat = statistic_fn(data_list)

    # Bootstrap resampling
    bootstrap_stats = []
    for _ in range(n_bootstrap):
        # Resample with replacement
        sample = [data_list[rng.randrange(n)] for _ in range(n)]
        bootstrap_stats.append(statistic_fn(sample))

    bootstrap_stats.sort()

    # Standard error and bias
    mean_boot = sum(bootstrap_stats) / n_bootstrap
    var_boot = sum((x - mean_boot) ** 2 for x in bootstrap_stats) / (n_bootstrap - 1)
    std_error = math.sqrt(var_boot)
    bias = mean_boot - original_stat

    if method == "percentile":
        alpha = 1 - confidence_level
        lo_idx = int(alpha / 2 * n_bootstrap)
        hi_idx = int((1 - alpha / 2) * n_bootstrap)
        ci_lower = bootstrap_stats[lo_idx]
        ci_upper = bootstrap_stats[hi_idx]

    elif method == "bca":
        ci_lower, ci_upper = _bca_ci(
            bootstrap_stats, original_stat, data_list, statistic_fn,
            confidence_level, rng
        )

    else:
        raise ValueError(f"Unknown method: {method}")

    return BootstrapResult(
        statistic=original_stat,
        ci_lower=ci_lower,
        ci_upper=ci_upper,
        confidence_level=confidence_level,
        n_bootstrap=n_bootstrap,
        method=method,
        std_error=std_error,
        bias=bias,
    )


def _bca_ci(
    bootstrap_stats: List[float],
    original_stat: float,
    data: List[float],
    statistic_fn: Callable,
    confidence_level: float,
    rng: random.Random,
) -> tuple[float, float]:
    """Compute BCa (Bias-Corrected and Accelerated) confidence interval.

    BCa adjusts the percentile method for:
    1. Bias: how far the original statistic is from the bootstrap mean.
    2. Acceleration: how quickly the standard error changes with the statistic.
    """
    n_bootstrap = len(bootstrap_stats)
    n = len(data)
    alpha = 1 - confidence_level

    # Bias correction: proportion of bootstrap stats below the original
    z0 = _norm_ppf(
        sum(1 for x in bootstrap_stats if x < original_stat) / n_bootstrap
    )

    # Acceleration: jackknife estimate
    jackknife_stats = []
    for i in range(n):
        # Leave-one-out sample
        sample = data[:i] + data[i + 1:]
        jackknife_stats.append(statistic_fn(sample))

    mean_jack = sum(jackknife_stats) / n
    num = sum((mean_jack - x) ** 3 for x in jackknife_stats)
    den = 6.0 * (sum((mean_jack - x) ** 2 for x in jackknife_stats) ** 1.5)
    accel = num / den if den != 0 else 0.0

    # Adjusted quantiles
    z_lo = _norm_ppf(alpha / 2)
    z_hi = _norm_ppf(1 - alpha / 2)

    alpha_lo = _norm_cdf(z0 + (z0 + z_lo) / (1 - accel * (z0 + z_lo)))
    alpha_hi = _norm_cdf(z0 + (z0 + z_hi) / (1 - accel * (z0 + z_hi)))

    lo_idx = int(alpha_lo * n_bootstrap)
    hi_idx = int(alpha_hi * n_bootstrap)
    lo_idx = max(0, min(lo_idx, n_bootstrap - 1))
    hi_idx = max(0, min(hi_idx, n_bootstrap - 1))

    return bootstrap_stats[lo_idx], bootstrap_stats[hi_idx]


def _norm_cdf(x: float) -> float:
    """Standard normal CDF."""
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def _norm_ppf(p: float) -> float:
    """Inverse normal CDF via bisection."""
    if not 0 < p < 1:
        return -10.0 if p <= 0 else 10.0
    lo, hi = -10.0, 10.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if _norm_cdf(mid) < p:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Normal data: bootstrap CI should match the analytical CI
    rng = random.Random(123)
    data = [rng.gauss(100, 15) for _ in range(200)]
    mean = sum(data) / len(data)
    std = math.sqrt(sum((x - mean) ** 2 for x in data) / (len(data) - 1))

    result = bootstrap_ci(data, confidence_level=0.95, n_bootstrap=10_000)
    print(result)

    # Analytical 95% CI: mean ± 1.96 * std / sqrt(n)
    se = std / math.sqrt(len(data))
    analytical_lo = mean - 1.96 * se
    analytical_hi = mean + 1.96 * se

    # Bootstrap CI should be close to analytical
    assert abs(result.ci_lower - analytical_lo) < 0.5, (
        result.ci_lower, analytical_lo
    )
    assert abs(result.ci_upper - analytical_hi) < 0.5, (
        result.ci_upper, analytical_hi
    )

    # BCa method should also work
    result_bca = bootstrap_ci(
        data, confidence_level=0.95, n_bootstrap=10_000, method="bca"
    )
    print(result_bca)
    assert abs(result_bca.ci_lower - analytical_lo) < 1.0
    assert abs(result_bca.ci_upper - analytical_hi) < 1.0

    # Skewed data: bootstrap should handle it
    skewed_data = [rng.expovariate(0.1) for _ in range(200)]
    result_skewed = bootstrap_ci(skewed_data, n_bootstrap=10_000)
    print(result_skewed)
    # CI should contain the true mean (10 for Exp(0.1))
    assert result_skewed.ci_lower < 10 < result_skewed.ci_upper

    # Median statistic
    def median(x):
        s = sorted(x)
        n = len(s)
        return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2

    result_median = bootstrap_ci(data, statistic_fn=median, n_bootstrap=10_000)
    print(result_median)
    # Median should be close to mean for normal data
    assert abs(result_median.statistic - mean) < 2.0

    # Small sample
    small_data = [1, 2, 3, 4, 5]
    result_small = bootstrap_ci(small_data, n_bootstrap=5_000)
    print(result_small)
    assert result_small.ci_lower < 3 < result_small.ci_upper

    print("\nAll tests passed.")
