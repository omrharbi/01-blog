import { Component, Input, signal, computed } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';
import { PostResponse } from '../../../core/models/post/postResponse';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';
import { SharedService } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { Observable, Subscription } from 'rxjs';
import { FollowingLogiqueService } from '../../../core/service/serivecLogique/following/following-logique-service';
import { Tranding } from '../../../core/service/servicesAPIREST/tranding/tranding';
import { TrendingTag } from '../../../core/models/tranding/tranding';
import { AdminService } from '../../../core/service/servicesAPIREST/admin/admin-service';
import { RtlScrollAxisType } from '@angular/cdk/platform';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare, PostCard, Materaile],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  posts: PostResponse[] = [];
  trand: TrendingTag[] = [];
  posts$!: Observable<any>
  constructor(private postservice:
    PostService, private postDatashard:
      SharedService, private auth: AuthService, private global: Global,
    private follow: FollowingLogiqueService,
    private tranding: Tranding,

  ) {
    // this.posts$ = this.postDatashard.posts$;
  }

  isAuthenticated: boolean = false;
  countPosts = signal(0);
  countFollowers = signal(0);
  countFollowing = signal(0);
  private subscription = new Subscription();

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  loading = false;
  ngOnInit() {
    this.loadingPosts()

    this.isAuthenticated = this.auth.isLoggedIn();
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
      this.subscription = this.global.sharedData.subscribe((event) => {
        if (event.type === "notification") {
          // this.isNotificated = event.data;
        }
      });
      this.tranding.TrendingTag().subscribe({
        next: repose => {
          this.trand = repose;
        },
        error: error => {
          console.log(error, "tranding");

        }
      })
    } else {
      console.log("you need login ");

    }
  }
  loadingPosts() {
    if (this.loading || (this.totalPages && this.currentPage >= this.totalPages)) return;
    this.loading = true;
    this.postservice.getAllPost(0, this.pageSize).subscribe(response => {
      if (response.data && response.data.content) {
        this.posts = response.data.content;
        this.currentPage = response.data.number;
        this.totalPages = response.data.totalPages;
        this.postDatashard.setPosts(this.posts);
        this.loading = false;
      }
    });

  }

  loadMorePosts() {
    if (this.loading || this.currentPage >= this.totalPages - 1) {
      return;
    }
    this.loading = true;
    const nextPage = this.currentPage + 1;
    this.postservice.getAllPost(nextPage, this.pageSize).subscribe({
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
