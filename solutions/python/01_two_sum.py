"""
Problem 01: Two Sum
===================

Given an array of integers `nums` and an integer `target`, return indices of
the two numbers such that they add up to `target`.

You may assume that each input has exactly one solution, and you may not use
the same element twice.

Example:
    >>> two_sum([2, 7, 11, 15], 9)
    [0, 1]

Constraints:
    - 2 <= len(nums) <= 10^4
    - -10^9 <= nums[i] <= 10^9
    - Exactly one solution exists.

Approach: Hash Map (O(n) time, O(n) space)
-------------------------------------------
For each number `x` at index `i`, check if `target - x` has already been seen.
If yes, return the stored index and `i`. Otherwise, store `x -> i`.

Why this is the canonical interview answer:
- Single pass, O(n) time.
- O(n) space for the hash map.
- Handles duplicates correctly (we check before inserting).
"""

from __future__ import annotations
from typing import List


def two_sum(nums: List[int], target: int) -> List[int]:
    """Return indices of two numbers that sum to target.

    Time:  O(n)
    Space: O(n)
    """
    seen: dict[int, int] = {}  # value -> index
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    raise ValueError("No two-sum solution exists")


# ---------------------------------------------------------------------------
# Alternative: brute force (O(n^2)) — shown for contrast, NOT recommended.
# ---------------------------------------------------------------------------
def two_sum_brute_force(nums: List[int], target: int) -> List[int]:
    """Brute-force O(n^2) solution. Use only if you forget the hash-map trick."""
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    raise ValueError("No two-sum solution exists")


# ---------------------------------------------------------------------------
# Alternative: sorted + two pointers (O(n log n)) — modifies input order.
# ---------------------------------------------------------------------------
def two_sum_sorted(nums: List[int], target: int) -> List[int]:
    """Sort a copy, use two pointers, then map back to original indices.

    Time:  O(n log n)
    Space: O(n)
    """
    indexed = sorted(enumerate(nums), key=lambda t: t[1])
    lo, hi = 0, len(indexed) - 1
    while lo < hi:
        s = indexed[lo][1] + indexed[hi][1]
        if s == target:
            return sorted([indexed[lo][0], indexed[hi][0]])
        elif s < target:
            lo += 1
        else:
            hi -= 1
    raise ValueError("No two-sum solution exists")


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic case
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    # Negative numbers
    assert two_sum([-3, 4, 3, 90], 0) == [0, 2]
    # Duplicates
    assert two_sum([3, 3], 6) == [0, 1]
    # Single valid pair at the end
    assert two_sum([1, 2, 3, 4, 5], 9) == [3, 4]

    # All three approaches agree
    for nums, target in [([2, 7, 11, 15], 9), ([-3, 4, 3, 90], 0), ([3, 3], 6)]:
        a = sorted(two_sum(nums, target))
        b = sorted(two_sum_brute_force(nums, target))
        c = sorted(two_sum_sorted(nums, target))
        assert a == b == c, (a, b, c)

    print("All tests passed.")
