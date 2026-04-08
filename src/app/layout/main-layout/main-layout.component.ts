import { Component, inject } from "@angular/core";
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthError } from "@supabase/supabase-js";
import { AuthService } from "@services/auth/auth.service";

@Component({
    selector: "app-main-layout",
    imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
    templateUrl: "./main-layout.component.html",
    styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private toast = inject(ToastrService);

    onLogout() {
        this.authService
            .logout()
            .then(() => this.router.navigate(["/login"]))
            .catch((err: AuthError) => this.toast.error(err.message));
    }
}
