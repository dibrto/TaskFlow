import { Component, EventEmitter, inject, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BoardService } from "@services/board/board.service";

@Component({
    selector: "app-create-dashboard",
    imports: [ReactiveFormsModule],
    templateUrl: "./create-dashboard.component.html",
    styleUrl: "./create-dashboard.component.css"
})
export class CreateDashboardComponent {
    @Output() close = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private boardService = inject(BoardService);
    private router = inject(Router);

    createBoardForm: FormGroup = this.fb.group({
        title: ["", [Validators.required]],
        description: [""]
    });

    onClose() {
        this.close.emit();
    }

    async onCreateBoard() {
        const newBoard = await this.boardService.createBoard(this.createBoardForm.value);
        this.router.navigate(["/board/" + newBoard.id]);
    }
}
