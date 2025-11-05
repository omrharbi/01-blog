import { Component, signal, computed, inject } from '@angular/core';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { PostsResponseInAdmin } from '../../../core/models/admin/UserResponseInAdmin';
import { Materaile } from '../../../modules/materaile-module';
import { PrettyDatePipe } from '../../../shared/pipes/pretty-date.pipe';
import { AdminServiceShared } from '../../../core/service/serivecLogique/admin/admin-service';

@Component({
  selector: 'app-posts-management',
  imports: [Materaile, PrettyDatePipe],
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

  }
  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadPosts(page);
  }
  loadPosts(page: number) {
    this.loading.set(true);
    this.admin.getAllPosts(page, this.pageSize()).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response.data && response.data.content) {
          this.getAllPosts.set(response.data.content);
          this.totalPages.set(response.data.totalPages);
          this.currentPage.set(response.data.number);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  deletePosts(postId: string) {
    this.adminService.deletePosts(postId)
    this.postsId.set(postId)
  }
  showMore() {
    if (this.loading() || this.currentPage() >= this.totalPages() - 1) return;
    this.loading.set(true);

    const nextPage = this.currentPage() + 1;

    this.admin.getAllPosts(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.getAllPosts.update(posts => [
            ...posts,
            ...response.data.content.filter((newPost:any) => !posts.some(post => post.id === newPost.id)
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


}
