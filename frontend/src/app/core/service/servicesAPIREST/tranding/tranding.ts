import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../models/authentication/autResponse-module';
import { TrendingTag } from '../../../models/tranding/tranding';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment, token } from '../../../constant/constante';

@Injectable({
  providedIn: 'root'
})
export class Tranding {
  constructor(private http: HttpClient) { }
  TrendingTag(): Observable<TrendingTag[]> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })

    return this.http.get<TrendingTag[]>(
      `${environment.tags.tags}`,
      { headers }
    );
  }
}
