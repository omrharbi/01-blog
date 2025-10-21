import { Component } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { FollowingService } from '../../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../../core/models/user/userProfileResponse';
import { FollowingLogiqueService } from '../../../core/service/serivecLogique/following/following-logique-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [Materaile],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private auth: AuthService, private followingLogic: FollowingLogiqueService) { }
  isAuthenticated: boolean = false;
  explore: UserProfile[] = []
  private subscription = new Subscription()
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    if (this.isAuthenticated) {
      this.followingLogic.loadingData();
      // this.users.explore().subscribe({
      //   next: response => {
      //     this.explor = response.data
      //     console.log(response, "explor**");
      //   },
      //   error: error => {
      //     console.log("error", error);
      //   }
      // })
      this.subscription.add(
        this.followingLogic.explore$.subscribe(explose => {
          // console.log(explose,"side bar");
          
          this.explore = explose
        })
      )



    }
  }

}
