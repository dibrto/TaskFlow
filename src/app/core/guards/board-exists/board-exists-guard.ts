import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { BoardService } from "@services/board/board.service";
import { map } from "rxjs";

export const boardExistsGuard: CanActivateFn = (route, state) => {
    const boardService = inject(BoardService);
    const router = inject(Router);

    const id = route.paramMap.get("id");

    if (!id) {
        return router.createUrlTree(["/dashboard"]);
    }

    return boardService.boards$.pipe(
        map(boards => {
            const exists = boards.some(board => board.id === id);

            return exists ? true : router.createUrlTree(["/dashboard"]);
        })
    );
};
