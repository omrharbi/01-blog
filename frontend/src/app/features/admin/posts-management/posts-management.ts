import { Component, signal, computed, inject } from '@angular/core';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { ActionType, PostsResponseInAdmin } from '../../../core/models/admin/UserResponseInAdmin';
import { Materaile } from '../../../modules/materaile-module';
import { PrettyDatePipe } from '../../../shared/pipes/pretty-date.pipe';
import { AdminServiceShared } from '../../../core/service/serivecLogique/admin/admin-service';
import { Router } from '@angular/router';
import { use } from 'marked';
import { BanPopup } from '../../ban-popup/ban-popup';

@Component({
  selector: 'app-posts-management',
  imports: [Materaile, PrettyDatePipe, BanPopup],
  templateUrl: './posts-management.html',
  styleUrl: './posts-management.scss',
})
export class PostsManagement {
  constructor(private admin: AdminService) { }
  getAllPosts = signal<PostsResponseInAdmin[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  loading = signal(false);
  actionType: ActionType = 'ban';
  postId = signal<string>('')

  totalPosts = signal(0);
  router = inject(Router)
  showBanPopup = false;
  adminService = inject(AdminServiceShared);
  postsId = signal<string>('')
  startIndex = computed(() => this.currentPage() * this.pageSize());
  endIndex = computed(() =>
    Math.min(this.startIndex() + this.pageSize() - 1, this.totalPages())

  );
  ngOnInit() {
    this.loadPosts(0);

    this.adminService.check_delete_post$.subscribe({
      next: response => {
        if (response == true) {
           
          this.getAllPosts.update(posts => posts.filter(u => u.id !== this.postsId()));
        }
      }
    })

    this.adminService.hidden_post$.subscribe({
      next: res => {
        // if (!res) return;
        console.log(res, "response", this.getAllPosts(), "all posts");

        this.getAllPosts.update(users =>
          users.map(u =>
            u.id === res.postId
              ? { ...u, hidden: res.hidden }
              : u
          )
        );
      },
      error: err => { console.error("**-**-*-*-*-*-*-",err); }
    })

  }
  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadPosts(page);
  }
  loadPosts(page: number) {
    this.loading.set(true);
    this.admin.getAllPosts(page, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          console.log(response.data.content);
          
          this.getAllPosts.set(response.data.content);
          this.totalPages.set(response.data.totalPages);
          this.currentPage.set(response.data.number);
          this.totalPosts.set(response.data.totalElements)
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
 

  deletePosts(type: ActionType, postId: string) {
    this.showBanPopup = true
    this.actionType = type
    this.postId.set(postId)
  }
  showMore() {
    if (this.loading() || this.currentPage() >= this.totalPages() - 1) return;
    this.loading.set(true);

    const nextPage = this.currentPage() + 1;

    this.admin.getAllPosts(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          // console.log(response);

          this.getAllPosts.update(posts => [
            ...posts,
            ...response.data.content.filter((newPost: any) => !posts.some(post => post.id === newPost.id)
            )
          ]);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });



  }

  actionTypeHandle(type: ActionType, postId: string) {
    this.showBanPopup = true
    this.actionType = type
    this.postId.set(postId)
  }

  openPostPopup(type: ActionType, postid: string) {
    this.showBanPopup = true
    this.actionType = type
    this.postId.set(postid)
  }
  viewPosts(postId: string) {
    console.log(postId);
    this.router.navigate([`/post/${postId}`])
  }
}
