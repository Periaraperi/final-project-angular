import { Routes } from "@angular/router";
import { authGuard, profileGuard } from "../guards";

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    loadComponent: () => import('../../core/components/home/home.component').then(mod => mod.HomeComponent)
  },
  {
    path: 'auth/login',
    canActivate: [authGuard],
    loadComponent: () => import('../../features/authentication/components/login/login.component').then(mod => mod.LoginComponent)
  },
  {
    path: 'auth/register',
    canActivate: [authGuard],
    loadComponent: () => import('../../features/authentication/components/register/register.component').then(mod => mod.RegisterComponent)
  },
  {
    path: 'users/profile',
    canActivate: [profileGuard],
    loadComponent: () => import('../../features/users/components/user-profile/user-profile.component').then(mod => mod.UserProfileComponent)
  },
  {
    path: 'books',
    loadComponent: () => import('../../features/books/components/book-search/book-search.component').then(mod => mod.BookSearchComponent)
  },
  {
    path: 'books/editions/:workId',
    loadComponent: () => import('../../features/books/components/editions/editions.component').then(mod => mod.EditionsComponent)
  }
];

