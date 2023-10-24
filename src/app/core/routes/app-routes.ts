import { Routes } from "@angular/router";

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    loadComponent: () => import('../../core/components/home/home.component').then(mod => mod.HomeComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('../../features/authentication/components/login/login.component').then(mod => mod.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('../../features/authentication/components/register/register.component').then(mod => mod.RegisterComponent)
  },
  {
    path: 'users/profile',
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

