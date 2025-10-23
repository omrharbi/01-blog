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
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private auth: AuthService, private followingLogic: FollowingLogiqueService) {}
  isAuthenticated: boolean = false;
  explore: UserProfile[] = [];
  private subscription = new Subscription();
  username: string | null = null;
  IsAdmin: boolean =false;

  ngOnInit() {
    this.username = this.auth.getCurrentUsername();
    // this.username = this.auth.getCurrentUserRole();
    this.isAuthenticated = this.auth.isLoggedIn();
    if (this.auth.hasRole('ADMIN')) {
      this.IsAdmin = true;
    } 
    // console.log(this.auth.getCurrentUserRole (),"**************");

    // this.isAuthenticated = this.auth.is();
    if (this.isAuthenticated) {
      this.followingLogic.loadingData();
      this.subscription.add(
        this.followingLogic.explore$.subscribe((explose) => {
          this.explore = explose;
        })
      );
    }
  }
}
