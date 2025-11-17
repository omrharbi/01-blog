import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { environment, token } from '../../../constant/constante';
import { ApiResponseWithPage, PostResponse } from '../../../models/post/postResponse';
import { RequestEditProfile } from '../../../models/user/userProfileRequest';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }
  // snapshotTime = null;
  profile(username: string): Observable<ApiResponse<UserProfile>> {
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
  isIFollow(username: string): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<boolean>>(
      `${environment.subscriptions.is_I_follow}/${username}`, {
      headers
    }
    )
  }
  GetMyPosts(snapshotTime: string | null, username: string, page: number, size: number): Observable<ApiResponseWithPage<PostResponse[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponseWithPage<PostResponse[]>>(
      `${environment.user.getMyPosts}/${username}/posts?snapshotTime=${snapshotTime}&page=${page}&size=${size}`, {
      headers
    }
    )
  }


  editProfile(info: RequestEditProfile, image?: File): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token'); // or your auth token

    const formData = new FormData();

    // Append JSON data as a blob
    // const datajson = new Blob([JSON.stringify(info)], { type: 'application/json' })
    formData.append('request', JSON.stringify(info));
    // Append file if present
    if (image) {
      formData.append('files', image); // name must match @RequestParam("files") in Spring
    }

    // Headers: only Authorization, do NOT set Content-Type
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<ApiResponse<any>>(
      `${environment.user.edit_profile}`,
      formData,
      { headers }
    );
  }

}
