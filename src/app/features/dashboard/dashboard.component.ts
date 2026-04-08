import { Component, inject, OnInit } from "@angular/core";
import { Board } from "@interfaces/board";
import { DashboardService } from "@services/dashboard/dashboard.service";
import { CreateDashboardComponent } from "./create-dashboard/create-dashboard.component";
import { Router } from "@angular/router";

@Component({
    selector: "app-dashboard",
    imports: [CreateDashboardComponent],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
    private dashboardService = inject(DashboardService);
    private router = inject(Router);

    boards: Board[] = [];
    isModalCreateBoard: boolean = false;

    async ngOnInit() {
        this.boards = await this.dashboardService.getBoards();
    }

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
