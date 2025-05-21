import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./Pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./Pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
