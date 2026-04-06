import { inject, Injectable } from "@angular/core";
import { UserLogin, UserRegister } from "@interfaces/user";
import { ApiService } from "@services/api/api.service";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private supabase = inject(SupabaseService);
    private api = inject(ApiService);

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
