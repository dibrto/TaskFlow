import { inject, Injectable } from "@angular/core";
import { BoardTask, BoardTaskCreate, BoardTaskDetails, BoardTaskEdit } from "@interfaces/board-task";
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

    async getTask(taskId: string): Promise<BoardTaskDetails | null> {
        return this.api.execWithoutLoader(() =>
            this.supabase.client
                .from("board_tasks")
                .select("id, title, description, updated_at")
                .eq("id", taskId)
                .maybeSingle()
        );
    }

    async editTask(taskId: string, req: BoardTaskEdit): Promise<BoardTask> {
        return this.api.execWithoutLoader(() =>
            this.supabase.client
                .from("board_tasks")
                .update({ ...req })
                .eq("id", taskId)
                .select("id, title, description, board_column_id, position")
                .single()
        );
    }

    // renumbers the tasks of one column; taskIds are in display order, first = top
    async setColumnOrder(taskIds: string[]): Promise<void> {
        return this.api.execWithoutLoader(() =>
            this.supabase.client.rpc("set_column_task_order", { p_task_ids: taskIds })
        );
    }

    async deleteTask(taskId: string): Promise<BoardTask | null> {
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
