import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { environment, token } from '../../../constant/constante';
import { PostResponse } from '../../../models/post/postResponse';

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
// f196e108-0cdd-4b43-a359-ceb83c8a8062 
// 867e6d5e-24db-4e90-b66c-4d74adc860d7
  GetMyPosts(username:string): Observable<ApiResponse<PostResponse[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<PostResponse[]>>(
      `${environment.user.getMyPosts}/${username}/posts`, {
      headers
    }
    )
  }
}
