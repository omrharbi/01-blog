import { Component, Inject, Signal, signal } from '@angular/core';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { Materaile } from '../../../modules/materaile-module';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Materaile],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  constructor(private admin: AdminService) { }
  totleUsers = signal(0)
  totlePosts = signal(0)
  totleReport = signal(0)
  
  ngOnInit() { 
    this.admin.getcountUsers().subscribe({
      next: (response: any) => {
        console.log(response,"count");

        this.totleUsers.set(response.data.countPosts)
        this.totlePosts.set(response.data.countUser)
        this.totleReport.set(response.data.countReport)
       }
    })
    // this.admin.getcountPosts().subscribe({
    //   next: (response: any) => {
    //     console.log(response);
        
    //     // this.totlePosts.set(response?.data.content)
    //    }
    // })
    
  }
}
