import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: "app-create-dashboard",
    imports: [ReactiveFormsModule],
    templateUrl: "./create-dashboard.component.html",
    styleUrl: "./create-dashboard.component.css",
})
export class CreateDashboardComponent {
    private fb = inject(FormBuilder);

    createBoardForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
    });

    onCreateBoard() {
        console.log(111);
    }
}
