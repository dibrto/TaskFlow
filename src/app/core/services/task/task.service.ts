import { inject, Injectable } from "@angular/core";
import { BoardTask, BoardTaskCreate } from "@interfaces/board";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root"
})
export class TaskService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);

    async createTask(req: BoardTaskCreate): Promise<BoardTask> {
        return this.api.exec(() =>
            this.supabase.client
                .from("board_tasks")
                .insert({ ...req })
                .select()
                .single()
        );
    }
}
