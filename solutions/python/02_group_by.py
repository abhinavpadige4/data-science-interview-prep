"""
Problem 02: Group By
====================

Given a list of (key, value) pairs, group the values by their key.

Example:
    >>> group_by([('a', 1), ('b', 2), ('a', 3), ('c', 4), ('a', 5)])
    {'a': [1, 3, 5], 'b': [2], 'c': [4]}

This is a classic data-engineering / pandas-style problem. In interviews,
expect variations like:
- Group by a computed key (e.g., first letter of a string).
- Group by a function (e.g., group by length).
- Group and aggregate (sum, count, mean).

Approach: defaultdict(list) — O(n) time, O(n) space.
"""

from __future__ import annotations
from collections import defaultdict
from typing import Any, Callable, Dict, Hashable, Iterable, List, Tuple


def group_by(pairs: Iterable[Tuple[Hashable, Any]]) -> Dict[Hashable, List[Any]]:
    """Group values by key, preserving insertion order.

    Time:  O(n)
    Space: O(n)
    """
    groups: Dict[Hashable, List[Any]] = defaultdict(list)
    for key, value in pairs:
        groups[key].append(value)
    return dict(groups)


def group_by_key_fn(
    items: Iterable[Any], key_fn: Callable[[Any], Hashable]
) -> Dict[Hashable, List[Any]]:
    """Group items by a computed key (like pandas groupby).

    Example:
        >>> group_by_key_fn(['apple', 'banana', 'avocado', 'blueberry'],
        ...                 key_fn=lambda s: s[0])
        {'a': ['apple', 'avocado'], 'b': ['banana', 'blueberry']}

    Time:  O(n)
    Space: O(n)
    """
    groups: Dict[Hashable, List[Any]] = defaultdict(list)
    for item in items:
        groups[key_fn(item)].append(item)
    return dict(groups)


def group_and_aggregate(
    pairs: Iterable[Tuple[Hashable, float]],
    agg_fn: Callable[[List[float]], float] = sum,
) -> Dict[Hashable, float]:
    """Group by key and apply an aggregation function to each group.

    Example:
        >>> group_and_aggregate([('a', 1), ('a', 2), ('b', 3)], agg_fn=sum)
        {'a': 3, 'b': 3}

    Time:  O(n)
    Space: O(n)
    """
    groups: Dict[Hashable, List[float]] = defaultdict(list)
    for key, value in pairs:
        groups[key].append(value)
    return {key: agg_fn(values) for key, values in groups.items()}


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic grouping
    result = group_by([('a', 1), ('b', 2), ('a', 3), ('c', 4), ('a', 5)])
    assert result == {'a': [1, 3, 5], 'b': [2], 'c': [4]}

    # Empty input
    assert group_by([]) == {}

    # Single element
    assert group_by([('x', 10)]) == {'x': [10]}

    # Group by computed key
    words = ['apple', 'banana', 'avocado', 'blueberry', 'cherry']
    by_first = group_by_key_fn(words, key_fn=lambda s: s[0])
    assert by_first == {
        'a': ['apple', 'avocado'],
        'b': ['banana', 'blueberry'],
        'c': ['cherry'],
    }

    # Group by length
    by_len = group_by_key_fn(words, key_fn=len)
    assert by_len[5] == ['apple', 'banana', 'cherry']
    assert by_len[7] == ['avocado']
    assert by_len[9] == ['blueberry']

    # Aggregation: sum
    agg = group_and_aggregate([('a', 1), ('a', 2), ('b', 3)], agg_fn=sum)
    assert agg == {'a': 3, 'b': 3}

    # Aggregation: mean
    def mean(xs: List[float]) -> float:
        return sum(xs) / len(xs)

    agg_mean = group_and_aggregate(
        [('a', 1), ('a', 3), ('b', 2), ('b', 4)], agg_fn=mean
    )
    assert agg_mean == {'a': 2.0, 'b': 3.0}

    # Aggregation: count
    agg_count = group_and_aggregate(
        [('a', 1), ('a', 2), ('a', 3), ('b', 4)], agg_fn=len
    )
    assert agg_count == {'a': 3, 'b': 1}

    print("All tests passed.")
