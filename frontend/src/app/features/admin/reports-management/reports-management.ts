import { Component, inject, signal, Signal } from '@angular/core';
import { ReportService } from '../../../core/service/servicesAPIREST/report/report-service';
import { ActionType, ReportPosts } from '../../../core/models/admin/UserResponseInAdmin';
import { Materaile } from '../../../modules/materaile-module';
import { PrettyDatePipe } from '../../../shared/pipes/pretty-date.pipe';
import { Router } from '@angular/router';
import { AdminServiceShared } from '../../../core/service/serivecLogique/admin/admin-service';
import { BanPopup } from '../../ban-popup/ban-popup';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
// import { BanPopup } from '../ban-popup/ban-popup';

@Component({
  selector: 'app-reports-management',
  imports: [Materaile, PrettyDatePipe, BanPopup],
  templateUrl: './reports-management.html',
  styleUrl: './reports-management.scss',
})
export class ReportsManagement {
  reportService = inject(ReportService);
  router = inject(Router);
  adminService = inject(AdminServiceShared);
  showBanPopup = false;
  actionType = signal<ActionType>('ban')
  userId = signal<string>('')
  postId = signal<string>('')
  adminService_api = inject(AdminService);
  postReposrt = signal<ReportPosts[]>([]);
  reportServiceUser = signal<ReportPosts[]>([]);
  lenghtPosts = signal(0);
  lenghtUser = signal(0);
  status = signal(false);
  hidden_posts = signal<{}>({});

  ngOnInit() {


    this.loadingUser()
    this.loadingPosts();
    this.adminService.update_user_report$.subscribe({
      next: response => {
        if (!response) return;
        // console.log(response, "response ", this.reportServiceUser());
        this.reportServiceUser.update(users =>
          users.map(u =>
            u.reportedUserId === response?.reportedUserId
              ? { ...u, status: !response.status }
              : u
          )
        );

      }
    })
    this.adminService.hidden_post$.subscribe({
      next: res => {
        // if (!res) return;
        console.log(res,"response", this.postReposrt());
        
        this.postReposrt.update(users =>
          users.map(u => 
             u.postId === res?.postId
                ? { ...u, hidden: !res.hidden }
               : u
          )
        );
      }
    })

    this.adminService.check_delete_user$.subscribe({
      next: response => {
        if (response == true) {
          this.lenghtUser() - 1;
          this.reportServiceUser.update(users => users.filter(u => u.reportedUserId !== this.userId()));
        }
      }
    })
  }

  loadingUser() {
    this.reportService.getReportUsers().subscribe({
      next: response => {
        this.reportServiceUser.set(response.data?.content)
        this.lenghtUser.set(response.data?.content.length)
        // console.log(response, "all user report");
      },
      error: error => {
        console.log(error);

      }
    })
  }

  loadingPosts() {
    this.reportService.getReportPosts().subscribe({
      next: response => {
        this.postReposrt.set(response.data?.content)
        this.lenghtPosts.set(response.data?.content.length)
        // const hiddenMap = new Map<string, boolean>();
        // response.data.content.forEach((post: any) => {
        //   hiddenMap.set(post.postId, post.hidden || false);
        // });
        // this.hidden_posts.set(hiddenMap);
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

  openPostPopup(type: ActionType, postid: string) {
    this.showBanPopup = true
    this.actionType.set(type)
    this.postId.set(postid)
  }


  openUserPopup(type: ActionType, userId: string) {
    this.showBanPopup = true
    this.actionType.set(type)
    this.userId.set(userId)
  }


}
