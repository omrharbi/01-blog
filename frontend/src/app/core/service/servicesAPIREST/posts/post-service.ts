import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from '../../../models/post/postRequest';
import { environment, token } from '../../../constant/constante';
import { ApiResponse, ApiResponsePosts, PostResponse } from '../../../models/post/postResponse';
// import { PostResponse } from '../../../models/postData/postResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }
  createPosts(postRequest: PostRequest): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ApiResponse<PostResponse>>(
      `${environment.savepost.post}`,
      postRequest,
      { headers }
    );
  }

  editPost(postRequest: PostRequest, id: string): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<ApiResponse<PostResponse>>(
      `${environment.savepost.edit}${id}`,
      postRequest,
      { headers }
    );
  }

  removeMedia(id: string): Observable<number> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.delete<number>(
      `${environment.savepost.removeMedia}${id}`,
      { headers }
    );
  }
  getAllPost(page: number, size: number): Observable<ApiResponsePosts<PostResponse[]>> {
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponsePosts<PostResponse[]>>(`${environment.post.posts}?page=${page}&size=${size}`, {
      headers
    });
  }

  getpostByID(id: string): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    const url = `${environment.post.postByID}${id}`
    return this.http.get<ApiResponse<PostResponse>>(url, {
      headers
    });
  }
  DeletePost(id: string): Observable<ApiResponse<string>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.delete<ApiResponse<string>>(`${environment.post.deletePost}/${id}`, {
      headers
    })
  }
}
