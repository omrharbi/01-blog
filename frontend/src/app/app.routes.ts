import { RouterModule, Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Register } from './features/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Home } from './features/home/home/home';
import { authGuard } from './core/guards/auth/auth-guard';
import { CreatePost } from './features/posts/create-post/create-post';
import { PostList } from './features/posts/post-list/post-list';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout, // root uses MainLayout
    // canActivate: [authGuard],
    children: [
      { path: '', component: Home }, // <-- default child is Home
      { path: 'create', component: CreatePost },
      { path: 'posts', component: PostList },
      // other protected pages
    ], // default path now points to home
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  // {
  //   path: 'main',
  //   component: MainLayout,
  //   canActivate: [authGuard], // protect all main layout routes
  //   children: [
  //     { path: 'home', component: Home },
  //     // other protected pages
  //     { path: '', redirectTo: 'home', pathMatch: 'full' },
  //   ],
  // },
  { path: '**', redirectTo: 'login' },
];
