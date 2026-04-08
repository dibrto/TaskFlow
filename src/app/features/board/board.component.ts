import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Board, BoardMember } from "@interfaces/board";
import { BoardService } from "@services/board/board.service";

@Component({
    selector: "app-board",
    imports: [],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.css"
})
export class BoardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private boardService = inject(BoardService);

    private boardId: string = "";
    board: Board | null = null;
    members: BoardMember[] = [];

    async ngOnInit(): Promise<void> {
        this.boardId = this.route.snapshot.params["id"];
        const { board_members, ...board } = await this.boardService.getBoard(this.boardId);

        this.board = board;
        this.members = board_members;
    }

    newTasks: any[] = [
        { title: "Login UI", description: "Create login page" },
        { title: "API Setup", description: "Setup backend auth" }
    ];

    inProgressTasks: any[] = [{ title: "Dashboard", description: "Build main dashboard" }];

    testingTasks: any[] = [{ title: "Bug Fix", description: "Fix login validation" }];

    doneTasks: any[] = [{ title: "Project Setup", description: "Initial setup done" }];
}
