import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostResponse } from '../../../models/post/postResponse';
import { Profile } from '../../../../features/profile/profile';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { ProfileService } from '../../servicesAPIREST/profile/profile-service';
import { RequestEditProfile } from '../../../models/user/userProfileRequest';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceLogique {
  constructor(private profile: ProfileService) { }
  private dataProfileSubject = new BehaviorSubject<UserProfile>({
    id: '',
    firstname: '',
    lastname: '',
    about: '',
    username: '',
    avatar: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    followingMe: false,
    skills: [],
    createdAt: ""
  });

  dataProfile$ = this.dataProfileSubject.asObservable()

  loadingProfile(username: string) {
    this.profile.profile(username).subscribe({
      next: (respone) => {
        console.log(respone, "*************");
        
        this.dataProfileSubject.next(respone.data);
      },
      error: (error) => {
        console.log(error, 'error herr ');
      },
    });
  }

  EditePRofileProfile(info: RequestEditProfile, image?: File) {
    this.profile.editProfile(info, image).subscribe({
      next: (respone) => {
        this.dataProfileSubject.next(respone.data);
      },
      error: (error) => {
        console.log(error, 'error herr ');
      },
    });
  }

   getCurrentProfile(): UserProfile {
    return this.dataProfileSubject.value;
  }

}
