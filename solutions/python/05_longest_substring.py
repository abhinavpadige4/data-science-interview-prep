"""
Problem 05: Longest Substring Without Repeating Characters
===========================================================

Given a string `s`, find the length of the longest substring without
repeating characters.

Example:
    >>> longest_substring("abcabcbb")
    3   # "abc"
    >>> longest_substring("bbbbb")
    1   # "b"
    >>> longest_substring("pwwkew")
    3   # "wke"

Approach: Sliding window with a hash map.
- Maintain a window [left, right] with all unique characters.
- When we see a duplicate, move `left` past the previous occurrence.
- Track the maximum window size.

Time:  O(n)
Space: O(min(n, |alphabet|))
"""

from __future__ import annotations


def longest_substring(s: str) -> int:
    """Return the length of the longest substring without repeating characters.

    Time:  O(n)
    Space: O(min(n, |alphabet|))
    """
    last_seen: dict[str, int] = {}  # char -> last index
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            # Move left past the previous occurrence of char
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len


def longest_substring_set(s: str) -> int:
    """Alternative using a set (slower in practice, but cleaner).

    Time:  O(n) amortized
    Space: O(min(n, |alphabet|))
    """
    window: set[str] = set()
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        while char in window:
            window.remove(s[left])
            left += 1
        window.add(char)
        max_len = max(max_len, right - left + 1)

    return max_len


def longest_substring_ascii(s: str) -> int:
    """Optimized for ASCII strings using an array instead of a dict.

    Time:  O(n)
    Space: O(128)
    """
    last_seen = [-1] * 128
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        idx = ord(char)
        if last_seen[idx] >= left:
            left = last_seen[idx] + 1
        last_seen[idx] = right
        max_len = max(max_len, right - left + 1)

    return max_len


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Basic cases
    assert longest_substring("abcabcbb") == 3
    assert longest_substring("bbbbb") == 1
    assert longest_substring("pwwkew") == 3

    # Edge cases
    assert longest_substring("") == 0
    assert longest_substring("a") == 1
    assert longest_substring("abcdef") == 6  # all unique

    # Unicode
    assert longest_substring("héllo") == 3  # "hél" or "llo"

    # All three approaches agree
    test_cases = ["abcabcbb", "bbbbb", "pwwkew", "abcdef", "aab", "dvdf"]
    for s in test_cases:
        a = longest_substring(s)
        b = longest_substring_set(s)
        c = longest_substring_ascii(s)
        assert a == b == c, (s, a, b, c)

    print("All tests passed.")
