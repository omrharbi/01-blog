import { Component } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { FollowingService } from '../../../core/service/servicesAPIREST/following/following-service';
import { UserProfile } from '../../../core/models/user/userProfileResponse';

@Component({
  selector: 'app-sidebar',
  imports: [Materaile],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private auth: AuthService, private users: FollowingService) { }
  isAuthenticated: boolean = false;
  explor: UserProfile[] = []

  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    if (this.isAuthenticated) {
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
  }

}
