import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {

  }

  getALLNotifications():Observable<ApiResponse<NotificationResponse[]>>{
    
  }
}
