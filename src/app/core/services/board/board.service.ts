import { inject, Injectable } from "@angular/core";
import { BoardGet } from "@interfaces/board";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root"
})
export class BoardService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);

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
                    )`
                )
                .eq("id", id)
                .single()
        );
    }
}
