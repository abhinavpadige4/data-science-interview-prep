-- Problem 01: Top N per Group
-- ============================
-- Find the top 3 products by sales in each category.
--
-- Schema:
--   products(product_id, product_name, category_id)
--   sales(sale_id, product_id, quantity, sale_date)
--
-- Approach: Window functions with ROW_NUMBER() or RANK().
--
-- Time:  O(n log n) for the sort
-- Space: O(n)

-- Solution 1: Using ROW_NUMBER() (exactly 3 per category, no ties)
WITH product_sales AS (
    SELECT
        p.product_id,
        p.product_name,
        p.category_id,
        SUM(s.quantity) AS total_quantity
    FROM products p
    JOIN sales s ON p.product_id = s.product_id
    GROUP BY p.product_id, p.product_name, p.category_id
),
ranked AS (
    SELECT
        product_id,
        product_name,
        category_id,
        total_quantity,
        ROW_NUMBER() OVER (
            PARTITION BY category_id
            ORDER BY total_quantity DESC
        ) AS rn
    FROM product_sales
)
SELECT
    category_id,
    product_id,
    product_name,
    total_quantity,
    rn
FROM ranked
WHERE rn <= 3
ORDER BY category_id, rn;

-- Solution 2: Using RANK() (handles ties — may return more than 3)
WITH product_sales AS (
    SELECT
        p.product_id,
        p.product_name,
        p.category_id,
        SUM(s.quantity) AS total_quantity
    FROM products p
    JOIN sales s ON p.product_id = s.product_id
    GROUP BY p.product_id, p.product_name, p.category_id
),
ranked AS (
    SELECT
        product_id,
        product_name,
        category_id,
        total_quantity,
        RANK() OVER (
            PARTITION BY category_id
            ORDER BY total_quantity DESC
        ) AS rnk
    FROM product_sales
)
SELECT
    category_id,
    product_id,
    product_name,
    total_quantity,
    rnk
FROM ranked
WHERE rnk <= 3
ORDER BY category_id, rnk;

-- Solution 3: Using DENSE_RANK() (ties get the same rank, no gaps)
WITH product_sales AS (
    SELECT
        p.product_id,
        p.product_name,
        p.category_id,
        SUM(s.quantity) AS total_quantity
    FROM products p
    JOIN sales s ON p.product_id = s.product_id
    GROUP BY p.product_id, p.product_name, p.category_id
),
ranked AS (
    SELECT
        product_id,
        product_name,
        category_id,
        total_quantity,
        DENSE_RANK() OVER (
            PARTITION BY category_id
            ORDER BY total_quantity DESC
        ) AS drnk
    FROM product_sales
)
SELECT
    category_id,
    product_id,
    product_name,
    total_quantity,
    drnk
FROM ranked
WHERE drnk <= 3
ORDER BY category_id, drnk;

-- Key differences:
-- ROW_NUMBER(): 1, 2, 3, 4 (no ties, exactly N rows)
-- RANK():       1, 2, 2, 4 (ties get same rank, gaps after)
-- DENSE_RANK(): 1, 2, 2, 3 (ties get same rank, no gaps)

-- Interview tip: Always ask about ties! If the interviewer says "top 3
-- products", they usually mean ROW_NUMBER() (exactly 3). If they say
-- "top 3 sales levels", they might mean DENSE_RANK().
