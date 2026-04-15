import { inject, Injectable } from "@angular/core";
import { Board, BoardTask, BoardTaskCreate, BoardTaskEdit } from "@interfaces/board";
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
                .select("id, title, description, board_column_id, position")
                .single()
        );
    }

    async editTask(taskId: string, req: BoardTaskEdit): Promise<BoardTask> {
        return this.api.exec(() =>
            this.supabase.client
                .from("board_tasks")
                .update({ ...req })
                .eq("id", taskId)
                .select("id, title, description, board_column_id, position")
                .single()
        );
    }

    async deleteTask(taskId: string): Promise<BoardTask> {
        return this.api.exec(() =>
            this.supabase.client
                .from("board_tasks")
                .delete()
                .eq("id", taskId)
                .select("id, title, description, board_column_id, position")
                .maybeSingle()
        );
    }
}
