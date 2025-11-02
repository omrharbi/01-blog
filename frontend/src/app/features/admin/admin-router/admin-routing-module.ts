import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { AdminGuard } from '../../../core/guards/admin/admin-guard';
import { UsersManagement } from '../users-management/users-management';
import { PostsManagement } from '../posts-management/posts-management';
import { ReportsManagement } from '../reports-management/reports-management';
import { AdminLayout } from '../../../layout/admin-layout/admin-layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      { path: 'dashboard', component: AdminDashboard },
      {
        path: "users",
        component: UsersManagement,
      },
      {
        path: "posts",
        component: PostsManagement,
      }
      ,
      {
        path: "reports",
        component: ReportsManagement,

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
