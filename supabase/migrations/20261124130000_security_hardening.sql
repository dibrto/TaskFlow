-- =========================================
-- 1. Text length limits
-- =========================================
ALTER TABLE boards
    ADD CONSTRAINT CK_boards_title_length       CHECK (char_length(title) <= 100),
    ADD CONSTRAINT CK_boards_description_length CHECK (char_length(description) <= 500);

ALTER TABLE board_columns
    ADD CONSTRAINT CK_board_columns_title_length CHECK (char_length(title) <= 100);

ALTER TABLE board_tasks
    ADD CONSTRAINT CK_board_tasks_title_length       CHECK (char_length(title) <= 255),
    ADD CONSTRAINT CK_board_tasks_description_length CHECK (char_length(description) <= 2000);

-- =========================================
-- 2. created_by / created_at cannot be changed on UPDATE
-- =========================================
CREATE OR REPLACE FUNCTION update_system_fields()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
    new.created_by      = old.created_by;
    new.created_at      = old.created_at;
    new.updated_by      = auth.uid();
    new.updated_at      = now();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- 3. Only the owner can create, change and delete columns
--    (reading stays open to all members)
-- =========================================
DROP POLICY IF EXISTS "board_columns_insert" ON board_columns;
CREATE POLICY "board_columns_insert"
ON board_columns
FOR INSERT
WITH CHECK (is_board_owner(board_columns.board_id));

DROP POLICY IF EXISTS "board_columns_update" ON board_columns;
CREATE POLICY "board_columns_update"
ON board_columns
FOR UPDATE
USING      (is_board_owner(board_columns.board_id))
WITH CHECK (is_board_owner(board_columns.board_id));

DROP POLICY IF EXISTS "board_columns_delete" ON board_columns;
CREATE POLICY "board_columns_delete"
ON board_columns
FOR DELETE
USING (is_board_owner(board_columns.board_id));

-- =========================================
-- 4a. The owner cannot remove itself from the board
--     (deleting the whole board still removes the members via CASCADE)
-- =========================================
DROP POLICY IF EXISTS "board_members_delete" ON board_members;
CREATE POLICY "board_members_delete"
ON board_members
FOR DELETE
USING (
    is_board_owner(board_members.board_id)
    AND board_members.role <> 'owner'
);

-- =========================================
-- 4b. Helper functions are not callable by anonymous users
-- =========================================
REVOKE EXECUTE ON FUNCTION is_board_member(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_board_owner(UUID)  FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION is_board_member(UUID) TO authenticated;
GRANT  EXECUTE ON FUNCTION is_board_owner(UUID)  TO authenticated;
