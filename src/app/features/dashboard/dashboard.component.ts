import { Component, inject, OnInit } from "@angular/core";
import { Board } from "@interfaces/board";
import { DashboardService } from "@services/dashboard/dashboard.service";

@Component({
    selector: "app-dashboard",
    imports: [],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
    private DashboardService = inject(DashboardService);

    boards: Board[] = [];

    async ngOnInit() {
        this.boards = await this.DashboardService.getBoards();
    }
}
