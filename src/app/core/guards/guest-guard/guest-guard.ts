import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/auth/auth.service";

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
        router.navigate(["/dashboard"]);
        return false;
    }

    return true;
};
