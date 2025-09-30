import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../constant/constante';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}
  token = localStorage.getItem('USER_TOKEN');
  uploadFile(file: File): Observable<{ fileName: string; filePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    console.log(this.token);
    
    return this.http.post<{ fileName: string; filePath: string }>(
      `${environment.upload.upload_image}`,
      formData,
      { headers  }
    );
  }
}
