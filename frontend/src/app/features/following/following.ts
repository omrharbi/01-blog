import { Component } from '@angular/core';
import { FollowingService } from '../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';

@Component({
  selector: 'app-following',
  imports: [],
  templateUrl: './following.html',
  styleUrl: './following.scss'
})
export class Following {

  constructor(private users: FollowingService) { }
  usersProfile: UserProfile[] = []
  ngOnInit() {
    this.users.getAllUser().subscribe({
      next: response => {
        // console.log(response);
        this.usersProfile = response.data
      },
      error: error => {
        console.log("error", error);

      }
    })
  }
}
