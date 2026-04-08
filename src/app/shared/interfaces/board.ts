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

export interface BoardGet {
    id: string;
    title: string;
    description: string;
    board_members: BoardMember[];
}
