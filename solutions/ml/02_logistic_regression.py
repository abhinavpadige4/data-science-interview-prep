"""
Problem 02: Logistic Regression from Scratch
=============================================

Implement binary logistic regression using:
1. Gradient Descent
2. Newton-Raphson (Fisher scoring)

Also implement L2 regularization (Ridge logistic regression).

Time:  O(iterations * n * p) for GD, O(iterations * p^3) for Newton
Space: O(p^2)
"""

from __future__ import annotations
import math
from typing import List, Sequence, Tuple


def sigmoid(z: float) -> float:
    """Numerically stable sigmoid function."""
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    else:
        ez = math.exp(z)
        return ez / (1.0 + ez)


def add_bias(X: List[List[float]]) -> List[List[float]]:
    """Add a column of 1s to X for the intercept term."""
    return [[1.0] + row for row in X]


def mat_transpose(A: List[List[float]]) -> List[List[float]]:
    """Transpose a matrix."""
    if not A or not A[0]:
        return []
    rows, cols = len(A), len(A[0])
    return [[A[i][j] for i in range(rows)] for j in range(cols)]


def mat_mul(A: List[List[float]], B: List[List[float]]) -> List[List[float]]:
    """Multiply two matrices."""
    rows_a, cols_a = len(A), len(A[0])
    cols_b = len(B[0])
    result = [[0.0] * cols_b for _ in range(rows_a)]
    for i in range(rows_a):
        for k in range(cols_a):
            if A[i][k] == 0:
                continue
            for j in range(cols_b):
                result[i][j] += A[i][k] * B[k][j]
    return result


def mat_vec(A: List[List[float]], v: List[float]) -> List[float]:
    """Multiply a matrix by a vector."""
    return [sum(A[i][j] * v[j] for j in range(len(v))) for i in range(len(A))]


def mat_identity(n: int) -> List[List[float]]:
    """Create an n x n identity matrix."""
    return [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]


def mat_inverse(A: List[List[float]]) -> List[List[float]]:
    """Invert a matrix using Gauss-Jordan elimination."""
    n = len(A)
    aug = [row[:] + mat_identity(n)[i] for i, row in enumerate(A)]
    for col in range(n):
        max_row = max(range(col, n), key=lambda r: abs(aug[r][col]))
        if abs(aug[max_row][col]) < 1e-12:
            raise ValueError("Matrix is singular")
        aug[col], aug[max_row] = aug[max_row], aug[col]
        pivot = aug[col][col]
        aug[col] = [x / pivot for x in aug[col]]
        for row in range(n):
            if row != col and aug[row][col] != 0:
                factor = aug[row][col]
                aug[row] = [
                    aug[row][j] - factor * aug[col][j] for j in range(2 * n)
                ]
    return [row[n:] for row in aug]


def log_loss(y_true: List[int], y_pred_proba: List[float]) -> float:
    """Binary cross-entropy loss."""
    eps = 1e-15
    n = len(y_true)
    loss = 0.0
    for i in range(n):
        p = max(min(y_pred_proba[i], 1 - eps), eps)
        if y_true[i] == 1:
            loss -= math.log(p)
        else:
            loss -= math.log(1 - p)
    return loss / n


def accuracy(y_true: List[int], y_pred: List[int]) -> float:
    """Classification accuracy."""
    return sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true)


def predict_proba(X: List[List[float]], beta: List[float]) -> List[float]:
    """Predict probabilities."""
    X_b = add_bias(X)
    z = mat_vec(X_b, beta)
    return [sigmoid(zi) for zi in z]


def predict(X: List[List[float]], beta: List[float], threshold: float = 0.5) -> List[int]:
    """Predict classes."""
    return [1 if p >= threshold else 0 for p in predict_proba(X, beta)]


def logistic_regression_gd(
    X: List[List[float]],
    y: List[int],
    lr: float = 0.1,
    n_iterations: int = 1000,
    l2_lambda: float = 0.0,
    tol: float = 1e-7,
) -> List[float]:
    """Fit logistic regression using gradient descent.

    Loss: L = -1/n * sum(y*log(p) + (1-y)*log(1-p)) + λ/2 * ||β||²

    Time:  O(iterations * n * p)
    Space: O(p)
    """
    X_b = add_bias(X)
    n, p = len(X_b), len(X_b[0])

    # Initialize weights to zero
    beta = [0.0] * p

    for iteration in range(n_iterations):
        # Predictions
        z = mat_vec(X_b, beta)
        y_pred = [sigmoid(zi) for zi in z]

        # Gradient: (1/n) * X^T * (y_pred - y) + λ * β
        grad = [0.0] * p
        for j in range(p):
            grad[j] = sum(
                X_b[i][j] * (y_pred[i] - y[i]) for i in range(n)
            ) / n
            # L2 regularization (don't regularize the bias)
            if j > 0 and l2_lambda > 0:
                grad[j] += l2_lambda * beta[j]

        # Update
        max_grad = 0.0
        for j in range(p):
            beta[j] -= lr * grad[j]
            max_grad = max(max_grad, abs(grad[j]))

        # Convergence check
        if max_grad < tol:
            break

    return beta


def logistic_regression_newton(
    X: List[List[float]],
    y: List[int],
    n_iterations: int = 100,
    l2_lambda: float = 0.0,
    tol: float = 1e-7,
) -> List[float]:
    """Fit logistic regression using Newton-Raphson (Fisher scoring).

    β_{k+1} = β_k - H^{-1} * g
    where H is the Hessian and g is the gradient.

    Time:  O(iterations * p^3)
    Space: O(p^2)
    """
    X_b = add_bias(X)
    n, p = len(X_b), len(X_b[0])

    # Initialize weights to zero
    beta = [0.0] * p

    for iteration in range(n_iterations):
        # Predictions
        z = mat_vec(X_b, beta)
        y_pred = [sigmoid(zi) for zi in z]

        # Gradient: (1/n) * X^T * (y_pred - y) + λ * β
        grad = [0.0] * p
        for j in range(p):
            grad[j] = sum(
                X_b[i][j] * (y_pred[i] - y[i]) for i in range(n)
            ) / n
            if j > 0 and l2_lambda > 0:
                grad[j] += l2_lambda * beta[j]

        # Hessian: (1/n) * X^T * W * X + λ * I
        # where W is a diagonal matrix with w_i = p_i * (1 - p_i)
        hessian = [[0.0] * p for _ in range(p)]
        for i in range(n):
            w = y_pred[i] * (1 - y_pred[i])
            for j in range(p):
                for k in range(p):
                    hessian[j][k] += X_b[i][j] * X_b[i][k] * w
        for j in range(p):
            for k in range(p):
                hessian[j][k] /= n
            if j > 0 and l2_lambda > 0:
                hessian[j][j] += l2_lambda

        # Solve H * delta = grad
        try:
            hessian_inv = mat_inverse(hessian)
        except ValueError:
            # If singular, add a small ridge
            for j in range(p):
                hessian[j][j] += 1e-6
            hessian_inv = mat_inverse(hessian)

        delta = mat_vec(hessian_inv, grad)

        # Update
        max_delta = 0.0
        for j in range(p):
            beta[j] -= delta[j]
            max_delta = max(max_delta, abs(delta[j]))

        if max_delta < tol:
            break

    return beta


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Linearly separable data
    X = [[0, 0], [0, 1], [1, 0], [1, 1]]
    y = [0, 0, 1, 1]

    # Gradient descent
    beta_gd = logistic_regression_gd(X, y, lr=0.1, n_iterations=1000)
    print(f"GD: {beta_gd}")
    y_pred = predict(X, beta_gd)
    assert accuracy(y, y_pred) == 1.0

    # Newton-Raphson
    beta_newton = logistic_regression_newton(X, y, n_iterations=50)
    print(f"Newton: {beta_newton}")
    y_pred_newton = predict(X, beta_newton)
    assert accuracy(y, y_pred_newton) == 1.0

    # Both should give similar results
    for i in range(len(beta_gd)):
        assert abs(beta_gd[i] - beta_newton[i]) < 0.5, (
            beta_gd[i], beta_newton[i]
        )

    # Larger dataset
    import random
    rng = random.Random(42)
    X_large = []
    y_large = []
    for _ in range(200):
        x1 = rng.gauss(0, 1)
        x2 = rng.gauss(0, 1)
        X_large.append([x1, x2])
        # True model: P(y=1) = sigmoid(2*x1 + 3*x2 - 1)
        z = 2 * x1 + 3 * x2 - 1
        y_large.append(1 if rng.random() < sigmoid(z) else 0)

    beta_large = logistic_regression_gd(
        X_large, y_large, lr=0.1, n_iterations=2000
    )
    print(f"Large: intercept={beta_large[0]:.4f}, "
          f"coef1={beta_large[1]:.4f}, coef2={beta_large[2]:.4f}")
    # Should recover the true coefficients approximately
    assert abs(beta_large[0] + 1) < 0.5  # intercept ≈ -1
    assert abs(beta_large[1] - 2) < 0.5  # coef1 ≈ 2
    assert abs(beta_large[2] - 3) < 0.5  # coef2 ≈ 3

    # L2 regularization shrinks coefficients
    beta_ridge = logistic_regression_gd(
        X_large, y_large, lr=0.1, n_iterations=2000, l2_lambda=0.1
    )
    print(f"Ridge: intercept={beta_ridge[0]:.4f}, "
          f"coef1={beta_ridge[1]:.4f}, coef2={beta_ridge[2]:.4f}")
    assert abs(beta_ridge[1]) < abs(beta_large[1])
    assert abs(beta_ridge[2]) < abs(beta_large[2])

    # Verify sigmoid
    assert abs(sigmoid(0) - 0.5) < 1e-10
    assert sigmoid(100) > 0.9999
    assert sigmoid(-100) < 0.0001

    # Verify log_loss
    assert log_loss([1, 0], [0.9, 0.1]) < 0.1
    assert log_loss([1, 0], [0.5, 0.5]) > 0.6

    print("\nAll tests passed.")
