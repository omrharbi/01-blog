import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, token } from '../../../constant/constante';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { FollowingService } from '../../servicesAPIREST/following/following-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowingLogiqueService {
  constructor(private users: FollowingService) { }

  private exploreSubject = new BehaviorSubject<UserProfile[]>([]);
  private followingSubject = new BehaviorSubject<UserProfile[]>([]);
  private followersSubject = new BehaviorSubject<UserProfile[]>([]);
  private countFollowingSubject = new BehaviorSubject<number>(0);
  private countFollowersSubject = new BehaviorSubject<number>(0);
  explore$ = this.exploreSubject.asObservable();
  following$ = this.followingSubject.asObservable();
  followers$ = this.followersSubject.asObservable();
  countFollowing$ = this.countFollowingSubject.asObservable();
  countFollowers$ = this.countFollowersSubject.asObservable();

  loadingData() {

  }

  private loadingFollowing() {
    this.users.following().subscribe({
      next: respnse => {
        this.followingSubject.next(respnse.data);
        this.countFollowingSubject.next(respnse.data.length)
      },
      error: error => {
        console.log("Error loading following:", error);
      }
    })
  }


  private loadingFollowers() {
    this.users.following().subscribe({
      next: respnse => {
        this.followersSubject.next(respnse.data);
        this.countFollowersSubject.next(respnse.data.length)
      },
      error: error => {
        console.log("Error loading following:", error);
      }
    })
  }


  private loadingExplore() {
    this.users.following().subscribe({
      next: respnse => {
        this.exploreSubject.next(respnse.data);
      },
      error: error => {
        console.log("Error loading following:", error);
      }
    })
  }
  follow(id: string) {
    const currentExpler = this.exploreSubject.value;


    const userindex = currentExpler.findIndex(user => user.id == id);
    if (userindex === -1) return;
    const userToFollow = currentExpler[userindex];

    this.users.followUser(id).subscribe({
      next: response => {
        if (response.status === true) {
          const currentFollowing = this.followersSubject.value;
          this.followersSubject.next([userToFollow, ...currentFollowing])
          const updateExplore = [...currentExpler]
          updateExplore.splice(userindex, 1)
          this.exploreSubject.next(updateExplore)
          this.countFollowingSubject.next(currentFollowing.length + 1);
        }
        console.log(response, "followUser**");
      },
      error: error => {
        console.log("error", error);

      }
    })
  }


}
