import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { environment, token } from '../../../constant/constante';
import { ApiResponseWithPage, PostResponse } from '../../../models/post/postResponse';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }
  profile(username:string): Observable<ApiResponse<UserProfile>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<UserProfile>>(
      `${environment.user.getMe}/${username}`, {
      headers
    }
    )
  }
  GetMyPosts(username:string, page:number, size:number): Observable<ApiResponseWithPage<PostResponse[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponseWithPage<PostResponse[]>>(
      `${environment.user.getMyPosts}/${username}/posts?page=${page}&size=${size}`, {
      headers
    }
    )
  }
}
