import { Routes } from "@angular/router";

import { Login } from "./features/auth/login/login";
import { Register } from "./features/auth/register/register";

import { MainLayout } from "./layout/main-layout/main-layout";
import { Dashboard } from "./features/dashboard/dashboard";
import { Board } from "./features/board/board";

export const routes: Routes = [
    {
        path: "",
        component: MainLayout,
        children: [
            { path: "dashboard", component: Dashboard },
            { path: "board", component: Board },
        ],
    },

    { path: "login", component: Login },
    { path: "register", component: Register },
];
