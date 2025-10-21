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
import { guestGuard } from './core/guards/auth/guest-guard';
import { Preview } from './shared/components/preview/preview';
// import { ExplorePosts } from './features/explore-stories/explore-stories';
import { Following } from './features/following/following';
import { LikedPosts } from './features/liked-posts/liked-posts';
import { Profile } from './features/profile/profile';
import { CanDeactivateGuard } from './core/guards/CanDeactivateGuard/CanDeactivateGuard';
import { ExplorePosts } from './features/explore-stories/explore-posts';
import { Comment } from './features/comment/comment';
// import { Bookmarks } from './features/bookmarks/bookmarks';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout, // root uses MainLayout
    // canActivate: [authGuard],
    children: [
      { path: '', component: Home }, // <-- default child is Home
      { path: 'post/:id', component: PostList },
      { path: 'posts', component: PostList },
      { path: 'preview', component: Preview },
      { path: 'explore', component: ExplorePosts },
      
      { path: 'profile', component: Profile , canActivate: [authGuard]},
      { path: 'create', component: CreatePost, canActivate: [authGuard] },
      {
        path: 'edit', component: CreatePost,
        canActivate: [authGuard],
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'following', component: Following, canActivate: [authGuard] },
      { path: 'liked', component: LikedPosts, canActivate: [authGuard] },
      { path: 'comments/:id', component: PostList, canActivate: [authGuard] },
      // { path: 'bookmarks', component: Bookmarks },
      // other protected pages
    ], // default path now points to home
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login, canActivate: [guestGuard] },    // ✅ guest only
      { path: 'register', component: Register, canActivate: [guestGuard] }, // ✅ guest only
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
