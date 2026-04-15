import { inject, Injectable } from "@angular/core";
import { LoaderService } from "@services/loader/loader.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    private toast = inject(ToastrService);

    async handleResponse<T = any>(promise: Promise<any>): Promise<T> {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }

        const res = await promise;

        if (res?.error) throw res.error;
        // if (!res || !("data" in res)) throw new Error("Invalid response");

        return res.data;
    }

    private handleError(err: any) {
        if (err.message === "No internet connection") {
            this.toast.error("No internet");
            return;
        }

        // if (err.status === 401) return;

        this.toast.error(err.message || "Something went wrong");
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

    exec<T>(fn: () => any): Promise<T> {
        return this.withLoader(async () => {
            try {
                return await this.handleResponse<T>(fn());
            } catch (err) {
                this.handleError(err);
                throw err;
            }
        });
    }

    execWithoutLoader<T>(fn: () => any): Promise<T> {
        try {
            return this.handleResponse<T>(fn());
        } catch (err) {
            this.handleError(err);
            throw err;
        }
    }
}
