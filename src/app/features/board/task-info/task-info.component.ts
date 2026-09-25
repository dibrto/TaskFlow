import { Component, EventEmitter, HostListener, inject, Input, OnChanges, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BoardTask } from "@interfaces/board-task";
import { TaskService } from "@services/task/task.service";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: "app-task-info",
    imports: [ReactiveFormsModule, MatIcon],
    templateUrl: "./task-info.component.html",
    styleUrl: "./task-info.component.css"
})
export class TaskInfoComponent implements OnChanges {
    @Output() close = new EventEmitter<void>();
    isClosing = false;
    private readonly animationDuration = 200;
    private mouseDownTarget: EventTarget | null = null;

    @Input() boardId: string | null = null;
    @Input() columnId: string | null = null;
    @Output() created = new EventEmitter<BoardTask>();

    @Input() taskInfo: BoardTask | null = null;
    @Output() edited = new EventEmitter<BoardTask>();
    @Output() deleted = new EventEmitter<BoardTask>();

    private fb = inject(FormBuilder);
    private taskService = inject(TaskService);

    taskForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
        description: [""]
    });

    get isTaskInfo() {
        return !!this.taskInfo;
    }

    ngOnChanges() {
        if (this.taskInfo) {
            this.taskForm.patchValue(this.taskInfo);
        }
    }

   onClose(): void {
        if (this.isClosing) {
            return;
        }

        this.isClosing = true;

        setTimeout(() => {
            this.close.emit();
        }, this.animationDuration);
    }

    onMouseDown(event: MouseEvent) {
        this.mouseDownTarget = event.target;
    }

    onMouseUp(event: MouseEvent) {
        const startedOnBackdrop = this.mouseDownTarget === event.currentTarget;
        const endedOnBackdrop = event.target === event.currentTarget;

        if (startedOnBackdrop && endedOnBackdrop)
            this.onClose();

        this.mouseDownTarget = null;
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        this.onClose();
    }

    async onCreate() {
        const data = this.taskForm.value;
        const req = {
            ...data,
            board_id: this.boardId,
            board_column_id: this.columnId
        };
        const newTask = await this.taskService.createTask(req);
        this.created.emit(newTask);
        this.onClose();
    }

    async onEdit() {
        const data = this.taskForm.value;
        const id = this.taskInfo?.id ?? "";
        const updTask = await this.taskService.editTask(id, data);
        this.edited.emit(updTask);
        this.onClose();
    }

    async onDelete() {
        if (!this.taskInfo || !confirm("Do you want to delete the task ?")) {
            return;
        }

        const deletedTask = await this.taskService.deleteTask(this.taskInfo.id);
        this.deleted.emit(deletedTask);
        this.onClose();
    }

    autoResize(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        const styles = getComputedStyle(textarea);

        textarea.style.height = 'auto'; // reset the height

        const borderHeight = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        const maxHeight = window.innerHeight * 0.49;

        textarea.style.height = `${Math.min(textarea.scrollHeight + borderHeight, maxHeight)}px`;
    }
}
