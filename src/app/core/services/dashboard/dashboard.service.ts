import { inject, Injectable } from "@angular/core";
import { Board } from "@interfaces/board";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);

    async getBoards(): Promise<Board[]> {
        return this.api.exec<Board[]>(() => this.supabase.client.from("boards").select("id, title, description"));
    }

    async createBoard() {
        console.log(111);
    }
}
