import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    async handleResponse<T>(promise: Promise<{ data: T; error: any }>): Promise<T> {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }

        const { data, error } = await promise;
        if (error) throw error;
        return data;
    }
}
