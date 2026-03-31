import { Component } from "@angular/core";

@Component({
    selector: "app-board",
    imports: [],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.css",
})
export class BoardComponent {
    newTasks: any[] = [
        { title: "Login UI", description: "Create login page" },
        { title: "API Setup", description: "Setup backend auth" },
    ];

    inProgressTasks: any[] = [{ title: "Dashboard", description: "Build main dashboard" }];

    testingTasks: any[] = [{ title: "Bug Fix", description: "Fix login validation" }];

    doneTasks: any[] = [{ title: "Project Setup", description: "Initial setup done" }];
}
