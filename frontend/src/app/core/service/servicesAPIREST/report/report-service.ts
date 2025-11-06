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
export class ReportService {
  constructor(private http: HttpClient) { }
  reportPosts(report: any): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.post<ApiResponse<any>>(
      `${environment.report.report_post}`,
      report,
      {
        headers
      }
    )
  }


  reportUser(report: any): Observable<ApiResponse<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.post<ApiResponse<any>>(
      `${environment.report.report_user}`,
      report,
      {
        headers
      }
    )
  }


  getReportPosts(): Observable<ApiResponseWithPage<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.report.get_all_posts_report}`,
      {
        headers
      }
    )
  }

  getReportUsers(): Observable<ApiResponseWithPage<any>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<any>>(
      `${environment.report.get_all_user_report}`,
      {
        headers
      }
    )
  }


}
