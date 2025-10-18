import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequest } from '../../../models/postData/postRequest';
import { environment } from '../../../constant/constante';
import { ApiResponse, PostResponse } from '../../../models/postData/postResponse';
// import { PostResponse } from '../../../models/postData/postResponse';

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

  editPost(postRequest: PostRequest,id:number): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    // console.log(id,"");
    
    return this.http.put<ApiResponse<PostResponse>>(
      `${environment.savepost.edit}${id}`,
      postRequest,
      { headers }
    );
  }

   removeMedia( id:number): Observable<number> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.delete<number>(
      `${environment.savepost.removeMedia}${id}`,
       { headers }
    );
  }
  getAllPost(): Observable<ApiResponse<PostResponse[]>> {
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${this.token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<PostResponse[]>>(`${environment.getpost.posts}`, {
      headers
    });
  }

  getpostByID(id: number): Observable<ApiResponse<PostResponse>> {
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${this.token}`,
      'Content-Type': "application/json"
    })
    const url = `${environment.getpost.postByID}${id}`
    return this.http.get<ApiResponse<PostResponse>>(url, {
      headers
    });
  }
}
