import { Injectable } from "@angular/core";
import { createClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class SupabaseService {
    public client = createClient(environment.supabaseUrl, environment.supabaseKey);
}
