import { Component, inject } from "@angular/core";
import { Board } from "@interfaces/board";
import { BoardService } from "@services/board/board.service";
import { CreateDashboardComponent } from "./create-dashboard/create-dashboard.component";
import { Router } from "@angular/router";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-dashboard",
    imports: [CreateDashboardComponent, AsyncPipe],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.css"
})
export class DashboardComponent {
    private boardService = inject(BoardService);
    private router = inject(Router);

    boards$ = this.boardService.boards$;
    isModalCreateBoard: boolean = false;

    onOpenModal() {
        this.isModalCreateBoard = true;
    }

    onCloseModal() {
        this.isModalCreateBoard = false;
    }

    onBoardClick(board: Board) {
        this.router.navigate(["/board/" + board.id]);
    }
}
