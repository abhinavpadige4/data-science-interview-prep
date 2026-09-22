"""
Problem 01: Linear Regression from Scratch
===========================================

Implement linear regression using:
1. Closed-form solution (Normal Equation): β = (X^T X)^{-1} X^T y
2. Gradient Descent: iterative optimization

Also implement L1 (Lasso) and L2 (Ridge) regularization.

Time:  O(n * p^2) for closed-form, O(iterations * n * p) for GD
Space: O(p^2)
"""

from __future__ import annotations
import math
from typing import List, Sequence, Tuple


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
    """Invert a matrix using Gauss-Jordan elimination.

    Raises ValueError if the matrix is singular.
    """
    n = len(A)
    # Augment with identity
    aug = [row[:] + mat_identity(n)[i] for i, row in enumerate(A)]

    for col in range(n):
        # Find pivot
        max_row = max(range(col, n), key=lambda r: abs(aug[r][col]))
        if abs(aug[max_row][col]) < 1e-12:
            raise ValueError("Matrix is singular")
        aug[col], aug[max_row] = aug[max_row], aug[col]

        # Scale pivot row
        pivot = aug[col][col]
        aug[col] = [x / pivot for x in aug[col]]

        # Eliminate column
        for row in range(n):
            if row != col and aug[row][col] != 0:
                factor = aug[row][col]
                aug[row] = [
                    aug[row][j] - factor * aug[col][j] for j in range(2 * n)
                ]

    return [row[n:] for row in aug]


def linear_regression_closed_form(
    X: List[List[float]], y: List[float]
) -> List[float]:
    """Fit linear regression using the Normal Equation.

    β = (X^T X)^{-1} X^T y

    Time:  O(n * p^2)
    Space: O(p^2)
    """
    X_b = add_bias(X)
    X_t = mat_transpose(X_b)
    X_t_X = mat_mul(X_t, X_b)
    X_t_X_inv = mat_inverse(X_t_X)
    X_t_y = mat_vec(X_t, y)
    return mat_vec(X_t_X_inv, X_t_y)


def linear_regression_gd(
    X: List[List[float]],
    y: List[float],
    lr: float = 0.01,
    n_iterations: int = 1000,
    l2_lambda: float = 0.0,
    l1_lambda: float = 0.0,
) -> List[float]:
    """Fit linear regression using gradient descent with optional regularization.

    Loss: L = (1/2n) * ||Xβ - y||² + λ₂ * ||β||² + λ₁ * ||β||₁

    Time:  O(iterations * n * p)
    Space: O(p)
    """
    X_b = add_bias(X)
    n, p = len(X_b), len(X_b[0])

    # Initialize weights to zero
    beta = [0.0] * p

    for _ in range(n_iterations):
        # Predictions
        y_pred = [sum(X_b[i][j] * beta[j] for j in range(p)) for i in range(n)]

        # Errors
        errors = [y_pred[i] - y[i] for i in range(n)]

        # Gradient: (1/n) * X^T * errors + regularization
        grad = [0.0] * p
        for j in range(p):
            grad[j] = sum(X_b[i][j] * errors[i] for i in range(n)) / n
            # L2 regularization (don't regularize the bias)
            if j > 0 and l2_lambda > 0:
                grad[j] += l2_lambda * beta[j]

        # Update
        for j in range(p):
            beta[j] -= lr * grad[j]
            # L1 regularization (soft thresholding)
            if j > 0 and l1_lambda > 0:
                if beta[j] > l1_lambda:
                    beta[j] -= l1_lambda
                elif beta[j] < -l1_lambda:
                    beta[j] += l1_lambda
                else:
                    beta[j] = 0.0

    return beta


def predict(X: List[List[float]], beta: List[float]) -> List[float]:
    """Predict y from X and beta (beta[0] is the intercept)."""
    X_b = add_bias(X)
    return mat_vec(X_b, beta)


def mse(y_true: List[float], y_pred: List[float]) -> float:
    """Mean Squared Error."""
    n = len(y_true)
    return sum((y_true[i] - y_pred[i]) ** 2 for i in range(n)) / n


def r_squared(y_true: List[float], y_pred: List[float]) -> float:
    """R² score (coefficient of determination)."""
    n = len(y_true)
    mean_y = sum(y_true) / n
    ss_res = sum((y_true[i] - y_pred[i]) ** 2 for i in range(n))
    ss_tot = sum((y_true[i] - mean_y) ** 2 for i in range(n))
    return 1 - ss_res / ss_tot if ss_tot > 0 else 0.0


# ---------------------------------------------------------------------------
# Self-tests
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # Simple linear relationship: y = 2x + 3
    X = [[float(i)] for i in range(100)]
    y = [2 * x[0] + 3 for x in X]

    # Closed-form solution
    beta_cf = linear_regression_closed_form(X, y)
    print(f"Closed-form: intercept={beta_cf[0]:.4f}, slope={beta_cf[1]:.4f}")
    assert abs(beta_cf[0] - 3) < 1e-6
    assert abs(beta_cf[1] - 2) < 1e-6

    # Gradient descent solution
    beta_gd = linear_regression_gd(X, y, lr=0.01, n_iterations=5000)
    print(f"GD: intercept={beta_gd[0]:.4f}, slope={beta_gd[1]:.4f}")
    assert abs(beta_gd[0] - 3) < 0.1
    assert abs(beta_gd[1] - 2) < 0.1

    # Predictions should be accurate
    y_pred = predict(X, beta_cf)
    assert mse(y, y_pred) < 1e-10
    assert r_squared(y, y_pred) > 0.9999

    # Noisy data
    import random
    rng = random.Random(42)
    X_noisy = [[float(i)] for i in range(100)]
    y_noisy = [2 * x[0] + 3 + rng.gauss(0, 1) for x in X_noisy]

    beta_noisy = linear_regression_closed_form(X_noisy, y_noisy)
    print(f"Noisy: intercept={beta_noisy[0]:.4f}, slope={beta_noisy[1]:.4f}")
    assert abs(beta_noisy[0] - 3) < 0.5
    assert abs(beta_noisy[1] - 2) < 0.5

    # Multiple features: y = 1 + 2x1 + 3x2
    X_multi = [[1.0, 2.0], [2.0, 1.0], [3.0, 3.0], [4.0, 2.0], [5.0, 4.0]]
    y_multi = [1 + 2 * x[0] + 3 * x[1] for x in X_multi]

    beta_multi = linear_regression_closed_form(X_multi, y_multi)
    print(f"Multi: intercept={beta_multi[0]:.4f}, "
          f"coef1={beta_multi[1]:.4f}, coef2={beta_multi[2]:.4f}")
    assert abs(beta_multi[0] - 1) < 1e-6
    assert abs(beta_multi[1] - 2) < 1e-6
    assert abs(beta_multi[2] - 3) < 1e-6

    # L2 regularization shrinks coefficients
    beta_ridge = linear_regression_gd(
        X_multi, y_multi, lr=0.01, n_iterations=1000, l2_lambda=0.1
    )
    print(f"Ridge: intercept={beta_ridge[0]:.4f}, "
          f"coef1={beta_ridge[1]:.4f}, coef2={beta_ridge[2]:.4f}")
    # Ridge coefficients should be smaller in magnitude
    assert abs(beta_ridge[1]) < abs(beta_multi[1])
    assert abs(beta_ridge[2]) < abs(beta_multi[2])

    # L1 regularization can zero out coefficients
    beta_lasso = linear_regression_gd(
        X_multi, y_multi, lr=0.01, n_iterations=1000, l1_lambda=0.5
    )
    print(f"Lasso: intercept={beta_lasso[0]:.4f}, "
          f"coef1={beta_lasso[1]:.4f}, coef2={beta_lasso[2]:.4f}")

    # Verify matrix operations
    A = [[1, 2], [3, 4]]
    A_inv = mat_inverse(A)
    A_times_inv = mat_mul(A, A_inv)
    for i in range(2):
        for j in range(2):
            expected = 1.0 if i == j else 0.0
            assert abs(A_times_inv[i][j] - expected) < 1e-10

    print("\nAll tests passed.")
