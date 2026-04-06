import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideToastr } from "ngx-toastr";
import { routes } from "./app.routes";
import { AuthService } from "@services/auth/auth.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideToastr(),

        provideAppInitializer(() => {
            const auth = inject(AuthService);
            return auth.loadInitialUser();
        }),
    ],
};
