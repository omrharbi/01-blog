import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, token } from '../../../constant/constante';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { FollowingService } from '../../servicesAPIREST/following/following-service';
import { BehaviorSubject } from 'rxjs';
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  totalDataResponse: number;
}
@Injectable({
  providedIn: 'root'
})
export class FollowingLogiqueService {
  constructor(private users: FollowingService) { }
  // Separate subjects for each list
  private exploreSubject = new BehaviorSubject<UserProfile[]>([]);
  private followingSubject = new BehaviorSubject<UserProfile[]>([]);
  private followersSubject = new BehaviorSubject<UserProfile[]>([]);


  // count 
  private countFollowingSubject = new BehaviorSubject<number>(0);
  private countFollowersSubject = new BehaviorSubject<number>(0);


  // Separate pagination for each list
  private followingPagesSubject = new BehaviorSubject<PaginationInfo | null>(null);
  private followersPagesSubject = new BehaviorSubject<PaginationInfo | null>(null);
  private explorePagesSubject = new BehaviorSubject<PaginationInfo | null>(null);


  private loadingSubject = new BehaviorSubject<any>({});


  // Observables
  loading$ = this.loadingSubject.asObservable();
  explore$ = this.exploreSubject.asObservable();
  following$ = this.followingSubject.asObservable();
  followers$ = this.followersSubject.asObservable();
  countFollowing$ = this.countFollowingSubject.asObservable();
  countFollowers$ = this.countFollowersSubject.asObservable();


  // Separate pagination observables
  followingPages$ = this.followingPagesSubject.asObservable();
  followersPages$ = this.followersPagesSubject.asObservable();
  explorePages$ = this.explorePagesSubject.asObservable();



  loadingFollowing(page: number, size: number) {
    this.loadingSubject.next(true);
    this.users.following(page, size).subscribe({
      next: response => {
        if (response.data.content) {
          const currentFollowing = this.followingSubject.value;
          this.followingSubject.next([...currentFollowing, ...response.data.content])
          this.countFollowingSubject.next(response.data.totalElements);


          this.followingPagesSubject.next({
            currentPage: response.data.number,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            totalDataResponse: response.data.content.length
          })
        }
        this.loadingSubject.next(false);

      },
      error: error => {
        this.loadingSubject.next(false);
        console.log("Error loading following:", error);
      }
    })
  }

  loadingFollowers(page: number, size: number) {
    this.loadingSubject.next(true)
    this.users.followers(page, size).subscribe({
      next: respnse => {
        if (respnse.data.content) {

          const currentFollowers = this.followersSubject.value;
          this.followersSubject.next([...currentFollowers, ...respnse.data.content]);
          this.countFollowersSubject.next(respnse.data.totalElements)

          this.followersPagesSubject.next({
            currentPage: respnse.data.number,
            totalPages: respnse.data.totalPages,
            totalElements: respnse.data.totalElements,
            totalDataResponse: respnse.data.content.length
          })
        } else {
          this.loadingSubject.next(false);
        }
      },
      error: error => {
        this.loadingSubject.next(false);
        console.log("Error loading following:", error);
      }
    })
  }


  loadingExplore(page: number, size: number) {
    this.loadingSubject.next(true);

    this.users.explore(page, size).subscribe({
      next: response => {
        if (response.data.content) {
          console.log(response);

          const currentExplore = this.exploreSubject.value;
          const currentFollowing = this.followingSubject.value;
          const newUsers = response.data.content.filter(newUser => {
            const alreadyFollowing = currentFollowing.some(user => user.id === newUser.id);
            const alreadyInExplore = currentExplore.some(user => user.id === newUser.id);
            return !alreadyFollowing && !alreadyInExplore;
          });

          this.exploreSubject.next([...currentExplore, ...newUsers]);
          this.explorePagesSubject.next({
            currentPage: response.data.number,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            totalDataResponse: response.data.content.length
          });
        }
        this.loadingSubject.next(false);
      },
      error: error => {
        this.loadingSubject.next(false);
        console.error("Error loading explore:", error);
      }
    });
  }
  follow(id: string, onSuccess?: () => void) {
    const currentExplore = this.exploreSubject.value;
    const userindex = currentExplore.findIndex(user => user.id == id);
    if (userindex === -1) return;

    const userToFollow = currentExplore[userindex];

    this.users.followUser(id).subscribe({
      next: response => {
        if (response.status === true) {
          const currentFollowing = this.followingSubject.value;
          const alreadyFollowing = currentFollowing.some(user => user.id === id);


          if (!alreadyFollowing) {
            // Add to following list only if not already there
            this.followingSubject.next([userToFollow, ...currentFollowing]);

            // Update following count
            const totalFollowing = this.countFollowingSubject.value;
            this.countFollowingSubject.next(totalFollowing + 1);

          }

          const updatedExplore = currentExplore.filter(user => user.id !== id);
          this.exploreSubject.next(updatedExplore);

          // Update explore pagination to reflect removed item
          const currentExplorePage = this.explorePagesSubject.value;
          if (currentExplorePage) {
            this.explorePagesSubject.next({
              ...currentExplorePage,
              totalElements: Math.max(0, currentExplorePage.totalElements - 1)
            });
          }

          // Call success callback
          if (onSuccess) onSuccess();
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

    const userToUnfollow = currentFollowing[userIndex];

    this.users.unfollow(id).subscribe({
      next: response => {
        if (response.status === true) {

          // Remove from following list
          const updateFollowing = currentFollowing.filter((_, index) => index !== userIndex)

          this.followingSubject.next(updateFollowing);

          const currentExplore = this.exploreSubject.value;
          this.exploreSubject.next([userToUnfollow, ...currentExplore]);
          // Update counts
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
