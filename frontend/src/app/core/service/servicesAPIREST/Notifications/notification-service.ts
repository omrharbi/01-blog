import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { environment, token } from '../../../constant/constante';
import { NotificationResponse } from '../../../models/Notification/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) {

  }

  getALLNotifications(): Observable<ApiResponse<NotificationResponse[]>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': "application/json"
    })
    return this.http.get<ApiResponse<NotificationResponse[]>>(
      `${environment.notification.getNotification}`, {
      headers
    }
    )
  }
}
