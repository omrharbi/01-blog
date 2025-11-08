import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, token } from '../../../constant/constante';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { ApiResponseWithPage } from '../../../models/post/postResponse';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {
  constructor(private http: HttpClient) { }
  //   Get users I follow
  following(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponseWithPage<UserProfile[]>>(
      `${environment.subscriptions.following}?page=${page}&size=${size}`, {
      headers
    }
    )
  }

  // Get my followers

  followers(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponseWithPage<UserProfile[]>>(
      `${environment.subscriptions.followers}?page=${page}&size=${size}`, {
      headers
    }
    )
  }


  explore(page: number, size: number)  {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponseWithPage<UserProfile[]>>(
      `${environment.subscriptions.explore}?page=${page}&size=${size}`, {
      headers
    }
    )
  }


  followUser(iduserIfFollow: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.post<ApiResponseWithPage<UserProfile[]>>(
      `${environment.subscriptions.addFollow}/${iduserIfFollow}`, {
      headers
    }
    )
  }


  unfollow(iduserIfFollow: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.delete<ApiResponse<UserProfile[]>>(
      `${environment.subscriptions.unfollow}/${iduserIfFollow}`, {
      headers
    }
    )
  }
}
