import { Component } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { Materaile } from '../../modules/materaile-module';
import { apiUrl } from '../../core/constant/constante';
import { use } from 'marked';

@Component({
  selector: 'app-following',
  imports: [Materaile],
  templateUrl: './following.html',
  styleUrl: './following.scss'
})
export class Following {

  constructor(private users: FollowingService) { }
  following: UserProfile[] = []
  followers: UserProfile[] = []
  explor: UserProfile[] = []
  apiUrl = apiUrl;
  countFollowing = 0;
  countFollowers = 0;
  ngOnInit() {
    this.users.following().subscribe({
      next: response => {
        this.following = response.data
        this.countFollowing = this.following.length;
        console.log(this.following, "*following ");
      },
      error: error => {
        console.log("error", error);

      }
    })

    // Get my followers
    this.users.followers().subscribe({
      next: response => {
        this.followers = response.data
        this.countFollowers=this.followers.length;
        console.log(response.data, "followers**");
      },
      error: error => {
        console.log("error", error);
      }
    })

    // users not follow 
    this.users.explor().subscribe({
      next: response => {
        this.explor = response.data
        console.log(response, "explor**");
      },
      error: error => {
        console.log("error", error);

      }
    })
  }
  follow(id: string) {
    // const userindex = this.explor.findIndex(user => user.id == id);
    // if (userindex === -1) return;
    // const userToFollow = this.explor[userindex];

    // this.users.followUser(id).subscribe({
    //   next: response => {
    //      if (response.status === true) {
    //       this.following.unshift(userToFollow);
    //       this.explor.splice(userindex, 1);
    //       this.countFollowing++;
    //     }
    //     console.log(response, "followUser**");
    //   },
    //   error: error => {
    //     console.log("error", error);

    //   }
    // })

  }
  Unfollow(id: string) {
    const explorIndex = this.following.findIndex(user => user.id == id)
    if (explorIndex === -1) return;
    const userUnFollow = this.following[explorIndex];
    this.users.unfollow(id).subscribe({
      next: response => {
        if (response.status === true) {
          this.explor.unshift(userUnFollow);
          this.following.splice(explorIndex, 1);
          this.countFollowing--;
        }
        // this.explor = response.data
        console.log(response, "followUser**");
      },
      error: error => {
        console.log("error", error);

      }
    })
  }

}

 