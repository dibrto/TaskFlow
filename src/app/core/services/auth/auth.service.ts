import { computed, inject, Injectable, signal } from "@angular/core";
import { UserLogin, UserRegister } from "@interfaces/user";
import { User } from "@supabase/supabase-js";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";
import { BoardService } from "@services/board/board.service";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);
    private boardService = inject(BoardService);

    user = signal<User | null>(null);
    isAuthenticated = computed(() => !!this.user());

    constructor() {
        // sync login/logout
        this.supabase.client.auth.onAuthStateChange((event, session) => {
            this.user.set(session?.user ?? null);
        });
    }

    async loadInitialUser() {
        const { data } = await this.supabase.client.auth.getSession();
        this.user.set(data.session?.user ?? null);
    }

    register({ email, password, username }: UserRegister) {
        const req = {
            email,
            password,
            options: {
                data: {
                    display_name: username
                }
            }
        };

        return this.api.exec(() => this.supabase.client.auth.signUp(req));
    }

    login({ email, password }: UserLogin) {
        const req = { email, password };
        return this.api.exec(() => this.supabase.client.auth.signInWithPassword(req));
    }

    async logout() {
        try {
            await this.api.exec(() => this.supabase.client.auth.signOut());
            this.boardService.clearBoards();
        } catch {}
    }
}
