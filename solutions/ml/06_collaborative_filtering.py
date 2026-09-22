"""
Problem 06: Collaborative Filtering (Matrix Factorization)
============================================================

Implement matrix factorization for collaborative filtering using SGD.

The goal is to factorize a user-item rating matrix R into two matrices:
- P (user factors): m x k
- Q (item factors): n x k

such that R ≈ P * Q^T

We minimize: L = sum((r_ui - p_u^T * q_i)^2) + λ(||P||² + ||Q||²)

Time:  O(iterations * nnz * k) where nnz is the number of non-zero entries
Space: O(m * k + n * k)
"""

from __future__ import annotations
import math
import random
from typing import Dict, List, Tuple


class MatrixFactorization:
    """Matrix factorization for collaborative filtering."""

    def __init__(
        self,
        n_users: int,
        n_items: int,
        n_factors: int = 10,
        learning_rate: float = 0.01,
        regularization: float = 0.01,
        n_iterations: int = 100,
        seed: int = 42,
    ):
        self.n_users = n_users
        self.n_items = n_items
        self.n_factors = n_factors
        self.learning_rate = learning_rate
        self.regularization = regularization
        self.n_iterations = n_iterations
        self.seed = seed

        # Initialize factors
        rng = random.Random(seed)
        self.P = [[rng.gauss(0, 0.1) for _ in range(n_factors)] for _ in range(n_users)]
        self.Q = [[rng.gauss(0, 0.1) for _ in range(n_factors)] for _ in range(n_items)]

        # Bias terms
        self.b_u = [0.0] * n_users  # user biases
        self.b_i = [0.0] * n_items  # item biases
        self.b_global = 0.0  # global bias

    def predict(self, user: int, item: int) -> float:
        """Predict the rating for a user-item pair."""
        dot = sum(self.P[user][k] * self.Q[item][k] for k in range(self.n_factors))
        return self.b_global + self.b_u[user] + self.b_i[item] + dot

    def fit(self, ratings: List[Tuple[int, int, float]]) -> "MatrixFactorization":
        """Fit the model to observed ratings.

        Args:
            ratings: List of (user, item, rating) tuples.

        Time:  O(iterations * nnz * k)
        Space: O(m * k + n * k)
        """
        rng = random.Random(self.seed)

        # Compute global bias
        self.b_global = sum(r for _, _, r in ratings) / len(ratings)

        for iteration in range(self.n_iterations):
            # Shuffle the ratings
            shuffled = ratings[:]
            rng.shuffle(shuffled)

            total_loss = 0.0

            for user, item, rating in shuffled:
                # Predict
                pred = self.predict(user, item)
                error = rating - pred

                # Update biases
                self.b_u[user] += self.learning_rate * (error - self.regularization * self.b_u[user])
                self.b_i[item] += self.learning_rate * (error - self.regularization * self.b_i[item])

                # Update factors
                for k in range(self.n_factors):
                    self.P[user][k] += self.learning_rate * (
                        error * self.Q[item][k] - self.regularization * self.P[user][k]
                    )
                    self.Q[item][k] += self.learning_rate * (
                        error * self.P[user][k] - self.regularization * self.Q[item][k]
                    )

                total_loss += error ** 2

            if iteration % 10 == 0:
                rmse = math.sqrt(total_loss / len(ratings))
                print(f"Iteration {iteration}: RMSE = {rmse:.4f}")

        return self

    def recommend(
        self, user: int, n: int = 10, exclude_items: List[int] = None
    ) -> List[Tuple[int, float]]:
        """Recommend n items for a user.

        Args:
            user: User ID.
            n: Number of recommendations.
            exclude_items: Items to exclude (e.g., already rated).

        Returns:
            List of (item_id, predicted_rating) tuples, sorted by rating.
        """
        if exclude_items is None:
            exclude_items = []

        exclude_set = set(exclude_items)
        predictions = []
        for item in range(self.n_items):
            if item not in exclude_set:
                pred = self.predict(user, item)
                predictions.append((item, pred))

        # Sort by predicted rating (descending)
        predictions.sort(key=lambda x: x[1], reverse=True)
        return predictions[:n]


def rmse(ratings: List[Tuple[int, int, float]], model: MatrixFactorization) -> float:
    """Compute RMSE for the model on the given ratings."""
    total_error = 0.0
    for user, item, rating in ratings:
        pred = model.predict(user, item)
        total_error += (rating - pred) ** 2
    return math.sqrt(total_error / len(ratings))


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Create a synthetic dataset
    rng = random.Random(42)
    n_users = 50
    n_items = 30
    n_factors = 5

    # Generate true factors
    true_P = [[rng.gauss(0, 1) for _ in range(n_factors)] for _ in range(n_users)]
    true_Q = [[rng.gauss(0, 1) for _ in range(n_factors)] for _ in range(n_items)]

    # Generate ratings (80% of the matrix)
    ratings = []
    for user in range(n_users):
        for item in range(n_items):
            if rng.random() < 0.8:
                true_rating = sum(true_P[user][k] * true_Q[item][k] for k in range(n_factors))
                rating = max(1, min(5, 3 + true_rating + rng.gauss(0, 0.5)))
                ratings.append((user, item, rating))

    print(f"Generated {len(ratings)} ratings")

    # Train the model
    model = MatrixFactorization(
        n_users=n_users,
        n_items=n_items,
        n_factors=n_factors,
        learning_rate=0.01,
        regularization=0.01,
        n_iterations=100,
    )
    model.fit(ratings)

    # Evaluate
    test_rmse = rmse(ratings, model)
    print(f"Test RMSE: {test_rmse:.4f}")
    assert test_rmse < 1.0

    # Test recommendations
    recommendations = model.recommend(user=0, n=5)
    print(f"Recommendations for user 0: {recommendations}")
    assert len(recommendations) == 5
    assert all(isinstance(item, int) and isinstance(rating, float) for item, rating in recommendations)

    # Verify predictions are in a reasonable range
    for user in range(min(5, n_users)):
        for item in range(min(5, n_items)):
            pred = model.predict(user, item)
            assert -10 < pred < 10, f"Prediction out of range: {pred}"

    # Verify the model improves over a simple baseline
    baseline_pred = sum(r for _, _, r in ratings) / len(ratings)
    baseline_rmse = math.sqrt(
        sum((r - baseline_pred) ** 2 for _, _, r in ratings) / len(ratings)
    )
    print(f"Baseline RMSE: {baseline_rmse:.4f}")
    print(f"Model RMSE: {test_rmse:.4f}")
    assert test_rmse < baseline_rmse

    print("\nAll tests passed.")
