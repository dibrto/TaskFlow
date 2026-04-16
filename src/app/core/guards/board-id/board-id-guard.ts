import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { isValidUUID } from "@utils/uuid.util";

export const boardIdGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const id = route.paramMap.get("id");

    if (!id || !isValidUUID(id)) {
        return router.createUrlTree(["/dashboard"]);
    }

    return true;
};
