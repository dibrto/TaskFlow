import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Board } from "@interfaces/board";
import { TaskService } from "@services/task/task.service";

@Component({
    selector: "app-task-info",
    imports: [ReactiveFormsModule],
    templateUrl: "./task-info.component.html",
    styleUrl: "./task-info.component.css"
})
export class TaskInfoComponent {
    @Output() close = new EventEmitter<void>();
    @Input() boardId: string | null = null;
    @Input() columnId: string | null = null;

    private fb = inject(FormBuilder);
    private taskService = inject(TaskService);

    taskForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
        description: [""]
    });

    onClose() {
        this.close.emit();
    }

    async onSave() {
        const data = this.taskForm.value;
        const req = {
            ...data,
            board_id: this.boardId,
            board_column_id: this.columnId
        };
        const newTask = await this.taskService.createTask(req);
        console.log(newTask);
    }
}
