import { Injectable } from "@angular/core";

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
}
