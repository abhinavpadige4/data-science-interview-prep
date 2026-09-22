"""
Problem 03: Top K Frequent Elements
====================================

Given a non-empty array of integers, return the `k` most frequent elements.

Example:
    >>> top_k_frequent([1, 1, 1, 2, 2, 3], 2)
    [1, 2]

Constraints:
    - 1 <= k <= len(set(nums))
    - The answer is guaranteed to be unique.

Approaches:
1. Counter + heap (O(n log k)) — best for large n, small k.
2. Counter + sort (O(n log n)) — simpler, fine for small n.
3. Bucket sort (O(n)) — optimal, but more code.

Interview tip: mention all three, then implement the heap version.
"""

from __future__ import annotations
import heapq
from collections import Counter
from typing import List


def top_k_frequent(nums: List[int], k: int) -> List[int]:
    """Return the k most frequent elements using a min-heap.

    Time:  O(n log k)
    Space: O(n)
    """
    counts = Counter(nums)
    # Use a min-heap of size k. heapq is a min-heap, so we push (count, value)
    # and pop the smallest when size exceeds k.
    heap: List[tuple[int, int]] = []
    for value, count in counts.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)
    # Extract results, sorted by frequency descending
    result = [value for _, value in heap]
    result.sort(key=lambda v: counts[v], reverse=True)
    return result


def top_k_frequent_sort(nums: List[int], k: int) -> List[int]:
    """Return the k most frequent elements using sorting.

    Time:  O(n log n)
    Space: O(n)
    """
    counts = Counter(nums)
    sorted_items = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    return [value for value, _ in sorted_items[:k]]


def top_k_frequent_bucket(nums: List[int], k: int) -> List[int]:
    """Return the k most frequent elements using bucket sort.

    Time:  O(n)
    Space: O(n)
    """
    counts = Counter(nums)
    n = len(nums)
    # buckets[i] holds values that appear exactly i times
    buckets: List[List[int]] = [[] for _ in range(n + 1)]
    for value, count in counts.items():
        buckets[count].append(value)
    # Walk buckets from highest frequency to lowest
    result: List[int] = []
    for i in range(n, 0, -1):
        for value in buckets[i]:
            result.append(value)
            if len(result) == k:
                return result
    return result


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic case
    assert top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]
    assert top_k_frequent_sort([1, 1, 1, 2, 2, 3], 2) == [1, 2]
    assert top_k_frequent_bucket([1, 1, 1, 2, 2, 3], 2) == [1, 2]

    # Single element
    assert top_k_frequent([1], 1) == [1]

    # All same
    assert top_k_frequent([5, 5, 5, 5], 1) == [5]

    # All different
    assert top_k_frequent([1, 2, 3, 4, 5], 3) == [1, 2, 3]  # any 3 is valid

    # Negative numbers
    assert top_k_frequent([-1, -1, -2, -2, -3], 2) == [-1, -2]

    # k = 1
    assert top_k_frequent([1, 2, 2, 3, 3, 3], 1) == [3]

    # All three approaches agree on a larger example
    nums = [1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4]
    k = 3
    a = set(top_k_frequent(nums, k))
    b = set(top_k_frequent_sort(nums, k))
    c = set(top_k_frequent_bucket(nums, k))
    assert a == b == c == {4, 1, 2}, (a, b, c)

    print("All tests passed.")
