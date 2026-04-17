import { Routes } from "@angular/router";

import { guestGuard } from "@guards/guest-guard/guest-guard";
import { LoginComponent } from "@features/auth/login/login.component";
import { RegisterComponent } from "@features/auth/register/register.component";

import { authGuard } from "@guards/auth-guard/auth-guard";
import { MainLayoutComponent } from "@layout/main-layout/main-layout.component";
import { DashboardComponent } from "@features/dashboard/dashboard.component";
import { HomeComponent } from "@features/home/home.component";
import { boardIdGuard } from "@guards/board-id/board-id-guard";
import { boardExistsGuard } from "@guards/board-exists/board-exists-guard";
import { BoardComponent } from "@features/board/board.component";

export const routes: Routes = [
    { path: "", component: HomeComponent, pathMatch: "full" },

    {
        path: "",
        component: MainLayoutComponent,
        children: [
            { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
            { path: "board/:id", component: BoardComponent, canActivate: [authGuard, boardIdGuard] }
        ]
    },

    { path: "login", component: LoginComponent, canActivate: [guestGuard] },
    { path: "register", component: RegisterComponent, canActivate: [guestGuard] },

    { path: "**", redirectTo: "/" }
];
