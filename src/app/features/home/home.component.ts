import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatMenuModule } from "@angular/material/menu";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule, MatTooltip, DragDropModule, MatMenuModule],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent {
    tasks = [
        { id: 1, title: "Design landing page", description: false },
        { id: 1, title: "Prepare backlog", description: true },
        { id: 1, title: "Invite team", description: false }
    ];

    drop(event: CdkDragDrop<any[]>) {
        moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    }
}
