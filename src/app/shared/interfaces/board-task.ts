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
