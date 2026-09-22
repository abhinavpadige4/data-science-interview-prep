-- Problem 05: Running Totals & Cumulative Metrics
-- =================================================
-- Calculate running totals, moving averages, and other cumulative metrics.
--
-- Schema:
--   orders(order_id, user_id, order_date, amount)
--
-- Approach: Window functions with SUM() OVER, AVG() OVER, etc.
--
-- Time:  O(n log n) for the sort
-- Space: O(n)

-- Solution 1: Running total of daily revenue
WITH daily_revenue AS (
    SELECT
        order_date,
        SUM(amount) AS daily_revenue
    FROM orders
    GROUP BY order_date
)
SELECT
    order_date,
    daily_revenue,
    SUM(daily_revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total,
    AVG(daily_revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_average,
    SUM(daily_revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7_day_total,
    AVG(daily_revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7_day_average
FROM daily_revenue
ORDER BY order_date;

-- Solution 2: Running total by user
SELECT
    user_id,
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS user_running_total,
    COUNT(*) OVER (
        PARTITION BY user_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS user_order_count,
    AVG(amount) OVER (
        PARTITION BY user_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS user_avg_order_value
FROM orders
ORDER BY user_id, order_date;

-- Solution 3: Year-over-year growth
WITH yearly_revenue AS (
    SELECT
        EXTRACT(YEAR FROM order_date) AS year,
        SUM(amount) AS yearly_revenue
    FROM orders
    GROUP BY EXTRACT(YEAR FROM order_date)
)
SELECT
    year,
    yearly_revenue,
    LAG(yearly_revenue) OVER (ORDER BY year) AS prev_year_revenue,
    ROUND(
        100.0 * (yearly_revenue - LAG(yearly_revenue) OVER (ORDER BY year))
        / NULLIF(LAG(yearly_revenue) OVER (ORDER BY year), 0),
        2
    ) AS yoy_growth_pct
FROM yearly_revenue
ORDER BY year;

-- Solution 4: Percentile rank
SELECT
    user_id,
    order_date,
    amount,
    PERCENT_RANK() OVER (
        ORDER BY amount
    ) AS percentile_rank,
    NTILE(10) OVER (
        ORDER BY amount
    ) AS decile
FROM orders
ORDER BY amount;

-- Key window function concepts:
-- - ORDER BY: defines the order of rows
-- - PARTITION BY: divides rows into groups
-- - ROWS BETWEEN: defines the frame (which rows to include)
--   - UNBOUNDED PRECEDING: from the start
--   - CURRENT ROW: up to the current row
--   - N PRECEDING: N rows before the current row
--   - UNBOUNDED FOLLOWING: to the end
-- - RANGE vs ROWS: RANGE uses values, ROWS uses physical rows

-- Common frame definitions:
-- - Running total: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
-- - Rolling 7-day: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
-- - Full window: ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING

-- Interview tip: Always specify the frame! Without it, the default is
-- RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which can cause
-- unexpected results with ties.
