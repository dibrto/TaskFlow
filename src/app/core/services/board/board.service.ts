import { inject, Injectable } from "@angular/core";
import { Board, BoardCreate, BoardGet } from "@interfaces/board";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class BoardService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);

    private boardsSubject = new BehaviorSubject<Board[]>([]);
    boards$ = this.boardsSubject.asObservable();

    async getBoards(): Promise<Board[]> {
        return this.api.exec<Board[]>(() =>
            this.supabase.client.from("boards").select("id, title, description").order("created_at")
        );
    }

    async loadBoards(): Promise<void> {
        if (this.boardsSubject.value.length) return;

        this.boardsSubject.next(await this.getBoards());
    }

    clearBoards(): void {
        this.boardsSubject.next([]);
    }

    async createBoard(req: BoardCreate): Promise<Board> {
        const newBoard = await this.api.exec<Board>(() =>
            this.supabase.client
                .from("boards")
                .insert({ ...req })
                .select("id, title, description")
                .single()
        );

        const current = this.boardsSubject.value;
        this.boardsSubject.next([...current, newBoard]);

        return newBoard;
    }

    async getBoard(id: string): Promise<BoardGet> {
        return this.api.exec(() =>
            this.supabase.client
                .from("boards")
                .select(
                    `id,
                    title,
                    description,
                    board_members (
                        user_id,
                        role
                    ),
                    board_columns(
                        id,
                        title
                    ),
                    board_tasks(
                        id,
                        title,
                        description,
                        board_column_id,
                        position
                    )`
                )
                .eq("id", id)
                .order("board_column_id", { referencedTable: "board_tasks" })
                .order("position", { referencedTable: "board_tasks", ascending: false })
                .single()
        );
    }

    async editBoard({ id, ...req }: Board): Promise<Board> {
        const updBoard = await this.api.exec<Board>(() =>
            this.supabase.client
                .from("boards")
                .update({ ...req })
                .eq("id", id)
                .select("id, title, description")
                .single()
        );

        const current = this.boardsSubject.value;
        const updated = current.map(b => (b.id === updBoard.id ? updBoard : b));
        this.boardsSubject.next(updated);

        return updBoard;
    }

    async deleteBoard(id: string): Promise<void> {
        const delBoard = await this.api.exec<Board>(() =>
            this.supabase.client.from("boards").delete().eq("id", id).select("id, title, description").single()
        );

        const current = this.boardsSubject.value;
        const updated = current.filter(b => b.id !== delBoard.id);
        this.boardsSubject.next(updated);
    }
}
