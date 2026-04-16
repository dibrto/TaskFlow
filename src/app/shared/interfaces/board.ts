import { BoardTask } from "@interfaces/board-task";

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

export interface BoardGet {
    id: string;
    title: string;
    description: string;
    board_members: BoardMember[];
    board_columns: BoardColumn[];
    board_tasks: BoardTask[];
}
