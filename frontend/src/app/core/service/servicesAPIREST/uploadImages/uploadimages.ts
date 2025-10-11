import { Injectable } from '@angular/core';
import { UploadImage } from '../../serivecLogique/upload-images/upload-image';
import { ApiResponse, MediaResponse } from '../../../models/postData/postResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../constant/constante';

@Injectable({
  providedIn: 'root'
})
export class Uploadimages {
  token = localStorage.getItem('USER_TOKEN');
  constructor(private images: UploadImage, private http: HttpClient) { }
  saveImages(): Observable<ApiResponse<MediaResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<ApiResponse<MediaResponse>>(
      `${environment.uploads.Uploadimages}`,
      this.images,
      { headers }
    );
  }
}
