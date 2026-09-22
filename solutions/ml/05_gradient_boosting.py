"""
Problem 05: Gradient Boosting from Scratch
============================================

Implement functional gradient boosting for regression.

Algorithm:
1. Initialize the model with the mean of the target.
2. For each iteration:
   a. Compute the negative gradient of the loss (pseudo-residuals).
   b. Fit a shallow tree to the pseudo-residuals.
   c. Update the model: F(x) += learning_rate * tree(x).
3. Predict by summing all trees.

Time:  O(n_estimators * n * p * log(n))
Space: O(n_estimators * n * depth)
"""

from __future__ import annotations
import math
from typing import List, Optional, Tuple


def squared_error_loss(y_true: List[float], y_pred: List[float]) -> float:
    """Mean squared error loss."""
    n = len(y_true)
    return sum((y_true[i] - y_pred[i]) ** 2 for i in range(n)) / n


def squared_error_gradient(y_true: List[float], y_pred: List[float]) -> List[float]:
    """Negative gradient of MSE loss: y_true - y_pred.

    For L = (1/2) * (y - F)^2, the gradient w.r.t. F is -(y - F) = F - y.
    The negative gradient (pseudo-residuals) is y - F.
    """
    return [y_true[i] - y_pred[i] for i in range(len(y_true))]


class SimpleTree:
    """A shallow decision tree for gradient boosting."""

    def __init__(self, max_depth: int = 3):
        self.max_depth = max_depth
        self.tree: Optional[dict] = None

    def _variance(self, values: List[float]) -> float:
        if len(values) < 2:
            return 0.0
        mean = sum(values) / len(values)
        return sum((x - mean) ** 2 for x in values) / len(values)

    def _find_best_split(
        self, X: List[List[float]], y: List[float]
    ) -> Optional[Tuple[int, float, float]]:
        n, p = len(X), len(X[0])
        best_gain = 0.0
        best_feature = None
        best_threshold = None

        parent_var = self._variance(y)
        parent_size = len(y)

        for feature in range(p):
            values = sorted(set(X[i][feature] for i in range(n)))
            if len(values) <= 1:
                continue

            for i in range(len(values) - 1):
                threshold = (values[i] + values[i + 1]) / 2

                left_indices = [j for j in range(n) if X[j][feature] <= threshold]
                right_indices = [j for j in range(n) if X[j][feature] > threshold]

                if len(left_indices) < 2 or len(right_indices) < 2:
                    continue

                left_var = self._variance([y[j] for j in left_indices])
                right_var = self._variance([y[j] for j in right_indices])

                weighted_var = (
                    len(left_indices) * left_var
                    + len(right_indices) * right_var
                ) / parent_size

                gain = parent_var - weighted_var

                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature
                    best_threshold = threshold

        if best_feature is None:
            return None

        return best_feature, best_threshold, best_gain

    def _build_tree(
        self, X: List[List[float]], y: List[float], depth: int = 0
    ) -> dict:
        n = len(y)

        if depth >= self.max_depth or n < 2:
            return {"type": "leaf", "value": sum(y) / n}

        split = self._find_best_split(X, y)
        if split is None:
            return {"type": "leaf", "value": sum(y) / n}

        feature, threshold, _ = split

        left_indices = [i for i in range(n) if X[i][feature] <= threshold]
        right_indices = [i for i in range(n) if X[i][feature] > threshold]

        left_tree = self._build_tree(
            [X[i] for i in left_indices],
            [y[i] for i in left_indices],
            depth + 1,
        )
        right_tree = self._build_tree(
            [X[i] for i in right_indices],
            [y[i] for i in right_indices],
            depth + 1,
        )

        return {
            "type": "internal",
            "feature": feature,
            "threshold": threshold,
            "left": left_tree,
            "right": right_tree,
        }

    def fit(self, X: List[List[float]], y: List[float]) -> "SimpleTree":
        self.tree = self._build_tree(X, y)
        return self

    def _predict_one(self, x: List[float], node: dict) -> float:
        if node["type"] == "leaf":
            return node["value"]
        if x[node["feature"]] <= node["threshold"]:
            return self._predict_one(x, node["left"])
        else:
            return self._predict_one(x, node["right"])

    def predict(self, X: List[List[float]]) -> List[float]:
        return [self._predict_one(x, self.tree) for x in X]


class GradientBoostingRegressor:
    """Gradient boosting regressor using shallow trees."""

    def __init__(
        self,
        n_estimators: int = 100,
        learning_rate: float = 0.1,
        max_depth: int = 3,
    ):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.trees: List[SimpleTree] = []
        self.initial_prediction: float = 0.0

    def fit(self, X: List[List[float]], y: List[float]) -> "GradientBoostingRegressor":
        n = len(y)

        # Initialize with the mean
        self.initial_prediction = sum(y) / n
        y_pred = [self.initial_prediction] * n

        for _ in range(self.n_estimators):
            # Compute pseudo-residuals (negative gradient)
            residuals = squared_error_gradient(y, y_pred)

            # Fit a tree to the residuals
            tree = SimpleTree(max_depth=self.max_depth)
            tree.fit(X, residuals)

            # Update predictions
            tree_preds = tree.predict(X)
            for i in range(n):
                y_pred[i] += self.learning_rate * tree_preds[i]

            self.trees.append(tree)

        return self

    def predict(self, X: List[List[float]]) -> List[float]:
        predictions = [self.initial_prediction] * len(X)
        for tree in self.trees:
            tree_preds = tree.predict(X)
            for i in range(len(X)):
                predictions[i] += self.learning_rate * tree_preds[i]
        return predictions


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Simple linear relationship
    X = [[float(i)] for i in range(100)]
    y = [2 * x[0] + 3 for x in X]

    model = GradientBoostingRegressor(
        n_estimators=50, learning_rate=0.1, max_depth=3
    )
    model.fit(X, y)
    predictions = model.predict(X)

    mse = squared_error_loss(y, predictions)
    print(f"Linear MSE: {mse:.6f}")
    assert mse < 1.0

    # Non-linear relationship
    X_nonlinear = [[float(i)] for i in range(100)]
    y_nonlinear = [math.sin(x[0] * 0.1) * 10 for x in X_nonlinear]

    model_nonlinear = GradientBoostingRegressor(
        n_estimators=100, learning_rate=0.1, max_depth=4
    )
    model_nonlinear.fit(X_nonlinear, y_nonlinear)
    predictions_nonlinear = model_nonlinear.predict(X_nonlinear)

    mse_nonlinear = squared_error_loss(y_nonlinear, predictions_nonlinear)
    print(f"Non-linear MSE: {mse_nonlinear:.6f}")
    assert mse_nonlinear < 5.0

    # Multiple features
    import random
    rng = random.Random(42)
    X_multi = []
    y_multi = []
    for _ in range(200):
        x1 = rng.gauss(0, 1)
        x2 = rng.gauss(0, 1)
        X_multi.append([x1, x2])
        y_multi.append(2 * x1 + 3 * x2 + rng.gauss(0, 0.5))

    model_multi = GradientBoostingRegressor(
        n_estimators=100, learning_rate=0.1, max_depth=3
    )
    model_multi.fit(X_multi, y_multi)
    predictions_multi = model_multi.predict(X_multi)

    mse_multi = squared_error_loss(y_multi, predictions_multi)
    print(f"Multi-feature MSE: {mse_multi:.6f}")
    assert mse_multi < 2.0

    # Verify gradient boosting improves over the initial prediction
    initial_mse = squared_error_loss(y, [sum(y) / len(y)] * len(y))
    print(f"Initial MSE: {initial_mse:.6f}")
    print(f"Final MSE: {mse:.6f}")
    assert mse < initial_mse

    # Verify the number of trees
    assert len(model.trees) == 50
    assert len(model_nonlinear.trees) == 100

    # Verify predictions are reasonable
    for pred, true in zip(predictions, y):
        assert abs(pred - true) < 5.0

    print("\nAll tests passed.")
