-- Problem 03: Funnel Analysis
-- ===========================
-- Calculate conversion rates through a multi-step funnel.
--
-- Schema:
--   events(user_id, event_name, event_timestamp)
--
-- Funnel steps: view_product -> add_to_cart -> checkout -> purchase
--
-- Approach: Self-join events with LAG() or sequential filtering.
--
-- Time:  O(n log n) for the sort
-- Space: O(n)

-- Solution 1: Using CTEs with sequential filtering
WITH step1_view AS (
    SELECT DISTINCT user_id, event_timestamp
    FROM events
    WHERE event_name = 'view_product'
),
step2_cart AS (
    SELECT DISTINCT e.user_id, e.event_timestamp
    FROM events e
    JOIN step1_view v ON e.user_id = v.user_id
    WHERE e.event_name = 'add_to_cart'
    AND e.event_timestamp >= v.event_timestamp
),
step3_checkout AS (
    SELECT DISTINCT e.user_id, e.event_timestamp
    FROM events e
    JOIN step2_cart c ON e.user_id = c.user_id
    WHERE e.event_name = 'checkout'
    AND e.event_timestamp >= c.event_timestamp
),
step4_purchase AS (
    SELECT DISTINCT e.user_id, e.event_timestamp
    FROM events e
    JOIN step3_checkout c ON e.user_id = c.user_id
    WHERE e.event_name = 'purchase'
    AND e.event_timestamp >= c.event_timestamp
)
SELECT
    'view_product' AS step,
    COUNT(DISTINCT user_id) AS users,
    100.0 AS conversion_rate
FROM step1_view
UNION ALL
SELECT
    'add_to_cart' AS step,
    COUNT(DISTINCT user_id) AS users,
    ROUND(100.0 * COUNT(DISTINCT c.user_id) / (SELECT COUNT(DISTINCT user_id) FROM step1_view), 2) AS conversion_rate
FROM step2_cart c
UNION ALL
SELECT
    'checkout' AS step,
    COUNT(DISTINCT user_id) AS users,
    ROUND(100.0 * COUNT(DISTINCT c.user_id) / (SELECT COUNT(DISTINCT user_id) FROM step1_view), 2) AS conversion_rate
FROM step3_checkout c
UNION ALL
SELECT
    'purchase' AS step,
    COUNT(DISTINCT user_id) AS users,
    ROUND(100.0 * COUNT(DISTINCT c.user_id) / (SELECT COUNT(DISTINCT user_id) FROM step1_view), 2) AS conversion_rate
FROM step4_purchase c
ORDER BY
    CASE step
        WHEN 'view_product' THEN 1
        WHEN 'add_to_cart' THEN 2
        WHEN 'checkout' THEN 3
        WHEN 'purchase' THEN 4
    END;

-- Solution 2: Using window functions (more elegant)
WITH user_events AS (
    SELECT
        user_id,
        event_name,
        event_timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, event_name
            ORDER BY event_timestamp
        ) AS rn
    FROM events
    WHERE event_name IN ('view_product', 'add_to_cart', 'checkout', 'purchase')
),
first_events AS (
    SELECT
        user_id,
        MIN(CASE WHEN event_name = 'view_product' THEN event_timestamp END) AS view_time,
        MIN(CASE WHEN event_name = 'add_to_cart' THEN event_timestamp END) AS cart_time,
        MIN(CASE WHEN event_name = 'checkout' THEN event_timestamp END) AS checkout_time,
        MIN(CASE WHEN event_name = 'purchase' THEN event_timestamp END) AS purchase_time
    FROM user_events
    WHERE rn = 1
    GROUP BY user_id
),
funnel AS (
    SELECT
        user_id,
        CASE WHEN view_time IS NOT NULL THEN 1 ELSE 0 END AS viewed,
        CASE WHEN cart_time IS NOT NULL AND cart_time >= view_time THEN 1 ELSE 0 END AS added_to_cart,
        CASE WHEN checkout_time IS NOT NULL AND checkout_time >= cart_time THEN 1 ELSE 0 END AS checked_out,
        CASE WHEN purchase_time IS NOT NULL AND purchase_time >= checkout_time THEN 1 ELSE 0 END AS purchased
    FROM first_events
)
SELECT
    SUM(viewed) AS viewed,
    SUM(added_to_cart) AS added_to_cart,
    SUM(checked_out) AS checked_out,
    SUM(purchased) AS purchased,
    ROUND(100.0 * SUM(added_to_cart) / NULLIF(SUM(viewed), 0), 2) AS view_to_cart_rate,
    ROUND(100.0 * SUM(checked_out) / NULLIF(SUM(added_to_cart), 0), 2) AS cart_to_checkout_rate,
    ROUND(100.0 * SUM(purchased) / NULLIF(SUM(checked_out), 0), 2) AS checkout_to_purchase_rate,
    ROUND(100.0 * SUM(purchased) / NULLIF(SUM(viewed), 0), 2) AS overall_conversion_rate
FROM funnel;

-- Key concepts:
-- - Funnel: sequential steps users must complete
-- - Conversion rate: % of users who complete each step
-- - Drop-off: users who abandon at each step
-- - Time window: optionally limit to events within N days

-- Interview tip: Always ask about the time window!
-- - "Within 24 hours" vs "ever"
-- - "Strict order" vs "any order"
-- - "First occurrence" vs "any occurrence"
