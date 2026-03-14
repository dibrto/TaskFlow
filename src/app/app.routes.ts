import { Routes } from "@angular/router";
import { Dashboard } from "./features/dashboard/dashboard";
import { Login } from "./features/auth/login/login";

export const routes: Routes = [
    { path: "dashboard", component: Dashboard },
    { path: "login", component: Login },
];
