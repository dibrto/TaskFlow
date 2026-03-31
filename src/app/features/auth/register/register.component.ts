import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "@services/auth/auth.service";

@Component({
    selector: "app-register",
    imports: [RouterLink, FormsModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.css",
})
export class RegisterComponent {
    private authService = inject(AuthService);

    onRegister() {
        this.authService.register();
    }
}
