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
  currentPage =0
  currentData = 0;
  currentPageFollwing = signal(0)
  totalPages = signal(0);
  totalPagesFollwing = signal(0);
  pageSize = signal(3);
  totalElement = 0;
  nextPage=0;
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    if (!this.isAuthenticated) return;
    this.followingLogic.loadingFollowers(0, this.pageSize())
    this.followingLogic.loadingFollowing(0, this.pageSize())
    this.followingLogic.loadingExplore(0, this.pageSize())

    this.followingLogic.pages$.subscribe({
      next: response => {
        this.totalPages.set(response.totalPage)
        this.totalPagesFollwing.set(response.totalPagesFollwing)
        this.totalElement = response.totalElements;
        this.currentData = response.totalDataResponse
       }
    })
    this.subscriptions.add(
      this.followingLogic.following$.subscribe(following => {
        this.following = following;
        console.log(following, "following ");
      })
    );
    this.subscriptions.add(
      this.followingLogic.followers$.subscribe(followers => {
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
    const nextPage = this.currentPage + 1;
    this.followingLogic.loading$.subscribe({
      next: response => this.loading.set(response),
      error: err => this.loading.set(false)
    })

    if (nextPage >= this.totalPages()) return;
    this.followingLogic.loadingFollowers(nextPage, this.pageSize())
  }

  loadingMoreExplore() {
     this.nextPage+=this.currentPage+1;
    console.log(this.nextPage,"here==");
    
    // console.log(nextPage, "))", this.totalPagesFollwing(), "next **");
    this.followingLogic.pages$.subscribe({
      next: response => {
        this.currentData += response.totalDataResponse + 1;
        if (this.currentData >= this.totalElement) {
          this.loading.set(true)
          return;
        } else {
          this.loading.set(false)
        }
      },
      error: err => this.loading.set(false)
    })

    if (this.nextPage >= this.totalPagesFollwing()) return;
    this.followingLogic.loadingExplore(this.nextPage, this.pageSize())
    // this.loading.set(false);

  }
  loadingMoreFollowing() {
    // if (this.loading() || this.currentPageFollwing() >= this.totalPagesFollwing() - 1) { return }
    // let nextPage =0;
    this.nextPage+=this.currentPage+1;
    console.log(this.nextPage,"here==");
    
    // console.log(nextPage, "))", this.totalPagesFollwing(), "next **");
    this.followingLogic.pages$.subscribe({
      next: response => {
        this.currentData += response.totalDataResponse + 1;
        if (this.currentData >= this.totalElement) {
          this.loading.set(true)
          return;
        } else {
          this.loading.set(false)
        }
      },
      error: err => this.loading.set(false)
    })

    if (this.nextPage >= this.totalPagesFollwing()) return;
    this.followingLogic.loadingFollowing(this.nextPage, this.pageSize())
  }
  follow(id: string) {
    this.followingLogic.follow(id)
  }
  Unfollow(id: string) {
    this.followingLogic.Unfollow(id);
  }
  hasMoreFollowers(): boolean {
    if (this.currentData >= this.totalElement) {
      // console.log("herer");
      return false
    }
    else {
      return true
    }
    // return this.currentPage() < this.totalPages() - 1;
  }

  hasMorefollowing(): boolean {
    // this.loading.set(false)
    // console.log(this.currentData, this.totalElement);

    if (this.currentData === this.totalElement) {
      // console.log("herer");
      return false

    }
    else {
      // console.log(" oo is here ");

      return true
    }
    // return this.currentPageFollwing() < this.totalPagesFollwing() - 1;
  }

}
