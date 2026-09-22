-- Problem 02: Retention Cohort Analysis
-- ======================================
-- Calculate weekly retention rates by signup cohort.
--
-- Schema:
--   users(user_id, signup_date)
--   activity(user_id, activity_date)
--
-- Approach: Self-join users with activity, compute week offset.
--
-- Time:  O(n * m) where n = users, m = activity records
-- Space: O(n * m)

-- Solution: Weekly retention matrix
WITH user_activity AS (
    SELECT
        u.user_id,
        u.signup_date,
        a.activity_date,
        -- Compute week offset from signup
        FLOOR(
            (a.activity_date - u.signup_date) / 7.0
        ) AS week_offset
    FROM users u
    JOIN activity a ON u.user_id = a.user_id
    WHERE a.activity_date >= u.signup_date
),
cohort_sizes AS (
    SELECT
        DATE_TRUNC('week', signup_date) AS cohort_week,
        COUNT(DISTINCT user_id) AS cohort_size
    FROM users
    GROUP BY DATE_TRUNC('week', signup_date)
),
retention AS (
    SELECT
        cohort_week,
        week_offset,
        COUNT(DISTINCT user_id) AS retained_users
    FROM user_activity
    GROUP BY cohort_week, week_offset
)
SELECT
    r.cohort_week,
    cs.cohort_size,
    r.week_offset,
    r.retained_users,
    ROUND(
        100.0 * r.retained_users / cs.cohort_size,
        2
    ) AS retention_rate_pct
FROM retention r
JOIN cohort_sizes cs ON r.cohort_week = cs.cohort_week
ORDER BY r.cohort_week, r.week_offset;

-- Alternative: Pivot to get a matrix (one row per cohort)
WITH user_activity AS (
    SELECT
        u.user_id,
        DATE_TRUNC('week', u.signup_date) AS cohort_week,
        FLOOR((a.activity_date - u.signup_date) / 7.0) AS week_offset
    FROM users u
    JOIN activity a ON u.user_id = a.user_id
    WHERE a.activity_date >= u.signup_date
),
cohort_sizes AS (
    SELECT
        DATE_TRUNC('week', signup_date) AS cohort_week,
        COUNT(DISTINCT user_id) AS cohort_size
    FROM users
    GROUP BY DATE_TRUNC('week', signup_date)
)
SELECT
    ua.cohort_week,
    cs.cohort_size,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.week_offset = 0 THEN ua.user_id END) / cs.cohort_size, 2) AS week_0,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.week_offset = 1 THEN ua.user_id END) / cs.cohort_size, 2) AS week_1,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.week_offset = 2 THEN ua.user_id END) / cs.cohort_size, 2) AS week_2,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.week_offset = 3 THEN ua.user_id END) / cs.cohort_size, 2) AS week_3,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN ua.week_offset = 4 THEN ua.user_id END) / cs.cohort_size, 2) AS week_4
FROM user_activity ua
JOIN cohort_sizes cs ON ua.cohort_week = cs.cohort_week
GROUP BY ua.cohort_week, cs.cohort_size
ORDER BY ua.cohort_week;

-- Key concepts:
-- - Cohort: users who signed up in the same time period
-- - Retention: % of cohort that returns in a later period
-- - Week offset: how many weeks after signup the activity occurred
-- - DATE_TRUNC: truncates a date to the start of the period

-- Interview tip: Always clarify the retention definition!
-- - "Return retention": did they come back at all?
-- - "Consecutive retention": did they come back every week?
-- - "N-day retention": did they come back within N days?
