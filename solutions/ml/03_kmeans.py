"""
Problem 03: K-Means Clustering from Scratch
=============================================

Implement K-Means clustering using Lloyd's algorithm.

Algorithm:
1. Initialize k centroids (randomly or using K-Means++).
2. Assign each point to the nearest centroid.
3. Update centroids to the mean of their assigned points.
4. Repeat until convergence.

Time:  O(iterations * n * k * d)
Space: O(n * k)
"""

from __future__ import annotations
import math
import random
from typing import List, Sequence, Tuple


def euclidean_distance(a: List[float], b: List[float]) -> float:
    """Euclidean distance between two points."""
    return math.sqrt(sum((ai - bi) ** 2 for ai, bi in zip(a, b)))


def kmeans_pp_init(
    data: List[List[float]], k: int, rng: random.Random
) -> List[List[float]]:
    """Initialize centroids using K-Means++ for better convergence.

    Time:  O(n * k)
    Space: O(k)
    """
    n = len(data)
    d = len(data[0])

    # First centroid: random point
    centroids = [data[rng.randrange(n)][:]]

    for _ in range(1, k):
        # Compute distances to nearest centroid
        distances = []
        for point in data:
            min_dist = min(
                euclidean_distance(point, c) ** 2 for c in centroids
            )
            distances.append(min_dist)

        # Choose next centroid with probability proportional to distance²
        total = sum(distances)
        if total == 0:
            # All points are at centroids, pick randomly
            centroids.append(data[rng.randrange(n)][:])
            continue

        r = rng.random() * total
        cumulative = 0.0
        for i, dist in enumerate(distances):
            cumulative += dist
            if cumulative >= r:
                centroids.append(data[i][:])
                break

    return centroids


def kmeans(
    data: List[List[float]],
    k: int,
    max_iterations: int = 100,
    tol: float = 1e-6,
    init: str = "kmeans++",
    seed: int = 42,
) -> Tuple[List[List[float]], List[int], float]:
    """Run K-Means clustering.

    Args:
        data: List of points, each a list of features.
        k: Number of clusters.
        max_iterations: Maximum number of iterations.
        tol: Convergence tolerance for centroid movement.
        init: Initialization method ("kmeans++" or "random").
        seed: Random seed for reproducibility.

    Returns:
        Tuple of (centroids, labels, inertia).
        - centroids: List of k centroid coordinates.
        - labels: List of cluster assignments for each point.
        - inertia: Sum of squared distances to nearest centroid.

    Time:  O(iterations * n * k * d)
    Space: O(n * k)
    """
    if k <= 0 or k > len(data):
        raise ValueError("k must be between 1 and len(data)")

    rng = random.Random(seed)
    n = len(data)
    d = len(data[0])

    # Initialize centroids
    if init == "kmeans++":
        centroids = kmeans_pp_init(data, k, rng)
    else:
        indices = rng.sample(range(n), k)
        centroids = [data[i][:] for i in indices]

    labels = [0] * n
    inertia = float("inf")

    for iteration in range(max_iterations):
        # Assignment step: assign each point to nearest centroid
        new_labels = []
        for point in data:
            distances = [
                euclidean_distance(point, c) for c in centroids
            ]
            new_labels.append(distances.index(min(distances)))

        # Check for convergence
        if new_labels == labels and iteration > 0:
            break

        labels = new_labels

        # Update step: recompute centroids
        new_centroids = [[0.0] * d for _ in range(k)]
        counts = [0] * k

        for i, label in enumerate(labels):
            counts[label] += 1
            for j in range(d):
                new_centroids[label][j] += data[i][j]

        # Average the points in each cluster
        for c in range(k):
            if counts[c] > 0:
                for j in range(d):
                    new_centroids[c][j] /= counts[c]
            else:
                # Empty cluster: reinitialize to a random point
                new_centroids[c] = data[rng.randrange(n)][:]

        # Check centroid movement
        centroid_shift = sum(
            euclidean_distance(old, new)
            for old, new in zip(centroids, new_centroids)
        )
        centroids = new_centroids

        if centroid_shift < tol:
            break

    # Compute final inertia
    inertia = sum(
        euclidean_distance(data[i], centroids[labels[i]]) ** 2
        for i in range(n)
    )

    return centroids, labels, inertia


def silhouette_score(
    data: List[List[float]], labels: List[int]
) -> float:
    """Compute the mean silhouette score for the clustering.

    Silhouette score measures how similar a point is to its own cluster
    compared to other clusters. Range: [-1, 1], higher is better.

    Time:  O(n² * d)
    Space: O(n)
    """
    n = len(data)
    unique_labels = set(labels)
    if len(unique_labels) <= 1:
        return 0.0

    scores = []
    for i in range(n):
        # a(i): mean distance to points in the same cluster
        same_cluster = [
            j for j in range(n) if labels[j] == labels[i] and j != i
        ]
        if not same_cluster:
            scores.append(0.0)
            continue

        a_i = sum(
            euclidean_distance(data[i], data[j]) for j in same_cluster
        ) / len(same_cluster)

        # b(i): min mean distance to points in other clusters
        b_i = float("inf")
        for label in unique_labels:
            if label == labels[i]:
                continue
            other_cluster = [j for j in range(n) if labels[j] == label]
            if other_cluster:
                mean_dist = sum(
                    euclidean_distance(data[i], data[j])
                    for j in other_cluster
                ) / len(other_cluster)
                b_i = min(b_i, mean_dist)

        # Silhouette coefficient
        if b_i == float("inf"):
            s_i = 0.0
        else:
            s_i = (b_i - a_i) / max(a_i, b_i)

        scores.append(s_i)

    return sum(scores) / n


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Two well-separated clusters
    data = [[0, 0], [0.1, 0.1], [0.2, 0.2],
            [10, 10], [10.1, 10.1], [10.2, 10.2]]
    centroids, labels, inertia = kmeans(data, k=2)
    print(f"Centroids: {centroids}")
    print(f"Labels: {labels}")
    print(f"Inertia: {inertia:.4f}")

    # Points in the same cluster should have the same label
    assert labels[0] == labels[1] == labels[2]
    assert labels[3] == labels[4] == labels[5]
    assert labels[0] != labels[3]

    # Silhouette score should be high for well-separated clusters
    score = silhouette_score(data, labels)
    print(f"Silhouette score: {score:.4f}")
    assert score > 0.8

    # Three clusters
    data3 = [[0, 0], [0.1, 0.1], [0.2, 0.2],
             [10, 0], [10.1, 0.1], [10.2, 0.2],
             [5, 10], [5.1, 10.1], [5.2, 10.2]]
    centroids3, labels3, inertia3 = kmeans(data3, k=3)
    print(f"3-cluster centroids: {centroids3}")
    print(f"3-cluster labels: {labels3}")

    # Each cluster should have 3 points
    from collections import Counter
    counts = Counter(labels3)
    assert all(c == 3 for c in counts.values())

    # Random data
    rng = random.Random(42)
    data_random = [[rng.gauss(0, 1), rng.gauss(0, 1)] for _ in range(100)]
    centroids_r, labels_r, inertia_r = kmeans(data_random, k=4)
    print(f"Random data: {len(set(labels_r))} clusters found")
    assert len(set(labels_r)) == 4

    # Verify K-Means++ initialization
    centroids_pp = kmeans_pp_init(data, 2, random.Random(42))
    assert len(centroids_pp) == 2

    print("\nAll tests passed.")
