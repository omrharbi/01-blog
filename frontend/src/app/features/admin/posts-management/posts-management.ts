import { Component, signal, computed } from '@angular/core';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { PostsResponseInAdmin } from '../../../core/models/admin/UserResponseInAdmin';
import { Materaile } from '../../../modules/materaile-module';
import { PrettyDatePipe } from '../../../shared/pipes/pretty-date.pipe';

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

  startIndex = computed(() => this.currentPage() * this.pageSize() + 1);
  endIndex = computed(() =>
    Math.min(this.startIndex() + this.getAllPosts().length - 1, this.totalPages())
  );
  ngOnInit() {
    this.loadPosts(0);
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
          this.getAllPosts.set(response.data.content);
          this.totalPages.set(response.data.totalElements);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  showMore() {
    if (this.loading() || this.currentPage() >= this.totalPages() - 1) return;
    this.loading.set(true);

    const nextPage = this.currentPage() + 1;
    this.admin.getAllPosts(nextPage, this.pageSize()).subscribe({
      next: (response: any) => {
        if (response.data && response.data.content) {
          this.getAllPosts.update(posts => [...posts, ...response.data.content]);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }


}
