import { Routes } from "@angular/router";

import { LoginComponent } from "@features/auth/login/login.component";
import { RegisterComponent } from "@features/auth/register/register.component";

import { MainLayoutComponent } from "@layout/main-layout/main-layout.component";
import { DashboardComponent } from "@features/dashboard/dashboard.component";
import { BoardComponent } from "@features/board/board.component";

export const routes: Routes = [
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            { path: "dashboard", component: DashboardComponent },
            { path: "board", component: BoardComponent },
        ],
    },

    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
];
