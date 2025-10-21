import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, token } from '../../../constant/constante';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { likeResponse } from '../../../models/like/likeResponse';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  constructor(private http: HttpClient) { }

  toggleLikePost( targetid: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })

    return this.http.post<ApiResponse<likeResponse>>(
      `${environment.like.toggleLikePost}/${targetid}`,
      {
        headers
      }
    )
  }


  
}
