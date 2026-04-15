export interface Board {
    id: string;
    title: string;
    description: string;
}

export interface BoardCreate {
    title: string;
    description: string;
}

export interface BoardMember {
    user_id: string;
    role: string;
}

export interface BoardColumn {
    id: string;
    title: string;
    position: number;
}

export interface BoardTask {
    id: string;
    title: string;
    description: string;
    board_column_id: string;
    position: number;
}

export interface BoardTaskCreate {
    board_id: string;
    board_column_id: string;
    title: string;
    description: string;
}

export interface BoardTaskEdit {
    title?: string;
    description?: string;
    board_column_id?: string;
    position?: number;
}

export interface BoardGet {
    id: string;
    title: string;
    description: string;
    board_members: BoardMember[];
    board_columns: BoardColumn[];
    board_tasks: BoardTask[];
}
