import { Component, EventEmitter, inject, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: "app-create-dashboard",
    imports: [ReactiveFormsModule],
    templateUrl: "./create-dashboard.component.html",
    styleUrl: "./create-dashboard.component.css",
})
export class CreateDashboardComponent {
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    private fb = inject(FormBuilder);

    createBoardForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
        description: [""],
    });

    onCreateBoard() {
        console.log(111);
        this.onClose();
    }
}
