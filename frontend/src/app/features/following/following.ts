import { Component } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { Materaile } from '../../modules/materaile-module';
import { apiUrl } from '../../core/constant/constante';
import { use } from 'marked';
import { FollowingLogiqueService } from '../../core/service/serivecLogique/following/following-logique-service';
import { Subscription } from 'rxjs';
import { NotificationsServiceLogique } from '../../core/service/serivecLogique/notifications/notifications-service-logique';

@Component({
  selector: 'app-following',
  imports: [Materaile],
  templateUrl: './following.html',
  styleUrl: './following.scss'
})
export class Following {

  constructor(private users: FollowingService,
    private notifLogique: NotificationsServiceLogique,
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
    // this.notifLogique.connect();
  }
  Unfollow(id: string) {
    this.followingLogic.Unfollow(id);
  }
}
