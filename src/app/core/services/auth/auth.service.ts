import { computed, inject, Injectable, signal } from "@angular/core";
import { UserLogin, UserRegister } from "@interfaces/user";
import { User } from "@supabase/supabase-js";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);

    user = signal<User | null>(null);
    isAuthenticated = computed(() => !!this.user());

    constructor() {
        // sync login/logout
        this.supabase.client.auth.onAuthStateChange((event, session) => {
            this.user.set(session?.user ?? null);
        });

        // after refresh
        this.loadInitialUser();
    }

    private async loadInitialUser() {
        const { data } = await this.supabase.client.auth.getSession();
        this.user.set(data.session?.user ?? null);
    }

    register({ email, password, username }: UserRegister) {
        const req = {
            email,
            password,
            options: {
                data: {
                    display_name: username,
                },
            },
        };

        return this.api.handleResponse(this.supabase.client.auth.signUp(req));
    }

    login(req: UserLogin) {
        return this.api.handleResponse(this.supabase.client.auth.signInWithPassword(req));
    }
}
