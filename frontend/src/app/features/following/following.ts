import { Component, signal } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { Materaile } from '../../modules/materaile-module';
import { apiUrl } from '../../core/constant/constante';
import { use } from 'marked';
import { FollowingLogiqueService } from '../../core/service/serivecLogique/following/following-logique-service';
import { count, retry, Subscription } from 'rxjs';
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

  // Separate pagination for each list
  followingCurrentPage = 0;
  followerCurrentPage = 0;
  exploreCurrentPage = 0;

  followingTotalPages = signal(0);
  followersTotalPages = signal(0);
  exploreTotalPages = signal(0);

  followingTotalElements = 0;
  followersTotalElements = 0;
  exploreTotalElements = 0;

  pageSize = signal(5);
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    if (!this.isAuthenticated) return;
    this.loadInitialData();
    this.setupSubscriptions()
  }

  private setupSubscriptions() {
    this.subscriptions.add(
      this.followingLogic.loading$.subscribe(isLoading => {
        this.loading.set(isLoading);
      })
    );
    this.followingLogic.followingPages$.subscribe({
      next: pages => {
        this.followingCurrentPage = pages?.currentPage ?? 0;
        this.followingTotalPages.set(pages?.totalPages ?? 0);
        this.followingTotalElements = pages?.totalElements ?? 0;


        console.log('Following pagination updated:', pages);
      }
    })

    this.followingLogic.followersPages$.subscribe({
      next: pages => {
        this.followerCurrentPage = pages?.currentPage ?? 0;
        this.followersTotalPages.set(pages?.totalPages ?? 0);
        this.followersTotalElements = pages?.totalElements ?? 0;
      }
    })

    this.followingLogic.explorePages$.subscribe({
      next: pages => {
        this.exploreCurrentPage = pages?.currentPage ?? 0;
        this.exploreTotalPages.set(pages?.totalPages ?? 0);
        this.exploreTotalElements = pages?.totalElements ?? 0;
      }
    })



    // Subscribe to data
    this.subscriptions.add(
      this.followingLogic.following$.subscribe(following => {
        this.following = following;
      })
    );
    this.subscriptions.add(
      this.followingLogic.followers$.subscribe(followers => {
        this.followers = followers;
      })
    );

    this.subscriptions.add(
      this.followingLogic.explore$.subscribe(explore => {
        this.explore = explore;
      })
    );

    this.subscriptions.add(
      this.followingLogic.countexplore$.subscribe(countFollowers => {
        this.countFollowers = countFollowers;
      })
    );

    this.subscriptions.add(
      this.followingLogic.countFollowing$.subscribe(countFollowing => {
        this.countFollowing = countFollowing;
      })
    );
  }
  private loadInitialData() {
    // Load first page for each list
    // this.followingLogic.loadingFollowers(0, this.pageSize());
    this.followingLogic.loadingFollowing(0, this.pageSize());
    this.followingLogic.loadingExplore(0, this.pageSize());
  }
  // loadingMoreFollowes() {
  //   if (this.loading() || this.followerCurrentPage >= this.followersTotalPages() - 1) {
  //     return;
  //   }
  //   const nextPage = this.followerCurrentPage + 1;
  //   this.followingLogic.loadingFollowers(nextPage, this.pageSize())
  // }

  loadingMoreExplore() {
    if (this.loading() || this.exploreCurrentPage >= this.exploreTotalPages() - 1) {
      return;
    }
    const nextPage = this.exploreCurrentPage + 1;
    console.log(nextPage, "next ***", this.loading());

    this.followingLogic.loadingExplore(nextPage, this.pageSize());
  }


  loadingMoreFollowing() {

    console.log(this.followingCurrentPage, this.followingTotalPages() - 1, "next ***");
    if (this.loading() || this.followingCurrentPage >= this.followingTotalPages() - 1) {
      return;
    }
    const nextPage = this.followingCurrentPage + 1;
    console.log(nextPage, "next ***");

    this.followingLogic.loadingFollowing(nextPage, this.pageSize())
  }
  follow(id: string) {
    const exploreCountBefore = this.explore.length;

    this.followingLogic.follow(id);

    setTimeout(() => {
      const exploreCountAfter = this.explore.length;
 
      if (exploreCountAfter < exploreCountBefore && this.hasMoreExplore()) {
        console.log(`Following: Auto-loading more explore users. Had ${exploreCountBefore}, now ${exploreCountAfter}`);

        const nextPage = this.exploreCurrentPage + 1;
        this.followingLogic.loadingExplore(nextPage, this.pageSize());
      }
 
      if (exploreCountAfter <= 2 && this.hasMoreExplore()) {
        console.log(`Following: Very few users left (${exploreCountAfter}), loading more...`);
        const nextPage = this.exploreCurrentPage + 1;
        this.followingLogic.loadingExplore(nextPage, this.pageSize());
      }
    }, 300);  
  }

  Unfollow(id: string) {
    const followingCountBefore = this.following.length;

    this.followingLogic.Unfollow(id);

    setTimeout(() => {
      const followingCountAfter = this.following.length;
 
      if (followingCountAfter < followingCountBefore && this.hasMoreFollowing()) {
        console.log(`Unfollowing: Auto-loading more following users. Had ${followingCountBefore}, now ${followingCountAfter}`);

        const nextPage = this.followingCurrentPage + 1;
        this.followingLogic.loadingFollowing(nextPage, this.pageSize());
      }
 
      if (followingCountAfter <= 2 && this.hasMoreFollowing()) {
        console.log(`Unfollowing: Very few users left (${followingCountAfter}), loading more...`);
        const nextPage = this.followingCurrentPage + 1;
        this.followingLogic.loadingFollowing(nextPage, this.pageSize());
      }
    }, 300);  
  }
  hasMoreFollowers(): boolean {
    const hasMoreItems = this.followers.length < this.followersTotalElements;
    const hasMorePages = this.followerCurrentPage < this.followersTotalPages() - 1;
    return hasMoreItems && hasMorePages;
  }

  hasMoreFollowing(): boolean {
    return this.followingCurrentPage < this.followingTotalPages() - 1;
  }

  hasMoreExplore(): boolean {
    return this.exploreCurrentPage < this.exploreTotalPages() - 1;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
