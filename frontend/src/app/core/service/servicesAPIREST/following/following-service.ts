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
  getAllUser() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

     return this.http.get<ApiResponse<UserProfile[]>>(
          `${environment.user.getAllUSer}`, {
          headers
        }
        )
  }
}
