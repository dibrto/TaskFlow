import { Component, EventEmitter, HostListener, inject, Input, OnChanges, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BoardTask } from "@interfaces/board-task";
import { TaskService } from "@services/task/task.service";

@Component({
    selector: "app-task-info",
    imports: [ReactiveFormsModule],
    templateUrl: "./task-info.component.html",
    styleUrl: "./task-info.component.css"
})
export class TaskInfoComponent implements OnChanges {
    @Output() close = new EventEmitter<void>();
    isClosing = false;
    private readonly animationDuration = 200;

    @Input() boardId: string | null = null;
    @Input() columnId: string | null = null;
    @Output() created = new EventEmitter<BoardTask>();

    @Input() taskInfo: BoardTask | null = null;
    @Output() edited = new EventEmitter<BoardTask>();

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

    onModalClick(event: Event){
        if (event.target === event.currentTarget)
            this.onClose();
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

    autoResize(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        const styles = getComputedStyle(textarea);

        textarea.style.height = 'auto'; // reset the height

        const borderHeight = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        const maxHeight = window.innerHeight * 0.65;

        textarea.style.height = `${Math.min(textarea.scrollHeight + borderHeight, maxHeight)}px`;
    }
}
