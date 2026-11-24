-- =========================================
-- 1. Task positions no longer have to be unique
--    The unique index made two inserts into the same column at the same time fail,
--    and it does not allow renumbering a column in one UPDATE.
-- =========================================
DROP INDEX IF EXISTS UQIDX_board_tasks_board_column_position;

CREATE INDEX IF NOT EXISTS IDX_board_tasks_board_column_position
ON board_tasks (board_column_id, position);

-- =========================================
-- 2. Renumber the tasks of a column in the given order (first id = top)
--    Used when there is no room left between two positions.
--    SECURITY INVOKER: RLS still decides which tasks the caller may update.
-- =========================================
CREATE OR REPLACE FUNCTION set_column_task_order(p_task_ids UUID[])
RETURNS VOID
LANGUAGE SQL
SECURITY INVOKER
SET search_path = public
AS $$
    UPDATE board_tasks t
    SET    position = (cardinality(p_task_ids) - x.ord + 1) * 1000
    FROM   unnest(p_task_ids) WITH ORDINALITY AS x(id, ord)
    WHERE  t.id = x.id;
$$;

REVOKE EXECUTE ON FUNCTION set_column_task_order(UUID[]) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION set_column_task_order(UUID[]) TO authenticated;
