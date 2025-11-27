import { Component, signal } from '@angular/core';
import { PostCard } from '../posts/post-card/post-card';
import { PostResponse } from '../../core/models/post/postResponse';
import { TrendingTag } from '../../core/models/tranding/tranding';
import { Observable, Subscription } from 'rxjs';
import { PostService } from '../../core/service/servicesAPIREST/posts/post-service';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { Global } from '../../core/service/serivecLogique/globalEvent/global';
import { SharedService } from '../../core/service/serivecLogique/shared-service/shared-service-post';
import { FollowingLogiqueService } from '../../core/service/serivecLogique/following/following-logique-service';
import { Materaile } from '../../modules/materaile-module';

@Component({
  selector: 'app-explore-posts',
  imports: [PostCard, Materaile],
  templateUrl: './explore-posts.html',
  styleUrl: './explore-posts.scss'
})
export class ExplorePosts {
  posts: PostResponse[] = [];
  posts$!: Observable<any>
  constructor(private postservice:
    PostService, private postDatashard:
      SharedService, private auth: AuthService,
    private follow: FollowingLogiqueService,

  ) {
  }
  snapshotTime: string | null = null;

  isAuthenticated: boolean = false;
  countPosts = signal(0);
  countFollowers = signal(0);
  countFollowing = signal(0);
  private subscription = new Subscription();

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  loading = false;
  loading_post = true;

  userId = signal<string | null>(null);
  ngOnInit() {

    this.isAuthenticated = this.auth.isLoggedIn();
    this.userId.set(this.auth.getCurrentUserUUID() || null);
    this.loadingPosts()
    if (this.isAuthenticated) {
      this.postDatashard.newpost$.subscribe(post => {
        if (post) {
          this.updatePostInList(post);
        }
      });

      this.postDatashard.countPost$.subscribe(count => {
        this.countPosts.update(count => count)
      });

      this.follow.countFollowers$.subscribe(count => {
        this.countFollowers.update(count => count)
      });
      this.follow.countFollowing$.subscribe(count => {
        this.countFollowing.update(count => count)
      });

    } else {
      console.log("you need login ");

    }
  }
  loadingPosts() {
    if (this.loading || (this.totalPages && this.currentPage >= this.totalPages)) return;
    this.loading = true;
    this.postservice.getAllPost(this.userId(), this.snapshotTime, 0, this.pageSize).subscribe(response => {
      if (response.data && response.data.content) {
        if (response.data && response.data.content) {
          this.posts = response.data.content;
          this.currentPage = response.data.number;
          this.totalPages = response.data.totalPages;
          this.postDatashard.setPosts(this.posts);
          this.loading = false;
          this.loading_post = false;
        }
      }
    });
  }


  loadMorePosts() {
    if (this.loading || this.currentPage >= this.totalPages - 1) {
      return;
    }
    this.snapshotTime = new Date().toISOString();

    this.loading = true;
    const nextPage = this.currentPage + 1;
    this.postservice.getAllPost(this.userId(), this.snapshotTime, nextPage, this.pageSize).subscribe({
      next: response => {
        
        if (response.data && response.data.content) {
          this.posts = [...this.posts, ...response.data.content];
          this.currentPage = response.data.number;
          this.totalPages = response.data.totalPages;
          this.postDatashard.setPosts(this.posts);
        }
        this.loading = false;
      },
      error: error => {
        console.error('Error loading more posts:', error);
        this.loading = false;
      }
    });

  }


  hasMorePosts(): boolean {
    return this.currentPage < this.totalPages - 1;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  private updatePostInList(updatedPost: PostResponse) {
    this.posts.unshift(updatedPost);
    this.posts = [...this.posts]; // Trigger change detection
  }
}

