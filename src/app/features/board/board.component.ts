import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { catchError, EMPTY, from, switchMap } from "rxjs";

import { Board, BoardColumn, BoardMember } from "@interfaces/board";
import { BoardService } from "@services/board/board.service";
import { TaskInfoComponent } from "./task-info/task-info.component";
import { TaskService } from "@services/task/task.service";
import getNewPosition from "@utils/position.helper";
import { EditBoardComponent } from "./edit-board/edit-board.component";
import { BoardTask } from "@interfaces/board-task";
@Component({
    selector: "app-board",
    imports: [TaskInfoComponent, MatMenuModule, MatIconModule, DragDropModule, EditBoardComponent, MatTooltipModule],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.css"
})
export class BoardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private boardService = inject(BoardService);
    private taskService = inject(TaskService);
    private router = inject(Router);

    isEditBoard: boolean = false;

    connectedLists: string[] = [];

    board: Board | null = null;
    members: BoardMember[] = [];
    columns: BoardColumn[] = [];
    tasks: Record<string, BoardTask[]> = {};

    isTaskInfo: boolean = false;
    column: BoardColumn | null = null;
    taskInfo: BoardTask | null = null;

    ngOnInit(): void {
        this.route.params
            .pipe(
                // catch per request so a failed load does not end the stream and the next board still loads
                switchMap(params => from(this.boardService.getBoard(params["id"])).pipe(catchError(() => EMPTY)))
            )
            .subscribe(data => {
                if (!data) {
                    this.router.navigate(["/dashboard"]);
                    return;
                }

                const { board_columns, board_tasks, board_members, ...board } = data;

                this.board = board;
                this.members = board_members;
                this.columns = board_columns;
                this.connectedLists = this.columns.map(c => c.id.toString());

                for (const column of this.columns) {
                    this.tasks[column.id] = [];
                }

                for (const task of board_tasks) {
                    this.tasks[task.board_column_id].push(task);
                }
            });
    }

    onToggleEditBoard(): void {
        this.isEditBoard = !this.isEditBoard;
    }
    onBoardEdited(updBoard: Board) {
        this.board = updBoard;
    }
    async onBoardDelete() {
        if (!this.board) return;

        const res = confirm("Do you want to delete the board ?");
        if (!res) return;

        try {
            const id = this.board.id;
            await this.boardService.deleteBoard(id);
            this.router.navigate(["/dashboard"]);
        } catch {}
    }

    async drop(event: CdkDragDrop<BoardTask[]>) {
        // same col
        if (event.previousContainer === event.container) {
            const prevState = [...event.container.data];

            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            const task = event.container.data[event.currentIndex];

            try {
                await this.saveTaskPosition(event.container.data, event.currentIndex, task.board_column_id);
            } catch {
                this.tasks[task.board_column_id] = prevState;
            }
        }
        // diff col
        else {
            const prevStateContainer = [...event.container.data];
            const prevStatePreviousContainer = [...event.previousContainer.data];

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            const colCurr = event.container.id;
            const colPrev = event.previousContainer.id;

            try {
                await this.saveTaskPosition(event.container.data, event.currentIndex, colCurr);
            } catch {
                this.tasks[colCurr] = prevStateContainer;
                this.tasks[colPrev] = prevStatePreviousContainer;
            }
        }
    }

    // saves the moved task; when there is no room left between its neighbours, renumbers the whole column
    private async saveTaskPosition(list: BoardTask[], index: number, columnId: string) {
        const task = list[index];
        const newPos = getNewPosition(list, index);

        list[index] = await this.taskService.editTask(task.id, {
            board_column_id: columnId,
            position: newPos ?? task.position
        });

        if (newPos === null) {
            await this.taskService.setColumnOrder(list.map(t => t.id));
            // same numbering as set_column_task_order in the database
            list.forEach((t, i) => (t.position = (list.length - i) * 1000));
        }
    }

    onOpenCreateTask(column: BoardColumn) {
        this.isTaskInfo = true;
        this.column = column;
    }

    onTaskCreated(task: BoardTask) {
        this.tasks[task.board_column_id].unshift(task);
    }

    onOpenTaskInfo(task: BoardTask, column: BoardColumn) {
        this.isTaskInfo = true;
        this.column = column;
        this.taskInfo = task;
    }

    onTaskEdited(updatedTask: BoardTask) {
        const list = this.tasks[updatedTask.board_column_id];

        const index = list.findIndex(t => t.id === updatedTask.id);

        if (index !== -1) {
            list[index] = updatedTask;
        }
    }

    onTaskDeleted(deletedTask: BoardTask) {
        this.tasks[deletedTask.board_column_id] = this.tasks[deletedTask.board_column_id].filter(
            task => task.id !== deletedTask.id
        );
    }

    onCloseTaskInfo() {
        this.isTaskInfo = false;
        this.column = null;
        this.taskInfo = null;
    }
}
