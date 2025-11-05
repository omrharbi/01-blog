import { Component, signal } from '@angular/core';
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
  totleUsers = signal(0)
  totlePosts = signal(0)
  getAllPosts = signal<PostsResponseInAdmin[]>([]);
  ngOnInit() {
    let page = 0;
    let size = 5;
    this.admin.getAllPosts(page, size).subscribe({
      next: (response: any) => {
        // this.totlePosts.set(response?.data.length)
        this.getAllPosts.set(response.data.content)
        console.log("admin posts", response.data.content);
      }
    })
  }
}
