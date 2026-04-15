import { AsyncPipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from "@angular/router";
import { AuthService } from "@services/auth/auth.service";
import { BoardService } from "@services/board/board.service";

@Component({
    selector: "app-main-layout",
    imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, AsyncPipe, MatIconModule],
    templateUrl: "./main-layout.component.html",
    styleUrl: "./main-layout.component.css"
})
export class MainLayoutComponent implements OnInit {
    private authService = inject(AuthService);
    private boardService = inject(BoardService);
    private router = inject(Router);

    boards$ = this.boardService.boards$;
    showBoards: boolean = true;

    ngOnInit(): void {
        this.boardService.loadBoards();
    }

    onToggleShowBoards() {
        this.showBoards = !this.showBoards;
    }

    async onLogout() {
        await this.authService.logout();
        this.router.navigate(["/login"]);
    }
}
