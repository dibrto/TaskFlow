import { Component } from "@angular/core";

@Component({
    selector: "app-dashboard",
    imports: [],
    templateUrl: "./dashboard.html",
    styleUrl: "./dashboard.css",
})
export class Dashboard {
    boards: any[] = [
        { title: "Project Alpha", tasks: 12 },
        { title: "Website Redesign", tasks: 8 },
        { title: "Marketing Tasks", tasks: 5 },
        { title: "Personal Tasks", tasks: 7 },
    ];
}
