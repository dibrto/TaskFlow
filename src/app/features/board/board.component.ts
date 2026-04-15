import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { switchMap } from "rxjs";

import { Board, BoardColumn, BoardMember, BoardTask } from "@interfaces/board";
import { BoardService } from "@services/board/board.service";
import { TaskInfoComponent } from "./task-info/task-info.component";
import { TaskService } from "@services/task/task.service";
import getNewPosition from "@utils/position.helper";
@Component({
    selector: "app-board",
    imports: [TaskInfoComponent, MatMenuModule, MatIconModule, DragDropModule],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.css"
})
export class BoardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private boardService = inject(BoardService);
    private taskService = inject(TaskService);

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
                const { board_columns, board_tasks, board_members, ...board } = data;

                this.board = board;
                this.members = board_members;
                this.columns = board_columns;
                this.connectedLists = this.columns.map(c => "col-" + c.id);

                for (const column of this.columns) {
                    this.tasks[column.id] = [];
                }

                for (const task of board_tasks) {
                    this.tasks[task.board_column_id].push(task);
                }
            });
    }

    async drop(event: CdkDragDrop<BoardTask[]>) {
        if (event.previousContainer === event.container) {
            const prevState = [...event.container.data];
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            const newPos = getNewPosition(event.container.data, event.currentIndex);
            const task = event.container.data[event.currentIndex];

            try {
                const res = await this.taskService.editTask(task.id, {
                    board_column_id: task.board_column_id,
                    position: newPos
                });
                event.container.data[event.currentIndex] = res;
            } catch {
                this.tasks[task.board_column_id] = prevState;
            }
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
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
