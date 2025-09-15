import { RouterModule, Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Register } from './features/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { AdminLayout } from './layout/admin-layout/admin-layout';
 
export const routes: Routes = [
    {
        path:"",
        redirectTo:"login",
        pathMatch:"full"
    },
    {
        path:'login',
        component:AuthLayout,
        children:[
            {
                path:"",
                component:Login
            },
            {
                path:"",
                component:Register
            }
        ]
    },
    {
        path:'',
        component:MainLayout,
        children:[
            // {
            // // { path: 'home', component: HomeComponent },
            // // { path: 'profile', component: ProfileComponent }
            // }
        ]
        
    },
    {   
        path:'admin',
        component:AdminLayout,
        children:[
            // {
            // // { path: 'dashboard', component: AdminLayoutComponent },
            // // { path: 'profile', component: ProfileComponent }
            // }
        ]
        
    },
    { path: '**', redirectTo: 'login' } // wildcard route
];

 