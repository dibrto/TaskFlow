import { Routes } from "@angular/router";

import { LoginComponent } from "@features/auth/login/login.component";
import { RegisterComponent } from "@features/auth/register/register.component";

import { authGuard } from "@guards/auth-guard/auth-guard";
import { MainLayoutComponent } from "@layout/main-layout/main-layout.component";
import { DashboardComponent } from "@features/dashboard/dashboard.component";
import { BoardComponent } from "@features/board/board.component";

export const routes: Routes = [
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
            { path: "board", component: BoardComponent, canActivate: [authGuard] },
        ],
    },

    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
];
