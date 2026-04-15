import { Component, EventEmitter, inject, Input, OnChanges, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Board } from "@interfaces/board";
import { BoardService } from "@services/board/board.service";

@Component({
    selector: "app-edit-board",
    imports: [ReactiveFormsModule],
    templateUrl: "./edit-board.component.html",
    styleUrl: "./edit-board.component.css"
})
export class EditBoardComponent implements OnChanges {
    @Output() close = new EventEmitter<void>();
    @Output() edited = new EventEmitter<Board>();

    @Input() boardInfo: Board | null = null;

    private fb = inject(FormBuilder);
    private boardService = inject(BoardService);

    boardForm: FormGroup = this.fb.group({
        id: [""],
        title: ["", [Validators.required]],
        description: [""]
    });

    ngOnChanges() {
        if (this.boardInfo) {
            this.boardForm.patchValue(this.boardInfo);
        }
    }

    async onEdit() {
        const data = this.boardForm.value;
        try {
            const updBoard = await this.boardService.editBoard(data);
            this.edited.emit(updBoard);
            this.close.emit();
        } catch {}
    }
}
