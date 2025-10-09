import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from '../../models/postData/postRequest';
import { environment } from '../../constant/constante';
import { ApiResponse } from '../../models/postData/postResponse';
import { PostResponse } from '../../models/postData/postResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }
  token = localStorage.getItem('USER_TOKEN');
  createPosts(postRequest: PostRequest): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse<PostResponse>>(
      `${environment.savepost.post}`,
      postRequest,
      { headers }
    );
  }

  getAllPost(): Observable<ApiResponse<PostResponse[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<PostResponse[]>>(`${environment.getpost.posts}`, {
      headers
    });
  }

  getpostByID(): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<PostResponse>>(`${environment.getpost.postByID}`, {
      headers
    });
  }
}
