import { Component, inject, signal, Signal } from '@angular/core';
import { ReportService } from '../../../core/service/servicesAPIREST/report/report-service';
import { ReportPosts } from '../../../core/models/admin/UserResponseInAdmin';
import { Materaile } from '../../../modules/materaile-module';
import { PrettyDatePipe } from '../../../shared/pipes/pretty-date.pipe';
import { Router } from '@angular/router';
import { AdminServiceShared } from '../../../core/service/serivecLogique/admin/admin-service';

@Component({
  selector: 'app-reports-management',
  imports: [Materaile, PrettyDatePipe],
  templateUrl: './reports-management.html',
  styleUrl: './reports-management.scss',
})
export class ReportsManagement {
  reportService = inject(ReportService);
  router = inject(Router);
  adminService = inject(AdminServiceShared);

  postReposrt = signal<ReportPosts[]>([]);
  lenghtPosts = signal(0);
  ngOnInit() {
    this.loadingPosts();
    this.loadingUser()
  }

  loadingUser(){
     this.reportService.getReportUsers().subscribe({
      next: response => {
        this.postReposrt.set(response.data?.content)
        this.lenghtPosts.set(response.data?.content.length)
        console.log(response, "all user report");
      },
      error: error => {
        console.log(error);

      }
    })
  }

  loadingPosts(){
     this.reportService.getReportPosts().subscribe({
      next: response => {
        this.postReposrt.set(response.data?.content)
        this.lenghtPosts.set(response.data?.content.length)
        console.log(response, "all posts report");
      },
      error: error => {
        console.log(error);

      }
    })
  }
  viewPosts(postId: string) {
    console.log(postId);
    this.router.navigate([`/post/${postId}`])
  }

  deletePosts(postId: string) {
    this.adminService.deletePosts(postId)
    this.postReposrt.update(post => post.filter(p => p.postId != postId));
    this.lenghtPosts.set(this.postReposrt.length)
  }
}
