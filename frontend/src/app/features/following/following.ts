import { Component } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { Materaile } from '../../modules/materaile-module';
import { apiUrl } from '../../core/constant/constante';
import { use } from 'marked';
import { FollowingLogiqueService } from '../../core/service/serivecLogique/following/following-logique-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-following',
  imports: [Materaile],
  templateUrl: './following.html',
  styleUrl: './following.scss'
})
export class Following {

  constructor(private users: FollowingService,

    private followingLogic: FollowingLogiqueService
  ) { }
  private subscriptions = new Subscription();
  following: UserProfile[] = []
  followers: UserProfile[] = []
  explore: UserProfile[] = []
  apiUrl = apiUrl;
  countFollowing = 0;
  countFollowers = 0;
  ngOnInit() {
    this.followingLogic.loadingData();
    // this.users.following().subscribe({
    //   next: response => {
    //     this.following = response.data
    //     this.countFollowing = this.following.length;
    //     console.log(this.following, "*following ");
    //   },
    //   error: error => {
    //     console.log("error", error);

    //   }
    // })

    // // Get my followers
    // this.users.followers().subscribe({
    //   next: response => {
    //     this.followers = response.data
    //     this.countFollowers = this.followers.length;
    //     console.log(response.data, "followers**");
    //   },
    //   error: error => {
    //     console.log("error", error);
    //   }
    // })

    // // users not follow 
    // this.users.explor().subscribe({
    //   next: response => {
    //     this.explor = response.data
    //     console.log(response, "explor**");
    //   },
    //   error: error => {
    //     console.log("error", error);

    //   }
    // })

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
  follow(id: string) {
    this.followingLogic.follow(id)
  }
  Unfollow(id: string) {
    this.followingLogic.Unfollow(id);
  }
}
