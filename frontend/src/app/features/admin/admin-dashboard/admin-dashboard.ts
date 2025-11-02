import { Component, Inject } from '@angular/core';
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
  ngOnInit() {
    let page = 0;
    let size = 10;
    this.admin.getAllUsers(page, size).subscribe({
      next: (response: any) => {
        console.log("admin test", response);
      }
    })
  }
}
