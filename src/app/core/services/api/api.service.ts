import { inject, Injectable } from "@angular/core";
import { LoaderService } from "@services/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    async handleResponse<T = any>(promise: Promise<any>): Promise<T> {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }

        const res = await promise;

        if (res?.error) throw res.error;
        // if (!res || !("data" in res)) throw new Error("Invalid response");

        return res.data;
    }

    loader = inject(LoaderService);
    async withLoader<T>(fn: () => Promise<T>): Promise<T> {
        this.loader.show();
        try {
            return await fn();
        } finally {
            this.loader.hide();
        }
    }

    async exec<T>(fn: () => any): Promise<T> {
        return this.withLoader(() => this.handleResponse<T>(fn()));
    }
}
