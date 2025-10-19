import { Component } from '@angular/core';
import { EditProfile } from './edit-profile/edit-profile';
import { Materaile } from '../../modules/materaile-module';
import { AuthService } from '../../core/service/servicesAPIREST/auth/auth-service';
import { ProfileService } from '../../core/service/servicesAPIREST/profile/profile-service';
import { UserProfile } from '../../core/models/user/userProfileResponse';

@Component({
  selector: 'app-profile',
  imports: [EditProfile, Materaile],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  constructor(private auth: AuthService, private profile: ProfileService) { }
  isAuthenticated: boolean = false;
  editProfile = false;
  userProfile: UserProfile = {
    id: "",
    firstname: "",
    lastname: "",
    about: "",
    username: "",
    avatar: "",
  };
  EditPorfile() {
    this.editProfile = !this.editProfile;
  }
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    this.profile.profile().subscribe(res => {
      this.userProfile = res.data;
      console.log(this.userProfile.avatar);

    })
  }
}
