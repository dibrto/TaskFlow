import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthError } from "@supabase/supabase-js";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "@services/auth/auth.service";

@Component({
    selector: "app-login",
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent {
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private toast = inject(ToastrService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
    });

    onLogin() {
        const formValue = this.loginForm.value;
        this.authService
            .login(formValue)
            .then(() => this.router.navigate(["/dashboard"]))
            .catch((err: AuthError) => this.toast.error(err.message));
    }
}
