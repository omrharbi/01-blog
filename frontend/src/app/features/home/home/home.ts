import { Component, Input, signal, computed } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';
import { PostResponse } from '../../../core/models/post/postResponse';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';
import { SharedService } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { FollowingLogiqueService } from '../../../core/service/serivecLogique/following/following-logique-service';
import { Tranding } from '../../../core/service/servicesAPIREST/tranding/tranding';
import { TrendingTag } from '../../../core/models/tranding/tranding';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';

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
  constructor(private postservice:
    PostService, private postDatashard:
      SharedService, private auth: AuthService, private global: Global,
    private follow: FollowingLogiqueService,
    private tranding: Tranding,
    private preview: PreviewService,


  ) {
    // this.posts$ = this.postDatashard.posts$;
  }
  snapshotTime: string | null = null;

  isAuthenticated: boolean = false;
  countPosts = signal(0);
  countFollowers = signal(0);
  countFollowing = signal(0);
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  loading = false;
  loading_post = true;

  userId = signal<string | null>(null);
  ngOnInit() {

    this.isAuthenticated = this.auth.isLoggedIn();
    this.userId.set(this.auth.getCurrentUserUUID() || null);
    this.loadingPostsFollowing()
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
  loadingPostsFollowing() {
    if (this.loading || (this.totalPages && this.currentPage >= this.totalPages)) return;
    this.loading = true;
    this.postservice.getAllPostsFromFollowedUsers(this.userId(), this.snapshotTime, 0, 3).subscribe(response => {
      if (response.data && response.data.content) {
        console.log("*---*-*-*-*",response.data);
        
        this.responseData(response)
      }
    });
  }


  loadMorePostsFollowing() {
    if (this.loading || this.currentPage >= this.totalPages - 1) {
      return;
    }
    this.snapshotTime = new Date().toISOString();

    this.loading = true;
    const nextPage = 1;
    console.log(nextPage, this.currentPage);

    this.postservice.getAllPostsFromFollowedUsers(this.userId(), this.snapshotTime, 1, 5).subscribe({
      next: response => {
        console.log(response, "response");

        this.responseDataLoading(response)
      },
      error: error => {
        console.error('Error loading more posts:', error);
        this.loading = false;
      }
    });

  }


  private responseData(response: any) {
    if (response.data && response.data.content) {
      this.posts = response.data.content;
      this.posts.forEach(elem => {
        elem.content=this.preview.renderMarkdownWithMedia(elem.content)
      })
      this.currentPage = response.data.number;
      this.totalPages = response.data.totalPages;
      this.postDatashard.setPosts(this.posts);
      this.loading = false;
      this.loading_post = false;
    }
  }
  private responseDataLoading(response: any) {
    if (response.data && response.data.content) {
      this.posts = [...this.posts, ...response.data.content];
      this.currentPage = response.data.number;
      this.totalPages = response.data.totalPages;
      this.postDatashard.setPosts(this.posts);
    }
    this.loading = false;
  }
  hasMorePosts(): boolean {

    return this.currentPage < this.totalPages - 1;
  }
  private updatePostInList(updatedPost: PostResponse) {
    this.posts.unshift(updatedPost);
    this.posts = [...this.posts]; // Trigger change detection
  }
}
