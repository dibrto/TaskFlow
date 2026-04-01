import { inject, Injectable } from "@angular/core";
import { UserRegister } from "@interfaces/user";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private supabase = inject(SupabaseService);

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

        return this.supabase.client.auth.signUp(req);
    }
}
