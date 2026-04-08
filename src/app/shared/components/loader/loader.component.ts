import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LoaderService } from "@services/loader/loader.service";

@Component({
    selector: "app-loader",
    imports: [AsyncPipe],
    templateUrl: "./loader.component.html",
    styleUrl: "./loader.component.css",
})
export class LoaderComponent {
    private loader = inject(LoaderService);
    loading$ = this.loader.loading$;
}
