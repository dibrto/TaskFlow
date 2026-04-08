import { Routes } from "@angular/router";

import { guestGuard } from "@guards/guest-guard/guest-guard";
import { LoginComponent } from "@features/auth/login/login.component";
import { RegisterComponent } from "@features/auth/register/register.component";

import { authGuard } from "@guards/auth-guard/auth-guard";
import { MainLayoutComponent } from "@layout/main-layout/main-layout.component";
import { DashboardComponent } from "@features/dashboard/dashboard.component";
import { BoardComponent } from "@features/board/board.component";

export const routes: Routes = [
    { path: "", redirectTo: "/dashboard", pathMatch: "full" },

    {
        path: "",
        component: MainLayoutComponent,
        children: [
            { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
            { path: "board/:id", component: BoardComponent, canActivate: [authGuard] },
        ],
    },

    { path: "login", component: LoginComponent, canActivate: [guestGuard] },
    { path: "register", component: RegisterComponent, canActivate: [guestGuard] },
];
