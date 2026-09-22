"""
Problem 07: Flatten Nested List Iterator
=========================================

Given a nested list of integers, return an iterator that flattens it so that
it yields integers in the same order they appear in the nested list.

Example:
    >>> list(flatten([[1, 1], [2, [1, 1]], [4, [5]]]))
    [1, 1, 2, 1, 1, 4, 5]

This is a classic generator problem. The key insight is to use `yield` to
lazily produce values, and recursion to handle arbitrary nesting depth.

Approaches:
1. Recursive generator (clean, handles arbitrary depth).
2. Iterative with a stack (avoids recursion limit).
3. Pre-flatten into a list (simple, but uses O(n) space upfront).
"""

from __future__ import annotations
from typing import Any, Iterator, List


NestedList = List[Any]  # Any is either int or NestedList


def flatten(nested: NestedList) -> Iterator[int]:
    """Recursively flatten a nested list, yielding integers in order.

    Time:  O(n) where n is the total number of integers.
    Space: O(d) where d is the maximum nesting depth (recursion stack).
    """
    for item in nested:
        if isinstance(item, list):
            # Recurse into the sublist
            yield from flatten(item)
        else:
            yield item


def flatten_iterative(nested: NestedList) -> Iterator[int]:
    """Iteratively flatten using an explicit stack.

    Time:  O(n)
    Space: O(n) for the stack (worst case: deeply nested)
    """
    # Push items in reverse order so we process them left-to-right
    stack: List[Any] = list(reversed(nested))
    while stack:
        item = stack.pop()
        if isinstance(item, list):
            stack.extend(reversed(item))
        else:
            yield item


def flatten_to_list(nested: NestedList) -> List[int]:
    """Flatten into a list (eager, not lazy).

    Time:  O(n)
    Space: O(n)
    """
    return list(flatten(nested))


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic case
    nested = [[1, 1], [2, [1, 1]], [4, [5]]]
    assert list(flatten(nested)) == [1, 1, 2, 1, 1, 4, 5]
    assert list(flatten_iterative(nested)) == [1, 1, 2, 1, 1, 4, 5]
    assert flatten_to_list(nested) == [1, 1, 2, 1, 1, 4, 5]

    # Flat list
    assert list(flatten([1, 2, 3])) == [1, 2, 3]

    # Deeply nested
    assert list(flatten([[[[[1]]]]])) == [1]

    # Mixed
    assert list(flatten([1, [2, [3, [4]]], 5])) == [1, 2, 3, 4, 5]

    # Empty
    assert list(flatten([])) == []
    assert list(flatten([[], [], []])) == []

    # Single element
    assert list(flatten([42])) == [42]

    # Both approaches agree on a complex case
    complex_nested = [
        1,
        [2, [3, [4, [5]]]],
        [6, 7],
        [[8, [9, 10]]],
        11,
    ]
    expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    assert list(flatten(complex_nested)) == expected
    assert list(flatten_iterative(complex_nested)) == expected

    # Verify it's a generator (lazy)
    gen = flatten([[1, 2], [3, 4]])
    assert hasattr(gen, '__iter__') and hasattr(gen, '__next__')
    assert next(gen) == 1
    assert next(gen) == 2
    assert next(gen) == 3
    assert next(gen) == 4

    print("All tests passed.")
