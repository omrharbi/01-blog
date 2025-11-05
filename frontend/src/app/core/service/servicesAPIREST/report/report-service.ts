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
export class ReportService {
  constructor(private http: HttpClient) { }
  reportPosts(report: any): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.post<ApiResponse<any>>(
      `${environment.report.reportPost}`,
      report, 
      {
        headers
      }
    )
  }

}
