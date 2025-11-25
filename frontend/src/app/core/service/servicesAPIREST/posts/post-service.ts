import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from '../../../models/post/postRequest';
import { environment, token } from '../../../constant/constante';
import { ApiResponse, ApiResponseWithPage, PostResponse } from '../../../models/post/postResponse';
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
  getAllPost(userId: string | null, snapshotTime: string | null, page: number, size: number): Observable<ApiResponseWithPage<PostResponse[]>> {
    const headers = new HttpHeaders({
      'Content-Type': "application/json"
    })
    let params = new HttpParams()
      // .set("userId", userId)
      .set("page", page)
      .set("size", size);
    if (snapshotTime) {
      params = params.set("snapshotTime", snapshotTime);
    }
    if (userId) {
      params = params.set("userPrincipal", userId);
    }
    return this.http.get<ApiResponseWithPage<PostResponse[]>>(`${environment.post.posts}`, {
      params,
      headers
    });
  }


  getAllPostsFromFollowedUsers(userId: string | null, snapshotTime: string | null, page: number, size: number): Observable<ApiResponseWithPage<PostResponse[]>> {
    const headers = new HttpHeaders({
      'Content-Type': "application/json"
    })
    let params = new HttpParams()
      // .set("userId", userId)
      .set("page", page)
      .set("size", size);
    if (snapshotTime) {
      params = params.set("snapshotTime", snapshotTime);
    }
    if (userId) {
      params = params.set("userPrincipal", userId);
    }
    return this.http.get<ApiResponseWithPage<PostResponse[]>>(`${environment.post.get_all_posts_from_followed_users}`, {
      params,
      headers
    });
  }

  getpostByID(userId: string | null, id: string): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    let params = new HttpParams()


    if (userId) {
      params = params.set("userPrincipal", userId);
    }
    const url = `${environment.post.postByID}${id}`
    return this.http.get<ApiResponse<PostResponse>>(url, {
      params,
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
