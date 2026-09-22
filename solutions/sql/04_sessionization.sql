-- Problem 04: Sessionization (Gap-and-Island)
-- ============================================
-- Group user events into sessions based on inactivity timeout.
-- A new session starts if the gap between events exceeds 30 minutes.
--
-- Schema:
--   events(user_id, event_name, event_timestamp)
--
-- Approach: Gap-and-island pattern with LAG().
--
-- Time:  O(n log n) for the sort
-- Space: O(n)

-- Solution: Sessionization with 30-minute inactivity timeout
WITH ordered_events AS (
    SELECT
        user_id,
        event_name,
        event_timestamp,
        LAG(event_timestamp) OVER (
            PARTITION BY user_id
            ORDER BY event_timestamp
        ) AS prev_timestamp
    FROM events
),
session_flags AS (
    SELECT
        user_id,
        event_name,
        event_timestamp,
        prev_timestamp,
        -- New session if no previous event or gap > 30 minutes
        CASE
            WHEN prev_timestamp IS NULL THEN 1
            WHEN EXTRACT(EPOCH FROM (event_timestamp - prev_timestamp)) > 1800 THEN 1
            ELSE 0
        END AS is_new_session
    FROM ordered_events
),
session_ids AS (
    SELECT
        user_id,
        event_name,
        event_timestamp,
        -- Cumulative sum of new session flags = session ID
        SUM(is_new_session) OVER (
            PARTITION BY user_id
            ORDER BY event_timestamp
        ) AS session_id
    FROM session_flags
)
SELECT
    user_id,
    session_id,
    COUNT(*) AS event_count,
    MIN(event_timestamp) AS session_start,
    MAX(event_timestamp) AS session_end,
    EXTRACT(EPOCH FROM (MAX(event_timestamp) - MIN(event_timestamp))) / 60.0 AS duration_minutes,
    ARRAY_AGG(event_name ORDER BY event_timestamp) AS events
FROM session_ids
GROUP BY user_id, session_id
ORDER BY user_id, session_id;

-- Alternative: Using a recursive CTE (for databases without window functions)
WITH RECURSIVE ordered_events AS (
    SELECT
        user_id,
        event_name,
        event_timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY event_timestamp
        ) AS rn
    FROM events
),
sessions AS (
    -- Base case: first event for each user
    SELECT
        user_id,
        event_name,
        event_timestamp,
        rn,
        1 AS session_id
    FROM ordered_events
    WHERE rn = 1

    UNION ALL

    -- Recursive case: subsequent events
    SELECT
        e.user_id,
        e.event_name,
        e.event_timestamp,
        e.rn,
        CASE
            WHEN EXTRACT(EPOCH FROM (e.event_timestamp - p.event_timestamp)) > 1800
                THEN p.session_id + 1
            ELSE p.session_id
        END
    FROM ordered_events e
    JOIN sessions p ON e.user_id = p.user_id AND e.rn = p.rn + 1
)
SELECT
    user_id,
    session_id,
    COUNT(*) AS event_count,
    MIN(event_timestamp) AS session_start,
    MAX(event_timestamp) AS session_end
FROM sessions
GROUP BY user_id, session_id
ORDER BY user_id, session_id;

-- Key concepts:
-- - Sessionization: grouping events into sessions
-- - Gap-and-island: identifying contiguous groups of rows
-- - LAG(): accessing the previous row's value
-- - Cumulative sum: creating group IDs from flags

-- Interview tip: Always clarify the session definition!
-- - Inactivity timeout (30 min, 1 hour, etc.)
-- - Time of day (midnight reset)
-- - Device-based vs user-based sessions
