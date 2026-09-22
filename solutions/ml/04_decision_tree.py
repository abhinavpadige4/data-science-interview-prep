"""
Problem 04: Decision Tree (CART) from Scratch
===============================================

Implement a Classification and Regression Tree (CART) using Gini impurity
for classification and variance reduction for regression.

Algorithm:
1. For each feature and threshold, compute the impurity reduction.
2. Split on the best feature/threshold.
3. Recurse on each child until a stopping criterion is met.
4. At leaves, predict the majority class (classification) or mean (regression).

Time:  O(n * p * log(n)) for building, O(p * depth) for prediction
Space: O(n * depth)
"""

from __future__ import annotations
import math
from typing import Any, Dict, List, Optional, Tuple, Union


def gini_impurity(labels: List[int]) -> float:
    """Compute Gini impurity for a set of labels.

    Gini = 1 - sum(p_i²) where p_i is the proportion of class i.

    Time:  O(n)
    Space: O(1)
    """
    if not labels:
        return 0.0
    n = len(labels)
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return 1 - sum((count / n) ** 2 for count in counts.values())


def entropy(labels: List[int]) -> float:
    """Compute entropy for a set of labels.

    Entropy = -sum(p_i * log2(p_i))

    Time:  O(n)
    Space: O(1)
    """
    if not labels:
        return 0.0
    n = len(labels)
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    entropy_val = 0.0
    for count in counts.values():
        p = count / n
        if p > 0:
            entropy_val -= p * math.log2(p)
    return entropy_val


def variance(labels: List[float]) -> float:
    """Compute variance for a set of continuous values."""
    if len(labels) < 2:
        return 0.0
    mean = sum(labels) / len(labels)
    return sum((x - mean) ** 2 for x in labels) / len(labels)


class DecisionTree:
    """A CART decision tree for classification and regression."""

    def __init__(
        self,
        max_depth: int = 10,
        min_samples_split: int = 2,
        min_samples_leaf: int = 1,
        criterion: str = "gini",
        max_features: Optional[int] = None,
    ):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.criterion = criterion
        self.max_features = max_features
        self.tree: Optional[Dict] = None

    def _impurity(self, labels: List[Union[int, float]]) -> float:
        """Compute impurity based on the criterion."""
        if self.criterion == "gini":
            return gini_impurity(labels)
        elif self.criterion == "entropy":
            return entropy(labels)
        elif self.criterion == "variance":
            return variance(labels)
        else:
            raise ValueError(f"Unknown criterion: {self.criterion}")

    def _find_best_split(
        self, X: List[List[float]], y: List[Union[int, float]]
    ) -> Optional[Tuple[int, float, float]]:
        """Find the best feature and threshold to split on.

        Returns:
            Tuple of (feature_index, threshold, impurity_reduction) or None.

        Time:  O(n * p * log(n))
        """
        n, p = len(X), len(X[0])
        best_gain = 0.0
        best_feature = None
        best_threshold = None

        # Parent impurity
        parent_impurity = self._impurity(y)
        parent_size = len(y)

        # Consider a subset of features if max_features is set
        if self.max_features and self.max_features < p:
            import random
            rng = random.Random(42)
            features = rng.sample(range(p), self.max_features)
        else:
            features = range(p)

        for feature in features:
            # Get unique values for this feature
            values = sorted(set(X[i][feature] for i in range(n)))
            if len(values) <= 1:
                continue

            # Try thresholds between consecutive unique values
            for i in range(len(values) - 1):
                threshold = (values[i] + values[i + 1]) / 2

                # Split the data
                left_indices = [
                    j for j in range(n) if X[j][feature] <= threshold
                ]
                right_indices = [
                    j for j in range(n) if X[j][feature] > threshold
                ]

                # Check minimum leaf size
                if (
                    len(left_indices) < self.min_samples_leaf
                    or len(right_indices) < self.min_samples_leaf
                ):
                    continue

                # Compute weighted impurity
                left_impurity = self._impurity(
                    [y[j] for j in left_indices]
                )
                right_impurity = self._impurity(
                    [y[j] for j in right_indices]
                )

                weighted_impurity = (
                    len(left_indices) * left_impurity
                    + len(right_indices) * right_impurity
                ) / parent_size

                gain = parent_impurity - weighted_impurity

                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature
                    best_threshold = threshold

        if best_feature is None:
            return None

        return best_feature, best_threshold, best_gain

    def _build_tree(
        self,
        X: List[List[float]],
        y: List[Union[int, float]],
        depth: int = 0,
    ) -> Dict:
        """Recursively build the decision tree."""
        n = len(y)

        # Stopping criteria
        if (
            depth >= self.max_depth
            or n < self.min_samples_split
            or len(set(y)) == 1
        ):
            # Leaf node
            if isinstance(y[0], (int, float)) and not isinstance(y[0], bool):
                # Regression: predict the mean
                prediction = sum(y) / n
            else:
                # Classification: predict the majority class
                counts = {}
                for label in y:
                    counts[label] = counts.get(label, 0) + 1
                prediction = max(counts, key=counts.get)

            return {
                "type": "leaf",
                "prediction": prediction,
                "samples": n,
            }

        # Find the best split
        split = self._find_best_split(X, y)
        if split is None:
            # No valid split found, create a leaf
            if isinstance(y[0], (int, float)) and not isinstance(y[0], bool):
                prediction = sum(y) / n
            else:
                counts = {}
                for label in y:
                    counts[label] = counts.get(label, 0) + 1
                prediction = max(counts, key=counts.get)

            return {
                "type": "leaf",
                "prediction": prediction,
                "samples": n,
            }

        feature, threshold, _ = split

        # Split the data
        left_indices = [i for i in range(n) if X[i][feature] <= threshold]
        right_indices = [i for i in range(n) if X[i][feature] > threshold]

        # Recurse
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
            "samples": n,
        }

    def fit(self, X: List[List[float]], y: List[Union[int, float]]) -> "DecisionTree":
        """Fit the decision tree to the data."""
        self.tree = self._build_tree(X, y)
        return self

    def _predict_one(self, x: List[float], node: Dict) -> Union[int, float]:
        """Predict for a single sample."""
        if node["type"] == "leaf":
            return node["prediction"]

        if x[node["feature"]] <= node["threshold"]:
            return self._predict_one(x, node["left"])
        else:
            return self._predict_one(x, node["right"])

    def predict(self, X: List[List[float]]) -> List[Union[int, float]]:
        """Predict for multiple samples."""
        return [self._predict_one(x, self.tree) for x in X]

    def get_depth(self, node: Optional[Dict] = None) -> int:
        """Get the depth of the tree."""
        if node is None:
            node = self.tree
        if node is None:
            return 0
        if node["type"] == "leaf":
            return 0
        return 1 + max(
            self.get_depth(node["left"]),
            self.get_depth(node["right"]),
        )

    def get_num_leaves(self, node: Optional[Dict] = None) -> int:
        """Get the number of leaves in the tree."""
        if node is None:
            node = self.tree
        if node is None:
            return 0
        if node["type"] == "leaf":
            return 1
        return (
            self.get_num_leaves(node["left"])
            + self.get_num_leaves(node["right"])
        )


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Simple classification: XOR-like problem
    X = [[0, 0], [0, 1], [1, 0], [1, 1]]
    y = [0, 1, 1, 0]

    tree = DecisionTree(max_depth=3, criterion="gini")
    tree.fit(X, y)
    predictions = tree.predict(X)
    print(f"XOR predictions: {predictions}")
    assert predictions == y

    # Linearly separable data
    X_linear = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 2], [3, 3]]
    y_linear = [0, 0, 0, 1, 1, 1]

    tree_linear = DecisionTree(max_depth=5, criterion="gini")
    tree_linear.fit(X_linear, y_linear)
    predictions_linear = tree_linear.predict(X_linear)
    print(f"Linear predictions: {predictions_linear}")
    assert predictions_linear == y_linear

    # Regression
    X_reg = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]
    y_reg = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

    tree_reg = DecisionTree(max_depth=5, criterion="variance")
    tree_reg.fit(X_reg, y_reg)
    predictions_reg = tree_reg.predict(X_reg)
    print(f"Regression predictions: {predictions_reg}")
    # Should be close to the true values
    for pred, true in zip(predictions_reg, y_reg):
        assert abs(pred - true) < 2.0

    # Verify tree structure
    assert tree.get_depth() <= 3
    assert tree.get_num_leaves() >= 1

    # Verify impurity functions
    assert gini_impurity([1, 1, 1, 1]) == 0.0
    assert gini_impurity([0, 0, 1, 1]) == 0.5
    assert entropy([1, 1, 1, 1]) == 0.0
    assert abs(entropy([0, 0, 1, 1]) - 1.0) < 1e-10
    assert variance([1, 1, 1, 1]) == 0.0
    assert variance([0, 0, 1, 1]) == 0.25

    # Larger dataset
    import random
    rng = random.Random(42)
    X_large = []
    y_large = []
    for _ in range(200):
        x1 = rng.gauss(0, 1)
        x2 = rng.gauss(0, 1)
        X_large.append([x1, x2])
        y_large.append(1 if x1 + x2 > 0 else 0)

    tree_large = DecisionTree(max_depth=10, criterion="gini")
    tree_large.fit(X_large, y_large)
    predictions_large = tree_large.predict(X_large)
    accuracy = sum(
        1 for p, t in zip(predictions_large, y_large) if p == t
    ) / len(y_large)
    print(f"Large dataset accuracy: {accuracy:.4f}")
    assert accuracy > 0.9

    print("\nAll tests passed.")
