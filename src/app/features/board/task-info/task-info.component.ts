import { Component, ElementRef, EventEmitter, HostListener, inject, Input, LOCALE_ID, OnInit, Output, signal, ViewChild } from "@angular/core";
import { formatDate } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BoardTask, BoardTaskDetails } from "@interfaces/board-task";
import { TaskService } from "@services/task/task.service";
import { MatIcon } from "@angular/material/icon";
import { BoardColumn } from "@interfaces/board";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-task-info",
    imports: [ReactiveFormsModule, MatIcon],
    templateUrl: "./task-info.component.html",
    styleUrl: "./task-info.component.css"
})
export class TaskInfoComponent implements OnInit {
    @Output() close = new EventEmitter<void>();
    isClosing = false;
    private readonly animationDuration = 200;
    private mouseDownTarget: EventTarget | null = null;
    @ViewChild("description") description!: ElementRef<HTMLTextAreaElement>;

    @Input() taskId: string | null = null;
    @Input() boardId: string | null = null;
    @Input() column: BoardColumn | null = null;
    @Output() created = new EventEmitter<BoardTask>();

    @Output() edited = new EventEmitter<BoardTask>();
    @Output() deleted = new EventEmitter<BoardTask>();

    private fb = inject(FormBuilder);
    private taskService = inject(TaskService);
    private locale = inject(LOCALE_ID);
    private toast = inject(ToastrService);

    taskInfo: BoardTaskDetails | null = null;
    readonly isLoading = signal(false);
    readonly isSaving = signal(false);

    taskForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
        description: [""]
    });

    get isEdit() {
        return !!this.taskId;
    }

    get lastUpdatedLabel(): string {
        if (!this.taskInfo?.updated_at) {
            return "";
        }

        const updated = new Date(this.taskInfo.updated_at);
        const time = formatDate(updated, "HH:mm", this.locale);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfUpdated = new Date(updated);
        startOfUpdated.setHours(0, 0, 0, 0);

        const dayDiff = Math.round((startOfToday.getTime() - startOfUpdated.getTime()) / 86_400_000);

        if (dayDiff === 0) {
            return `today at ${time}`;
        }

        if (dayDiff === 1) {
            return `yesterday at ${time}`;
        }

        const sameYear = updated.getFullYear() === new Date().getFullYear();
        const date = formatDate(updated, sameYear ? "MMM d" : "MMM d, y", this.locale);

        return `on ${date} at ${time}`;
    }

    async ngOnInit() {
        if (!this.taskId){
            return;
        }

        this.isLoading.set(true);

        try {
            const task = await this.taskService.getTask(this.taskId);

            if (!task) {
                this.toast.error("This task no longer exists");
                this.onClose();
                return;
            }

            this.taskInfo = task;

            this.taskForm.patchValue({
                title: this.taskInfo.title,
                description: this.taskInfo.description,
            });

            this.autoResize(this.description.nativeElement);
        } catch {
            // the error toast is shown by ApiService
            this.onClose();
        } finally {
            this.isLoading.set(false);
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
        await this.save(async () => {
            const data = this.taskForm.value;
            const req = {
                ...data,
                board_id: this.boardId,
                board_column_id: this.column?.id
            };
            const newTask = await this.taskService.createTask(req);
            this.created.emit(newTask);
        });
    }

    async onEdit() {
        await this.save(async () => {
            const data = this.taskForm.value;
            const id = this.taskInfo?.id ?? "";
            const updTask = await this.taskService.editTask(id, data);
            this.edited.emit(updTask);
        });
    }

    async onDelete() {
        if (!this.taskInfo || !confirm("Do you want to delete the task ?")) {
            return;
        }

        const id = this.taskInfo.id;

        await this.save(async () => {
            const deletedTask = await this.taskService.deleteTask(id);
            if (deletedTask) {
                this.deleted.emit(deletedTask);
            }
        });
    }

    // runs one request at a time and closes the modal only on success
    private async save(action: () => Promise<void>) {
        if (this.isSaving()) {
            return;
        }

        this.isSaving.set(true);

        try {
            await action();
            this.onClose();
        } catch {
            // the error toast is shown by ApiService; the modal stays open so nothing typed is lost
        } finally {
            this.isSaving.set(false);
        }
    }

    autoResize(textarea: HTMLTextAreaElement): void {
        const styles = getComputedStyle(textarea);

        textarea.style.height = 'auto'; // reset the height

        const borderHeight = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
        const maxHeight = window.innerHeight * 0.49;

        textarea.style.height = `${Math.min(textarea.scrollHeight + borderHeight, maxHeight)}px`;
    }
}
