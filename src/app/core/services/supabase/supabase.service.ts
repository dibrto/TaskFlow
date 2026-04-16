import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { createClient } from "@supabase/supabase-js";

@Injectable({
    providedIn: "root"
})
export class SupabaseService {
    public client = createClient(environment.supabaseUrl, environment.supabaseKey);
}
