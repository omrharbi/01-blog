import { Component, signal } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { Materaile } from '../../modules/materaile-module';
import { apiUrl } from '../../core/constant/constante';
import { use } from 'marked';
import { FollowingLogiqueService } from '../../core/service/serivecLogique/following/following-logique-service';
import { retry, Subscription } from 'rxjs';
import { NotificationsServiceLogique } from '../../core/service/serivecLogique/notifications/notifications-service-logique';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';

@Component({
  selector: 'app-following',
  imports: [Materaile],
  templateUrl: './following.html',
  styleUrl: './following.scss'
})
export class Following {

  constructor(private users: FollowingService,
    private notifLogique: NotificationsServiceLogique,
    private followingLogic: FollowingLogiqueService,
    private auth: AuthService

  ) { }
  private subscriptions = new Subscription();
  following: UserProfile[] = []
  followers: UserProfile[] = []
  explore: UserProfile[] = []
  apiUrl = apiUrl;
  countFollowing = 0;
  countFollowers = 0;
  isAuthenticated = false;
  loading = signal(false);
  currentPage = signal(0)
  totalPages = signal(0);
  pageSize = signal(5);
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    if (!this.isAuthenticated) return;
    this.followingLogic.loadingFollowers(0, this.pageSize())
    this.followingLogic.loadingFollowing(0, this.pageSize())
    this.followingLogic.loadingExplore(0, this.pageSize())
    this.followingLogic.pages$.subscribe({
      next:response=>{
        // console.log(response.totalPage, "totle numver ");
        
        this.totalPages.set(response.totalPage)
      }
    })
    this.subscriptions.add(
      this.followingLogic.following$.subscribe(following => {
        this.following = following;
      })
    );

    this.subscriptions.add(
      this.followingLogic.followers$.subscribe(followers => {
        // console.log(followers, "followers");

        this.followers = followers;
      })
    );

    this.subscriptions.add(
      this.followingLogic.explore$.subscribe(explore => {
        console.log(explore, "explore");
        this.explore = explore;
      })
    );

    this.subscriptions.add(
      this.followingLogic.countFollowers$.subscribe(countFollowers => {
        this.countFollowers = countFollowers;
      })
    );

    this.subscriptions.add(
      this.followingLogic.countFollowing$.subscribe(countFollowing => {
        this.countFollowing = countFollowing;
      })
    );
  }

  loadingMoreFollowes() {
    // this.followingLogic.loadingData(page, size);
    const nextPage = this.currentPage() + 1;
    console.log(nextPage,"next page ");
    
    if (nextPage >= this.totalPages()) return;
    this.followingLogic.loadingFollowers(nextPage, this.pageSize())
  }

  loadingMoreExplore() {
    // this.followingLogic.loadingData(page, size);
    const nextPage = this.currentPage() + 1;
    console.log(nextPage,"next page ");

    if (nextPage >= this.totalPages()) return;
    this.followingLogic.loadingExplore(nextPage, this.pageSize())
  }
  loadingMoreFollowing() {
    // this.followingLogic.loadingData(page, size);
    const nextPage = this.currentPage() + 1;
    console.log(nextPage,"next page ");

    if (nextPage >= this.totalPages()) return;
    this.followingLogic.loadingFollowing(nextPage, this.pageSize())
  }
  follow(id: string) {
    this.followingLogic.follow(id)
    // this.notifLogique.connect();
  }
  Unfollow(id: string) {
    this.followingLogic.Unfollow(id);
  }
  hasMorePosts(): boolean {
    return this.currentPage() < this.totalPages() - 1;
  }
}
