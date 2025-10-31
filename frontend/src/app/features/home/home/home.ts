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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare, PostCard, Materaile],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  posts: PostResponse[] = [];
  tags: TrendingTag[] = [];
  posts$!: Observable<any>
  constructor(private postservice:
    PostService, private postDatashard:
      SharedService, private auth: AuthService, private global: Global,
    private follow: FollowingLogiqueService,
    private tranding: Tranding,
    private admin: AdminService
  ) {
    this.posts$ = this.postDatashard.posts$;
  }

  isAuthenticated: boolean = false;
  // isNotificated = false;
  // posts$=this.postDatashard.posts$;
  // postsComput= computed(()=>this.postDatashard.posts$.subscribe({
  //   next:res=>{
  //     console.log(res);

  //   }
  // }));
  countPosts = signal(0);
  countFollowers = signal(0);
  countFollowing = signal(0);
  private subscription = new Subscription();
  ngOnInit() {

    this.admin.getAllUsers().subscribe({
      next: resonse => {
        console.log("admin test", resonse);

      }
    })
    this.isAuthenticated = this.auth.isLoggedIn();
    // this.postDatashard.posts$.subscribe(posts => this.posts = posts);
    if (this.isAuthenticated) {
      this.postservice.getAllPost().subscribe(res => {
        this.posts = res.data;
        this.postDatashard.setPosts(res.data);
      });
      this.postDatashard.newpost$.subscribe(post => {
        console.log(post, "home here ");
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
          this.tags = repose;
          console.log(repose, "tranding");
        },
        error: error => {
          console.log(error, "tranding");

        }
      })
    }
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
