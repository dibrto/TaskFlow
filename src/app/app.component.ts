import { Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "@services/auth/auth.service";
import { LoaderComponent } from "./shared/components/loader/loader.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, LoaderComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    private authService = inject(AuthService);
}
