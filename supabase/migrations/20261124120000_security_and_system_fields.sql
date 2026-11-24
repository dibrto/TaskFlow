-- =========================================
-- 1. Fixed search_path on all functions
--    (required for SECURITY DEFINER, recommended for the rest)
-- =========================================
ALTER FUNCTION is_board_member(UUID)     SET search_path = public;
ALTER FUNCTION is_board_owner(UUID)      SET search_path = public;
ALTER FUNCTION setup_new_board()         SET search_path = public;
ALTER FUNCTION update_system_fields()    SET search_path = public;
ALTER FUNCTION insert_system_fields()    SET search_path = public;
ALTER FUNCTION set_task_last_position()  SET search_path = public;

-- =========================================
-- 2. System fields on board_columns and board_tasks
--    (created_by / updated_by can no longer be set by the client)
-- =========================================
DROP TRIGGER IF EXISTS      trg_insert_system_fields ON board_columns;
CREATE TRIGGER             trg_insert_system_fields
BEFORE INSERT ON           board_columns
FOR EACH ROW
EXECUTE FUNCTION           insert_system_fields();

DROP TRIGGER IF EXISTS      trg_update_system_fields ON board_columns;
CREATE TRIGGER             trg_update_system_fields
BEFORE UPDATE ON           board_columns
FOR EACH ROW
EXECUTE FUNCTION           update_system_fields();

DROP TRIGGER IF EXISTS      trg_insert_system_fields ON board_tasks;
CREATE TRIGGER             trg_insert_system_fields
BEFORE INSERT ON           board_tasks
FOR EACH ROW
EXECUTE FUNCTION           insert_system_fields();

DROP TRIGGER IF EXISTS      trg_update_system_fields ON board_tasks;
CREATE TRIGGER             trg_update_system_fields
BEFORE UPDATE ON           board_tasks
FOR EACH ROW
EXECUTE FUNCTION           update_system_fields();

-- update_system_fields already sets updated_at, so the duplicate is removed
DROP TRIGGER IF EXISTS      board_tasks_set_updated_at ON board_tasks;
DROP FUNCTION IF EXISTS     set_updated_at();

-- =========================================
-- 3. A task must point to a column from the same board
-- =========================================
ALTER TABLE board_columns
    ADD CONSTRAINT UQ_board_columns_id_board_id UNIQUE (id, board_id);

ALTER TABLE board_tasks
    DROP CONSTRAINT IF EXISTS FK_board_tasks_board_columns_board_columns_id;

ALTER TABLE board_tasks
    ADD CONSTRAINT FK_board_tasks_board_columns_column_board
    FOREIGN KEY (board_column_id, board_id)
    REFERENCES board_columns(id, board_id)
    ON DELETE CASCADE;
