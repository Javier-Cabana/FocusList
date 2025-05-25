import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./Pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'listas',
    loadComponent: () => import('./Pages/listas/listas.page').then( m => m.ListasPage),
    canActivate: [authGuard],
  },
  {
    path: 'registro',
    loadComponent: () => import('./Pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'tarea/:idLista',
    loadComponent: () => import('./Pages/tarea/tarea.page').then( m => m.TareaPage),
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    loadComponent: () => import('./Pages/perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
