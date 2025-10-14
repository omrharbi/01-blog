import { Injectable } from '@angular/core';
import { UploadImage } from '../../serivecLogique/upload-images/upload-image';
import { ApiResponse, MediaResponse } from '../../../models/postData/postResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../constant/constante';
import { MediaRequest } from '../../../models/postData/postRequest';

@Injectable({
  providedIn: 'root'
})
export class Uploadimages {
  token = localStorage.getItem('USER_TOKEN');
  constructor(private http: HttpClient) { }
  saveImages(files: File[], isEdit:boolean): Observable<MediaResponse[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file);
    });
    return this.http.post<MediaResponse[]>(
      `${environment.uploads.Uploadimages}`,
      formData,
      { headers }
    );
  }
}
