import { Component } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';
import { Materaile } from '../../modules/materaile-module';
import { apiUrl } from '../../core/constant/constante';

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
  ngOnInit() {
    this.users.following().subscribe({
      next: response => {
        this.following = response.data
        this.countFollowing = this.followers.length;
        console.log(this.countFollowing, "*following ");
      },
      error: error => {
        console.log("error", error);

      }
    })

    // Get my followers
    this.users.followers().subscribe({
      next: response => {
        this.followers = response.data
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
        console.log(response.data, "explor**");
      },
      error: error => {
        console.log("error", error);

      }
    })
  }

  Unfollow() {

  }
  follow(id:string){
    console.log(id,"id use");
    
  }
}
// f196e108-0cdd-4b43-a359-ceb83c8a8062
// 867e6d5e-24db-4e90-b66c-4d74adc860d7