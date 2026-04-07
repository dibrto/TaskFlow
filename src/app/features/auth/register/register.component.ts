import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthError } from "@supabase/supabase-js";
import { Toast, ToastrService } from "ngx-toastr";

import { AuthService } from "@services/auth/auth.service";
import passwordMatchValidator from "@validators/password-match.validator";

@Component({
    selector: "app-register",
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.css",
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private toast = inject(ToastrService);
    private router = inject(Router);

    registerForm: FormGroup = this.fb.group({
        username: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        passwords: this.fb.group(
            {
                password: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
                rePassword: ["", [Validators.required]],
            },
            { validators: passwordMatchValidator },
        ),
    });

    get passwordsGroup(): FormGroup {
        return this.registerForm.get("passwords") as FormGroup;
    }

    onRegister() {
        const formValue = this.registerForm.value;

        const regData = {
            username: formValue.username,
            email: formValue.email,
            password: formValue.passwords.password,
        };

        this.authService
            .register(regData)
            .then(() => {
                this.authService
                    .login({ email: regData.email, password: regData.password })
                    .then(() => this.router.navigate(["/dashboard"]))
                    .catch((err: AuthError) => this.toast.error(err.message));
            })
            .catch((err: AuthError) => this.toast.error(err.message));
    }
}
