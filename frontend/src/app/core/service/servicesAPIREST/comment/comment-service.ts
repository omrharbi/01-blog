import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentRequest } from '../../../models/comment/commentRequest';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { CommentResponse } from '../../../models/comment/CommentResponse';
import { environment, token } from '../../../constant/constante';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) { }

  AddComment(comment: CommentRequest): Observable<ApiResponse<CommentResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.post<ApiResponse<CommentResponse>>(
      `${environment.comment.addComment}`, comment, { headers }
    )
  }


  getComments(userId: string | null, id: string): Observable<ApiResponse<CommentResponse[]>> {
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    let params = new HttpParams()


    if (userId) {
      params = params.set("userPrincipal", userId);
    }

    return this.http.get<ApiResponse<CommentResponse[]>>(
      `${environment.comment.getComments}/${id}`, { params, headers }
    )
  }


  editComment(id: string, content: CommentRequest): Observable<ApiResponse<CommentResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.put<ApiResponse<CommentResponse>>(
      `${environment.comment.editComment}/${id}`, content, { headers }
    )
  }


  delete(id: string): Observable<ApiResponse<CommentResponse>> {
    console.log(id);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.delete<ApiResponse<CommentResponse>>(
      `${environment.comment.deleteComment}/${id}`, { headers }
    )
  }
}
