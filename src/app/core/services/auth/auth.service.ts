import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "@services/supabase/supabase.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private supabase = inject(SupabaseService);

    register() {
        return this.supabase.client.auth.signUp({
            email: "daniel.bratov@gmail.com",
            password: "dibr2005",
        });
    }
}
