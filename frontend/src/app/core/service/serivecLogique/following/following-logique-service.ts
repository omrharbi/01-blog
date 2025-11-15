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
  private totalElementsSubject = new BehaviorSubject<any>({});
  private pagesSubject = new BehaviorSubject<any>({});
  private loadingSubject = new BehaviorSubject<any>({});

  loading$ = this.loadingSubject.asObservable();
  explore$ = this.exploreSubject.asObservable();
  following$ = this.followingSubject.asObservable();
  followers$ = this.followersSubject.asObservable();
  countFollowing$ = this.countFollowingSubject.asObservable();
  countFollowers$ = this.countFollowersSubject.asObservable();
  pages$ = this.pagesSubject.asObservable();
  totalElementsSubject$ = this.totalElementsSubject.asObservable();
  loadingFollowing(page: number, size: number) {
    this.users.following(page, size).subscribe({
      next: respnse => {
        if (respnse.data.content) {
        this.countFollowingSubject.next(respnse.data.totalElements)

          const currentFollowing = this.followingSubject.value;
          this.followingSubject.next([...currentFollowing, ...respnse.data.content])
          this.pagesSubject.next({
            currentPage: respnse.data.number,
            totalPagesFollwing: respnse.data.totalPages,
            totalElements: respnse.data.totalElements,
            totalDataResponse: respnse.data.content.length
          })
        } else {
          this.loadingSubject.next(false)
        }
      },
      error: error => {
        console.log("Error loading following:", error);
      }
    })
  }

  loadingFollowers(page: number, size: number) {
    this.loadingSubject.next(true)
    this.users.followers(page, size).subscribe({
      next: respnse => {
        const currentFollowers = this.followersSubject.value;

        this.followersSubject.next([...currentFollowers, ...respnse.data.content]);

        this.countFollowersSubject.next(respnse.data.totalElements)
        this.totalElementsSubject.next(respnse.data.totalElements)
        this.loadingSubject.next(false)

        // console.log(respnse, "loadingFollowers ");
        this.pagesSubject.next({
          currentPage: respnse.data.number,
          totalPage: respnse.data.totalPages,
          totalElements: respnse.data.totalElements,
          totalDataResponse: respnse.data.content.length
        })
      },
      error: error => {
        console.log("Error loading following:", error);
      }
    })
  }


  loadingExplore(page: number, size: number) {
    this.loadingSubject.next(true)
    this.users.explore(page, size).subscribe({
      next: respnse => {
        
        const currentexploreSubject = this.exploreSubject.value;
        this.exploreSubject.next([...currentexploreSubject, ...respnse.data.content]);
        this.countFollowersSubject.next(respnse.data.totalElements)
        this.totalElementsSubject.next(respnse.data.totalElements)
        this.loadingSubject.next(false)
        this.pagesSubject.next({
          currentPage: respnse.data.number,
          totalPage: respnse.data.totalPages,
          totalElements: respnse.data.totalElements,
          totalDataResponse: respnse.data.content.length
        })

      },
      error: error => {
        this.loadingSubject.next(false)

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
          // console.log(currentFollowing,"currentFollowing **** ");

          this.followingSubject.next([userToFollow, ...currentFollowing])
          const updateExplore = [...currentExpler]
          updateExplore.splice(userindex, 1)
          this.exploreSubject.next(updateExplore)
          const totalFollowing = this.countFollowingSubject.value; //
          this.countFollowingSubject.next(totalFollowing + 1);
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
    console.log(userUnFollow, "userUnFollow");

    this.users.unfollow(id).subscribe({
      next: response => {
        if (response.status === true) {
          const updateFollowing = [...currentFollowing]

          updateFollowing.splice(userIndex, 1);

          this.followingSubject.next(updateFollowing);

          const currentExpler = this.exploreSubject.value;
          this.exploreSubject.next([...currentExpler, userUnFollow])
          const totalFollowing = this.countFollowingSubject.value; //

          this.countFollowingSubject.next(totalFollowing - 1)
        }
        console.log(response, "followUser**");
      },
      error: error => {
        console.log("error", error);

      }
    })
  }

}
