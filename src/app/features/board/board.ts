import { Component } from "@angular/core";

@Component({
    selector: "app-board",
    imports: [],
    templateUrl: "./board.html",
    styleUrl: "./board.css",
})
export class Board {
    newTasks: any[] = [
        { title: "Login UI", description: "Create login page" },
        { title: "API Setup", description: "Setup backend auth" },
    ];

    inProgressTasks: any[] = [{ title: "Dashboard", description: "Build main dashboard" }];

    testingTasks: any[] = [{ title: "Bug Fix", description: "Fix login validation" }];

    doneTasks: any[] = [{ title: "Project Setup", description: "Initial setup done" }];
}
