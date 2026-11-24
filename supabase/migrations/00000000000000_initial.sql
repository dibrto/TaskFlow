-- =========================================
-- TRIGGER FUNCTION (auto update system fields)
-- =========================================
CREATE OR REPLACE FUNCTION	update_system_fields()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_by		= auth.uid();
    new.updated_at		= now();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TRIGGER FUNCTION (auto insert system fields)
-- =========================================
CREATE OR REPLACE FUNCTION	insert_system_fields()
RETURNS TRIGGER AS $$
BEGIN
    new.created_by		= auth.uid();
    new.created_at		= now();
    new.updated_by		= auth.uid();
    new.updated_at		= now();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TABLE: boards
-- =========================================
CREATE TABLE IF NOT EXISTS	boards (
    id			    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title		    TEXT NOT NULL,
    description	    TEXT NOT NULL,

    created_by		UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at		TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by		UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at		TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS		trg_insert_system_fields ON boards;
CREATE TRIGGER			trg_insert_system_fields
BEFORE INSERT ON		boards
FOR EACH ROW
EXECUTE FUNCTION		insert_system_fields();

DROP TRIGGER IF EXISTS		trg_update_system_fields ON boards;
CREATE TRIGGER			trg_update_system_fields
BEFORE UPDATE ON		boards
FOR EACH ROW
EXECUTE FUNCTION		update_system_fields();

-- =========================================
-- TABLE: board_members
-- =========================================
CREATE TABLE IF NOT EXISTS	board_members (
    id				UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    board_id		UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id		UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    role			TEXT NOT NULL DEFAULT 'member',

    created_at		TIMESTAMPTZ DEFAULT now(),

    UNIQUE			(board_id, user_id)
);

-- =========================================
-- POLICIES: boards
-- =========================================
ALTER TABLE			boards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS	"board_select" ON boards;
CREATE POLICY		"board_select"
ON				boards
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = boards.id
        AND bm.user_id = auth.uid()
    )
    OR boards.created_by = auth.uid()
);

DROP POLICY IF EXISTS	"board_insert" ON boards;
CREATE POLICY		"board_insert"
ON				boards
FOR INSERT
WITH CHECK		(auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS	"board_update" ON boards;
CREATE POLICY		"board_update"
ON				boards
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = boards.id
        AND bm.user_id = auth.uid()
        AND bm.role = 'owner'
    )
);

DROP POLICY IF EXISTS	"board_delete" ON boards;
CREATE POLICY		"board_delete"
ON				boards
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = boards.id
        AND bm.user_id = auth.uid()
        AND bm.role = 'owner'
    )
);

-- =========================================
-- POLICIES: board_members
-- =========================================
ALTER TABLE			board_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION	is_board_member(_board_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM board_members
        WHERE board_id = _board_id
        AND user_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION	is_board_owner(_board_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM board_members
        WHERE board_id = _board_id
        AND user_id = auth.uid()
        AND role = 'owner'
    );
$$;

DROP POLICY IF EXISTS	"board_members_select" ON board_members;
CREATE POLICY		"board_members_select"
ON				board_members
FOR SELECT
USING (
    is_board_member(board_members.board_id)
);

DROP POLICY IF EXISTS	"board_members_delete" ON board_members;
CREATE POLICY		"board_members_delete"
ON				board_members
FOR DELETE
USING (
    is_board_owner(board_members.board_id)
);

-- =========================================
-- TRIGGER: setup_board
-- =========================================
CREATE OR REPLACE FUNCTION	setup_new_board()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO  board_members(board_id, user_id, role)
    VALUES			 (new.id, auth.uid(), 'owner');

    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_setup_board ON boards;
CREATE TRIGGER   trg_setup_board
AFTER INSERT ON	 boards
FOR EACH ROW
EXECUTE FUNCTION setup_new_board();


-- =========================================
-- TABLE: board_members rename constraints
-- =========================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'board_members_pkey') THEN
        ALTER TABLE board_members RENAME CONSTRAINT board_members_pkey TO PK_board_members_id;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'board_members_board_id_user_id_key') THEN
        ALTER TABLE board_members RENAME CONSTRAINT board_members_board_id_user_id_key TO UQ_board_members_board_id_user_id;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'board_members_board_id_fkey') THEN
        ALTER TABLE board_members RENAME CONSTRAINT board_members_board_id_fkey TO FK_board_members_boards_board_id;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'board_members_user_id_fkey') THEN
        ALTER TABLE board_members RENAME CONSTRAINT board_members_user_id_fkey TO FK_board_members_auth_users_user_id;
    END IF;
END $$;

-- =========================================
-- TABLE: boards rename constraints
-- =========================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'boards_pkey') THEN
        ALTER TABLE boards RENAME CONSTRAINT boards_pkey TO PK_boards_id;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'boards_created_by_fkey') THEN
        ALTER TABLE boards RENAME CONSTRAINT boards_created_by_fkey TO FK_boards_users_created_by;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'boards_updated_by_fkey') THEN
        ALTER TABLE boards RENAME CONSTRAINT boards_updated_by_fkey TO FK_boards_users_updated_by;
    END IF;
END $$;

-- =========================================
-- TABLE: board_columns
-- =========================================
CREATE TABLE IF NOT EXISTS board_columns (
    id				UUID DEFAULT gen_random_uuid(),
    board_id		UUID NOT NULL,
    title			TEXT NOT NULL,
    position        INT NOT NULL,

    created_by		UUID DEFAULT auth.uid(),
    created_at		TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by		UUID DEFAULT auth.uid(),
    updated_at		TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT      PK_board_columns_id PRIMARY KEY (id),
    CONSTRAINT      FK_board_columns_boards_board_id FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE,
    CONSTRAINT      FK_board_columns_users_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT      FK_board_columns_users_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS UQIDX_board_columns_board_position
ON board_columns (board_id, position);

-- =========================================
-- POLICIES: board_columns
-- =========================================

ALTER TABLE board_columns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "board_columns_select" ON board_columns;
CREATE POLICY "board_columns_select"
ON board_columns
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_columns.board_id
          AND bm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "board_columns_insert" ON board_columns;
CREATE POLICY "board_columns_insert"
ON board_columns
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_columns.board_id
          AND bm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "board_columns_update" ON board_columns;
CREATE POLICY "board_columns_update"
ON board_columns
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_columns.board_id
          AND bm.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_columns.board_id
          AND bm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "board_columns_delete" ON board_columns;
CREATE POLICY "board_columns_delete"
ON board_columns
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_columns.board_id
          AND bm.user_id = auth.uid()
    )
);

-- =========================================
-- TRIGGER: setup_board
-- =========================================
CREATE OR REPLACE FUNCTION	setup_new_board()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO  board_members(board_id, user_id, role)
    VALUES			 (new.id, auth.uid(), 'owner');

    INSERT INTO  public.board_columns(board_id, title, position)
    VALUES      (new.id, 'Tasks', 1),
                (new.id, 'In process', 2),
                (new.id, 'For testing', 3),
                (new.id, 'Completed', 4);

    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TABLE: board_tasks
-- =========================================
CREATE TABLE IF NOT EXISTS board_tasks (
    id				    UUID DEFAULT gen_random_uuid(),
    board_id		    UUID NOT NULL,
    board_column_id     UUID NOT NULL,
    title			    TEXT NOT NULL,
    description         TEXT,
    position            FLOAT8 NOT NULL,

    created_by		    UUID DEFAULT auth.uid(),
    created_at		    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by		    UUID DEFAULT auth.uid(),
    updated_at		    TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT          PK_board_tasks_id PRIMARY KEY (id),
    CONSTRAINT          FK_board_tasks_boards_board_id FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE,
    CONSTRAINT          FK_board_tasks_board_columns_board_columns_id FOREIGN KEY (board_column_id) REFERENCES public.board_columns(id) ON DELETE CASCADE,
    CONSTRAINT          FK_board_tasks_users_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT          FK_board_tasks_users_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS UQIDX_board_tasks_board_column_position
ON board_tasks (board_column_id, position);

-- =========================================
-- POLICIES: board_tasks
-- =========================================

ALTER TABLE board_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "board_tasks_select" ON board_tasks;
CREATE POLICY "board_tasks_select"
ON board_tasks
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_tasks.board_id
          AND bm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "board_tasks_insert" ON board_tasks;
CREATE POLICY "board_tasks_insert"
ON board_tasks
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_tasks.board_id
          AND bm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "board_tasks_update" ON board_tasks;
CREATE POLICY "board_tasks_update"
ON board_tasks
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_tasks.board_id
          AND bm.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_tasks.board_id
          AND bm.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "board_tasks_delete" ON board_tasks;
CREATE POLICY "board_tasks_delete"
ON board_tasks
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM board_members bm
        WHERE bm.board_id = board_tasks.board_id
          AND bm.user_id = auth.uid()
    )
);

-- =========================================
-- function: set_task_last_position
-- =========================================
CREATE OR REPLACE FUNCTION set_task_last_position()
RETURNS TRIGGER AS $$
BEGIN
  IF new.position IS NULL THEN
    SELECT COALESCE(MAX(position), 0) + 1000
    INTO new.position
    FROM board_tasks bt
    WHERE bt.board_column_id = new.board_column_id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS TRG_set_task_last_position ON board_tasks;
CREATE TRIGGER TRG_set_task_last_position
BEFORE INSERT ON board_tasks
FOR EACH ROW
EXECUTE FUNCTION set_task_last_position();

-- 1. Make sure the column exists (does nothing if it is already there)
alter table public.board_tasks
  add column if not exists updated_at timestamptz not null default now();

-- 2. Function that sets the current time
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3. Trigger before every update
drop trigger if exists board_tasks_set_updated_at on public.board_tasks;
create trigger board_tasks_set_updated_at
  before update on public.board_tasks
  for each row
  execute function public.set_updated_at();
