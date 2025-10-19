import { Injectable } from '@angular/core';
import { UploadImage } from '../../serivecLogique/upload-images/upload-image';
import { ApiResponse, MediaResponse } from '../../../models/post/postResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../constant/constante';
import { MediaRequest } from '../../../models/post/postRequest';

@Injectable({
  providedIn: 'root'
})
export class Uploadimages {
  token = localStorage.getItem('USER_TOKEN');
  constructor(private http: HttpClient) { }

  saveImages(files: File[]): Observable<MediaResponse[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })

    const formData = new FormData()

    // console.log('FormData entries:');
    // for (let [key, value] of (formData as any).entries()) {
    //   console.log(key, value);
    // }
    files.forEach((file) => {
      formData.append('files', file);
    });

    // console.log("formData",formData);
    
    return this.http.post<MediaResponse[]>(
      `${environment.uploads.Uploadimages}`,
      formData,
      { headers }
    );
  }
}
