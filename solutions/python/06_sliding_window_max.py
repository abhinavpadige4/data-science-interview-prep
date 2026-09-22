"""
Problem 06: Sliding Window Maximum
==================================

Given an array of integers `nums` and a window size `k`, return the maximum
value in each sliding window of size `k` as it moves from left to right.

Example:
    >>> sliding_window_max([1, 3, -1, -3, 5, 3, 6, 7], 3)
    [3, 3, 5, 5, 6, 7]

Approach: Monotonic deque.
- Maintain a deque of indices, in decreasing order of their values.
- For each new element, pop smaller elements from the back.
- Pop indices that are out of the window from the front.
- The front of the deque is always the max of the current window.

Time:  O(n) — each element is pushed and popped at most once.
Space: O(k)
"""

from __future__ import annotations
from collections import deque
from typing import List


def sliding_window_max(nums: List[int], k: int) -> List[int]:
    """Return the max of each sliding window of size k.

    Time:  O(n)
    Space: O(k)
    """
    if not nums or k <= 0:
        return []
    if k == 1:
        return list(nums)

    result: List[int] = []
    dq: deque[int] = deque()  # stores indices, values are decreasing

    for i, num in enumerate(nums):
        # Remove indices that are out of the window
        while dq and dq[0] <= i - k:
            dq.popleft()

        # Remove indices whose values are smaller than the current
        while dq and nums[dq[-1]] <= num:
            dq.pop()

        dq.append(i)

        # The window is full starting at index k-1
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result


def sliding_window_max_brute(nums: List[int], k: int) -> List[int]:
    """Brute-force O(n*k) solution for verification.

    Time:  O(n*k)
    Space: O(1)
    """
    if not nums or k <= 0:
        return []
    return [max(nums[i:i + k]) for i in range(len(nums) - k + 1)]


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic case
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    assert sliding_window_max(nums, k) == [3, 3, 5, 5, 6, 7]
    assert sliding_window_max_brute(nums, k) == [3, 3, 5, 5, 6, 7]

    # k = 1
    assert sliding_window_max([1, 2, 3], 1) == [1, 2, 3]

    # k = len(nums)
    assert sliding_window_max([1, 2, 3, 4, 5], 5) == [5]

    # All same
    assert sliding_window_max([5, 5, 5, 5], 2) == [5, 5, 5]

    # Decreasing
    assert sliding_window_max([5, 4, 3, 2, 1], 3) == [5, 4, 3]

    # Increasing
    assert sliding_window_max([1, 2, 3, 4, 5], 3) == [3, 4, 5]

    # Negative numbers
    assert sliding_window_max([-1, -2, -3, -4, -5], 2) == [-1, -2, -3, -4]

    # Single element
    assert sliding_window_max([42], 1) == [42]

    # Both approaches agree on random-ish inputs
    import random
    random.seed(42)
    for _ in range(20):
        n = random.randint(1, 50)
        k = random.randint(1, n)
        nums = [random.randint(-100, 100) for _ in range(n)]
        assert sliding_window_max(nums, k) == sliding_window_max_brute(nums, k)

    print("All tests passed.")
