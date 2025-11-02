import { Component, Inject, signal } from '@angular/core';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Materaile],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  // admin = Inject(AdminService)
  constructor(private admin: AdminService) { }
  totleUsers = signal(0)
  totlePosts = signal(0)
  ngOnInit() {
    let page = 0;
    let size = 21600;
    this.admin.getAllUsers(page, size).subscribe({
      next: (response: any) => {
        this.totleUsers.set(response?.data.content.length)
        console.log("admin test", response?.data.content.length);
      }
    })

    this.admin.getAllPosts(page, size).subscribe({
      next: (response: any) => {
        this.totlePosts.set(response?.data.length)
        console.log("admin posts", response);
      }
    })
  }
}
