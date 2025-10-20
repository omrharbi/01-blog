import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, token } from '../../../constant/constante';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { ApiResponse } from '../../../models/authentication/autResponse-module';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {
  constructor(private http: HttpClient) { }
  //   Get users I follow
  following() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponse<UserProfile[]>>(
      `${environment.subscriptions.following}`, {
      headers
    }
    )
  }

  // Get my followers

  followers() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponse<UserProfile[]>>(
      `${environment.subscriptions.followers}`, {
      headers
    }
    )
  }


  explor() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.get<ApiResponse<UserProfile[]>>(
      `${environment.subscriptions.explore}`, {
      headers
    }
    )
  }


  followUser(iduserIfFollow: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.post<ApiResponse<UserProfile[]>>(
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
