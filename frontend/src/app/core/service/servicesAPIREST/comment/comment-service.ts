import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  getComments(id: string): Observable<ApiResponse<CommentResponse[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<CommentResponse[]>>(
      `${environment.comment.getComments}/${id}`, { headers }
    )
  }

}
