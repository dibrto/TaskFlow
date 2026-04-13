import { Component, EventEmitter, inject, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: "app-task-info",
    imports: [ReactiveFormsModule],
    templateUrl: "./task-info.component.html",
    styleUrl: "./task-info.component.css"
})
export class TaskInfoComponent {
    @Output() close = new EventEmitter<void>();

    private fb = inject(FormBuilder);

    taskForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
        description: [""]
    });

    onClose() {
        this.close.emit();
    }

    async onCreateTask() {}
}
