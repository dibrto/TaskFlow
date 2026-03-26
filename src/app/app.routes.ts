import { Routes } from "@angular/router";

import { Login } from "./features/auth/login/login";
import { Register } from "./features/auth/register/register";

import { MainLayout } from "./layout/main-layout/main-layout";
import { Dashboard } from "./features/dashboard/dashboard";

export const routes: Routes = [
    {
        path: "",
        component: MainLayout,
        children: [{ path: "dashboard", component: Dashboard }],
    },

    { path: "login", component: Login },
    { path: "register", component: Register },
];
