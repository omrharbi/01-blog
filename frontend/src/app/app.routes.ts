import { RouterModule, Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Register } from './features/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Home } from './features/home/home/home';
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home', // default path now points to home
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard], // protect all main layout routes
    children: [
      { path: 'home', component: Home },
      // other protected pages
    ],
  },
  { path: '**', redirectTo: 'login' },
];
