import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { UserProfile } from '../../../models/user/userProfileResponse';
import { environment, token } from '../../../constant/constante';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }
  profile(): Observable<ApiResponse<UserProfile>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<UserProfile>>(
      `${environment.user.getMe}`, {
      headers
    }
    )
  }
}
