import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Board, BoardColumn, BoardMember, BoardTask } from "@interfaces/board";
import { BoardService } from "@services/board/board.service";
import { TaskInfoComponent } from "./task-info/task-info.component";

@Component({
    selector: "app-board",
    imports: [TaskInfoComponent],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.css"
})
export class BoardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private boardService = inject(BoardService);

    private boardId: string = "";
    board: Board | null = null;
    members: BoardMember[] = [];
    columns: BoardColumn[] = [];
    tasks: Record<string, BoardTask[]> = {};

    isCreateTask: boolean = false;
    columnId: string | null = null;

    async ngOnInit(): Promise<void> {
        this.boardId = this.route.snapshot.params["id"];
        const { board_columns, board_tasks, board_members, ...board } = await this.boardService.getBoard(this.boardId);

        this.board = board;
        this.members = board_members;
        this.columns = board_columns;

        for (const task of board_tasks) {
            if (!this.tasks[task.board_column_id]) {
                this.tasks[task.board_column_id] = [];
            }

            this.tasks[task.board_column_id].push(task);
        }
    }

    onOpenCreateTask(columnId: string) {
        this.isCreateTask = true;
        this.columnId = columnId;
    }

    onCloseCreateTask() {
        this.isCreateTask = false;
    }
}
