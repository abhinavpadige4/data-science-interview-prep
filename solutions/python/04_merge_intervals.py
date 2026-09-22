"""
Problem 04: Merge Intervals
===========================

Given an array of intervals where intervals[i] = [start_i, end_i], merge all
overlapping intervals and return an array of the non-overlapping intervals
that cover all the input intervals.

Example:
    >>> merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]])
    [[1, 6], [8, 10], [15, 18]]

Approach: Sort by start, then sweep and merge.
- Time:  O(n log n) for the sort.
- Space: O(n) for the output.

Edge cases to handle:
- Contiguous intervals: [1, 2] and [2, 3] should merge to [1, 3].
- Nested intervals: [1, 10] and [2, 3] should merge to [1, 10].
- Single interval.
- Empty input.
"""

from __future__ import annotations
from typing import List


def merge_intervals(intervals: List[List[int]]) -> List[List[int]]:
    """Merge overlapping intervals.

    Time:  O(n log n)
    Space: O(n)
    """
    if not intervals:
        return []

    # Sort by start time; if tied, by end time (so nested intervals merge correctly)
    intervals.sort(key=lambda x: (x[0], x[1]))

    merged: List[List[int]] = [intervals[0]]
    for start, end in intervals[1:]:
        last = merged[-1]
        if start <= last[1]:
            # Overlap or contiguous — extend the last interval
            last[1] = max(last[1], end)
        else:
            # No overlap — start a new interval
            merged.append([start, end])
    return merged


def merge_intervals_inplace(intervals: List[List[int]]) -> List[List[int]]:
    """Merge intervals in-place (modifies the input list).

    Time:  O(n log n)
    Space: O(1) extra (besides the sort)
    """
    if not intervals:
        return []

    intervals.sort(key=lambda x: (x[0], x[1]))

    write = 1
    for read in range(1, len(intervals)):
        if intervals[read][0] <= intervals[write - 1][1]:
            intervals[write - 1][1] = max(
                intervals[write - 1][1], intervals[read][1]
            )
        else:
            intervals[write] = intervals[read]
            write += 1

    return intervals[:write]


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic case
    assert merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]) == [
        [1, 6], [8, 10], [15, 18]
    ]

    # Contiguous intervals
    assert merge_intervals([[1, 2], [2, 3], [3, 4]]) == [[1, 4]]

    # Nested intervals
    assert merge_intervals([[1, 10], [2, 3], [4, 5]]) == [[1, 10]]

    # Single interval
    assert merge_intervals([[1, 5]]) == [[1, 5]]

    # Empty input
    assert merge_intervals([]) == []

    # No overlaps
    assert merge_intervals([[1, 2], [4, 5], [7, 8]]) == [[1, 2], [4, 5], [7, 8]]

    # All overlap
    assert merge_intervals([[1, 5], [2, 6], [3, 7], [4, 8]]) == [[1, 8]]

    # Negative numbers
    assert merge_intervals([[-5, -3], [-4, -2], [0, 1]]) == [[-5, -2], [0, 1]]

    # In-place version produces the same result
    intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
    expected = [[1, 6], [8, 10], [15, 18]]
    assert merge_intervals_inplace(intervals) == expected

    print("All tests passed.")
