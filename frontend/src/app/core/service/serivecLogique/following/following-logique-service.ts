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
    this.loadingExplore();
    this.loadingFollowers();
    this.loadingFollowing()
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
    this.users.followers().subscribe({
      next: respnse => {
        this.followersSubject.next(respnse.data);
        console.log(respnse,"following ");
        
        this.countFollowersSubject.next(respnse.data.length)
        // console.log(respnse, "loadingFollowers ");

      },
      error: error => {
        console.log("Error loading following:", error);
      }
    })
  }


  private loadingExplore() {
    this.users.explore().subscribe({
      next: respnse => {
        this.exploreSubject.next(respnse.data);
        // console.log(respnse, "loadingExplore ");

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
          const currentFollowing = this.followingSubject.value;
          this.followingSubject.next([userToFollow, ...currentFollowing])
          const updateExplore = [...currentExpler]
          updateExplore.splice(userindex, 1)
          this.exploreSubject.next(updateExplore)
          this.countFollowingSubject.next(currentFollowing.length + 1);
        }
      },
      error: error => {
        console.log("error", error);

      }
    })
  }



  Unfollow(id: string) {
    const currentFollowing = this.followingSubject.value;
    const userIndex = currentFollowing.findIndex(user => user.id == id)
    if (userIndex === -1) return;
    const userUnFollow = currentFollowing[userIndex];
    console.log(userUnFollow,"userUnFollow");
    
    this.users.unfollow(id).subscribe({
      next: response => {
        if (response.status === true) {
          const updateFollowing = [...currentFollowing]

          updateFollowing.splice(userIndex, 1);

          this.followingSubject.next(updateFollowing);

          const currentExpler = this.exploreSubject.value;
          this.exploreSubject.next([...currentExpler, userUnFollow])

          this.countFollowingSubject.next(updateFollowing.length)
        }
        console.log(response, "followUser**");
      },
      error: error => {
        console.log("error", error);

      }
    })
  }

}
