import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { switchMap } from "rxjs";

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
    columnId: string | null = null;
    taskInfo: BoardTask | null = null;

    ngOnInit(): void {
        this.route.params
            .pipe(
                switchMap(params => {
                    return this.boardService.getBoard(params["id"]);
                })
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
            const newPos = getNewPosition(event.container.data, event.currentIndex);

            try {
                const res = await this.taskService.editTask(task.id, {
                    board_column_id: task.board_column_id,
                    position: newPos
                });
                event.container.data[event.currentIndex] = res;
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
            const taskId = event.container.data[event.currentIndex].id;
            const colCurr = event.container.id;
            const colPrev = event.previousContainer.id;
            const newPos = getNewPosition(event.container.data, event.currentIndex);

            try {
                const res = await this.taskService.editTask(taskId, {
                    board_column_id: colCurr,
                    position: newPos
                });
                event.container.data[event.currentIndex] = res;
            } catch {
                this.tasks[colCurr] = prevStateContainer;
                this.tasks[colPrev] = prevStatePreviousContainer;
            }
        }
    }

    onOpenCreateTask(columnId: string) {
        this.isTaskInfo = true;
        this.columnId = columnId;
    }

    onTaskCreated(task: BoardTask) {
        this.tasks[task.board_column_id].unshift(task);
    }

    onOpenTaskInfo(task: BoardTask) {
        this.isTaskInfo = true;
        this.taskInfo = task;
    }

    onTaskEdited(updatedTask: BoardTask) {
        const list = this.tasks[updatedTask.board_column_id];

        const index = list.findIndex(t => t.id === updatedTask.id);

        if (index !== -1) {
            list[index] = updatedTask;
        }
    }

    async onTaskDelete(task: BoardTask) {
        const res = confirm("Do you want to delete the task ?");
        if (!res) return;

        try {
            const id = task.id;
            const delTask = await this.taskService.deleteTask(id);

            const tasks = this.tasks[delTask.board_column_id].filter(t => t.id !== delTask.id);
            this.tasks[delTask.board_column_id] = tasks;
        } catch {}
    }

    onCloseTaskInfo() {
        this.isTaskInfo = false;
        this.columnId = null;
        this.taskInfo = null;
    }
}
